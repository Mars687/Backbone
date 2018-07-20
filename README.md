## Backbone.js Learning Summary

了解MVC的发展历史，基本概念。

学习Backbone的Model：

a. 通过extend创建Backbone模型，学习模型的初始化Initialize()，默认值defaults，赋值Model.set(), 取值Model.get().

b. 通过在initialize()函数中添加监听器来监听模型的变化。

c. 通过model.validate()进行模型验证。

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
