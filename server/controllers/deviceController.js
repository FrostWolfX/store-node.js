const { Device, DeviceInfo } = require('../models/models');
const ApiError = require('../errors/ApiError');
const uuiq = require('uuid');
const path = require('path');

class DeviceController {
    async create(request, response, next) {
        try {
            let { name, price, brandId, typeId, info } = request.body;
            const { img } = request.files;
            let fileName = uuiq.v4() + ".jpeg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const device = await Device.create({ name, price, brandId, typeId, img: fileName });

            if (info) {
                info = JSON.parse(info);
                info.forEach(element =>
                    DeviceInfo.create({
                        title: element.title,
                        description: element.description,
                        deviceId: device.id
                    })
                );
            }
            console.log(info);

            return response.json(device);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }

    }

    async getAll(request, response) {
        try {
            let { brandId, typeId, limit, page } = request.query;
            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit;
            let devices;
            if (!brandId && !typeId) {
                devices = await Device.findAndCountAll({ limit, offset });
            }
            if (brandId && !typeId) {
                devices = await Device.findAndCountAll({ where: { brandId, limit, offset } });
            }
            if (!brandId && typeId) {
                devices = await Device.findAndCountAll({ where: { typeId, limit, offset } });
            }
            if (brandId && typeId) {
                devices = await Device.findAndCountAll({ where: { typeId, brandId, limit, offset } });
            }
            return response.json(devices);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getOne(request, response, next) {
        try {
            const { id } = request.params;
            const device = await Device.findOne({
                where: { id },
                include: [{ model: DeviceInfo, as: 'info' }]
            });
            return response.json(device);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }

    }
}

module.exports = new DeviceController();