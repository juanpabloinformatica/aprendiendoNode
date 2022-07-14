const sessionValidator = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('mensajes','Inicia sesión');
        return res.redirect('/auth/login');
    }
}
module.exports = sessionValidator;