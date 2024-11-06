const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');
        const userId = decodedToken.userdId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({error});
    }
};