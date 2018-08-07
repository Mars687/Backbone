Talent.BaseEmptyLayout = Marionette.Layout.extend({
	template: _.template('<div id="main-region"></div>'),
	regions:{
		main: '#main-region'
	},
	refresh: function() {
		this.main.show(new this.mainViewClass(this.options));
		this.trigger('refresh');
	},
	onShow: function() {
		this.refresh();
	}
});