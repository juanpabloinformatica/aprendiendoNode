
const usernameValidator = (req,res,next)=>{
    const {username} = req.body;
    const expression = /^[A-Za-z][A-Za-z0-9_]{6,29}$/
    console.log(username)
    if(expression.test(username)){
        return next();
    }else{
        console.log('No entro')
        req.flash('mensajes','invalid username');
        return res.redirect('/auth/register');
    } 
    
   
}

module.exports = usernameValidator