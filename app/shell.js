/*global define */

define(function (require) {
	'use strict';
	
	var router = require('plugins/router');
	
	return {
		router: router,
		activate: function () {
			router.map([
				{ route: '', title: 'Home', moduleId: 'home', nav: true }
			//	{ route: 'contact', title: 'Contact', moduleId: 'contact', nav: true }
			]).buildNavigationModel();
		
			return router.activate();
		}
	};
});