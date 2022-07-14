
const validUrl = require('valid-url');
  


const urlValidator = (req,res,next)=>{
    const {origin} = req.body;
    if (validUrl.isUri(origin)){
        console.log('Looks like an URI');
        next();
    } else {
        console.log('Not a URI');
        req.flash('mensajes','it does not Looks like an URI')
        res.redirect('/')
    }   
}

module.exports = urlValidator;