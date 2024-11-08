const Thing = require('../models/Thing')
const fs = require('fs');

exports.createThing = (req, res) => { 
    const thingObject = JSON.parse(req.body.thing); //Rend le Thing utlisable en le convertisant de form-data(à cause de la présence du fichier) en JSON
    delete thingObject._id; //Modifié avec thingObject. Supprime toujours l'id attribué par le front-end, Mongo en créant un automatiquement
    delete thingObject._userId; //Supprimé pour utiliser celui extrait du Token pour plus de sécurité
    const thing = new Thing({
        ...thingObject, //Modfié avec thingObject
        userId : req.auth.userId, //Extrait l'Id du Token
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //Résout l'URL complète de l'image avec son protocol, hote, répertoire et nom
    });
    thing.save()
        .then(() => res.status(201).json({message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyThing = (req, res) => {
    const thingObject = req.file ? { //Regarde si la req comporte un fichier
        ...JSON.parse(req.body.thing), //Si oui le rend exploitable...
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //...et résout son URL
    } : {...req.body}; //Sinon traite simplement l'objet entrant comme auparavant

    delete thingObject._userId; //Supprimé pour utiliser celui extrait du Token pour plus de sécurité
    Thing.findOne({_id: req.params.id}) //Cherche l'objet avant de le modifier pour pouvoir vérifier qu'il appartient à l'emetteur de la req
        .then((thing) => { //Si trouvé, le récupère
            if (thing.userId != req.auth.userId) { //Si le req n'émane pas du propriétaire du fichier
                res.status(401).json({message: 'Not authorized'}); //Accès refusé
            } else { //Sinon exécution du code d'origine
                Thing.updateOne({_id: req.params.id}, {...thingObject, _id: req.params.id}) //Modifié avec thingObject
                    .then(() => res.status(200).json({message: 'Objet mis à jour !'}))
                    .catch(error => res.status(400).json({ error }));
            }  
        })
        .catch((error) => {
            res.status(404).json({ error });
        });
};

exports.deleteThing = (req, res) => {
    Thing.findOne({_id: req.params.id}) //Utilise l'ID reçue comme paramètre pour accéder au Thing correspondant dans la DB
        .then(thing => { //Si trouvé
            if (thing.userId != req.auth.userId) { //Vérifie si l’utilisateur qui a fait la requête de suppression est bien celui qui a créé le Thing
                res.status(401).json({message: 'Not authorized'}); //Si non : accès refusé
            } else { //Si oui
                const filename = thing.imageUrl.split('/images/')[1]; //Sépare le segment du dossier de celui du nom de fichier et le récupère
                fs.unlink(`images/${filename}`, () => { //Fonction de suppretion de fs avec en callback la fonction déjà utilisée auparvant
                    Thing.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
                })
            }
        })
        .catch(error => res.status(500).json({ error })); //Erreur server
};

exports.getOneThing = (req, res) => {
    Thing.findOne({_id: req.params.id})
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllThings = (req, res) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
};