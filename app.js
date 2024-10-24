const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/Product')

mongoose.connect('mongodb+srv://ribeirosimon:<PASSWORD>@cluster0.0dgyu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/api/products', (req, res) => {
    Product.find() //Sans objet de configuration pour obtenir la liste complètes
        .then(Products => res.status(200).json({ products: Products })) //Récupère et renvoie le tableau de tous les Products de la DB
        .catch(error => res.status(400).json({ error })); //Récupère et renvoie l'erreur
});

app.get('/api/products/:id', (req, res) => { // ":" rend le segment dynamique de la route accessible en tant que paramètre
    Product.findOne({_id: req.params.id}) //Trouve le Product dont l'id est le même que celui du paramètre de la requête
        .then(Product => res.status(200).json({ product: Product }))
        .catch(error => res.status(404).json({ error }));
});

app.post('/api/products', (req, res) => { //contenu modifié pour enregistrer les nouvelles ressources avec le model Product
    delete req.body._id; //Supprime l'id attribué par le front-end, Mongoose en créant un automatiquement
    const product = new Product({
        ...req.body // Propage le body de la requête dans le nouvel objet Product
    })
    product.save() // Enregistre Product dans la DB et renvoie une promise nécessitant un .then et un .catch
        .then(product => res.status(201).json({ product })) //Dans tous les cas le renvoie d'une reponse est necessaire pour eviter l'expiration de la requête
        .catch(error => res.status(400).json({ error })); //Recupère l'éventuelle erreur et la renvoie en reponse ({error} équivaut à {error: error})
});

app.put('/api/products/:id', (req, res) => {
    Product.updateOne({_id: req.params.id}, {...req.body, _id:req.params.id})
        .then(() => res.status(200).json({message: 'Modified!'}))
        .catch(error => res.status(400).json({ error }));
});

app.delete('/api/products/:id', (req, res) => {
    Product.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({message: 'Deleted!'}))
        .catch(error => res.status(400).json({ error}))
})

module.exports = app;