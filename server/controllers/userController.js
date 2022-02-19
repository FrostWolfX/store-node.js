const ApiError = require('../errors/ApiError');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { User, Basket } = require('../models/models');

const generateJwt = (id, email, role) => {
    return jsonwebtoken.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserController {
    async registration(request, response, next) {
        try {
            const { email, password, role } = request.body;
            if (!email && !password) {
                return next(ApiError.badRequest('Некорректный email или пароль'));
            }
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ email, role, password: hashPassword });
            const basket = await Basket.create({ userId: user.id });
            const token = generateJwt(user.id, user.email, user.role);
            return response.json({ token });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }

    }

    async login(request, response, next) {
        try {
            const { email, password } = request.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.internal('Пользователь не найден'));
            }
            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return next(ApiError.internal('Указан неверный пароль'));
            }
            const token = generateJwt(user.id, user.email, user.role);
            return response.json({ token });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async check(request, response, next) {
        try {
            const token = generateJwt(request.user.id, request.user.email, request.user.role);
            return response.json({ token });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}


module.exports = new UserController();