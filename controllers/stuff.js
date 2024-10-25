const Thing = require('../models/Thing')

exports.createThing = (req, res) => { //contenu modifié pour enregistrer les nouvelles ressources avec le model Thing
    delete req.body._id; //Supprime l'id attribué par le front-end, Mongo en créant un automatiquement
    const thing = new Thing({
        ...req.body // Propage le body de la requête dans le nouvel objet thing
    })
    thing.save() // Enregistre thing dans la DB et renvoie une promise nécessitant un .then et un .catch
        .then(() => res.status(201).json({ message: 'Objet enregistré !'})) //Dans tous les cas le renvoie d'une reponse est necessaire pour eviter l'expiration de la requête
        .catch(error => res.status(400).json({ error })); //Recupère l'éventuelle erreur et la renvoie en reponse ({error} équivaut à {error: error})
};

exports.modifyThing = (req, res) => {
    Thing.updateOne({_id: req.params.id}, {...req.body, _id:req.params.id})
        .then(() => res.status(200).json({message: 'Objet mis à jour !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res) => {
    Thing.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res) => { // ":" rend le segment dynamique de la route accessible en tant que paramètre
    Thing.findOne({_id: req.params.id}) //Trouve le thing dont l'id est le même que celui du paramètre de la requête
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllThings = (req, res) => { //Contenu modifié pour récupérer tous les objets Thing de la DB plutôt que l'ancien tableau statique
    Thing.find() //Sans objet de configuration pour obtenir la liste complètes
        .then(things => res.status(200).json(things)) //Récupère et renvoie le tableau de tous les things de la DB
        .catch(error => res.status(400).json({ error })); //Récupère et renvoie l'erreur
};