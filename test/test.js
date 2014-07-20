var assert = require('chai').assert;
var wimp = require('../index');
var artistId = 4948323;
var albumId = 0;
var doLogin = function(done){
	var username = process.env.UN;
	var password = process.env.PW;
	wimp.login(username, password, function(err, wimp){	console.log(username, password);

		this.wimp = wimp;
		console.log(wimp, this);
		return done(wimp);
	});
}
doLogin(function(wimp){

describe('WiMP', function(){
	beforeEach(doLogin);
	describe('#getArtist()', function(){
		var wimp = wimp;
		wimp.getArtist(artistId, function(artist){
			it('should return the correct artist', function(){
				assert(artist.id, artistId);
				assert(artist.name, 'Hvitmalt Gjerde');
			});
		});
	});

	describe('#getAlbum()', function(){
		var wimp = wimp;
		wimp.getAlbum(albumId, function(albums){
			it('should return the correct album', function(){
				assert(album.id, albumId);
				assert(album.name, 'Hvitmalt Gjerde');
				assert(album.artist.name, 'Hvitmalt Gjerde');
			});
		});
	});
});

});