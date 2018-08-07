define(['talent','templates/todos', 'model/index', 'collections/todocollection'], 
function(Talent, jst, TodoModel, TodoCollection) {
	/**
	* Footer view class
	* @author nobody
	* @extends {TalentView}
	* @class FooterView
	*/
	return Talent.ItemView.extend(
		/** @lends FooterView.prototype */
	{
        template: jst['todos/page-regions/footer']

        ,ui:{
            clearall: '.clear-completed'
            ,selectall: '.selectall'
            ,selectactive: '.selectactive'
            ,selectcompleted: '.selectcompleted'
		}
		,events: function() {
			var events = {};
            events["click " + this.ui.clearall] = "clearAll";
            events["click " + this.ui.selectall] = "selectAll";
            events["click " + this.ui.selectactive] = "selectActive";
            events["click " + this.ui.selectcompleted] = "selectCompleted";
			return events;
		}
		,initialize: function() {
		}
		,render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
		,clearAll: function() {
            this.trigger('clearAll');
        }
        ,selectAll: function() {
            this.trigger('selectAll');
        }
        ,selectActive: function() {
            this.trigger('selectActive');
        }
        ,selectCompleted: function() {    
            this.trigger('selectCompleted');
        }
	});
});