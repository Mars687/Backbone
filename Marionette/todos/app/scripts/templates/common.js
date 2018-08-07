define(function(){

  this["JST"] = this["JST"] || {};

  this["JST"]["common/layouts/empty-layout"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div id="main-region"></div>';}return __p};

  this["JST"]["common/layouts/master-layout"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div id="header-region" class="row"></div>\n\n<div id="content-wrapper" class="row">\n\t<div id="sidebar-region" class="col-md-3"></div>\n\t<div id="main-region" class="col-md-8"></div>\n</div>\n<div id="footer-region" class="row"></div>\n\n';}return __p};

  this["JST"]["common/page-regions/footer"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<hr>\n<center>2000-2013 Forward Talent</center>';}return __p};

  this["JST"]["common/page-regions/header"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<ul class="pull-right list-inline">\n\t<li>me@talent.com</li>\n\t<li>\n\t\t<a href="index.html">\n\t\t\t<span class="txt">Logout</span>\n\t\t</a>\n\t</li>\n</ul>\n<h2>\n\t<a href="/">TalentJS</a>\n</h2>\n\n<nav class="navbar navbar-default" role="navigation">\n\t<div class="collapse navbar-collapse navbar-ex1-collapse">\n\t\t<ul class="nav navbar-nav">\n\t\t\t<li class="home"><a href="#home">Home</a></li>\n\t\t\t<li class="about"><a href="#about">About</a></li>\n\t\t\t<li class="todos"><a href="#todos">Todos</a></li>\n\t\t</ul>\n\t</div>\n</nav>';}return __p};

  this["JST"]["common/page-regions/sidebar"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<li>\n\t<h4>Sidebar Menu Header</h4>\n</li>\n<li class="divider"></li>\n<li>\n\t<a href="/">Lorem ipsum dolor sit amet.</a>\n</li>\n<li>\n\t<a href="/">Lorem ipsum dolor sit amet.</a>\n</li>\n<li>\n\t<a href="/">Lorem ipsum dolor sit amet.</a>\n</li>\n<li>\n\t<a href="/">Lorem ipsum dolor sit amet.</a>\n</li>\n<li>\n\t<a href="/">Lorem ipsum dolor sit amet.</a>\n</li>\n<li>\n\t<a href="/">Lorem ipsum dolor sit amet.</a>\n</li>';}return __p};

  return this["JST"];

});