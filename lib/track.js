var _ = require('lodash');
var PassThrough = require('stream').PassThrough;
var ffmpeg = require('fluent-ffmpeg');
exports = module.exports = Track;
function Track(track, _wimp){
	this._wimp = _wimp;
	_.merge(this, track);
	this.soundQuality = _wimp.config.quality;
}
Track.prototype.play = function(){
	var wimp = this._wimp;
	var stream = new PassThrough();
	var streamUrl = this.requestStreamUrl(function(err, url){
		if(err) return stream.emit('error', err);
		console.log(url);
		var command = new ffmpeg('rtmp://' + url)
		.toFormat('mp3')
		.on('error', function(err){
			console.log('An error occurred: ' + err.message);
		})
		.on('end', function(){
			console.log('Processing finished !');
		});

		var ffstream = command.pipe();
		ffstream.on('data', function(chunk){
			stream.write(chunk);
			console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
		});
	});

 	return stream;
};
Track.prototype.requestStreamUrl = function(fn){
	var wimp = this._wimp;
	var params = {
		'soundQuality': this.soundQuality
	};
	wimp.request('GET', 'tracks/' + this.id + '/streamUrl', params, null, function(err, res){
		if(err){
			fn(err);
		}else if(!res.body || !res.body.url){
			fn(new Error('response contained no "url"'));
		}else{
			fn(null, res.body.url);
		}
	});
};