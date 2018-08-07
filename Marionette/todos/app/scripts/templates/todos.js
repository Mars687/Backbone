define(function(){

  this["JST"] = this["JST"] || {};

  this["JST"]["todos/index-page"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<section class="todoapp">\n    <header class="header"></header>\n    <main class="main">\n        <div class="todo-list"></div>   \n    </main>\n    <footer class="footer"></footer>\n</section>';}return __p};

  this["JST"]["todos/page-regions/footer"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div>\n\n    <ul class="filters">\n        <li>\n            <button class="selectall">All</button>\n        </li>\n        <li>\n            <button class="selectactive">Active</button>\n        </li>\n        <li>\n            <button class="selectcompleted">Completed</button>\n        </li>\n    </ul>\n<button class="clear-completed">Clear completed</button>\n</div>';}return __p};

  this["JST"]["todos/page-regions/header"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<h1>todos</h1>\n<input class="new-todo" placeholder="What needs to be done?" autofocus>';}return __p};

  this["JST"]["todos/page-regions/todoItem"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '<div class="view">\n    <input class="toggle" type="checkbox" '; if (completed) { ;__p += ' checked '; } ;__p += '>\n    <label>' +__e( title ) +'</label>\n    <button class="destroy"></button>\n</div>\n<input class="edit" value="' +__e( title ) +'">';}return __p};

  this["JST"]["todos/page-regions/todoList"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div>\n    <input id="toggle-all" class="toggle-all" type="checkbox">\n    <label for="toggle-all">Mark all as complete</label>\n    <ul class="todo-item"></ul>\n</div>';}return __p};

  return this["JST"];

});