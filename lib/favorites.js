var _ = require('lodash');
exports = module.exports = Favorites;
function Favorites(userId, _wimp){
	this._wimp = _wimp;
	this.baseUrl = 'users/' + userId + '/favorites';
};
Favorites.prototype.getArtists = function(fn){
	var self = this;
	var wimp = self._wimp;
	wimp._mapRequest(self.baseUrl + '/artists', null, 'artists', fn);
};
Favorites.prototype.getAlbums = function(fn){
	var self = this;
	var wimp = self._wimp;
	wimp._mapRequest(self.baseUrl + '/albums', null, 'albums', fn);
};
Favorites.prototype.getTracks = function(fn){
	var self = this;
	var wimp = self._wimp;
	wimp._mapRequest(self.baseUrl + '/tracks', null, 'tracks', fn);
};