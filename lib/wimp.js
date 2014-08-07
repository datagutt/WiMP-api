/* Module dependencies */
var util = require('util');
var inherits = util.inherits;
var EventEmitter = require('events').EventEmitter;
var qs = require('qs');
var superagent = require('superagent');
var _ = require('lodash')
var async = require('async');
var url = require('url');

module.exports = WiMP;

var User = require('./user');
var Artist = require('./artist');
var Album = require('./album');
var Track = require('./track');
var Playlist = require('./playlist');

WiMP.login = function(un, pw, fn){
	if(!fn) fn = function(){};
	var wimp = new WiMP();
	wimp.login(un, pw, function(err){
		if(err) return fn(err);
		fn.call(wimp, null, wimp);
	})
	return wimp;
}

function WiMP(){
	if(!(this instanceof WiMP)) return new WiMP();
	EventEmitter.call(this);

 	this.agent = superagent.agent();

	this.apiLocation = 'https://play.wimpmusic.com/v1/';
	this.apiToken = 'rQtt0XAsYjXYIlml';
	this.countryCode = 'NO';
}
inherits(WiMP, EventEmitter);

WiMP.prototype.login = function(un, pw, fn){
	var self = this;
	var e = {
		'username': un,
		'password': pw
	};
	self.agent
	.post(self.apiLocation + 'login/username?token=' + this.apiToken)
	.type('form')
	.send(e)
	.end(function(err, res){
		if(res.body.status && res.body.status == 401){
			self.emit('error', new Error(res.body.userMessage));
		}else{
			self.sessionId = res.body.sessionId;
			self.countryCode = res.body.countryCode;
			self.user = new User({
				id: res.body.userId
			}, self);
			self.emit('login');
		}
	});
	self.on('login', fn);
};
WiMP.prototype.request = function(method, path, params, data, fn){
	var self = this;
	var defaultParams = {};

	if(self.sessionId){
		defaultParams['sessionId'] = self.sessionId;
	}
	if(self.countryCode){
		defaultParams['countryCode'] = self.countryCode;
	}
	if(_.size(defaultParams) > 0){
		defaultParams['limit'] = 9999;
	}

	params = _.merge(defaultParams, params);
	self.agent[method.toLowerCase()](self.apiLocation + path)
	.query(params)
	.send(data)
	.end(fn);
};
WiMP.prototype.getUser = function(fn){
	var self = this;
	self._mapRequest('users/' + self.user.id, null, 'user', fn);
};
WiMP.prototype.getArtist = function(artistId, fn){
	var self = this;
	self._mapRequest('artists/' + artistId, null, 'artist', fn);
}
WiMP.prototype.getAlbums = function(artistId, fn){
	var self = this;
	self._mapRequest('artists/' + artistId + '/albums', null, 'albums', fn);
};
WiMP.prototype.getAlbum = function(albumId, fn){
	var self = this;
	self._mapRequest('album/' + albumId, null, 'album', fn);
};
WiMP.prototype.getTopTracks = function(artistId, fn){
	var self = this;
	self._mapRequest('artists/' + artistId + '/toptracks', {
		limit: 10
	}, 'tracks', fn);
};
WiMP.prototype.getAlbumTracks = function(albumId, fn){
	var self = this;
	self._mapRequest('albums/' + albumId + '/tracks', null, 'tracks', fn);
};
WiMP.prototype.getPlaylists = function(userId, fn){
	var self = this;
	self._mapRequest('users/' + userId + '/playlists', {
		limit: 9999
	}, 'playlist', fn);
};
WiMP.prototype.getPlaylistTracks = function(playlistId, fn){
	var self = this;
	self._mapRequest('playlists/' + playlistId + '/tracks', {
		limit: 9999
	}, 'tracks', fn);
};
WiMP.prototype.search = function(field, value, fn){
	var self = this;
	if(['artist', 'album', 'playlist', 'track'].indexOf(field) == -1){
		self.emit('error', new Error('Unknown field: ' + field));
	}
	var retType = field + 's';
	var url = 'search/' + retType;
	self._mapRequest(url, {
		'query': value,
		'limit': 50
	}, retType, fn);
};
WiMP.prototype.getFavoriteArtists = function(userId, fn){
	var self = this;
	self._mapRequest('users/' + userId + '/favorites/artists', {
		limit: 999
	}, 'artists', fn);
};
WiMP.prototype.getFavoriteAlbums = function(userId, fn){
	var self = this;
	self._mapRequest('users/' + userId + '/favorites/albums', {
		limit: 999
	}, 'albums', fn);
};
WiMP.prototype.getFavoriteTracks = function(userId, fn){
	var self = this;
	self._mapRequest('users/' + self.user.id + '/favorites/tracks', {
		limit: 999
	}, 'tracks', fn);
};
WiMP.prototype._mapRequest = function(url, params, ret, fn){
	var self = this;
	var parse;
	if(ret.indexOf('artist') == 0){
		parse = self._parseArtist;
	}else if(ret.indexOf('album') == 0){
		parse = self._parseAlbum;
	}else if(ret.indexOf('track') == 0){
		parse = self._parseTrack;
	}else if(ret.indexOf('playlist') == 0){
		parse = self._parsePlaylist;
	}else{
		self.emit('error', new Error('Not implemented'));
	}

	self.request('GET', url, params, null, function(err, res){
		var items = res.body.items;
		if(items){
			if(items.length > 0 && 'item' in items[0]){
				async.map(items, function(item, cb){
					parse.bind(self)([item['item'], cb]);
				}, function(err, items){
					async.map(items, parse.bind(self), fn);
				});
			}else{
				async.map(items, parse.bind(self), function(err, items){
					fn(err, items);
				});
			}
		}else{
			if(parse){
				parse(res.body, fn);
			}else{
				fn(err);
			}
		}
	});
};
WiMP.prototype._parseArtist = function(item, fn){
	var self = this;
	var artist = new Artist(item, self);
	if(fn){
		fn(null, artist);
	}
	return artist;
};
WiMP.prototype._parseAlbum = function(item, fn){
	var self = this;
	var album = new Album(item, self);
	if(fn){
		fn(null, album);
	}
	return album;
};
WiMP.prototype._parseTrack = function(item, fn){
	var self = this;
	var track = new Track(item, self);
	if(fn){
		fn(null, track);
	}
	return track;
};
WiMP.prototype._parsePlaylist = function(item, fn){
	var self = this;
	var playlist = new Playlist(item, self);
	if(fn){
		fn(null, playlist);
	}
	return playlist;
};