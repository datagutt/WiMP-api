/* Module dependencies */
var util = require('util');
var inherits = util.inherits;
var EventEmitter = require('events').EventEmitter;
var qs = require('qs');
var superagent = require('superagent');
var _ = require('lodash')

module.exports = WiMP;

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

	this.user = {};

	this.on('user', this.getUser);
}
inherits(WiMP, EventEmitter);

WiMP.prototype._buildUrl = function(method, params, querystring){
	var self = this;
	if(!querystring){
		querystring = {};
	}

	if(self.sessionId){
		querystring['sessionId'] = self.sessionId;
	}
	if(self.countryCode){
		querystring['countryCode'] = self.countryCode;
	}
	querystring = qs.stringify(querystring);

	return self.apiLocation + method + '/' + params.join('/') + '?' + querystring;
}
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
			self.user.id = res.body.userId;
			self.emit('user');
		}
	});
	self.on('login', fn);
};
WiMP.prototype.getUser = function(){
	var self = this;
	self.agent
	.get(self._buildUrl('users', [self.user.id]))
	.end(function(err, res){
		self.user = res.body;
		self.emit('login');
	});
};
WiMP.prototype.getArtist = function(artistId, fn){
	var self = this;
	self.agent
	.get(self._buildUrl('artist', [artistId]))
	.end(function(err, res){
		var items = res.body.items;
		artist = new Artist(items[0], self);
		fn(err, artist);
	});
}
WiMP.prototype.getAlbums = function(artistId, fn){
	var self = this;
	self.agent
	.get(self._buildUrl('artists', [artistId, 'albums'], {
		limit: 999
	}))
	.end(function(err, res){
		var items = res.body.items;
		var albums = [];
		_.each(items, function(album){
			album = new Album(album, self);
			albums.push(album);
			return album;
		});
		fn(err, albums);
	});
};
WiMP.prototype.getAlbum = function(albumId, fn){
	var self = this;
	self.agent
	.get(self._buildUrl('album', [albumId]))
	.end(function(err, res){
		var items = res.body.items;
		album = new Album(items[0], self);
		fn(err, album);
	});
};
WiMP.prototype.getTopTracks = function(artistId, fn){
	var self = this;
	self.agent
	.get(self._buildUrl('artists', [artistId, 'toptracks'], {
		limit: 10
	}))
	.end(function(err, res){
		var items = res.body.items;
		var tracks = [];
		_.each(items, function(track){
			track = new Track(track, self);
			tracks.push(track);
			return track;
		});
		fn(err, tracks);
	})
};
WiMP.prototype.getAlbumTracks = function(albumId, fn){
	var self = this;
	self.agent
	.get(self._buildUrl('albums', [albumId, 'tracks']))
	.end(function(err, res){
		var items = res.body.items;
		var tracks = [];
		_.each(items, function(track){
			track = new Track(track, self);
			tracks.push(track);
			return track;
		});
		fn(err, tracks);
	});
};
WiMP.prototype.getPlaylists = function(fn){
	var self = this;
	self.agent
	.get(self._buildUrl('users', [self.user.id, 'playlists'], {
		limit: 9999
	}))
	.end(function(err, res){
		var items = res.body.items;
		var playlists = [];
		_.each(items, function(playlist){
			playlist = new Playlist(playlist, self);
			playlists.push(playlist);
			return playlist;
		});
		fn(err, playlists);
	});
};
WiMP.prototype.getPlaylistTracks = function(playlistId, fn){
	var self = this;
	self.agent
	.get(wimp._buildUrl('playlists', [playlistId, 'tracks'], {
		limit: 9999
	}))
	.end(function(err, res){
		var items = res.body.items;
		var tracks = [];
		_.each(items, function(track){
			track = new Track(track, self);
			tracks.push(track);
			return track;
		});
		fn(err, tracks);
	});
};
WiMP.prototype.search = function(ret, query, fn){
	var self = this;
	if(ret == 'artists'){
		self.agent
		.get(self._buildUrl('search', ['artists'], {
			'query': query,
			'limit': 25
		}))
		.end(function(err, res){
			var items = res.body.items;
			var artists = [];
			console.log(items) ;
			_.each(items, function(artist){
				artist = new Artist(artist, self);
				artists.push(artist);
				return artist;
			});
			fn(err, artists);
		});
	}
};
