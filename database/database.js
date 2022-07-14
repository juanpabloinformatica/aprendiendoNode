
const mongoose = require('mongoose');

const getConnected = async ()=>{
    try {
        await mongoose.connect(process.env.URI)
        console.log('Conectado a la base de datos.')

    } catch (error) {
        console.log('Error al conectarse.')
    }
}

getConnected()
