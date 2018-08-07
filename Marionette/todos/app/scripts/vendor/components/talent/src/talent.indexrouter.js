/**
 * Root router
 * @author kongchangzhu
 * @extends {BaseRouter}
 * @class RootRouter
 */
Talent.IndexRouter = Talent.BaseRouter.extend(
	/** @lends RootRouter.prototype */
{
	/**
	 * Initialize child routers
	 * @param  {Object} options
	 */
	initialize: function(options) {
		this.options = options || {};
		/**
		 * if the request matches many routers, the last overrides privous ones
		 */
		this.route(/^(.*)$/, "loadPageView");
	}
});
