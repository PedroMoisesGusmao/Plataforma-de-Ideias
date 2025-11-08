const mongoose = require('mongoose');
const { createIndexes } = require('./indexes');
require('dotenv').config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;        
        await mongoose.connect(mongoURI);

        console.log('✅ MongoDB conectado com sucesso!');

        if (process.env.NODE_ENV !== 'test') {
            await createIndexes();
        }
        
    } catch (error) {
        console.error('❌ Erro ao conectar com MongoDB:', error.message);
        process.exit(1);
    }
};

mongoose.connection.on('connected', () => {
    console.log('Mongoose conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Erro na conexão do Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose desconectado do MongoDB');
});

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('Conexão MongoDB fechada devido ao encerramento da aplicação');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao fechar conexão:', error);
        process.exit(1);
    }
});

module.exports = connectDB;
