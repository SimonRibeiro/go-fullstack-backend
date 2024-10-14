const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/stuff', (req, res) => {
    const stuff = [
        {
            _id: 'oeihFzeoi',
            title: 'Mon premier objet',
            description: 'Les infos de mon premier objet',
            imageUrl: 'Https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 4900,
            userID: 'qsomihvqios',
        },
        {
            _id: 'oeihfzeomoihi',
            title: 'Mon deuxième objet',
            description: 'Les infos de mon deuxième objet',
            imageUrl: 'Https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 2900,
            userID: 'qsomihvqios'
        },
    ];
    res.status(200).json(stuff);
});

module.exports = app;