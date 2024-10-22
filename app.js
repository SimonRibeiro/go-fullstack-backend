const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Thing = require('./models/Thing')

mongoose.connect('mongodb+srv://ribeirosimon:<PASSWORD>@cluster0.yeur4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
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

app.post('/api/stuff', (req, res) => { //contenu modifié pour enregistrer les nouvelles ressources avec le model Thing
    delete req.body._id; //Supprime l'id attribué par le front-end, Mongo en créant un automatiquement
    const thing = new Thing({
        ...req.body // Propage le body de la requête dans le nouvel objet thing
    })
    thing.save() // Enregistre thing dans la DB et renvoie une promise nécessitant un .then et un .catch
        .then(() => res.status(201).json({ message: 'Objet enregistré !'})) //Dans tous les cas le renvoie d'une reponse est necessaire pour eviter l'expiration de la requête
        .catch(error => res.status(400).json({ error })); //Recupère l'éventuelle erreur et la renvoie en reponse ({error} équivaut à {error: error})
});

//Ajout :
app.put('/api/stuff/:id', (req, res) => {
    Thing.updateOne({_id: req.params.id}, {...req.body, _id:req.params.id})
        .then(() => res.status(200).json({message: 'Objet mis à jour !'}))
        .catch(error => res.status(400).json({ error }));
});

//Ajout :
app.delete('/api/stuff/:id', (req, res) => {
    Thing.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error}))
})

app.get('/api/stuff/:id', (req, res) => { // ":" rend le segment dynamique de la route accessible en tant que paramètre
    Thing.findOne({_id: req.params.id}) //Trouve le thing dont l'id est le même que celui du paramètre de la requête
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
});

app.use('/api/stuff', (req, res) => { //Contenu modifié pour récupérer tous les objets Thing de la DB plutôt que l'ancien tableau statique
    Thing.find() //Sans objet de configuration pour obtenir la liste complètes
        .then(things => res.status(200).json(things)) //Récupère et renvoie le tableau de tous les things de la DB
        .catch(error => res.status(400).json({ error })); //Récupère et renvoie l'erreur
});

module.exports = app;
