/*global define, console, $, document, window, videojs, http */

console.log(videojs);

define(function (require) {
	'use strict';
	
	var app = require('durandal/app'),
		ko = require('knockout'),
		http = require('plugins/http'),
		queryPrefix = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=',
		apiKey = 'AIzaSyBRsops2-sGNOAR2KzHvZwYTgqjPWEbD9k',
		loadVideo,
		loadVideoById,
		search,
		player = null,
		viewWidth = $("#applicationHost").width(),
		aspectRatio = 16 / 9,
		padding = 0.95,
		width = viewWidth * padding,
		height = width / aspectRatio;
	
	loadVideo = function (data, event) {
		loadVideoById(event.currentTarget.id);
	};
	
	loadVideoById = function (videoId) {
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
		var queryString, that = this;
			
		// don't search the first time you load the page.
		if (that.query() === '') {
			return;
		}
		
		queryString = queryPrefix + (that.query()).replace(" ", "+") + '&key=' + apiKey;
		console.log('do the search for: ' + queryString);
		
		return http.get(queryString).then(function (response) {
			var i, l, vid, vidObj;
			console.log('we got something in the promise.');
			console.log(response);
			that.vids([]);
			for (i = 0, l = response.items.length; i < l; i += 1) {
				vid = response.items[i];
				if (vid && vid.id && vid.id.videoId) {
					console.log(vid.id.videoId);
					that.vids.push(vid);
				}
			}
			if (that.vids()[0]) {
				loadVideoById(that.vids()[0].id.videoId);
			}
			console.log('Number of vids: ' +  that.vids.length);
		});
	};
	
	return {
		vids: ko.observableArray([]),
		query: ko.observable(''),
		activate: search,
		loadVideo: loadVideo
	};
});