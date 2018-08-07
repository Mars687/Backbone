Talent.BaseMasterLayout = Marionette.Layout.extend({
	template: _.template([
			'<div id="header-region"></div>',
			'<div class="row">',
			'	<div id="sidebar-region"></div>',
			'	<div id="main-region"></div>',
			'</div>',
			'<div id="footer-region"></div>'
		].join('')),
	regions:{
		header: '#header-region',
		footer: '#footer-region',	
		sidebar: '#sidebar-region',
		main: '#main-region'
	},
	refresh: function() {
		var mainView = new this.mainViewClass(this.options);
		this.main.show(mainView);
		if(this.hideSidebar){
			this.SidebarViewClass = null;
			this.sidebar.close();
		}else{
			// IndexPageView can pass new SidebarViewClass to Layout
			var SidebarViewClass = this.sidebarViewClass ?  this.sidebarViewClass : this.regionsClass.sidebar;
			if((this.SidebarViewClass !== SidebarViewClass) || this.refreshSidebar) {
				this.SidebarViewClass = SidebarViewClass;
				this.sidebarView = new this.SidebarViewClass;
				this.sidebar.show(this.sidebarView );
			}
		}
		this.trigger('refresh');
	},
	onShow: function(){
		this.header.show(new this.regionsClass.header);
		this.footer.show(new this.regionsClass.footer);

		this.refresh();
	},
	onClose : function() {
		this.sidebarViewClass = null;
		this.SidebarViewClass = null;
	}
});