const express = require('express');
const app = express();

//Ajout :
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ribeirosimon:W9SKchHjawMJWVc7@cluster0.yeur4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); //indique à Express d'intercepter toutes les requêtes qui ont comme Content-Type "application/json" 
//et met à disposition leur body directement sur l'objet req 
//Le package "body-parser" est une ancienne façon de faire équivalante (rendre les données du body de req exploitables)

app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/stuff', (req, res) => {
    console.log(req.body); //Log le body de la requete (au content-type "application/json") dans la console (qui execute le server)
    res.status(201).json({ //201 est le code de création de ressource
        message: 'Objet créé !'
    });
});

app.use('/api/stuff', (req, res) => {//La méthode .use permet d'intercepter toutes les requêtes (non spécifique) à la route indiquée, 
//on peut spécifier le verbe de requête à la place pour n'intercepter que celles-ci. 
//Les requêtes interceptées pour une même route par un middleware en amout, ne le seront pas par celles qui aurait pu le faire en aval.
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