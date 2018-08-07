(function() {
	/*
		version : 0.0.1-5,
		owner : beisen-ux
		author : yuanyuan
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
					this._callbackEventList = this._callbackEventList.concat(registers);
				}
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
						//self._callbackEventList[i].cb && self._callbackEventList[i].cb(message);
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
		,_formatRegister: function(register){
			register['listenEvent'] = this._addAppNameToEventName(register['listenEvent']);
			this.unregister(register.listenEvent);
			register['context'] = register['context'] ? register['context'] : window;
			return register;
		}
		,_addAppNameToEventName : function(event_name){
		
			return window.BSGlobal && window.BSGlobal.appName ? window.BSGlobal.appName+"_" + event_name : event_name;
		}
		,getPopUpData : function(){
			return JSON.parse(window.name);
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

		,sendMessage  : function(data, target) {
			data =  data || {};
			data._iTalentType = 'sendMessage';
			data._iTalentMessageDirection = 'up';
			target =  target ||  '*';
			this._sendMessage(data, target);
		}

		,_sendMessage : function(data, target) {
			target = target || '*';
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

		//top set iframe width and height
		,_updateSize : function(data){
			var iframeItem = document.getElementById(data['iframeId']);
			if(!iframeItem) {
				return false;
			}
			var height = data['height'] &&  this._convertMetricToPX(data['height']);
			var width = data['width'] && this._convertMetricToPX(data['width']);
			height && iframeItem.setAttribute('height', height);
			width && iframeItem.setAttribute('width', width);

			var type = iframeItem.getAttribute('data-type');
			if(type == 'popup') { 
				this._setPopIframePositon(iframeItem, width, height);
			}
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
				_italentHashNotChange : data._italentHashNotChange
			})
			window.top.postMessage(message, '*');
		}
	
		,_changeUrl : function(data){
			var iframeId = data['iframeId'];
			var iframeHref = decodeURIComponent(data['iframeHref']);
			var hash =  decodeURIComponent(window.location.hash || '');
			hash = hash.slice(hash.indexOf('#') +1);
			if(hash.indexOf(iframeId) != -1) {
				var regex = new RegExp(iframeId + "=([^&]*)(&)?", "i"); 
				hash = hash.replace(regex, iframeId + "="+ encodeURIComponent(iframeHref) + "&");
				hash = encodeURIComponent(hash);
				if(window.location.hash != hash) {
					if(data._italentHashNotChange) {
						if(window.history.pushState) {
							window.history.pushState(null, null,  "#" + hash);
						}else if(window.Talent){
							window.Talent.app.execute('history:navigate', "#" + decodeURIComponent(hash), false);
						} else if(window.Backbone) {
							window.Backbone.history.navigate("#" + decodeURIComponent(hash), false);
						} else {
							window.location.hash = "#" + hash;
						}
					} else {
						var location = window.location;
						var href = window.location.href.replace(/(javascript:|#).*$/, '');
						window.location.replace(href + '#' + hash);
					}
    			}
			}
		}

		,showPopup : function(url, width, height, data,transferFrameUrl) {
			var self = this;
			window.top.postMessage(this._convertMessageParams({
				url : encodeURIComponent(url),
				width : width,
				height : height,
				_transferframeUrl : transferFrameUrl,
				_iTalentType : 'showPopup',
				publishData : self._convertMessageParams(data)
			}), "*")
		}

		,_showPopup : function(data) {
			if(window.top != window) {
				window.top.postMessage(data);
			} else {
				var url = data['url'] && decodeURIComponent(data['url']);
				var popContainer = document.getElementById('_iTalent_pop_up');
				var ifrmEle = this._createPopIframe(url, data['width'], data['height'], data.publishData,data['_transferframeUrl']);

				if(popContainer) {
					var status = popContainer.style.display;
					popContainer.appendChild(ifrmEle);
				} else {
					popContainer = document.createElement('div');
					popContainer.setAttribute('id', '_iTalent_pop_up');
					popContainer.style.display = 'none';
					var shade = document.createElement('div');
					shade.setAttribute('style', 'position:fixed; width: 100%; height: 100%; background-color: #ccc; top: 0; left : 0; z-index: 10000; opacity: 0.5;')
					popContainer.appendChild(shade);
					popContainer.appendChild(ifrmEle);
					document.getElementById('bs_layout_container').appendChild(popContainer);
				}
				popContainer.style.display = 'block';
			}
		}
		,hidePopup : function() {
			if(window.top != window ) {
				window.top.postMessage(this._convertMessageParams({
					_iTalentType : 'hidePopup'
				}), "*");
			}else{
				this._hidePopup();
			}
		}
		,_hidePopup : function() {
			if(window.top != window){
				window.top.postMessage(data);
			} else {
				var iframe = this._popIframe.pop();
				document.getElementById('_iTalent_pop_up').removeChild(iframe);
				if(this._popIframe.length == 0) {
					document.getElementById('_iTalent_pop_up').style.display = 'none';
				}
			}
		}

		,_popIframe : []

		,_createPopIframe : function(url, width, height, data,_TransferFrameUrl){
			//add widgetId for popup iframe if is not exist
			var self = this;
			var ifrmEle = document.createElement('iframe');
			var index = this._popIframe.length + 10000;
			var location =  window.location;
			var iframeData = {
				__iTalentFrameId : 'popup_' + (new Date()).getTime() + parseInt(Math.random(1,10)*3000),
				data : data,
				__iTalentFrameType : 'pop'
			}

			var src = _TransferFrameUrl ? _TransferFrameUrl : location.protocol + '//' + location.host + '/italent-transfer-data.html';
			ifrmEle.setAttribute('frameborder', 0);
			ifrmEle.setAttribute('scrolling', 'auto');
			ifrmEle.setAttribute('style', 'position:fixed; top:50%; left:50%; z-index: '+ index +';');
			ifrmEle.setAttribute('width', this._convertMetricToPX(width));
			ifrmEle.setAttribute('height',this._convertMetricToPX(height));
			ifrmEle.setAttribute('src', src);
			ifrmEle.setAttribute('id', iframeData.__iTalentFrameId);
			ifrmEle.setAttribute('data-type', 'popup');
			ifrmEle = this._setPopIframePositon(ifrmEle, width, height);
			this._popIframe.push(ifrmEle);
			var state = 0;
			ifrmEle.onload = function(e) {
				if(state == 0) {
					var iframe = e.target;
					iframe.contentWindow.name = self._convertMessageParams(iframeData);
					iframe.contentWindow.location.href = url;
					state = 1;
				}
		    };
			return ifrmEle;
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
		,_setPopIframePositon : function(node, width, height) {
			width = width && this._convertMetricToPX(width, true);
			height = height && this._convertMetricToPX(height, true);
			width && (node.style.marginLeft = '-' + width);
			height && (node.style.marginTop =  '-' + height);
			return node;
		}
		,_convertMetricToPX : function(metric, half){
			if(typeof metric == 'string') {
				metric = (metric == "undefined" || metric == "null" || metric == "NaN" || !metric) ? '0' : metric;
				metric = metric.replace(/(px)?/, '') == '' ? 0 : metric;
				return (metric.indexOf("%") == -1) ? (half ? (parseInt(metric)/2 + 1) : (parseInt(metric) + 1)) + 'px' : metric;
			} else if(typeof metric == 'number') {
				return metric = (half ? (parseInt(metric)/2 + 1) : (parseInt(metric) + 1))  + 'px';
			}
			
		}
	}
	
	root.iTalentSDK = iTalentSDK;

}).call(this)