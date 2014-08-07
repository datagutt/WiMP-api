var _ = require('lodash');
var Favorites = require('./favorites.js');
exports = module.exports = User;
function User(user, _wimp){
	this._wimp = _wimp;
	_.merge(this, user);
};
