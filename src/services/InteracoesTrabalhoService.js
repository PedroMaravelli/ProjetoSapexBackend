const { where } = require("sequelize");
const { Comentario, Trabalho, Aluno, ComentarioLike, TrabalhoLike, Professor, Localizacao } = require("../database/models");

class InteracoesTrabalhoService {
    static async obterComentariosTrabalho(trabalho_id){
        const trabalho = await Trabalho.findByPk(trabalho_id, {
            include: [
                {
                    model: Aluno,
                    as: 'alunos',
                    attributes: ['nome', 'email']
                },
                {
                    model: Localizacao,
                    as: 'Localizacao'
                }
            ]
        });
    
        if(!trabalho){
            return { error: 'Trabalho não encontrado' };
        }
    
        const comentarios = await Comentario.findAll({
            where: {
                trabalho_id: trabalho_id,
                parent_id: null 
            },
            attributes: ['id', 'trabalho_id', 'conteudo', 'parent_id', 'likes_count', 'created_at'],
            include: [
                {
                    model: Aluno,
                    as: 'usuario',
                    attributes: ['nome', 'email']
                },
                {
                    model: Comentario,
                    as: 'replies',
                    attributes: ['id', 'trabalho_id', 'conteudo', 'parent_id', 'likes_count', 'created_at'],
                    include: [
                        {
                            model: Aluno,
                            as: 'usuario',
                            attributes: ['nome', 'email']
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        });
        
        return {
            trabalho,
            comentarios
        };
    }

    static async CriarComentario(trabalho_id, aluno_email, comentario){
        const trabalhoExiste = await Trabalho.findByPk(trabalho_id);

        if(!trabalhoExiste){
            return { error: 'Trabalho não encontrado' };
        }
        
        const usuario = await Aluno.findOne({ where: { email: aluno_email } });

        if(!usuario){
            return { error: 'Usuário não encontrado' };
        }

        const comentarioCriado = await Comentario.create({
            trabalho_id: trabalho_id,
            usuario_id: usuario.id,
            conteudo: comentario
        });
        await trabalhoExiste.increment('comentarios_count');

        return comentarioCriado;
    }

    static async ExcluirComentario(comentario_id, aluno_email){
        const comentario = await Comentario.findByPk(comentario_id);

        if(!comentario){
            return { error: 'Comentário não encontrado' };
        }

        const usuario = await Aluno.findOne({ where: { email: aluno_email } });

        if(!usuario){
            return { error: 'Usuário não encontrado' };
        }

        if(comentario.usuario_id !== usuario.id){
            return { error: 'Você não tem permissão para excluir este comentário' };
        }

        await comentario.destroy();
        
        
        const trabalho = await Trabalho.findByPk(comentario.trabalho_id);
        await trabalho.decrement('comentarios_count');

        return { success: true };
    }

    static async CurtirComentario(comentario_id, aluno_email){
        const comentario = await Comentario.findByPk(comentario_id);

        if(!comentario){
            return { error: 'Comentário não encontrado' };
        }

        const usuario = await Aluno.findOne({ where: { email: aluno_email } });

        if(!usuario){
            return { error: 'Usuário não encontrado' };
        }

        const usuarioJaCurtiu = await ComentarioLike.findOne({
            where:{
                comentario_id: comentario_id,
                usuario_id: usuario.id
            }
        });

        if(usuarioJaCurtiu){
            return { error: 'Você já curtiu este comentário' };
        }

        await ComentarioLike.create({
            comentario_id: comentario_id,
            usuario_id: usuario.id
        });

        
        await comentario.increment('likes_count');

        return { success: true };
    }

    static async LikeTrabalho(trabalho_id, aluno_email){
        const trabalho = await Trabalho.findByPk(trabalho_id);
        const aluno = await Aluno.findOne({ where: { email: aluno_email } });

        if(!trabalho && !aluno){
            return { error: 'Trabalho ou Aluno não encontrado' };
        }

        const usuarioJaCurtiuTrabalho = await TrabalhoLike.findOne({
            where: {
                trabalho_id: trabalho_id,
                usuario_id: aluno.id
            }
        })

        if(usuarioJaCurtiuTrabalho){
            return { error: 'Você já curtiu este trabalho' };
        }

        await TrabalhoLike.create({
            trabalho_id: trabalho_id,
            usuario_id: aluno.id
        });
        await trabalho.increment('likes_count');
        
        return { success: true };
    }
}

module.exports = InteracoesTrabalhoService;