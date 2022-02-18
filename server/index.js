/**
 * Импорт модулей
 */
require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const sequelize = require('./db');
const models = require('./models/models')
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/static/', express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

//обработка ошибок, последний middleware!!!
app.use(errorHandler);

//подключение к БД
const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`server strart on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}
start();
