# TalentJS Framework
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


----------
## 主要视图类的详细说明


## ItemView

### 简述

用于简单地渲染一个模板。
其render方法会将模板与数据绑定，并将结果渲染至$el中。

### 使用示例

```
MyView=Talent.ItemView.extend({
    template: jst['home/index-page']
});
```

### 属性

#### ui

一组hash表，获取view对应模板内的dom元素。
如下例所示，render前，this.ui.checkbox为字符串；render后，为jquery对象。

```
ui:{
    checkbox:"input[type=checkbox]"
},
,events:function(){
    var events = {};
    events['click ' + this.ui.checkbox] = 'clickHandler';
    return events;
}
onRender: function() {
    if (this.model.get('selected')) {
        this.ui.checkbox.addClass('checked');
    }
}
```

#### modelEvents

对model中发生的事件绑定相应的事件监听函数。

```
modelEvents: {
    "change":"modelChanged"
}
```

#### collectionEvents

对collection中发生的事件绑定相应的事件监听函数。

```
collectionEvents: {
    "add":"modelAdded"
}
```

### 方法

#### serializeData

该方法用于处理向模板中传入的数据，它的返回值必须为json对象。
ItemView传入的model或collection数据不适合直接渲染时，可用该方法。

```
serializeData: function(){
    return {
        "some attribute": "some value"
    }
}
```

### 方法回调

#### onRender

该方法在render后执行。你可以向其中加入你希望在view render之后执行的代码。

## CompositeView

### 简述

包含一个模板和一个可迭代区域。可迭代区域中的每个条目由ItemView负责渲染。

### 使用示例

```
var MyItemView = Talent.ItemView.extend({
    template : Talent._.template('<li><%=text%></li>')
});
Talent.CompositeView.extend({
    template : '<h1>Hello</h1><ul></ul>',
    itemViewContainer : 'ul',
    itemView: MyItemView
});
```

### 属性

#### itemView

用于指定渲染每个迭代条目的视图类，其必须是ItemView的子类；必选参数；

#### itemViewContainer

用于指定迭代区域。该方法指定一个DOM节点，用来包含所有迭代条目。必选参数。

#### itemViewOptions

从compositeView中传入到itemView中的参数。

```
var MyItemView = Talent.ItemView.extend({
    initialize: function(options){
        console.log(options.foo); // => "bar"
    }
});

Talent.CompositeView.extend({
    template : jst['common/todo-composite'],
    itemViewContainer : 'ul',
    itemView: MyItemView,
    itemViewOptions : {
        foo : "bar"
    }
});
```

当itemViewOptions中的值需要在运行时通过计算得出时，它也可以被定义为一个函数，必须返回一个对象。

```
Talent.CompositeView.extend({
    itemViewOptions: functioin(model, index){
        // 计算部分
        return {
            foo: "bar",
            itemIndex: index
        }
    }
});
```

#### emptyView

collection为空时在compositeView内渲染的视图类。

#### children

获取compositeView中所有的itemView


### 方法

#### buildItemView

自定义itemView的实例化过程。

```
buildItemView: function(item, ItemViewType, itemViewOptions){
    // 为ItemView构建最终的参数列表
    var options = _.extend({model: item}, itemViewOptions);
    // 实例化
    var view = new ItemViewType(options);
    return view;
}
```

#### appendHtml

自定义itemView实例插入到dom结点的过程。
默认情况下，compositeView把每个itemView添加到缓存元素中，在最后通过jQuery的.append方法把所有itemView添加到compositeView的el中。

```
Talent.CompositeView.extend({
        //第一个参数是compositeView实例，
        //第二个参数是当前itemView实例，
        //第三个参数itemView对应的model在collection中的序号。
    appendHtml: function(compositeView, itemView, index){
        if (compositeView.isBuffering) {
            //在事件重置和初始化渲染时缓存，减少向document插入元素的次数
            compositeView.elBuffer.appendChild(itemView.el);
        }
        else {
                        //如果compositeView已经被渲染，
                        //直接把新的itemView添加到compositeView中
            cmopositeView.$el.append(itemView.el);
        }
    }
});
```

#### close

close方法执行以下操作 ：

 - 解除所有listenTo事件
 - 解除所有自定义view事件
 - 解除所有DOM事件
 - 解除所有已渲染的item views
 - 从DOM中移除this.el节点
 - 如果设置了onClose事件回调函数，调用onClose函数


### 事件回调

#### onRender

view渲染完成后，对view对应的dom结构进行其它操作。

#### onClose

在view close后执行。

#### onBeforeItemAdded

item实例即将被添加到compositeView之前执行。

```
onBeforeItemAdded: function(itemView){
    //操作代码
}
```

#### onAfterItemAdded

item实例被添加到compositeView之后执行。

```
onAfterItemAdded: function(itemView){
    //操作代码
}
```

#### onItemRemoved

当item实例从compositeView中移除时执行。

```
onItemRemoved: function(itemView){
    // 操作代码
}
```

### 事件

以下事件函数在相应事件发生时被调用。

#### render
#### closed
#### before:item:added
#### after:item:added
#### item:removed

```
MyView = Talent.CompositeView.extend({...});

var myView = new MyView();

myView.on("render", function(){
    alert("the collection view was rendered!");
});

myView.on("colsed", function(){
    alert("the collection view was closed!");
});
```

```
var MyCV = Talent.CollectionView.extend({
    // ...

    onBeforeItemAdded: function(){
        // ...
    },

    onAfterItemAdded: function(){
        // ...
    }
});

var cv = new MyCV({...});

cv.on("before:item:added", function(viewInstance){
    // ...
});

cv.on("after:item:added", function(viewInstance){
    // ...
});

cv.on("item:removed", function(viewInstance){
    // ...
});
```

