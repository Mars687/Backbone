# Project title

## 本地运行
* 安装[nodejs](http://ux.beisen.co/redmine/attachments/download/2/node-v0.8.18-x64.msi)；
* 安装bower和grunt：`npm -g install bower grunt-cli`；
* 获取项目源码：`git clone <项目地址>`；
* 进入项目源码目录；
* 安装node modules：`npm install`；
* 安装JS库：`bower install`；
* 运行项目：`grunt server`在本地8000端口启动server，并在默认浏览器打开起始页面；


## 编码规范
- 文件命名: 小写，中划线分隔；
- 文件格式：utf-8无BOM；
- 代码缩进：tab, 4个空格的大小；
- 变量：驼峰式写法，如: userName；
- 类名：头字母大写，如：UserModel；
- MVC所涉及的类，需要增加类型后缀，如：DetailView, JobsPageView, UserCollection；
- 文件命名: 小写，中划线分隔，如: user-item-view.js, user-model.js；
- 页面视图类的文件名全部为index-page-view.js；
- 普通视图类的文件名全部为“-view.js”结尾；
- 对于this的别名，请使用：var self = this；


## v0.3版本变化
* 框架与业务代码的分离
    * 减少对业务开发的干扰
    * 便于以后的升级
* 命名空间
    * 框架所提供及依赖的类库均放在Talent下，包括$和_
* 插件管理
    * 使用bower管理第三方库的安装与升级
* 视图新成员
    * Layout
    * CompositeView
    * ItemView
    * CollectionView

## ItemView
用于简单地渲染一个模板

    MyView = Talent.ItemView.extend({
      template: jst['home/index-page']
    });

    myView = new MyView();
    myView.render();

## Layout
具有若干可局部刷新的区域region

    MyLayout = Talent.Layout.extend({
      template: "#my-layout-template",
      regions: {
        menu: "#menu-bar",
        content: "#main-content"
      } 
    });

    var myLayout = new MyLayout();
    myLayout.render();
    
    //myMenu在这里可以是ItemView或CompositeView的实例
    myLayout.menu.show(myMenu);

## CompositeView
包含一个模板和一个可迭代区域，可迭代区域中的每个条目由ItemView来负责渲染

    Talent.CompositeView.extend({
        template : jst['common/todo-composite'],
        itemViewContainer : 'ul',
        itemView: Talent.ItemView.extend({
            template : Talent._.template('<li><%=text%></li>')
        })
    });

## 项目结构与说明

### 文件夹结构
```
app/
    ├── index.html
    ├── images
    ├── styles
    │   └── css
    ├── scripts
    │   ├── main.js
    │   ├── config.js    
    │   ├── collections
    │   ├── helpers
    │   ├── models
    │   ├── network
    │   ├── routers
    │   ├── templates
    │   ├── vendor
    │   └── views
    │       ├── common
    │       └── home
    └── templates
        ├── common
        └── home
```

### index.html
- BSGlobal是全局变量，记录了后端输出给前端的数据；
- index.html中引用了主脚本文件scripts/main.js；

### scripts/main.js
- 通过require，加载框架、项目助手类(helpers)，并初始化网络；
- 调用Talent.app.start，开始监听路由事件；
- 截获所有地址以#开头的链接，由框架的router统一管理；

### scripts/config.js
- 该文件，通过require.config记录了各模块的别名及对应的路径；

### scripts/views/common
- 该目录中存放共用视图类，如header, footer；
- 每个频道都可以创建自己的common目录，用于存放各频道内部共用视图类；

### scripts/views/home/index-page-view.js
- 页面视图类，继承于BasePageView，包含一个MasteLayout的实例；
- 包含一个内部类MainView，负责管理页面主区域部分的显示；

### scripts/views/common/page-regions/header-view.js
- 普通视图类，继承于Talent.CompositeView或自定义的普通视图类；

### templates
- 该目录存放所有的模板文件， 文件以.html结尾；
- 该目录的结构与views一一对应；

### scripts/templates
- 该目录存放编译后的模板文件， 文件以.js结尾；
- 目前，每个一级频道的模板编译成一个文件， 如:home.js；




## 参考资源
1. [Backbone帮助](http://backbonejs.org)
2. [Backbone源码分析](http://www.cnblogs.com/nuysoft/archive/2012/03/19/2404274.html)
3. [Backbone设计模式](http://ricostacruz.com/backbone-patterns/)
4. [Backbone.js Fundamentals](http://addyosmani.github.com/backbone-fundamentals/)

