const passport = require('passport');
require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20').Strategy;


    // Configurar estratégia do Google
    passport.use('google', new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ['profile', 'email']
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
        
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
        return done(error, null);
        }
    }
    ));

    // Serialização do usuário (para sessão)
    passport.serializeUser(function(user, done) {
    done(null, user);
    });

    // Deserialização do usuário (da sessão)
    passport.deserializeUser(function(user, done) {
    done(null, user);
    });

    console.log('✅ Passport configurado com sucesso!');

    module.exports = passport;
