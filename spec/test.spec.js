var wimp = require('../index');
var artistId = 4948323;
var albumId = 0;
var doLogin = function(done){
	var username = process.env.UN;
	var password = process.env.PW;
	wimp.login(username, password, function(err, wimp){
		console.log(username, password);
		console.log(err);
		return done(wimp);
	});
};
describe('WiMP', function(){
	var wimp = 'a', _wimp = 'b';
	beforeEach(function(done){
		doLogin(function(wimp){
			_wimp = wimp;
			return wimp;
		});
	});

	describe('#getArtist()', function(){
		var _artist;
		beforeEach(function(done){
			console.log(_wimp.getArtist);
			_wimp.getArtist(artistId, function(artist){
				jasmine.log(artist)
				_artist = artist;
				done(artist);
			});
		});
		it('should return the correct artist', function(){
			console.log(arguments)
			expect(_artist.id).toBe(artistId);
			expect(_artist.name).toBe('Hvitmalt Gjerde');
		});
	});

	/*describe('#getAlbum()', function(){
		it('should return the correct album', function(){
			_wimp.getAlbum(albumId, function(albums){
				expect(album.id).toBe(albumId);
				expect(album.name).toBe('Hvitmalt Gjerde');
				expect(album.artist.name).toBe('Hvitmalt Gjerde');
			});
		});
	});*/
});