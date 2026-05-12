const { v4: uuidv4 } = require('uuid');

const generatePasswordWithUUID = (length = 8) => {
  const uuid = uuidv4().replace(/-/g, '');
  return uuid.substring(0, length);
};

module.exports = {generatePasswordWithUUID}