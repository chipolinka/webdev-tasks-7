'use strict';

const path = require('path');

exports.file = (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
};
