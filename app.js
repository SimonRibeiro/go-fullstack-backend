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
            imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.publicdomainpictures.net%2Fpictures%2F100000%2Fvelka%2Fnain-de-jardin-avec-ballon.jpg&f=1&nofb=1&ipt=729b7992b12273a960d8a0cb627cb7a22ab46c89be69bbc7d8196b97e9621870&ipo=images',
            price: 2900,
            userID: 'qsomihvqios'
        },
    ];
    res.status(200).json(stuff);
});

module.exports = app;