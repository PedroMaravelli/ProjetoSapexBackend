const passport = require('passport');
require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20').Strategy;



    passport.use('google', new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
        

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


    passport.serializeUser(function(user, done) {
    done(null, user);
    });


    passport.deserializeUser(function(user, done) {
    done(null, user);
    });

    module.exports = passport;
