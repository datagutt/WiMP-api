var _ = require('lodash');
exports = module.exports = Artist;
function Artist(artist, _wimp){
	this._wimp = _wimp;
	_.merge(this, artist);
}
Artist.prototype.getAlbums = function(fn){
	var wimp = this._wimp;
	return wimp.getAlbums(this.id, fn);
};
Artist.prototype.getTopTracks = function(fn){
	var wimp = this._wimp;
	return wimp.getTopTracks(this.id, fn);
};
Object.defineProperty(Artist.prototype, 'image', {
	get: function(width, height){
		if(!width){
			width = 512;
		}
		if(!height){
			height = 512;
		}
		return 'http://images.osl.wimpmusic.com/im/im?w=' + width + '&h=' + height + '&artistid=' + this.id;
	}
});