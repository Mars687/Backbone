## Backbone.js Learning Summary

### 了解MVC的发展历史，基本概念。

学习Backbone的Model：

a. 通过extend创建Backbone模型，学习模型的初始化Initialize()，默认值defaults，赋值Model.set(), 取值Model.get().

b. 通过在initialize()函数中添加监听器来监听模型的变化。

c. 通过model.validate()进行模型验证。

d. clear()方法删除模型中的属性，而不删除该模型，用于重置属性。 destroy()方法用于在集合和服务器删除整个模型。

学习Backbone的View:
a. 通过extend扩展Backbone.View创建新视图。

b. View的一个核心属性el是视图必不可少的，作为DOM元素的一个引用，视图可以使用el构成它的元素内容。

c. setElement将现有的 Backbone视图应用于其他不同的DOM元素。

d. render()渲染模板函数，events哈希。

学习Backbone的Collection：
a. 通过extend扩展Backbone.Collection来创建集合。

b. add(), remove() 方法添加或移除模型。

c. 使用集合的get() 方法接受id(每个模型均有)，cid(客户端ID)或 idAttribute(服务端数据库id)从集合里检索模型。

d. 监听add和remove事件，给集合模型属性绑定change事件监听模型属性变化。

e. Collection.set()方法接受模型数组参数，执行更新集合操作。Collection.reset()方法重置集合内容。

RESTful持久化：
a. Collection.fetch()从服务器上获取模型。

b. Collection.save()保存模型到服务器。

c. Collection.destroy()从集合和服务器中删除一个存在的模型。Collection.remove()方法只从集合中删除一个模型。

d. Collection.create()用于创建一个新模型。

事件（Event）
a. on()在object上绑定一个callback函数， 只要事件被触发，该回调函数就会被调用。类似于jQuery中的subscribe。

b. off()从object对象移除先前绑定的callback函数。类似于jQuery中的unsubscribe。

c. trigger()为指定事件（或用空格分隔的一组事件列表）触发回调函数。类似于jQuery中的publish。

d. once()方法绑定的回调函数触发一次就被移除。

e. listenTo()让对象监听另外一个对象的事件。stopListening()来停止监听事件。（只需调用一次stopListening()就可以将这些绑定全部解除)。

路由（Router）
a. extend创建一个自定义路由类。当匹配了URL片段便执行定义的动作，可以通过routes定义路由动作键值对。

b. routes将带参数的URLs映射到路由实力方法上。

c. route为路由对象手动创建路由。

d. navigate()方法可以在特定的点上通过更新URL来反映应用程序状态。

### marionette 1.2.2 学习重点：
1. 生命周期
2. 事件机制
3. 视图，及视图使用场景，CollectionView与CompositeView区别

a. CollectionView
CollectionView将会循环遍历指定集合中的所有模型，使用指定的itemView渲染每一个模型，然后将itemView的 el 的结果加到集合视图 el 的后面。

CollectionView's itemView
它是一个Backbone View对象定义，而不是实例。它可以是任意的Backbone.View 或来源于Marionette.ItemView.

``` javascript
MyItemView = Backbone.Marionette.ItemView.extend({});

Backbone.Marionette.CollectionView.extend({
  itemView: MyItemView
});
```
Item views 在被集合视图定义的itemView属性引用前必须预先定义。

b. CompositeView
CompositeView拓展子 CollectionView，作为复合视图用于树形结构中，同时表示枝叶的场景，或者一个集合要在包裹模板中被渲染的场景。

c. ItemView
ItemView是代表单独一项的视图，这一项可能是一个 Backbone.Model 或者是一个 Backbone.Collection。无论是哪一个，他都会最为单独一项来处理。ItemView 拓展自 Marionette.View。
4. 方法
initialization
render
onRender
onShow
beforeDestroy
destroy

onBeforeRender回调函数
在渲染集合视图前被调用。

``` javascript
Backbone.Marionette.CollectionView.extend({
  onBeforeRender: function(){
    // do stuff here
  }
});
```

onRender 回调函数
视图渲染后，会调用onRender方法。
``` javascript
Backbone.Marionette.CollectionView.extend({
  onRender: function(){
    // do stuff here
  }
});
```


使用 Marionette.js 需要写的代码要少很多，因为我们不需要详细说明 Render 函数了。使用 CollectionView 还是 ItemView 取决于你想要完成什么。如果你需要实现一个具有自定义功能的独立视图集合，CollectionView 是一个好的选择。但如果你需要渲染 collection的值，ItemView 是个不错的选择。

渲染视图并和新视图进行交换有些繁琐，可以通过调用 close 和 render 来实现，但为什么要使用 region 呢？
因为使用 region 就不用担心到底哪个是当前正在显示的视图了。可以通过调用 .show 方法用新视图替换原有视图，region 将会移除之前的那个视图。因此，不需要调用视图的 close 方法，如果一个视图在 region 中已经显示了，已存在视图的 close 方法会在调用 show 方法时被调用，并传递给新视图，因而确保视图的 .el 事件绑定被合适的移除了。

