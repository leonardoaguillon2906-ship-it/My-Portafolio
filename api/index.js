const path = require('path');
const app = require(path.resolve(process.cwd(), 'server'));

module.exports = (req, res) => {
    return app(req, res);
};
