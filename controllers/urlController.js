const Url = require('../models/urlModel');
const {nanoid} = require('nanoid');

const showUrls = async(req,res)=>{
    // console.log(req.user);
    try {
        const urls = await Url.find({user:req.user.id}).lean();
        return res.render('home',{urls:urls});
    } catch (error) {
        console.log('error al listar urls');
        return res.send('error al listar urls');
    }
}

const addUrl = async(req,res)=>{
    const {origin} = req.body;
    try {
        if(await Url.findOne({origin})){
            throw new Error('Usuario ya existe');
        }else{
            const shortUrl = nanoid();
            const user = req.user.id;
            const url = new Url({origin,shortUrl,user})
            await url.save();
            req.flash('mensajes','Url saved');
            return res.redirect('/')
        }
    } catch (error) {
        if(error.message){
            console.log(error.message);
            req.flash('mensajes',error.message);
            res.redirect('/')
        }else{
            req.flash('mensajes','error adding url');
            res.redirect('/')
        }
        
        
    }
}
// const deleteUrl = async (req,res)=>{
//     try {
//         await Url.deleteMany()
//         return res.redirect('/');
//     } catch (error) {
//         console.log(error)
//     }
// }
const deleteUrl = async(req,res)=>{
    const {_id} = req.params;
    try {
        if(await Url.findById(_id)){
            const url = await Url.findById(_id);
            // console.log(url.user.localeCompare(req.user.id));
            if(url.user.equals(req.user.id)){
                await Url.findByIdAndDelete(_id);
                req.flash('mensajes','Url borrado');
                return res.redirect('/');
            }else{
                req.flash('mensajes','Url ajena');
                return res.redirect('/');
            }       
        }else{
            req.flash('mensajes','No existe esa Url')
            return res.redirect('/');
        }
    } catch (error) {
        req.flash('mensajes',error.message)
        return res.redirect('/');
    }
}
const update1 = async(req,res)=>{
    const {_id} = req.params;
    try {
        const url = await Url.findById(_id).lean();
        console.log(url)
        return res.render('home',{url});
    } catch (error) {
        
    }
}
const update2 = async(req,res)=>{
    const {_id} = req.params;
    const {origin} = req.body;
    try {
       const url = await Url.findById(_id);
       url.origin = origin;
       await url.save();
       res.redirect('/');
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    showUrls,
    addUrl,
    deleteUrl,
    update1,
    update2
}