对视图元素的操作只限于当前模板下的视图，不可以跨视图操作。视图的展示要通过模型中的数据驱动，要通过操作模型数据来更改视图的展现。

### localStorage与sessionStorage
一、什么是localStorage、sessionStorage

在HTML5中，新加入了一个localStorage特性，这个特性主要是用来作为本地存储来使用的，解决了cookie存储空间不足的问题(cookie中每条cookie的存储空间为4k)，localStorage中一般浏览器支持的是5M大小，这个在不同的浏览器中localStorage会有所不同。

二、localStorage的优势与局限

localStorage的优势

1、localStorage拓展了cookie的4K限制

2、localStorage会可以将第一次请求的数据直接存储到本地，这个相当于一个5M大小的针对于前端页面的数据库，相比于cookie可以节约带宽，但是这个却是只有在高版本的浏览器中才支持的

localStorage的局限

1、浏览器的大小不统一，并且在IE8以上的IE版本才支持localStorage这个属性

2、目前所有的浏览器中都会把localStorage的值类型限定为string类型，这个在对我们日常比较常见的JSON对象类型需要一些转换

3、localStorage在浏览器的隐私模式下面是不可读取的

4、localStorage本质上是对字符串的读取，如果存储内容多的话会消耗内存空间，会导致页面变卡

5、localStorage不能被爬虫抓取到

localStorage与sessionStorage的唯一一点区别就是localStorage属于永久性存储，而sessionStorage属于当会话结束的时候，sessionStorage中的键值对会被清空

对浏览器来说，使用 Web Storage 存储键值对比存储 Cookie 方式更直观，而且容量更大，它包含两种：localStorage 和 sessionStorage

sessionStorage（临时存储） ：为每一个数据源维持一个存储区域，在浏览器打开期间存在，包括页面重新加载

localStorage（长期存储） ：与 sessionStorage 一样，但是浏览器关闭后，数据依然会一直存在

API
sessionStorage 和 localStorage 的用法基本一致，引用类型的值要转换成JSON

1. 保存数据到本地
``` Javascript
    const info = {
        name: 'Lee',
        age: 20,
        id: '001'
    };
    sessionStorage.setItem('key', JSON.stringify(info));
    localStorage.setItem('key', JSON.stringify(info));
```

2. 从本地存储获取数据

``` Javascript
    var data1 = JSON.parse(sessionStorage.getItem('key'));
    var data2 = JSON.parse(localStorage.getItem('key'));
```

3. 本地存储中删除某个保存的数据

``` Javascript
    sessionStorage.removeItem('key');
    localStorage.removeItem('key');
```

4. 删除所有保存的数据

``` Javascript
    sessionStorage.clear();
    localStorage.clear();
```

5. 监听本地存储的变化
Storage 发生变化（增加、更新、删除）时的 触发，同一个页面发生的改变不会触发，只会监听同一域名下其他页面改变 Storage

``` Javascript
    window.addEventListener('storage', function (e) {
        console.log('key', e.key);
        console.log('oldValue', e.oldValue);
        console.log('newValue', e.newValue);
        console.log('url', e.url);
    })
```

### 常见问题

1. compositeView 中的 model 被渲染了两遍

在compositeView中的集合调用 reset（）方法重置后，原视图中的 model 出现两次。调试后发现该 model 视图被渲染了两遍。调试多次没能解决该问题，查阅 Marionette 源码发现：

Marionette的CompositeView拓展自 CollectionView， 当调用reset()方法后，CollectionView 在渲染的过程中会调用内置的render（）方法，渲染子视图之前会先将所有视图移除并关闭，调用removeChildView（）方法：


``` javascript
// Remove the child view and close it 

removeChildView: function(view){ 

  // shut down the child view properly, 

  // including events that the collection has from it 

if (view){ 

       this.stopListening(view);


// call 'close' or 'remove', depending on which is found 

    if (view.close) { view.close(); } 

    else if (view.remove) { view.remove(); }



this.children.remove(view); 

 }
this.triggerMethod("item:removed", view);

}
```

当判断 if (view.close) { view.close(); } 时，本应调用Marionette内置的close（）方法关闭集合中的视图。但由于在此视图中自定义了一个同名close（）方法用于处理 blur 事件，这造成此时会优先调用重置的close（）方法，导致将model属性重新设定，再次渲染了该模型。

``` javascript
// 自定义close（）方法

close: function() {

    var value = this.$('.edit').val().trim();

    if (value) {

         this.model.set('title', value);

         this.$el.removeClass('editing');

      }

}
```


解决方法：重命名自定义方法为_close()。

由此，应当注意方法的命名尽量避免采用简单命名方式，以避免与框架内置方法名冲突。
