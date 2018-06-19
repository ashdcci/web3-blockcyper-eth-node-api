let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;


db = require('../config/db')
userSchema = require('../schema/UserSchema')
var User = db.model('User', userSchema.userSchema)

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: 'b1N3xXrpwNPrsLZH2GmCa95TbuU6hvvKQYVDcKSKrg4PfiOCm_X8A5G_hpLvTmD_'
  };

  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    
    console.log(jwt_payload, jwt_payload.id)
    if(!jwt_payload.id){
        // return done(null, false);
    }
    User.findOne({
      email:  jwt_payload.id
    }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};