/**
 * bugfix: IE7- cross domain;
 * support forceTrigge;
 * encode fragment after location hash ;
 */
Backbone.History.prototype.navigate = function(fragment, options) {
	if(this.iframe && !this.setIframe) {
		this.iframe = window;
		this.setIframe = true;
	}
	if (!Backbone.History.started) return false;
	if (!options || options === true) options = {trigger: options};
	fragment = encodeURIComponent(this.getFragment(fragment || '')); 
	if ((this.fragment === fragment) && !options.forceTrigger) return;
	this.fragment = fragment;
	var url = this.root + fragment;

	// If pushState is available, we use it to set the fragment as a real URL.
	if (this._hasPushState) {
		this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

		// If hash changes haven't been explicitly disabled, update the hash
		// fragment to store history.
		} else if (this._wantsHashChange) { 
			this._updateHash(this.location, fragment, options.replace);
			if (this.iframe && (fragment !== encodeURIComponent(this.getFragment(this.getHash(this.iframe))))) {
			// Opening and closing the iframe tricks IE7 and earlier to push a
			// history entry on hash-tag change.  When replace is true, we don't
			// want this.
			if(!options.replace) this.iframe.document.open().close();
			this._updateHash(this.iframe.location, fragment, options.replace);
		}

	// If you've told us that you explicitly don't want fallback hashchange-
	// based history, then `navigate` becomes a page refresh.
	} else {
		return this.location.assign(url);
	}
	if (options.trigger) this.loadUrl(fragment);
};