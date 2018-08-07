// Regular expression used to split event strings.
var eventSplitter = /\s+/;
var multiEventSplitter = /\.+/;
var array = [];
var slice = array.slice;

// Implement fancy features of the Events API such as multiple event
// names `"change blur"` and jQuery-style event maps `{change: action}`
// in terms of the existing API.
var eventsApi = function(obj, action, name, rest) {
	var flag = true;
	if (!name) return true;

	// Handle event maps.
	if (typeof name === 'object') {
	  for (var key in name) {
	    obj[action].apply(obj, [key, name[key]].concat(rest));
	  }
	  return false;
	}

	// Handle space separated event names.
	if (eventSplitter.test(name)) {
	  var names = name.split(eventSplitter);
	  for (var i = 0, l = names.length; i < l; i++) {
	    obj[action].apply(obj, [names[i]].concat(rest));
	  }
	  return false;
	}

	return true;
};
var mutiEventsApi = function(obj,action, name, rest) {
	if (!name) return true;
	if(multiEventSplitter.test(name)) {
		var names = name.split(multiEventSplitter);
		var prefix = names[0];
		var suffix = _.rest(names).join(".");
		obj[action].apply(obj, [prefix].concat(rest).concat([{_suffix : suffix, _mutiEvents : true}]));
		return false;
	}
	return true;
}

var triggerEvents = function(events, args) {
	var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
	switch (args.length) {
		case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
		case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
		case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
		case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
		default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
	}
};
var talentEvents = {
	on: function(name, callback, context, options) {
		if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
		if (!mutiEventsApi(this, 'on', name, [callback, context])) return this;
		this._events || (this._events = {});
		var events = this._events[name] || (this._events[name] = []);
		events.push({callback: callback, context: context, ctx: context || this, options : options});
		return this;
    },
    off: function(name, callback, context, options) {
		var retain, ev, events, names, i, l, j, k;
		if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
		if (!mutiEventsApi(this, 'off', name, [callback, context])) return this;
		if (!name && !callback && !context) {
			this._events = {};
			return this;
		}
		names = name ? [name] : _.keys(this._events);
		for (i = 0, l = names.length; i < l; i++) {
			name = names[i];
			if (events = this._events[name]) {
				this._events[name] = retain = [];
				if (callback || context || (options && options._mutiEvents)) {
					for (j = 0, k = events.length; j < k; j++) {
						ev = events[j];
						if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
							(context && context !== ev.context)) {
							retain.push(ev);
						}
						if(!ev.options || (options._mutiEvents && options._suffix != ev.options['_suffix'])) {
							retain.push(ev);
						}
					}
				}
				if (!retain.length) delete this._events[name];
			}
		}

		return this;
    },
    trigger: function(name) {
    	var array = [];
		if (!this._events) return this;
		var args = array.slice.call(arguments, 1);
		var last =  _.last(args);
		args = last && last._mutiEvents ? array.slice.call(args, 0, args.length - 1) : args;
		if (!eventsApi(this, 'trigger', name, args)) return this;
		if (!mutiEventsApi(this, 'trigger', name, args)) return this;
		var events = this._events[name];
		if(last && last._mutiEvents) {
			_.each(events, function(item){
				if(item.options && item.options._suffix == last._suffix) {
					array.push(item);
				}
			})
			events = array;
			name = name + '.' + last._suffix;
		}
		var allEvents = this._events.all;
		if (events) triggerEvents(events, args);
		if (allEvents) triggerEvents(allEvents, [name].concat(args));
		return this;
    }
}