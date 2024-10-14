//Inchangé
const http = require('http');
const app = require('./app');

//Créé par la ligne const errorHandler...
const { error } = require('console');

//Modification du "app.set PORT" 
const normalizePort = val => { //Renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//Gestion des erreurs
const errorHandler = error => {
    if (errorMonitor.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//Inchangé
const server = http.createServer(app);

//Enregistre sur le server les erreurs attrapées et le port ou canal surlequel le serveur s'excute dans la console
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    console.log('Listening on ' + bind);
})

//Simplifié avec la variable port
server.listen(port);