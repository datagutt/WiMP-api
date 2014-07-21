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