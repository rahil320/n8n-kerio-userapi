const auth = require('./nodes/kerio-client/KerioConnectAuth.node.js');
const autoresp = require('./nodes/kerio-client/KerioConnectAutoResponder.node.js');
const changePwd = require('./nodes/kerio-client/KerioConnectPassword.node.js');

module.exports = {
  nodes: [
    new auth(),
    new autoresp(),
		new changePwd(),
  ],
};
