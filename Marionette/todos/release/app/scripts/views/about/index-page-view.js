define('templates/about',[],function(){

  this["JST"] = this["JST"] || {};

  this["JST"]["about/index-page"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div class="panel panel-default">\n\t<div class="panel-heading">\n\t\t<h3 class="panel-title">about</h3>\n\t</div>\n\t<div class="panel-body">\n\t\t<p class="lead">\n\t\t\t<strong>View: </strong>\n\t\t\t<small>app/scripts/views/about/index-page-view.js</small>\n\t\t</p>\n\t\t<p class="lead">\n\t\t\t<strong>Template: </strong>\n\t\t\t<small>app/templates/about/index-page.html</small>\n\t\t</p>\n\t</div>\n</div>';}return __p};

  return this["JST"];

});
define('views/about/index-page-view',['talent'
	,'templates/about'
],function(Talent
	,jst
) {
	var MainView = Talent.Layout.extend({
		template: jst['about/index-page']
		,initialize: function() {
		}
		,regions: {
			// main: '.main-region'
		}
		,ui:{
			// item: '.ui-item'
		}
		,events:function(){
			var events = {};
			// events['click ' + this.ui.item] = 'eventHandler';
			return events;
		}
	});

	return Talent.BasePageView.extend({
		mainViewClass : MainView
		,pageTitle: 'About'
	});
});

