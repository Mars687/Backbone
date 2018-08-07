# 标准项目创建流程


## 流程


### 1. 本地初始化项目
- 借助于Generator，在本地创建项目框架；
	- 参考:[Generator TalentJS](http://gitlab.beisen.co/ux/generator-talent/tree/master)
	- 创建前，注意获取最新代码
- 修改项目中package.json文件中的name字段（如kaoshi-mobile）；
	- 上线时，静态文件的路径根据该字段生成
- 修改项目中package.json文件中的configFile（如StaticTMSKaoShiMobile）；
	- configFile用于指定项目对应的配置文件；
- 修改项目中package.json文件中的configUser字段（tms-recruit）；
	- configUser用于指定CI修改配置文件时所使用的帐户；

![image](http://gitlab.beisen.co/js/talent/raw/master/docs/project/images/1.png?raw=true =500x390)


### 2. gitlab上创建项目库
- 在某个group（如tms-ui）下创建一个新项目
	- 创建时，注意保持project name跟repository name一致；
- 在配置页面增加web hook，以便提交代码时通知CI执行构建；
	- web hook的URL为http://api.beisen.co/gitlab/hooks/push/

![image](http://gitlab.beisen.co/js/talent/raw/master/docs/project/images/2-1.png?raw=true =800x400)
![image](http://gitlab.beisen.co/js/talent/raw/master/docs/project/images/2-2.png?raw=true =800x400)


### 3. 创建CI任务
- 使用git-ci的脚本，创建CI任务
	- 创建时，需要指定第二步设定的project name和group；


### 4. 在配置文件中心，新增配置文件
- 根据项目配置，修改配置模板Static.xml；
	- xml的根结点名称要跟项目package.json中的configFile字段一致
	- 三处链接中的项目名要package.json中的name字段一致
	- CommitId的值修改为false，表示初始化状态
- 将修改好的XML，上传到配置文件中心；
	- 配置文件结点名称要跟项目package.json中的configFile字段一致
- 向刘永涛(liuyongtao)申请调用API读写配置文件的权限
	- 向其告知配置文件的名称(configFile)和帐户(configUser)

![image](http://gitlab.beisen.co/js/talent/raw/master/docs/project/images/4-1.png?raw=true =800x400)
![image](http://gitlab.beisen.co/js/talent/raw/master/docs/project/images/4-2.png?raw=true =800x400)


	
### 5. 测试
- 修改一个JS文件（如views/home/index-page-view.js），并提交，观察ci是否正常触发、并构建。