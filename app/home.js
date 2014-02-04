/*global define, console, $, document, window, videojs, http */

console.log(videojs);

define(function (require) {
	'use strict';
	
	var app = require('durandal/app'),
		ko = require('knockout'),
		http = require('plugins/http'),
		queryPrefix = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=',
		apiKey = 'AIzaSyBRsops2-sGNOAR2KzHvZwYTgqjPWEbD9k',
		//Video,
		loadVideo,
		search,
		player = null,
		viewWidth = 1000, //document.getElementById("guts").clientWidth,
		aspectRatio = 16 / 9,
		padding = 0.95,
		width = viewWidth * padding,
		height = width / aspectRatio;
	
//	Video = function (videoId) {
//		this.videoId = videoId;
//		this.url = 
//	};
	
	loadVideo = function (videoId) {
		var url = 'http://www.youtube.com/watch?v=' + videoId,
			videoHtml;
		
		console.log('Load video with id = ' + videoId);

		if (player) {
			player.dispose();
			$("#vid").remove();
		}

		console.log("width: " + width + " height: " + height);

		videoHtml = '<video id="vid" src="" class="video-js vjs-default-skin" controls preload="auto" ></video>';
		$("#player").prepend(videoHtml);

		window.scrollTo(0, 0);

		videojs('vid', { "techOrder": ["youtube"], "src": url }).ready(function () {
			player = this;
			player.width(width);
			player.height(height);
			player.play();
		});
	};
	
	search = function () {
		var tempArray = [], queryString,
			that = this;
			
		if (that.query() === '') {
			return;
		}
		
		queryString = queryPrefix + (that.query()).replace(" ", "+") + '&key=' + apiKey;
		console.log('do the search for: ' + queryString);
		
		return http.get(queryString).then(function (response) {
			var i, l, vid, vidObj;
			console.log('we got something in the promise.');
			console.log(response);
			that.vids([]); // always reset the video array
			for (i = 0, l = response.items.length; i < l; i += 1) {
				vid = response.items[i];
				if (vid && vid.id && vid.id.videoId) {
					console.log(vid.id.videoId);
					//vidObj = new Video(vid.id.videoId);
					that.vids.push(vid);
				}
			}
			
			if (that.vids[0]) {
				that.loadVideo(that.vids[0].id.videoId);
			}
			console.log('Number of vids: ' +  that.vids.length);
		});
	};
	
	return {
		// vids: [new Video('9JCZT_51GA0'), new Video('OGPD0ZBiMs0')],
		vids: ko.observableArray([]),
		query: ko.observable(''),
		activate: search,
		loadVideo: loadVideo
	};
});