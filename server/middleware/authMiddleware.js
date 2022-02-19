const jsonwebtoken = require('jsonwebtoken');


module.exports = function (request, response, next) {
    if (request.method === "OPTIONS") {
        next();
    }
    try {
        const token = request.headers.authorization.split(' ')[1]; //Bearer mytoken
        if (!token) {
            return response.status(401).json({ message: 'Пользователь не авторизован' });
        }
        const decode = jsonwebtoken.verify(token, process.env.SECRET_KEY);
        request.user = decode;
        next();
    } catch (error) {
        response.status(401).json({ message: 'Пользователь не авторизован' });
    }
}