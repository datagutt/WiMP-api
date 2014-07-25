var _ = require('lodash');
var PassThrough = require('stream').PassThrough;
var ffmpeg = require('fluent-ffmpeg');
exports = module.exports = Track;
function Track(track, _wimp){
	this._wimp = _wimp;
	_.merge(this, track);
	this.soundQuality = 'HIGH';
}
Track.prototype.play = function(){
	var wimp = this._wimp;
	var stream = new PassThrough();
	var streamUrl = this.requestStreamUrl();

	wimp.agent
	.get(streamUrl)
	.end(function(err, res){
		console.log(res.body.url);
		if(err) return stream.emit('error', err);
		if(!res.body.url) return stream.emit('error', new Error('response contained no "url"'));
 		var command = new ffmpeg('rtmp://' + res.body.url)
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
Track.prototype.requestStreamUrl = function(){
	var soundQuality = this.soundQuality;
	var wimp = this._wimp;
	return wimp._buildUrl('tracks/' + this.id + '/streamUrl', {
		'soundQuality': soundQuality
	});
};