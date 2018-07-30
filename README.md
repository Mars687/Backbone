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

marionette 1.2.2 学习重点：
1. 生命周期
2. 事件机制
3. 视图，及视图使用场景，CollectionView与CompositeView区别

initialization
render
onRender
onShow
beforeDestroy
destroy

CollectionView
它是一个Backbone View对象定义，而不是实例。它可以是任意的Backbone.View 或
来源于Marionette.ItemView.

``` javascript
MyItemView = Backbone.Marionette.ItemView.extend({});

Backbone.Marionette.CollectionView.extend({
  itemView: MyItemView
});
```
Item views 在被集合视图定义的itemView属性引用前必须预先定义。

onBeforeRender回调函数
在渲染集合视图前被调用

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
