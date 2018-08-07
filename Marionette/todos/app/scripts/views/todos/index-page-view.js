define(['talent'
    ,'templates/todos'
    ,'views/todos/page-regions/header-view'
    ,'views/todos/page-regions/todoList-view'
    ,'views/todos/page-regions/footer-view'
],function(Talent
	 ,jst, HeaderView, TodoListView, FooterView
) {
	/**
	 * Inner main view class
	 * @class HomeView~MainView
	 * @extends {Backbone.View}
	 */	
	var MainView = Talent.Layout.extend(
		/** @lends HomeView~MainView.prototype */
	{
        template: jst['todos/index-page']
   
		,initialize: function() {

            this.headerView = new HeaderView({
                collection: new Talent.Collection
            });

            this.listView = new TodoListView({
                collection: new Talent.Collection
            });

            this.footerView = new FooterView({
                collection: new Talent.Collection
            });

            this.listenTo(this.headerView, 'inputChange', function(data) {
                this.listView.collection.add({
                    title: data,
                    completed: false,
                    created: Date.now()
                });
            });

            this.listenTo(this.footerView, 'clearAll', this.clearAll);
            this.listenTo(this.footerView, 'selectAll', this.selectAll);
            this.listenTo(this.footerView, 'selectActive', this.selectActive);
            this.listenTo(this.footerView, 'selectCompleted', this.selectCompleted);
            this.listenTo(this.listView.collection, 'add remove change', function(){
                // 持久化，将listView.collection 储存到localStorage
                localStorage.setItem('todolist', JSON.stringify(this.listView.collection.toJSON()));
            });
		}
		,regions: {
            header: '.header',
			todolist: '.todo-list',
			todoitem: '.todo-item',
            footer: '.footer'
		}
		,ui:{
			
		}
		,events:function(){
			var events = {};
			return events;
		}
		
		,onShow: function() {    
            this.header.show(this.headerView);
            this.todolist.show(this.listView);
            this.footer.show(this.footerView);
		}
		,onClose:function(){

        }
        ,completed: function() {
            return this.listView.collection.where({completed: true});
        }
        ,remaining: function() {     
            return this.listView.collection.where({completed: false});
        }
        ,clearAll: function(){
            this.completed().map(function(todo){
                todo.destroy();
            })
        }
        ,selectAll: function() {
            this.listView.collection.reset(JSON.parse(localStorage.getItem('todolist')));
        }
        ,selectActive: function() { 
            this.listView.collection.reset(JSON.parse(localStorage.getItem('todolist')));
            this.listView.collection.reset(this.remaining());
        }
        ,selectCompleted: function() {
            this.listView.collection.reset(JSON.parse(localStorage.getItem('todolist')));
            this.listView.collection.reset(this.completed());
        }
    });
    
	return Talent.BasePageView.extend({
		mainViewClass : MainView
		,pageTitle: 'Todos'
	});
});
