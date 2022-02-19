const { Type } = require('../models/models');
const ApiError = require('../errors/ApiError');

class TypeController {
    async create(request, response, next) {
        try {
            const { name } = request.body;
            const type = await Type.create({ name });
            return response.json(type);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAll(request, response) {
        try {
            const types = await Type.findAll();
            return response.json(types);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}

module.exports = new TypeController();