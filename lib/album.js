var _ = require('lodash');
exports = module.exports = Album;
function Album(album, _wimp){
	this._wimp = _wimp;
	_.merge(this, album);
}
