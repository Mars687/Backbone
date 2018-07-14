var Workspace = Backbone.Router.extend({
    routes:{
        '*filter': 'setFilter'
    },

    setFilter: function( param ){
        // Trigger a colllection filter event, causing hiding/unhiding
        // of Todo view items
        window.app.Todos.trigger('filter');
    }
});

app.TodoRouter = new Workspace();
Backbone.history.start();