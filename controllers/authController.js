const User = require('../models/userModel');
const {validationResult} = require('express-validator');
const {nanoid} = require('nanoid');
const nodemailer = require("nodemailer");
console.log.apply(User);

const loginForm = (req,res)=>{
    res.render('login');
}
const registerForm = (req,res)=>{
    // console.log(req.flash('mensajes'));
    res.render('register');
}
const registerUser = async (req,res)=>{
    const {username,email,password} = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()==false){
        req.flash('mensajes',errors.array()[0].msg);
        return res.redirect('/auth/register');
    }
    
    try {
        if(await User.findOne({email})){
            req.flash('mensajes','User was registered before');
            return res.redirect('/auth/register');
        }else{
            console.log('Entra acá')
            const user = new User({username,email,password,tokenConfirm:nanoid()});
            await user.save();
            req.flash('mensajes',['user registered well','confirm account email']);
            const transporter = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "fa73d41c9c7cf2",
                  pass: "a234107f491327"
                }
              });
              let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: `${user.email}`, // list of receivers
                subject: "confirming", // Subject line
                text: "confirm account", // plain text body
                html: `<a href="http://localhost:7980/auth/confirm/${user._id}">confirmar aqui</a>`, // html body
              });
            return res.redirect('/auth/login');
        }
    } catch (error) {
        req.flash('mensajes',error.message);
        return res.redirect('/auth/register');
    }
}

const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    // const error = validationResult(req);
    try {
        if(! await User.findOne({email})){
            throw new Error('there is not any user with that email');
        }else{
            const user = await User.findOne({email})
            if(await user.validatePassword(password)==false){
                throw new Error('the user has a different password');
            }
            if(user.accountConfirm == false){
                throw new Error('confirm account first.');
            }
            req.login(user,(err)=>{
                if(!err){
                    req.flash('mensajes','perfect logged');
                    res.redirect('/');
                    
                }else{
                    return next(err);
                }
            })
            
        }
    } catch (error) {
        req.flash('mensajes',error.message);
        res.redirect('/auth/login');

    }
}
const confirm = async (req,res)=>{
    const {_id} = req.params;
    try {
        const user = await User.findById(_id);
        if(!user) throw new Error('there is no user with that id');
        console.log(user)
        user.tokenConfirm = null;
        user.accountConfirm = true;
        await user.save();
        req.flash('mensajes','User confirmed');
        res.redirect('/auth/login');
    } catch (error) {
        req.flash('mensajes',error.message);
        res.redirect('/auth/login');
    }
}
const logout = (req,res)=>{
    req.logout((err)=>{
        if(!err){
            req.flash('mensajes','session closed');
            res.redirect('/auth/login');
        }else{
            return next(err);
        }
    })
}

module.exports = {
    loginForm,
    registerForm,
    registerUser,
    loginUser,
    confirm,
    logout,
}