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
	 	var req = wimp.agent
	 	.get(res.body.url)
	 	.end()
		.request();
	 	req.on('response', function(res){
	 		if(res.statusCode == 200){
				var options = options || {};
				options.source = res;
 				var ff = new ffmpeg(options)
				.toFormat('mp3');
				ff.writeToStream(stream);
	 		}else{
				stream.emit('error', new Error('HTTP Status Code ' + res.statusCode));
			}
	 	});
	});

 	return stream;
}
Track.prototype.requestStreamUrl = function(){
	var soundQuality = this.soundQuality;
	var wimp = this._wimp;
	return wimp._buildUrl('tracks', [this.id, 'streamUrl'], {
		'soundQuality': soundQuality
	})
	return 'tracks/' + this.id + '/streamUrl?soundQuality=' + soundQuality;
}