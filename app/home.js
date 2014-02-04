/*global define, console, $, document, window, videojs */

console.log(videojs);

define(function (require) {
	'use strict';
	
	var app = require('durandal/app'),
		ko = require('knockout'),
		queryPrefix = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=',
		apiKey = 'AIzaSyBRsops2-sGNOAR2KzHvZwYTgqjPWEbD9k',
		Video,
		vm,
		search,
		loadVideo,
		player = null,
		viewWidth = 1000, //document.getElementById("guts").clientWidth,
		aspectRatio = 16 / 9,
		padding = 0.95,
		width = viewWidth * padding,
		height = width / aspectRatio;
	
	Video = function (videoId) {
		this.videoId = videoId;
	};
	
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
// 		if (!vm.query()) {
// 			vm.query('arctic monkeys');
//		}
		var queryString = queryPrefix + (vm.query()).replace(" ", "+") + '&key=' + apiKey;
		console.log('do the search for: ' + queryString);
		
		$.get(queryString, function (data, status) {
			var i, l, vid, vidObj;
			if (status === 'success') {
				console.log(data);
				vm.vids = []; // always reset the video array
				for (i = 0, l = data.items.length; i < l; i += 1) {
					vid = data.items[i];
					if (vid && vid.id && vid.id.videoId) {
						console.log(vid.id.videoId);
						vidObj = new Video(vid.id.videoId);
						vm.vids.push(vidObj);
					}
				}
				if (vm.vids[0]) {
					vm.loadVideo(vm.vids[0].videoId);
				}
			} else {
				console.log('GET Failed for video list. ' + status);
			}
		});
	};
	
	vm = {
		vids: [],
		query: ko.observable('black sabbath'),
		search: search,
		loadVideo: loadVideo
	};
	
	return vm;
});