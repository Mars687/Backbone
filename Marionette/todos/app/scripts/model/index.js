define(['backbone'],function(Backbone){
        return TodoModel = Backbone.Model.extend({
        defaults: {
            title: '',
            completed: false,
            created: 0
        },
    
        initialize: function() {
            if (this.isNew()) {
                this.set('created', Date.now());
            }
        },
    
        // Toggle the 'completed' state of this todo item.
        toggle: function() {
            this.save({
                completed: !this.get('completed')
            });
        }
    });
});