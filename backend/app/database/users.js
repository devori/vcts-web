const path = require('path');
const lowdb = require('lowdb');
const db = lowdb(path.resolve(__dirname, '../../data/users.json'));

db.defaults({}).write();

function findByUsername (username) {
  if (db.has(username).value()) {
    return db.get(username).cloneDeep().value();
  }
  return null;
}

function create (userInfo) {
  let user = findByUsername(userInfo.username);
  if (user !== null) {
    throw {
      status: 400,
      result: 'duplicated username'
    };
  }
  db.set(userInfo.username, userInfo).write();
  return findByUsername(userInfo.userId);
}

module.exports = {
  create: create,
  findByUsername: findByUsername
}
