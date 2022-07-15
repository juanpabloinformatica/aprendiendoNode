'use strict'
require('dotenv').config({path:'./.env'});
require('./database/database');

const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const csurf = require('csurf');
const mongoStore = require('connect-mongo');
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport')
const {create} = require('express-handlebars');
const MongoStore = require('connect-mongo');

const hbs = create({
    extname: '.hbs',
    partialsDir:['./views/components']
})


app.engine('.hbs',hbs.engine);
app.set('view engine','.hbs');
app.set('views', './views');
console.log(process.env.PATH);
app.use(cors({
  origin:process.env.PATH,
  credentials: true
}));
app.set('trust proxy',1)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  name:'secret_name',
  store:new MongoStore({mongoUrl:process.env.URI,ttl:60*60*10}),
  cookie:{
    secure:(process.env.MODE=='production')
  }
}))
app.use(flash());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(csurf());
app.use(passport.initialize());
app.use(passport.session());
require('./passport/passport');
app.use(mongoSanitize());
// app.get('/segundo',(req,res)=>{
//     console.log((req.flash('mensajes')));
// })
// app.get('/primero',(req,res)=>{
//     req.flash('mensajes','Inicializado flash');
//     res.redirect('/segundo');
// })
app.use((req,res,next)=>{
    res.locals.mensajes = req.flash('mensajes');
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(express.static('./public'));
app.use('/',require('./routes/home'));
app.use('/auth',require('./routes/auth'));

const PORT = process.env.PORT||7980
app.listen(PORT,()=>{
    console.log('listening');
})
