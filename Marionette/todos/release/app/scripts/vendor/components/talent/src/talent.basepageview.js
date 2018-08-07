Talent.BasePageView = Marionette.Layout.extend({
	layout: 'master-layout'
	,onLayoutRender: function() {
		
	}
	,getLayoutView: function(callback) {
		if(this.layoutView){
			callback(this.layoutView);
			return;			
		}

		var self = this;
		var layoutPath = 'views/common/layouts/' + this.layout;
		
		require([layoutPath], function(layoutView) {
			document.title = self.pageTitle || document.title;
			self.layoutView = layoutView;
			self.layoutView.options = _.extend({
				queryObject:self.options.queryObject
				,fragments:self.options.fragments
			}, self.layoutViewOptions);
			self.listenTo(self.layoutView, 'refresh', self.onLayoutRender, self);

			layoutView.mainViewClass = self.mainViewClass;
			layoutView.hideSidebar = self.hideSidebar;
			layoutView.refreshSidebar = self.refreshSidebar;
			layoutView.sidebarViewClass = self.sidebarViewClass;

			callback(layoutView);
		})
	}
});