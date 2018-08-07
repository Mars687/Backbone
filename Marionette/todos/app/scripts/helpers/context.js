/**
 * Context Object, pass global variable to all classes
 */
define(['talent'], function(Talent) {

	var localContext = {
		/**
		 * 获取租户信息
		 * @return
		 * {"Id":200605,"Name":"wg","Domain":"abc.com","Abbreviation":"wg"}
		 */
		getTenantInfo: function() {
			return BSGlobal.tenantInfo;
		},
		/**
		 * 获取当前登录用户信息
		 * @return
		 * {"Email":"wg1@abc.com","Avatar":"http://st.tita.com/titacn/tita/common/images/default_man_small.jpg","Id":100217545,"Name":"wg","IsRoot":false,"Role":3}
		 */
		getUserInfo: function() {
			return BSGlobal.loginUserInfo;
		},
		/**
		 * 获取图片的完整路径
		 * @return
		 * http://static.beisen.co/recruit/release/app/images/bg.png
		 */
		getStaticUrl: function(url) {
			var staticServer = BSGlobal.staticPath;
			return staticServer + "/" + url;
		},
		getLoading: function(){
			var url = this.getStaticUrl('images/load_m.gif');
			var html = [
			'<div class="_tt_loading_m">',
			'  加载中...',
			'</div>'].join("");
			return html;
		}
	};

	Talent.Context = Talent._.extend({}, localContext);

	return Talent.Context;
});