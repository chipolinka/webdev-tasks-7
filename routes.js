'use strict';

const controller = require('./controllers/controller');

module.exports = function (app) {
    app.get('/', controller.file);

    /* eslint no-unused-vars: 0 */
    /* eslint max-params: [2, 4] */
    app.use((err, req, res, next) => {
        console.error(err);
        res.sendStatus(500);
    });
};
