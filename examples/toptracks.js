var lame = require('lame');
var Speaker = require('speaker');
var WiMP = require('../index');
var username = process.env.USERNAME;
var password = process.env.PASSWORD;
var artistId = 4948323;
WiMP.login(username, password, function(err, wimp){
	console.log(err, wimp);
	wimp.search('artists', 'Hvitmalt Gjerde', function(artists){
		wimp.getTopTracks(artists[0].id, function(err, tracks){
			var track = tracks[0];
			console.log('Playing: %s - %s', track.artist.name, track.title);
			track.play()
			.pipe(new lame.Decoder())
			.pipe(new Speaker())
			.on('finish', function (){
				console.log('Song finished');
			});
			console.log(track.requestStreamUrl());
		});
	});
});