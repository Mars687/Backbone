define('templates/home',[],function(){

  this["JST"] = this["JST"] || {};

  this["JST"]["home/index-page"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div class="page-header">\n\t<h1>Get Started</h1>\n</div>\n<center>\n\t<div class="cover"></div><br />\n\t<button class="btn btn-large btn-primary btn-start">Start tutorial</button>\n</center>\n<div class="page-content"></div>';}return __p};

  return this["JST"];

});
define('views/home/index-page-view',['talent'
	,'templates/home'
],function(Talent
	,jst
) {
	/**
	 * Inner main view class
	 * @class HomeView~MainView
	 * @extends {Backbone.View}
	 */	
	var MainView = Talent.Layout.extend(
		/** @lends HomeView~MainView.prototype */
	{
		template: jst['home/index-page']
		,className: 'home-page-container'
		,initialize: function() {
			
		}
		,regions: {
			content: '.page-content'
		}
		,ui:{
			start: '.btn-start'
		}
		,events:function(){
			var events = {};
			events['click ' + this.ui.start] = 'start';
			return events;
		}
		,start: function(e) {
			this.ui.start.html('button clicked!');
		}
		,onRender: function() {
		}
		,onShow: function() {
		}
		,onClose:function(){
		}
	});


	return Talent.BasePageView.extend({
		mainViewClass : MainView
		,pageTitle: 'Home'
	});
});

