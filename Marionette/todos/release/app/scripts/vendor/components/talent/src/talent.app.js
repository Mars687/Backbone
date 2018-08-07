Talent.app =  new Backbone.Marionette.Application();
//@include talent.events.js
Talent.app.vent = Talent._.extend(Talent.app.vent, talentEvents);

Talent.app.reqres.request = function() {

	if(arguments[0] === undefined) {
		throw new Error("No request name!")
	}

	var config = this._wreqrHandlers[arguments[0]];
	var name = arguments[0].indexOf(":") !== -1 ? arguments[0].split(":") : arguments[0];
	var args = Array.prototype.slice.call(arguments, 1);
	if(args && args.length == 0) {
		Array.prototype.push.call(args, {});
	}
	if( name[1] ) {
		Array.prototype.push.call(args, name[1]);
	}

	if(config === undefined) { 
		config = this._wreqrHandlers[name[0] || name];
		if (config === undefined) {
			config = this._wreqrHandlers["*"];
		}
	}		
	return config.callback.apply(config.context, args);
};



Talent.app.commands.setHandler('history:navigate', function( href, triggerFlag ){
	Backbone.history.navigate(href, triggerFlag);
});

Talent.app.commands.setHandler('document:changePageTitle', function(title){
	document.title = title || document.title;
})

Talent.app.on("initialize:before", function(options){
	var indexRouter = new Talent.IndexRouter(options);

	indexRouter.on('route', function(router, route, params){
		Talent.app.vent.trigger('route', indexRouter.getFragments(), params);
	});

	Talent.app.reqres.setHandler('history:getQueryObject', function( options ){
		if(options && options.sync) {
			return indexRouter.getQueryObject();
		}
		var def = new $.Deferred;
		def.resolve(indexRouter.getQueryObject());
		return def;
	});

	Talent.app.reqres.setHandler('history:getFragments', function( options ){
		if(options && options.sync) {
			return indexRouter.getFragments();
		}
		var def = new $.Deferred;
		def.resolve(indexRouter.getFragments());
		return def;
	});

	Talent.app.reqres.setHandler('*', function( options, operation ){
		alert('Default Collection is unavailable now!');		
		// var collection = new AllCollection();			
		// return collection[operation]( options );
	});

	Talent.app.addRegions({
		container: options.container
	});
});

Talent.app.on("initialize:after", function(options){
	if (Backbone.history){
		Backbone.history.start(options);
		delegateLinkClick();
	}

	/**
	 * All navigation that is relative should be passed through the navigate
	 * method, to be processed by the router. If the link has a `data-bypass`
	 * attribute, bypass the delegation completely.
	 * @name module:main~delegateLinkClick
	 */
	function delegateLinkClick(){
		// prevent clicking in very short time repeatedly
		var delayClick = _.debounce(function(href, options){
			/**
			 * `Backbone.history.navigate` is sufficient for all Routers and will
			 * trigger the correct events. The Router's internal `navigate` method
			 * calls this anyways.  The fragment is sliced from the root.
			 */
			Backbone.history.navigate(href, options);
		}, 300, true);
		$(document).on('click', 'a:not([data-bypass])', function(e){
				/**
			 * Get the absolute anchor href.
			 */
			var href = $(e.currentTarget).attr('href');
			/**
			 * If the href exists and is a hash route, run it through Backbone.
			 */
			if (href && href.indexOf('#') === 0) {
				/**
				 * Stop the default event to ensure the link will not cause a page refresh.
				 */
				e.preventDefault();
				var isForceChange = true;
				var triggerFlag = true;
				if($(e.currentTarget).attr('data-trigger') === "false"){
					triggerFlag = false;
				}
				delayClick(href, {
					trigger: triggerFlag,
					forceTrigger:true
				});
			}
		});
	}
});