define(['talent','templates/todos','collections/todocollection', 
'views/todos/page-regions/todoItem-view',
'views/todos/index-page-view'], 
function(Talent, jst, TodoCollection, ItemView, IndexPageView) {
	/**
	* Header view class
	* @author nobody
	* @extends {Talent.CompositeView}
	* @class HeaderView
	*/
	return Talent.CompositeView.extend(
		/** @lends TodoListView.prototype */
	{
    
        template: jst['todos/page-regions/todoList']
        ,itemView: ItemView
        
        ,itemViewContainer: '.todo-item'
        
        ,ui:{
			toggle: '.toggle-all',
		}
		,events: function() {
			var events = {};
            events["click " + this.ui.toggle] = "toggleAllClick";
			return events;
		}
		,initialize: function() { 
           this.listenTo(this.collection, 'reset', this.render)
        }
        
        ,remaining: function() {
            return this.collection.where({completed: false}).length;
        }
		,toggleAllClick: function() {
            this.$('.toggle-all')[0].checked = Boolean(this.remaining());
            var completed = this.$('.toggle-all')[0].checked;
            this.collection.each(function(todo){
                todo.set({
                    'completed': completed
                });
            });
        }
	});
});