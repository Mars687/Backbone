define(['talent','templates/todos', 'model/index', 'collections/todocollection'], 
function(Talent, jst, TodoModel, TodoCollection) {
	/**
	* Header view class
	* @author nobody
	* @extends {TalentView}
	* @class HeaderView
	*/
	return Talent.ItemView.extend(
		/** @lends HeaderView.prototype */
	{
        template: jst['todos/page-regions/header']

        ,ui:{
			input: '.new-todo'
		}
		,events: function() {
			var events = {};
			events["keypress " + this.ui.input] = "createOnEnter";
			return events;
		}
		,initialize: function() {
		}
		,render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
		,createOnEnter: function(e) {
            var todoText = this.ui.input.val().trim();
            if (e.which === 13 && todoText) {
                // this.collection.add(this.model.set({
                //     title: todoText
                // }));
                this.trigger('inputChange', todoText)
                this.ui.input.val('');
            }
        }
	});
});