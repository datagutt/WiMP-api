var lame = require('lame');
var Speaker = require('speaker');
var async = require('async');
var WiMP = require('../index');
var username = process.env.USERNAME;
var password = process.env.PASSWORD;
WiMP.login(username, password, function(err, wimp){
	wimp.getPlaylists(function(err, playlists){
		var playlist = playlists[0];
		playlist.getTracks(function(err, tracks){
			tracks.sort(function(){
				return .5 - Math.random();
			});
			async.eachSeries(tracks, 
				function(track, callback){
					console.log('Playing: %s - %s', track.artist.name, track.title);
					track.play()
					.pipe(new lame.Decoder())
			 		.pipe(new Speaker())
			 		.on('finish', function (){
			 			callback();
			 		});
					console.log(track.requestStreamUrl());
				}, function(err){
					console.log('The playlist %s is finished', playlist.name)
				}
			);
		});
	});			
});