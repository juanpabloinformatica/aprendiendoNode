const express = require('express');
const { showUrls, addUrl, deleteUrl,update1,update2 } = require('../controllers/urlController');
const sessionValidator = require('../middlewares/sessionValidator');
const urlValidator = require('../middlewares/urlValidator');
const router = express.Router();





router.get('/',sessionValidator,showUrls)
router.post('/',sessionValidator,urlValidator,addUrl)
router.get('/delete/:_id',sessionValidator,deleteUrl)
router.get('/update1/:_id',sessionValidator,update1)
router.post('/update2/:_id',sessionValidator,urlValidator,update2);
module.exports = router;