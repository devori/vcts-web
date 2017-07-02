const crypto = require('crypto');

function getHashSha512(hashKey, str) {
  return crypto.createHmac('sha512', hashKey).update(str).digest('hex')
}

module.exports = {
  getHashSha512
}
