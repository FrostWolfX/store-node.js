const jsonwebtoken = require('jsonwebtoken');

module.exports = function (role) {
    return function (request, response, next) {
        if (request.method === "OPTIONS") {
            next();
        }
        try {
            const token = request.headers.authorization.split(' ')[1]; //Bearer mytoken
            if (!token) {
                return response.status(401).json({ message: "Пользователь не авторизован" });
            }
            const decode = jsonwebtoken.verify(token, process.env.SECRET_KEY);
            if (decode.role !== role) {
                return response.status(403).json({ message: "Нет доступа" });
            }
            request.user = decode;
            next();
        } catch (error) {
            response.status(401).json({ message: "Пользователь не авторизован" });
        }
    }
}