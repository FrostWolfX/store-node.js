const { Device } = require('../models/models');
const ApiError = require('../errors/ApiError');
const uuiq = require('uuid');
const path = require('path');

class DeviceController {
    async create(request, response, next) {
        try {
            const { name, price, brandId, typeId, info } = request.body;
            const { img } = request.files;
            let fileName = uuiq.v4() + ".jpeg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const device = await Device.create({ name, price, brandId, typeId, img: fileName });
            return response.json(device);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }

    }

    async getAll(request, response) {
        const devices = await Device.findAll();
        return response.json(devices);
    }

    async getById(request, response) {

    }
}

module.exports = new DeviceController();