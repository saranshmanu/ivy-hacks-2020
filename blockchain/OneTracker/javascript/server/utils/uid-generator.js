const { v4: uuidv4 } = require('uuid');

const generate_uid = () => {
    return uuidv4();
};

module.exports = {
    generate_uid
};