## Layout
### 简述

具有若干可局部刷新的区域(region)

### 使用示例

```
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
```

### 属性

#### regions

定义Layout中的Region。通过函数定义，该函数返回一个定义Region的对象。

```
regions: function(options){
    return {
        fooRegion: "#foo-element"
    };
}
```

### 方法

#### show

渲染view并将它添加到el元素中。

#### addRegion 

向Layout中添加Region，一次只能添加一个。

```
var layout = new MyLayout();

// ...

layout.addRegion("foo", "#foo");
```

#### addRegions 

向Layout中添加Region，一次可以添加多个。

```
var layout = new MyLayout();

// ...

layout.addRegions({
    foo: "#foo",
    bar: "#bar"
});
```

#### removeRegion

移除Layout中的Region。

```
var layout = new MyLayout();

// ...

layout.removeRegion("foo");
```

### 自定义Region Type

用于将默认的Region类替换为你自定义的Region类。

```
MyLayout = Talent.Layout.extend({
    regionType: SomeCustomRegion
});
```

也可以分别向每个region设置不同的Region类。

```
AppLayout = Talent.Layout.extend({
    template: "#layout-template",

    regionType: SomeDefaultCustomRegion,

    regions: {
        menu: {
            selector: "#menu",
            regionType: CustomRegionTypeReference
        },
        content: {
            selector: "#content",
            regionType: CustomRegionType2Reference
        }
    }
});
```

## Region

### 简述

需要经常变动内部视图的区域。其最重要的特性为在改变内部视图后旧视图会从DOM中移除。

### 使用示例

```
AppLayout = Talent.Layout.extend({
    template: "#layout-template",

    regions: {
        menu: "#menu",
        content: "#content"
    }
});
var layout = new AppLayout();
layout.render();
layout.menu.show(new MenuView());
layout.content.show(new MainContentView());
```

### 属性

#### currentView

设置绑定到Region中的view。该view不会渲染或显示。

```
var myView = new MyView({
    el: $("#existing-view-stuff")
});

var region = new Talent.Region({
    el: "#content",
    currentView: myView
});
```

### 方法

#### show

渲染并将view添加到DOM树中。每次调用show方法时会自动调用close关闭旧view。可以通过{preventClose: true}参数阻止close行为。

```
// 显示myView
var myView = new MyView();
MyApp.mainRegion.show(myView);

// anotherView替换掉myView。自动调用close方法
var anotherView = new AnotherView();
MyApp.mainRegion.show(anotherView);

// anotherView2替换anotherView。阻止调用close方法
var anotherView2 = new AnotherView();
MyApp.mainRegion.show(anotherView2, { preventClose: true });
```

#### reset

自动关闭所有显示的view并删除缓存的el元素。region下一次显示view时，el重新从DOM中获取。

#### open

改变视图添加到region中的过程。
默认的open方法为：

```
Talent.Region.prototype.open = function(view){
    this.$el.empty().append(view.el);
}
```

重写open方法添加其它效果

```
Talent.Region.prototype.open = function(view){
    this.$el.hide();
    this.$el.html(view.el);
    this.$el.slideDown("fast");
}
```

#### attachView

向Region中添加view，添加的view不会渲染或显示。

```
MyApp.addRegions({
    someRegion: "#content"
});

var myView = new MyView({
    el: $("#existing-view-stuff")
});

MyApp.someRegion.attachView(myView);
```

### 事件
#### beforeShow

当view已经渲染完成，但是尚未添加到DOM中时调用。

#### show

view渲染完成并添加到DOM中后调用。

#### close

当view被关闭之后调用。

```
MyApp.mainRegion.on("before:show", function(view){
  // manipulate the `view` or do something extra
  // with the region via `this`
});

MyApp.mainRegion.on("show", function(view){
    // manipulate the `view` or do something extra
    // with the region via `this`
});

MyApp.mainRegion.on("close", function(view){
    // manipulate the `view` or do something extra
    // with the region via `this`
});

MyRegion = Backbone.Marionette.Region.extend({
    // ...

    onBeforeShow: function(view) {
        // the `view` has not been shown yet
    },

    onShow: function(view){
        // the `view` has been shown
    }
});

MyView = Talent.ItemView.extend({
    onBeforeShow: function() {
        // called before the view has been shown
    },
    onShow: function(){
        // called when the view has been shown
    }
});
```

#### 实例化自定义Region

当我们想在应用运行之后向其中添加region时，就要按照上文中的方法扩展Region类，并在应用中实例化，如下所示：

```
var SomeRegion = Talent.Region.extend({
    el: "#some-div",

    initialize: function(options){
      // your init code, here
    }
});

MyApp.someRegion = new SomeRegion();

MyApp.someRegion.show(someView);
```

注意region必须要有一个元素与自身绑定，如果在添加region实例到应用或Layout中时没有指定选择器的话，在定义时也必须声明el属性。

#### 添加自定义Region Types

通过addRegions将自定义Region Type添加到应用中。

```
var FooterRegion = Talent.Region.extend({
    el: "#footer"
});

MyApp.addRegions({
    footerRegion: FooterRegion
});
```

也可以在添加时声明一个选择器。

```
var FooterRegion = Talent.Region.extend({
    el: "#footer"
});

MyApp.addRegions({
    footerRegion: {
        selector: "#footer",
        regionType: FooterRegion
    }
});
```
