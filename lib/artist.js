var _ = require('lodash');
exports = module.exports = Artist;
function Artist(artist, _wimp){
	this._wimp = _wimp;
	_.merge(this, artist);
}
Artist.prototype.getAlbums = function(fn){
	var wimp = this._wimp;
	return wimp.getArtistAlbums(this.id, fn);
};
Artist.prototype.getAlbumsEpAndSingles = function(fn){
	var wimp = this._wimp;
	return wimp.getArtistEpAndSingles(this.id, fn);
};
Artist.prototype.getAlbumsOther = function(fn){
	var wimp = this._wimp;
	return wimp.getArtistAlbumsOther(this.id, fn);
};
Artist.prototype.getTopTracks = function(fn){
	var wimp = this._wimp;
	return wimp.getArtistTopTracks(this.id, fn);
};
Artist.prototype.getArtistBio = function(fn){
	var wimp = this._wimp;
	return wimp.getArtistBio(this.id, fn);
};
Artist.prototype.getArtistSimilar = function(fn){
	var wimp = this._wimp;
	return wimp.getArtistSimilar(this.id, fn);
};
Artist.prototype.getArtistRadio = function(fn){
	var wimp = this._wimp;
	return wimp.getaritstRadio(this.id, fn);
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