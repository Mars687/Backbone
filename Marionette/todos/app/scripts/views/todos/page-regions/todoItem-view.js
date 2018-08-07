define(['talent','templates/todos','model/index', 
'collections/todocollection' ,
'views/todos/page-regions/todoList-view'], 
function(Talent, jst, TodoModel, TodoCollection, TodoListView) {
	/**
	* Header view class
	* @author nobody
	* @extends {Talent.ItemView}
	* @class TodoItemView
	*/
	return ItemView = Talent.ItemView.extend(
		/** @lends TodoItemView.prototype */
	{
        tagName: 'li'

        ,template: jst['todos/page-regions/todoItem']
        
        ,ui:{
			toggle: '.toggle',
            label: 'label',
            destroy: '.destroy',
            edit: '.edit'
        }
        
		,events: function() {
			var events = {};
            events["click " + this.ui.toggle]="toggleCompleted";
            events["dblclick " + this.ui.label]="edit";
            events["keypress " + this.ui.edit]="updateOnEnter";
            events["keydown " + this.ui.edit]="revertOnEscape";
            events["blur " + this.ui.edit]="editclose";
            events["click " + this.ui.destroy]="clear";
			return events;
		}
		,initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        }
		,toggleCompleted: function() {
            this.model.set({
                completed: !this.model.get('completed')
            })
        }
        
        ,edit: function() {
            this.$el.addClass('editing');
            this.$('.edit').focus();
        }

        ,updateOnEnter: function(e) {
            var todoText = this.$('.edit').val().trim();
            if (e.which === 13 && todoText) {
                this.model.set('title', todoText);
                this.$el.removeClass('editing');
            }
        }   
        ,revertOnEscape: function(e) {
            if (e.which === 27) {
                this.$('.edit').val(this.model.get('title'));
                this.$el.removeClass('editing');
            }
        }
        // 不要命名为close，以造成和 Marionette内置的close（）方法名冲突，
        // 在reset 集合时，调用自定义close 方法，将model渲染2遍。
        ,editclose: function() {
            var value = this.$('.edit').val().trim();

            if (value) {
                this.model.set('title', value);
                this.$el.removeClass('editing');
            }
        }
        ,clear: function() {
            this.model.destroy();
        }
    });
});