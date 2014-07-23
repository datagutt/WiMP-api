var _ = require('lodash');

exports = module.exports = Playlist;

function Playlist(playlist, _wimp){
	this._wimp = _wimp;
	_.merge(this, playlist);
}
Playlist.prototype.getTracks = function(fn){
	var wimp = this._wimp;
	return wimp.getPlaylistTracks(this.uuid, fn);
};
Object.defineProperty(Playlist.prototype, 'image', {
	get: function(width, height){
		if(!width){
			width = 512;
		}
		if(!height){
			height = 512;
		}
		return 'http://images.osl.wimpmusic.com/im/im?w=' + width + '&h=' + height + '&uuid=' + this.uuid;
	}
});