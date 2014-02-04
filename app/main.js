/*global requirejs, define */

requirejs.config({
	paths: {
		'text': '../lib/require/text',
		'durandal': '../lib/durandal/js',
		'plugins' : '../lib/durandal/js/plugins',
		'transitions' : '../lib/durandal/js/transitions',
		'knockout': '../lib/knockout/knockout-2.3.0',
		'jquery': '../lib/jquery/jquery-1.9.1'
	}
});

define(function (require) {
	'use strict';


	var system = require('durandal/system'),
		app = require('durandal/app');

	system.debug(true);

	app.title = 'Huzco Video Search';

	app.configurePlugins({
		router: true,
		dialog: true
	});

	app.start().then(function () {
		app.setRoot('shell');
	});
});