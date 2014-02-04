/*global define */

define(function (require) {
	'use strict';
	
	var http = require('plugins/http'),
		ko = require('knockout'),
		url,
		qs;
	
	url = 'http://api.flickr.com/services/feeds/photos_public.gne';
	
	qs = {
		tags: 'mount ranier',
		tagmode: 'any',
		format: 'json'
	};
	
	return {
		images: ko.observableArray([]),
		activate: function () {
			var that = this;
			if (this.images().length > 0) {
				return;
			}
		
			return http.jsonp(url, qs, 'jsoncallback').then(function (response) {
				that.images(response.items);
			});
		}
	};
});