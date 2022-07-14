const express = require('express');
const { loginForm, registerForm,registerUser,loginUser,confirm, logout } = require('../controllers/authController');
const {body} = require('express-validator');
const User = require('../models/userModel');
const usernameValidator = require('../middlewares/usernameValidator');
const router = express.Router();





router.get('/login',loginForm);
router.get('/register',registerForm)
router.post('/register',usernameValidator,[
    body('email','invalid email').isEmail(),
    body('password','invalid password').isLength({min:5}).custom((password,{req})=>{
        if(password==req.body.passwordRepit){
            return true;
        }else{
            throw new Error('password is not correct');
        }
    })
],registerUser);
router.post('/login',loginUser);
router.get('/confirm/:_id',confirm);
router.get('/logout',logout);
// router.post('/login')

module.exports = router;