var lame = require('lame');
var Speaker = require('speaker');
var WiMP = require('./index');
var username = process.env.USERNAME;
var password = process.env.PASSWORD;
var albumId = 4575689;
WiMP.login(username, password, function(err, wimp){
	console.log(err, wimp);
	wimp.getTracks(albumId, function(err, tracks){
		var track = tracks[0];
		console.log('Playing: %s - %s', track.artist.name, track.title);
		track
		.play()
		.pipe(new lame.Decoder())
 		.pipe(new Speaker())
 		.on('finish', function (){
 			wimp.disconnect();
 		});
	})
});