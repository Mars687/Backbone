(function() {
	/*
		version : 0.0.1-7,
		owner : beisen-ux
		author : beisen-ux
	*/
	var root = this;

	var iTalentSDK = {
		register : function(registers) {
			var self = this;
			if(!this._registed) {
				this._addEvent('message', onMessage);
				this._registed = true;
				this.bindHashChangeEvent();
			}
			if(registers && registers instanceof  Array) {
				for(var i=0;i<registers.length;i++){
					registers[i] = this._formatRegister(registers[i]);
				}
				this._callbackEventList = this._callbackEventList.concat(registers);
			}else if(registers && registers instanceof Object){
				registers = this._formatRegister(registers);
				this._callbackEventList.push(registers);
			}
			
			function onMessage(e) {
				var data = e.data;
				data = self._convertMessageParams(data);
				var message = data['data'] || {};

				var endMessage = false;
				for(var i = 0; i < self._callbackEventList.length; i++) {
					data.publishEvent = self._addAppNameToEventName(data.publishEvent);
					if(self._callbackEventList[i] && self._callbackEventList[i].listenEvent == data.publishEvent){
						self._callbackEventList[i].cb && self._callbackEventList[i].cb.apply(self._callbackEventList[i].context,[message]); 
						endMessage = true
					}
				}

				if(data && data._iTalentType && endMessage == false) {
					var type = data._iTalentType.indexOf("_") != 0 ? "_" + data._iTalentType : data._iTalentType;
					self[type] && self[type](data);
				}
			}
		}
		,getItalentHostUrl: function(url){

			var data = this.getPopUpData();
			if(!data || !data.__iTalentLocationHref || !data.__iTalentFrameType){

				return url;
			}
			var domain = location.href.slice(0,location.href.indexOf("?"));

			var iTalentData = data.__iTalentLocationHref.split("#");
			if(iTalentData.length !=2){
				return url;
			}
			var newUrl = iTalentData[0] + "#" + encodeURIComponent(iTalentData[1] + "?iTalentFrameType="+data.__iTalentFrameType + "&iTalentFrame="+encodeURIComponent(domain+url));	
			return newUrl;
		}
		,_formatRegister : function(register){
			register['listenEvent'] = this._addAppNameToEventName(register['listenEvent']);
			this.unregister(register.listenEvent);
			register['context'] = register['context'] ? register['context'] : window;
			return register;
		}
		,_addAppNameToEventName : function(event_name){
		
			return window.BSGlobal && window.BSGlobal.appName ? window.BSGlobal.appName+"_" + event_name : event_name;
		}
		,unregister  : function(listenEventName) {
			var callbackEventList = this._callbackEventList;
			for(var i=0; i <  callbackEventList.length; i ++) {
				if(callbackEventList[i].listenEvent == listenEventName) {
					callbackEventList = callbackEventList.slice(0, i).concat(callbackEventList.slice(i+1));
				}
			}
			this._callbackEventList = callbackEventList;
		}
		,getPopUpData : function(){
			return window.name ?  JSON.parse(window.name) : {};
		}
		,sendMessage  : function(data, target) {
			data =  data || {};
			data._iTalentType = 'sendMessage';
			data._iTalentMessageDirection = 'up';
			target =  target ||  '*';
			this._sendMessage(data, target);
		}

		,_sendMessage : function(data, target) {
			target = target || '*'
			if(window.top != window && data._iTalentMessageDirection == 'up') {
				data = this._convertMessageParams(data);
				window.top.postMessage(data, target);
			} else {
				data._iTalentMessageDirection = 'down';
				data = this._convertMessageParams(data);
				var iframeList = document.getElementsByTagName('iframe');

				for(var i = 0; i < iframeList.length; i++){
					iframeList[i].contentWindow.postMessage(data, target);
				}
			}
		}

		,_callbackEventList : []

		//iframe send size to top and top will execute _updatesize
		,updateSize : function(iframeId, width, height){
			var self = this;
			var message = this._convertMessageParams({
				_iTalentType : 'updateSize', 
				iframeId : iframeId || self._convertMessageParams(window.name || "{}")['__iTalentFrameId'],
				width : width || '100%',
				height : height || document.body.scrollHeight
			})

			window.top.postMessage(message, '*');
		}

		,bindHashChangeEvent : function() {
			var self = this;
			if(window.name == "") {
				return false;
			}
			var iframeId = this._convertMessageParams(window.name || "{}")['__iTalentFrameId'];
			this.recodeIframeUrl(iframeId,  {'_italentHashNotChange' : true});
			this._addEvent('hashchange', update);
		    function update(e, data){
		    	self.recodeIframeUrl(iframeId, data);
		    }
		}
		,recodeIframeUrl : function(iframeId, data) {
			var self = this;
			var data = data || {};
			var message = self._convertMessageParams({
				_iTalentType : 'changeUrl', 
				iframeId : iframeId || self._convertMessageParams(window.name || "")['__iTalentFrameId'],
				iframeHref : encodeURIComponent(window.location.href),
				_italentHashNotChange : data._italentHashNotChanges
			})
			window.top.postMessage(message, '*');
		}

		,showPopup : function(url, width, height, data,transferFrameUrl,childPosition) {
			var self = this;
			
			window.top.postMessage(this._convertMessageParams({
				url : encodeURIComponent(url),
				width : width,
				height : height,
				_transferframeUrl : transferFrameUrl,
				_childPosition: self._convertMessageParams(childPosition),
				_iTalentType : 'showPopup',
				publishData : self._convertMessageParams(data)
			}), "*");
			
		}

		,hidePopup : function() {
			if(window.top != window ) {
				window.top.postMessage(this._convertMessageParams({
					_iTalentType : 'hidePopup'
				}), "*");
			}
		}

		,_addEvent : function(event_name, callback) {
			this._removeEvent(event_name, callback);
			if (window.addEventListener) {
				window.addEventListener('on' + event_name, callback, false);
				window.addEventListener(event_name, callback, false);
			} else if (window.attachEvent) {
				window.attachEvent('on' + event_name, callback);
				window.attachEvent(event_name, callback);
			}	
		}
		,_removeEvent : function(event_name, callback) {
			if (window.removeEventListener) {
				window.removeEventListener('on' + event_name, callback, false);
				window.removeEventListener(event_name, callback, false);
			} else if (window.attachEvent) {
				window.attachEvent('on' + event_name, callback);
				window.attachEvent(event_name, callback);
			}	
		}
		,_convertMessageParams : function(params) {
			var data;
			if(typeof(params) == 'string') {
				data = JSON.parse(params);
			} else {
				data = JSON.stringify(params); 
			}
			return data;
		}
	}
	
	root.iTalentSDK = iTalentSDK;

}).call(this)