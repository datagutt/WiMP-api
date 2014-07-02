var _ = require('lodash');

exports = module.exports = Playlist;

var Track = require('./track');

function Playlist(playlist, _wimp){
	this._wimp = _wimp;
	_.merge(this, playlist);
}
Playlist.prototype.getTracks = function(fn){
	var self = this;
	var wimp = self._wimp;
	wimp.agent
	.get(wimp._buildUrl('playlists', [self.uuid, 'tracks'], {
		limit: 9999
	}))
	.end(function(err, res){
		var items = res.body.items;
		var tracks = [];
		_.each(items, function(track){
			track = new Track(track, wimp);
			tracks.push(track);
			return track;
		});
		fn(err, tracks);
	});
};