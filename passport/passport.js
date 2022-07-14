const passport = require('passport');
const User = require('../models/userModel');

passport.serializeUser((user,done)=>{
    return done(null,{id:user.id,email:user.email});
})
passport.deserializeUser(async(user,done)=>{
    try {
        const userDb = await User.findById(user.id); 
        done(null,{id:userDb.id,email:userDb.email});
    } catch (error) {
        done(error);
    }
})