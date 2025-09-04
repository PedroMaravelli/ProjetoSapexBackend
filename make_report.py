#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera relatorio.docx unificando:
- DAST (ZAP Baseline/Full + Dalfox/sqlmap)
- SAST (Semgrep)
- SCA/SBOM/FS (OSV + Syft/Grype + Trivy)
Com agregação por CWE, bucket CVSS, correlação endpoint→arquivo/linha,
uso opcional de OpenAPI/EPSS/KEV e (opcional) screenshots dos HTML do ZAP.

Uso:
  python make_report.py <ARTIFACTS_DIR> <OUTPUT_DOCX> [REPO_DIR]
                        [--openapi "openapi.yaml,openapi.json"]
                        [--epss epss.json] [--kev kev.json]
                        [--snap-zap]
"""
import json, re, sys, argparse, subprocess
from pathlib import Path
from collections import defaultdict, Counter
from docxtpl import DocxTemplate, InlineImage
from docx.shared import Mm
import yaml

# ---------- utils ----------
def load_json(p: Path):
    try: return json.loads(p.read_text(encoding="utf-8"))
    except: return None

def load_yaml(p: Path):
    try: return yaml.safe_load(p.read_text(encoding="utf-8"))
    except: return None

def find_first(base: Path, candidates):
    for c in candidates:
        q = base / c
        if q.exists(): return q
    return None

def cvss_bucket(score):
    if score is None: return "Unknown"
    try: s = float(score)
    except: return "Unknown"
    if s >= 9.0: return "Critical"
    if s >= 7.0: return "High"
    if s >= 4.0: return "Medium"
    if s > 0.0:  return "Low"
    return "None"

CWE_REMEDIATIONS = {
    79:  "XSS: escape/sanitize no output, CSP robusta, validação server-side.",
    89:  "SQLi: prepared statements/ORM; evitar concatenação de SQL.",
    352: "CSRF: tokens anti-CSRF, SameSite, verificação de origem.",
    22:  "Path Traversal: normalizar paths e whitelists.",
    78:  "OS Command Inj.: evitar shell; usar APIs/subprocess(list).",
    20:  "Input Validation: whitelists por tipo; rejeitar input inesperado.",
    200: "Exposure: reduzir dados sensíveis; autorizações por objeto.",
}

URL_PATH = re.compile(r"https?://[^/]+(?P<path>/[^\s?#]*)")
def extract_endpoint(url: str):
    m = URL_PATH.search(url or "")
    return m.group("path") if m else None

# ---------- loaders ----------
def load_zap_alerts(art_dir: Path):
    p = find_first(art_dir, [
        "dast-local/zap-full.json", "dast-local/zap-baseline.json",
        "zap-full/report_json.json", "zap-baseline/report_json.json"
    ])
    data = load_json(p) if p else None
    alerts = data.get("site",[{}])[0].get("alerts",[]) if data and "site" in data else []
    return alerts, p

def load_semgrep(art_dir: Path):
    p = art_dir/"semgrep"/"semgrep.json"
    data = load_json(p) or {}
    return data.get("results",[]), p

def load_grype(art_dir: Path):
    p = art_dir/"sca-sbom"/"grype.json"
    data = load_json(p) or {}
    return data.get("matches",[]) or data.get("ignoredMatches",[]), p

def load_trivy(art_dir: Path):
    p = art_dir/"sca-sbom"/"trivy.json"
    data = load_json(p) or {}
    return data.get("Results",[]) or [], p

def load_osv_count(art_dir: Path):
    p = art_dir/"sca-sbom"/"osv.json"
    data = load_json(p) or {}
    total = 0
    if isinstance(data, dict) and "results" in data:
        for r in data["results"]:
            total += len(r.get("vulnerabilities",[]) or [])
    return total, p

def load_openapi(repo_dir: Path, names: list[str]):
    for name in names:
        fp = repo_dir/name
        if fp.exists():
            if fp.suffix in (".yaml",".yml"): return (load_yaml(fp) or {}, fp)
            if fp.suffix == ".json":         return (load_json(fp) or {}, fp)
    return {}, None

def load_epss(path: Path):
    data = load_json(path) or {}
    mp = {}
    for row in (data.get("data") or []):
        cve = row.get("cve")
        if not cve: continue
        def f(x):
            try: return float(x)
            except: return None
        mp[cve] = {"epss": f(row.get("epss")), "percentile": f(row.get("percentile"))}
    return mp

def load_kev(path: Path):
    data = load_json(path) or {}
    return {v.get("cveID") for v in (data.get("vulnerabilities") or []) if v.get("cveID")}

# ---------- aggregates ----------
def aggregate_zap_by_cwe(alerts):
    cwe_sum = defaultdict(lambda: {"name": None, "risk": Counter(), "samples": []})
    for a in alerts:
        cwe = int(a.get("cweid") or 0)
        name = a.get("name")
        risk = a.get("riskdesc") or "Unknown"
        url  = a.get("url") or (a.get("instances",[{}])[0].get("uri") if a.get("instances") else None)
        param= a.get("param")
        ev   = a.get("evidence") or (a.get("instances",[{}])[0].get("evidence") if a.get("instances") else None)
        cwe_sum[cwe]["name"] = cwe_sum[cwe]["name"] or name
        cwe_sum[cwe]["risk"][risk] += 1
        if url:
            cwe_sum[cwe]["samples"].append({"url": url, "param": param, "evidence": ev})
    return cwe_sum

def consolidate_cvss(grype_matches, trivy_results):
    buckets = Counter()
    def add(score=None, sev=None):
        if score is not None: buckets[cvss_bucket(score)] += 1
        elif sev: buckets[sev.capitalize() if sev and sev.capitalize() in ("Critical","High","Medium","Low") else "Unknown"] += 1
        else: buckets["Unknown"] += 1

    for m in grype_matches:
        score = None
        for x in (m.get("vulnerability",{}).get("cvss") or []) + (m.get("cvss") or []):
            bs = x.get("metrics",{}).get("baseScore") or x.get("baseScore")
            if bs is not None:
                score = max(score or 0.0, float(bs))
        add(score=score, sev=(m.get("vulnerability",{}) or {}).get("severity"))

    for res in trivy_results or []:
        for v in (res.get("Vulnerabilities") or []):
            score = None; cv = v.get("CVSS")
            if isinstance(cv, dict):
                for src in ("nvd","redhat","ghsa"):
                    base = cv.get(src,{}).get("V3Score") or cv.get(src,{}).get("Score")
                    if base: score = max(score or 0.0, float(base))
            add(score=score, sev=v.get("Severity"))

    for k in ("Critical","High","Medium","Low","Unknown"): buckets[k] += 0
    return dict(buckets)

# ---------- correlation ----------
def index_semgrep(semgrep_results):
    idx = defaultdict(list)  # path -> [(line, check_id, message)]
    for r in semgrep_results:
        f = r.get("path")
        ln = (r.get("start") or {}).get("line")
        ck = r.get("check_id")
        mg = r.get("extra",{}).get("message")
        if f and ln:
            idx[f].append((ln, ck, mg))
    return idx

def build_openapi_map(openapi):
    paths = openapi.get("paths",{}) if isinstance(openapi,dict) else {}
    mp = {}
    for pth, methods in paths.items():
        if not isinstance(methods, dict): continue
        for meth, meta in methods.items():
            if not isinstance(meta, dict): continue
            opid = meta.get("operationId")
            if opid: mp[(pth, meth.lower())] = opid
    return mp

def search_repo(repo_dir: Path, needles, exts=None, max_hits=5):
    if exts is None:
        exts = (".js",".ts",".tsx",".py",".java",".go",".rb",".php",".cs",".jsp",".vue")
    hits=[]; files=[]
    for ext in exts: files += list(repo_dir.rglob(f"*{ext}"))
    for fp in files:
        try: txt = fp.read_text(encoding="utf-8", errors="ignore")
        except: continue
        for needle in needles:
            if not needle: continue
            if needle in txt:
                for i, line in enumerate(txt.splitlines(), start=1):
                    if needle in line:
                        hits.append({"file": str(fp), "line": i, "reason": f"match '{needle}'"})
                        if len(hits) >= max_hits: return hits
    return hits

def correlate(zap_alerts, semgrep_results, repo_dir: Path=None, openapi=None):
    sg_idx = index_semgrep(semgrep_results)
    op_map = build_openapi_map(openapi or {})
    corr = defaultdict(list)

    for a in zap_alerts:
        name = a.get("name")
        url  = a.get("url") or (a.get("instances",[{}])[0].get("uri") if a.get("instances") else None)
        endpoint = extract_endpoint(url or "")
        method = (a.get("method") or "").lower()
        key = f"{name}::{endpoint or url}"

        # 1) OpenAPI → operationId
        if openapi and endpoint:
            seg_e = [s for s in endpoint.split("/") if s]
            for (opath, m), opid in op_map.items():
                if method and m != method: continue
                seg_o = [s for s in opath.split("/") if s]
                if len(seg_e) != len(seg_o): continue
                ok = True
                for se, so in zip(seg_e, seg_o):
                    if so.startswith("{") and so.endswith("}"): continue
                    if se != so: ok = False; break
                if ok and repo_dir:
                    corr[key] += search_repo(repo_dir, [opid])

        # 2) rota literal no repo
        if repo_dir and endpoint:
            corr[key] += search_repo(repo_dir, [endpoint])

        # 3) heurística por semgrep (fragmento da rota no path)
        frag = [p for p in (endpoint or "").split("/") if p]
        frag = frag[-1] if frag else None
        if frag:
            for fpath, items in sg_idx.items():
                if frag.lower() in fpath.lower():
                    ln, ck, mg = items[0]
                    corr[key].append({"file": fpath, "line": ln, "reason": f"semgrep: {ck} ({mg})"})

        # fallback: qualquer finding do semgrep
        if not corr[key] and sg_idx:
            fpath, items = next(iter(sg_idx.items()))
            ln, ck, mg = items[0]
            corr[key].append({"file": fpath, "line": ln, "reason": f"semgrep: {ck} ({mg})"})
    return corr

# ---------- ZAP HTML → PNG ----------
def snapshot_zap(art_dir: Path):
    snaps=[]
    for sub in ("dast-local","zap-full","zap-baseline"):
        html = art_dir/sub/"zap-full.html" if sub=="dast-local" else art_dir/sub/"report_html.html"
        if not html.exists():
            html = art_dir/sub/"zap-baseline.html" if sub=="dast-local" else html
        if not html or not html.exists(): continue
        png  = html.with_suffix(".png")
        try:
            subprocess.run(["wkhtmltoimage", str(html), str(png)], check=False)
            if png.exists(): snaps.append(png)
        except FileNotFoundError:
            pass
    return snaps

# ---------- DOCX ----------
def build_doc(art_dir: Path, out_docx: Path, repo_dir: Path=None, openapi_names=None, epss_path: Path=None, kev_path: Path=None, snap=False):
    zap_alerts, _ = load_zap_alerts(art_dir)
    semgrep, _    = load_semgrep(art_dir)
    grype, _      = load_grype(art_dir)
    trivy, _      = load_trivy(art_dir)
    osv_count, _  = load_osv_count(art_dir)

    openapi, openapi_file = {}, None
    if repo_dir and openapi_names:
        names = [n.strip() for n in openapi_names.split(",") if n.strip()]
        openapi, openapi_file = load_openapi(repo_dir, names)

    epss = load_epss(Path(epss_path)) if epss_path else {}
    kev  = load_kev(Path(kev_path)) if kev_path else set()

    cwe_sum  = aggregate_zap_by_cwe(zap_alerts or [])
    cvss_sum = consolidate_cvss(grype or [], trivy or [])
    corr     = correlate(zap_alerts or [], semgrep or [], repo_dir, openapi)

    totals = {
        "zap_findings": sum(len(v["samples"]) for v in cwe_sum.values()) or len(zap_alerts or []),
        "semgrep_findings": len(semgrep or []),
        "grype_matches": len(grype or []),
        "trivy_issues": sum(len(r.get("Vulnerabilities") or []) for r in (trivy or [])),
        "osv_vulns": osv_count,
        "openapi_used": bool(openapi_file),
        "epss_used": bool(epss),
        "kev_used": bool(kev),
    }

    top=[]
    for cwe,data in cwe_sum.items():
        if cwe==0 and not data["samples"]: continue
        mode = data["risk"].most_common(1)[0][0] if data["risk"] else "Unknown"
        top.append({
            "cwe": cwe, "name": data["name"] or "Unknown",
            "risk_mode": mode, "count": sum(data["risk"].values()),
            "example": data["samples"][0] if data["samples"] else {},
            "remediation": CWE_REMEDIATIONS.get(cwe, "Validação server-side, escape/sanitize, controles de acesso, APIs seguras.")
        })
    top.sort(key=lambda x: x["count"], reverse=True)

    prioritized=[]
    def add_p(cve,pkg,score,sev,src):
        prioritized.append({
            "cve": cve, "pkg": pkg, "cvss": score, "sev": sev,
            "epss": (epss.get(cve,{}) or {}).get("epss"),
            "epss_percentile": (epss.get(cve,{}) or {}).get("percentile"),
            "kev": (cve in kev), "source": src
        })
    for m in grype or []:
        vuln = m.get("vulnerability", {}) or {}
        cve  = vuln.get("id") or (vuln.get("ids") or [None])[0]
        pkg  = (m.get("artifact",{}) or {}).get("name")
        score=None
        for x in (vuln.get("cvss") or []):
            bs = x.get("metrics",{}).get("baseScore") or x.get("baseScore")
            if bs is not None: score = max(score or 0.0, float(bs))
        add_p(cve,pkg,score,vuln.get("severity"),"grype")
    for res in trivy or []:
        for v in (res.get("Vulnerabilities") or []):
            cve = v.get("VulnerabilityID"); pkg=v.get("PkgName")
            score=None; cv=v.get("CVSS")
            if isinstance(cv,dict):
                for src in ("nvd","redhat","ghsa"):
                    base = cv.get(src,{}).get("V3Score") or cv.get(src,{}).get("Score")
                    if base: score=max(score or 0.0, float(base))
            add_p(cve,pkg,score,v.get("Severity"),"trivy")

    def prio_key(x): return (1 if x.get("kev") else 0, (x.get("epss") or 0.0), (x.get("cvss") or 0.0))
    prioritized.sort(key=prio_key, reverse=True)

    snaps = snapshot_zap(art_dir) if snap else []

    ctx = {
        "totals": totals,
        "cvss_summary": cvss_sum,
        "top_cwes": top[:10],
        "correlations": [{"alert": k, "links": v[:5]} for k,v in corr.items()],
        "prioritized": prioritized[:25],
        "notes": {
            "cvss_ref": "CVSS v3.1",
            "zap_ref": "ZAP Traditional JSON (riskdesc = risco + confiança)",
            "openapi_file": str(openapi_file) if openapi_file else ""
        },
        "zap_images": []
    }

    tpl = DocxTemplate(Path("tools/template.docx"))
    images=[]
    for p in snaps:
        try: images.append(InlineImage(tpl, str(p), width=Mm(160)))
        except: pass
    ctx["zap_images"]=images

    tpl.render(ctx)
    tpl.save(out_docx)

# ---------- main ----------
if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("artifacts_dir")
    ap.add_argument("output_docx")
    ap.add_argument("repo_dir", nargs="?")
    ap.add_argument("--openapi")
    ap.add_argument("--epss")
    ap.add_argument("--kev")
    ap.add_argument("--snap-zap", action="store_true")
    args = ap.parse_args()

    build_doc(
        art_dir=Path(args.artifacts_dir).resolve(),
        out_docx=Path(args.output_docx).resolve(),
        repo_dir=Path(args.repo_dir).resolve() if args.repo_dir else None,
        openapi_names=args.openapi,
        epss_path=Path(args.epss) if args.epss else None,
        kev_path=Path(args.kev) if args.kev else None,
        snap=args.snap_zap
    )
