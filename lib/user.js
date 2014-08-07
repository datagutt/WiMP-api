var _ = require('lodash');
exports = module.exports = User;
function User(user, _wimp){
	this._wimp = _wimp;
	_.merge(this, user);
};
