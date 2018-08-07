// bugfix: find missing events by re-delegating
Marionette.Region.prototype.show = function(view, options){
	this.ensureEl();
	options = options || {};
	if (view !== this.currentView) {
		if(this.currentView) {
			var lastViewEl = $(this.currentView.el).clone();
		}
		this.close();
		
		if(view.isClosed){
			view._initialEvents && view._initialEvents();
		}
		view.render();
		view.undelegateEvents();
		this.open(view, options);
		view.unbindUIElements && view.unbindUIElements();
		view.delegateEvents();
		view.bindUIElements && view.bindUIElements();			
	} else {
		view.render();
	}
	Marionette.triggerMethod.call(view, "show");
	Marionette.triggerMethod.call(this, "show", view);

	this.currentView = view;
	if(options.noAnimate) {
		return ;
	}
};