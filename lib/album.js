var _ = require('lodash');
exports = module.exports = Album;
function Album(album, _wimp){
	this._wimp = _wimp;
	_.merge(this, album);
}
Album.prototype.getTracks = function(fn){
	var wimp = this._wimp;
	return wimp.getAlbumTracks(this.id, fn);
};
Object.defineProperty(Album.prototype, 'image', {
	get: function(width, height){
		if(!width){
			width = 512;
		}
		if(!height){
			height = 512;
		}
		return 'http://images.osl.wimpmusic.com/im/im?w=' + width + '&h=' + height + '&albumid=' + this.id;
	}
});