const { Brand } = require('../models/models');
const ApiError = require('../errors/ApiError');

class BrandController {
    async create(request, response) {
        try {
            const { name } = request.body;
            const brand = await Brand.create({ name });
            return response.json(brand);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAll(request, response) {
        try {
            const brands = await Brand.findAll();
            return response.json(brands);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}

module.exports = new BrandController();