// Define a Todo model
/*
var Todo = Backbone.Model.extend({
    initialize: function(){
        console.log('This model has been initialized.');
    }
});

var myTodo = new Todo();
*/

var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: true
    }
    // validate: function(attribs) {
    //     if(attribs.title === undefined){
    //         return "Remember to set a title for your todo.";
    //     }
    // },

    // initialize: function() {
    //     console.log('This model has been initialized.');
    //     this.on("invalid", function(model, error){
    //         console.log(error);
    //     });
    // }
    //  setTitle: function(newTitle){
    //      this.set({ title: newTitle });
    //  }
});
// var TodosCollection = Backbone.Collection.extend({
//     model: Todo
// });

// var myTodo = new Todo({title:'Read the whole book', id:2});
var TodosCollection = new Backbone.Collection();

TodosCollection.on("add", function(todo){
    console.log("I should " + todo.get("title") + ". Have I done it before? "
+ (todo.get("completed") ? 'Yeah!' : 'No.'));
});

TodosCollection.add([
    { title: 'Go to Jamaica'},
    { title: 'Go to China'},
    { title: 'Go to Disneyland', completed: true}
]);

var TodoRouter = Backbone.Router.extend({
    routers: {
        "about": "showAbout",
        "search/:query": "searchTodos",
        "search/:query/p:page": "searchTodos"
    },

    showAbout: function(){},

    searchTodos: function(query, page){
        var page_number = page || 1;
        console.log("Page number: " + page_number + " of the results for todos containing the word: " + query);
    }
});

var myTodoRouter = new TodoRouter();

Backbone.history.start();


// var todos = new TodosCollection([a,b,c]);
// console.log("Collection size: " + todos.length); 
// todos.remove([b,c]);
// console.log("Collection size: " + todos.length); 
// todos.add(myTodo);
// console.log("Collection size: " + todos.length); 

// var items = new Backbone.Collection;
// items.add([{ id: 1, name: "Dog", age: 3}, { id: 2, name: "cat", age: 2}]);
// items.add([{ id: 1, name: "Bear" }], { merge: false });
// items.add([{ id: 2, name: "lion" }], { merge: true });

// console.log(JSON.stringify(items.toJSON()));
// var myTodo = new Todo();
// console.log('Todo title: ' + myTodo.get('title'));
// console.log('Completed: ' + myTodo.get('completed'));
// myTodo.set('completed', true, {validate: true});
// myTodo.setTitle('Go fishing on Sunday.');
// console.log('Todo title: ' + myTodo.get('title'));
// console.log('Completed: ' + myTodo.get('completed'));
/*
var todo1 = new Todo();
var todo1Attributes = todo1.toJSON();
console.log(todo1Attributes);

// console.log(todo1.get('title'));
// console.log(todo1.get('completed'));

var todo2 = new Todo({
    title: 'Check attributes property of the logged models in the console.',
    completed: true
});
console.log(todo2.toJSON());
// console.log(JSON.stringify(todo2));

var todo3 = new Todo({
    title: 'This todo is done, so take no action on this one.',
    completed: true
});

console.log(JSON.stringify(todo3));


var TodoView = Backbone.View.extend({
    tagName: 'ul',
    className: 'container',
    id: 'todos',

    todoTpl: _.template( "An example template" ),

    events: {
        'dblclick label': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close'
    },

    // initialize: function() {
    //     this.$el = $('#todo');
    //     console.log('This model has been initialized.');
    // },

    render: function() {
        this.$el.html( this.todoTpl( this.model.toJSON() ) );
        this.input = this.$('.edit');
        return this;
    },

    edit: function() {

    },

    close: function() {

    },

    updateOnEnter: function(e) {

    }
});

// create a view for a todo
todoView = new TodoView();
console.log(todoView.el);

var button1 = $('<button></button>');
var button2 = $('<button></button>');

var View = Backbone.View.extend({
    events: {
        click: function(e) {
            console.log(view.el === e.target);
        }
    }
});

// var view = new View({el: button1});

// view.setElement(button2);

// button1.trigger('click');
// button2.trigger('click');

var view = new Backbone.View;
view.setElement('<p><a><b>test</b></a></p>');
view.$('a b').html();

var ListView = Backbone.View.extend({
    render: function(){
        var items = this.model.get('items');
        _.each(items, function(item){
            var itemView = new itemView({ model: item });
            this.$el.append( itemView.render().el );
        },this);
    }
});
*/