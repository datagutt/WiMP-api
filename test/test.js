var assert = require('chai').assert;
var wimp = require('../index');
var artistId = 4948323;
var albumId = 0;
var doLogin = function(done){
	var username = process.env.UN;
	var password = process.env.PW;
	return function(done){
		console.log('lol');
		wimp.login(username, password, function(_this){
			return function(err, wimp){
				_this.wimp = wimp;
				console.log(wimp, _this);
				return done();
			};
		})(this);
	};
}
describe('WiMP', function(){
	beforeEach(doLogin);
	describe('#getArtist()', function(){
		var wimp = this.wimp;
		wimp.getArtist(artistId, function(artist){
			it('should return the correct artist', function(){
				assert(artist.id, artistId);
				assert(artist.name, 'Hvitmalt Gjerde');
			});
		});
	});

	describe('#getAlbum()', function(){
		var wimp = this.wimp;
		wimp.getAlbum(albumId, function(albums){
			it('should returncorrect the album', function(){
				assert(album.id, albumId);
				assert(album.name, 'Hvitmalt Gjerde');
				assert(album.artist.name, 'Hvitmalt Gjerde');
			});
		});
	});
});
