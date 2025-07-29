const passport = require('passport');
require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20').Strategy;


    if (!process.env.CLIENT_ID) {
    console.error('❌ ERRO: GOOGLE_CLIENT_ID não encontrado no .env');
    console.log('💡 Adicione no arquivo .env: GOOGLE_CLIENT_ID=seu_client_id_aqui');
    }

    if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.error('❌ ERRO: GOOGLE_CLIENT_SECRET não encontrado no .env');
    console.log('💡 Adicione no arquivo .env: GOOGLE_CLIENT_SECRET=seu_client_secret_aqui');
    }

    // Configurar estratégia do Google
    passport.use('google', new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ['profile', 'email']
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
        console.log('✅ Usuário autenticado pelo Google:', profile.displayName);
        console.log('📧 Email:', profile.emails[0].value);
        
        // Criar objeto do usuário
        const user = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            provider: 'google'
        };

        return done(null, user);
        } catch (error) {
        console.error('❌ Erro na estratégia Google:', error);
        return done(error, null);
        }
    }
    ));

    // Serialização do usuário (para sessão)
    passport.serializeUser(function(user, done) {
    console.log('🔒 Serializando usuário:', user.email);
    done(null, user);
    });

    // Deserialização do usuário (da sessão)
    passport.deserializeUser(function(user, done) {
    console.log('🔓 Deserializando usuário:', user.email);
    done(null, user);
    });

    console.log('✅ Passport configurado com sucesso!');

    module.exports = passport;
