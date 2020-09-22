const passport = require('passport');
const NaverStrategy = require('passport-naver');
const express = require('express');
const router = express.Router();
const config = require('./config');

router.get('/', passport.authenticate('naver', null), (req, res) => {
    console.log("/main/naver");
});

router.get('/naver/callback', passport.authenticate('naver', {
    successRedirect: '/',
    failureRedirect: '/index'
})
);

passport.use(new NaverStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL;
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(() => {
        const user = {
            name: profile.name,
            email: profile.emails[0].value,
            username: profile.displayName,
            provider: 'naver',
            naver: profile._json
        };
        console.log("user=", user);

        return done(null, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((req, user, done) => {
    req.session;
});

module.exports = router;