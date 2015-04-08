var lame = require('lame');
var Speaker = require('speaker');
var WiMP = require('../index');
var async = require('async');
var username = process.env.UN;
var password = process.env.PW;
WiMP.login(username, password, function(err, wimp){
	wimp.getFeatured(function(err, featured){
		//console.log(err, featured);
		var playlist = featured[0];
		console.log('Featured playlist: %s', playlist.name);
		playlist.getTracks(function(err, tracks){
			async.eachSeries(tracks, 
				function(track, callback){
					console.log('Playing: %s - %s', track.artist.name, track.name);
					track.play()
					.pipe(new lame.Decoder())
			 		.pipe(new Speaker())
			 		.on('finish', function (){
			 			callback();
			 		});
					//console.log(track.requestStreamUrl());
				}, function(err){
					console.log('The playlist %s is finished', playlist.name)
				}
			);
		});
	});
});
