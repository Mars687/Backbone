var Talent = (function(global, Backbone, _){
	"use strict";
	//version 0.3.2-8
	var Marionette = Backbone.Marionette;

	// Define and export the Talent namespace
	var Talent = {};

	// Get the DOM manipulator for later use
	Talent.$ = Backbone.$;
	Talent._ = _;

	// @include talent.backbone.js
	// @include talent.marionette.js
	// @include talent.baserouter.js
	// @include talent.indexrouter.js
	// @include talent.basemasterlayout.js
	// @include talent.baseemptylayout.js
	// @include talent.basepageview.js
	// 
	// @include talent.app.js

	Talent.Layout = Marionette.Layout.extend({
		constructor : function() {
			this.model || (this.model = new Backbone.Model);
			Marionette.Layout.prototype.constructor.apply(this,arguments);
		}
	});
	Talent.CompositeView = Marionette.CompositeView.extend({
		constructor : function() {
			this.collection || (this.collection = new Backbone.Collection);
			this.model || (this.model = new Backbone.Model);
			Marionette.CompositeView.prototype.constructor.apply(this,arguments);
		}
	});
	Talent.CollectionView = Marionette.CollectionView.extend({
		constructor : function() {
			this.collection || (this.collection = new Backbone.Collection);
			Marionette.CollectionView.prototype.constructor.apply(this,arguments);
		}
	});
	Talent.ItemView = Marionette.ItemView.extend({
		constructor : function() {
			this.model || (this.model = new Backbone.Model);			
			Marionette.ItemView.prototype.constructor.apply(this,arguments);
		}
	});
	
	Talent.Model = Backbone.Model;
	Talent.Collection = Backbone.Collection;
	Talent.View = Marionette.View;

	Talent.Router = Backbone.Router;
	Talent.Region = Marionette.Region;
	

  return Talent;
})(this, Backbone, _);