define(['backbone','model/index'],function(Backbone, TodoModel){
    return TodoCollection = Backbone.Collection.extend ({
        model: TodoModel,

        completed: function(){
            return this.where({completed: true})
        },
    
        remaining: function(){
            return this.where({completed: false})
        }
    });
});