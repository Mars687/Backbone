(function() {
	/*
		version : 0.0.1-8,
		owner : beisen-ux
		author : beisen-ux
	*/
	var root = this;
	if(window.__isLoadServer){
		throw new Error("only one instance of iTalentSDKServer is allowed!");
	}
	window.__isLoadServer = true;

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
		,_formatRegister: function(register){
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
							window.history.pushState(null, null,hash);
						}else if(window.Talent){
							window.Talent.app.execute('history:navigate', "#" + decodeURIComponent(hash),true);
						} else if(window.Backbone) {
							window.Backbone.history.navigate("#" + decodeURIComponent(hash), true);
						} else {
							window.location.hash = "#" + hash;
						}
					} else {
						// backbone _.updateHash 改写
						 //var href = window.location.href.replace(/(javascript:|#).*$/, '');
        				 //window.location.replace(href + '#' + hash);
						
						if(window.Talent){
							window.Talent.app.execute('history:navigate', "#" + decodeURIComponent(hash), false);
						} else if(window.Backbone) {
							window.Backbone.history.navigate("#" + decodeURIComponent(hash), false);
						}
					}
    			}
			}
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
			}), "*")
		}

		,_showPopup : function(data) {
			var self = this;
			if(window.top != window) {
				window.top.postMessage(data);
			} else {
				
				//childPositon 不为空！
				if(data._childPosition){
					var ifOldIE = this._checkBrowserVersion();
					if(ifOldIE){

						this._showPopupAnimate(data);
					}else{

						this._addIframeToContailer(data);
					}
				}else{
					
					this._addIframeToContailer(data);
				}
			}
		}
		,_showPopupAnimate : function(data){
			var self = this;
			var parent = this._popIframe[this._popIframe.length -1].ifrmEle;
			setTimeout(function(){
				var length = self._popIframe.length;
				if(length >=2){
				    parent.style.transform = "translate(-120px,14px) scale(0.75)";
				    parent.style.pointerEvents = "none";
				}else{
				    parent.style.transform = "translate(-85%,-59%) scale(0.75)";
				    parent.style.pointerEvents = "none";
				}
				    	
				self._popIframe[self._popIframe.length -1].ifrmEle = parent;
			},300);
			setTimeout(function(){
				self._addIframeToContailer(data);
			},500);
		}
		,_addIframeToContailer : function(data){
			
			var url = data['url'] && decodeURIComponent(data['url']);
			var popContainer = document.getElementById('__iTalent_pop_up');
			var ifrmEle = this._createPopIframe(url, data['width'], data['height'], data.publishData,data['_transferframeUrl'],this._convertMessageParams(data._childPosition));

			if(popContainer) {
				this._loading(popContainer);
				popContainer.appendChild(ifrmEle);
			} else {

				popContainer = document.createElement('div');
				popContainer.setAttribute('id', '__iTalent_pop_up');
				popContainer.style.display = 'none';
					
				var shade = document.createElement('div');
				shade.setAttribute('style', 'position:fixed; width: 100%; height: 100%; background-color: #ffffff; top: 0; left : 0; z-index: 10000; opacity: 0.6;filter:alpha(opacity=60)')
				this._loading(popContainer);
				popContainer.appendChild(shade);
				popContainer.appendChild(ifrmEle);
				document.getElementById('bs_layout_container').appendChild(popContainer);
			}
			popContainer.style.display = 'block';
		}
		,_loading : function(popContainer){

			var index = this._popIframe.length + 10000;
			var loading = document.getElementById("__iTalent_pop_loading");
			if(!loading){
				var loading = document.createElement("div");
				loading.setAttribute('id','__iTalent_pop_loading');
				loading.setAttribute('style','position:fixed;top:50%;left:50%;font-size:14px;line-height:16px;z-index:'+index+";");
				loading.innerHTML = '<img src="http://st-web.tita.com//ux/tita-web-v4/release/app/images/load_m.gif" style="vertical-align: middle;"/><span style="vertical-align: middle;color:#555555">加载中...</span> ';
				popContainer.appendChild(loading);
			}else{
				
				loading.setAttribute('style','position:fixed;top:50%;left:50%;display:block;z-index:'+index+";");
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
		,_hidePopup : function(data) {
			var self = this;
			if(window.top != window){
				window.top.postMessage(data);
			} else {
				var ifOldIE = this._checkBrowserVersion();
				if(ifOldIE){
					this._hidePopupAnimate();
				}else{
					//ie8 兼容
					var iframe = this._popIframe.pop();
					var __iTalent_pop_up = document.getElementById('__iTalent_pop_up');
					if(iframe && __iTalent_pop_up){
						__iTalent_pop_up.removeChild(iframe.ifrmEle);
					}
					iframe && document.getElementById('__iTalent_pop_up').removeChild(iframe.ifrmEle);
					if(this._popIframe.length == 0) {
						document.getElementById('__iTalent_pop_up').style.display = 'none';
					}
				}
			}
		}
		,_hidePopupAnimate : function(){
			var self = this;
			var iframe = this._popIframe[this._popIframe.length -1];
			var length = this._popIframe.length;
			if(length >=2){
				setTimeout(function(){
					var iframe = self._popIframe[self._popIframe.length -1];
					iframe.ifrmEle.style.top = iframe.top + "px";
					iframe.ifrmEle.style.left = iframe.left + "px";
					iframe.ifrmEle.style.transform = "scale(0)";
				},300);

				setTimeout(function(){
					var iframe = self._popIframe[self._popIframe.length -2].ifrmEle;
						
					if(self._popIframe.length >=3){
						iframe.style.transform = "scale(1)"; // 3级 scale(1) 
					}else{
							
						iframe.style.transform = "translate(-50%, -50%)"; 
					}
						
					iframe.style.pointerEvents = "all";

					var child = self._popIframe.pop();
					child && document.getElementById('__iTalent_pop_up').removeChild(child.ifrmEle);

				},900);
			}else{
					
				var iframe = this._popIframe.pop();
				if(iframe){
					iframe.ifrmEle.style.top = "-800px";
				}
				
				setTimeout(function(){
					var __iTalent_pop_up = document.getElementById('__iTalent_pop_up');
					iframe && __iTalent_pop_up.removeChild(iframe.ifrmEle);
					if(self._popIframe.length == 0 && __iTalent_pop_up) {
						__iTalent_pop_up.style.display = 'none';
					}
				},200);
			}
		}
		,_checkBrowserVersion :function(){
			var userAgent = navigator.userAgent.toLowerCase();
			var regStr_ie = /msie [\d.]+;/gi;
			if(userAgent.indexOf("msie") > 0)
			{
				var browser = userAgent.match(regStr_ie);
				var verinfo = (browser+"").replace(/[^0-9.]/ig,""); 
				if(verinfo <='8.0'){
					return false;
				}
			}
			return true;
		}

		,_popIframe : []

		,_createPopIframe : function(url, width, height, data,_TransferFrameUrl,_childPosition){
			//add widgetId for popup iframe if is not exist
			var self = this;
			var ifrmEle = document.createElement('iframe');
			
			var location =  window.location;
			var iframeData = {
				__iTalentFrameId : 'popup_' + (new Date()).getTime() + parseInt(Math.random(1,10)*3000),
				data : data,
				__iTalentFrameType : 'pop'
			}
			var src = _TransferFrameUrl ? _TransferFrameUrl : location.protocol + '//' + location.host + '/italent-transfer-data.html';
			ifrmEle.setAttribute('frameborder', 0);
			ifrmEle.setAttribute('scrolling', 'auto');

			var ifOldIE = this._checkBrowserVersion();
			if(ifOldIE){
				var ifrmEle = this._setIframeAminateAttr(_childPosition,ifrmEle);
			}else{
				var index = this._popIframe.length + 10000;
				ifrmEle.setAttribute('style', 'position:absolute; top:50%; left:50%; z-index: '+ index +';');
				ifrmEle = this._setPopIframePositon(ifrmEle, width, height);
			}

			ifrmEle.setAttribute('src', src);
			ifrmEle.setAttribute('id', iframeData.__iTalentFrameId);
			ifrmEle.setAttribute('data-type', 'popup');
			
			if(width){
				ifrmEle.setAttribute('width', this._convertMetricToPX(width));
			}
			if(height){
				ifrmEle.setAttribute('height',this._convertMetricToPX(height));
			}
			
			if(!_childPosition){
				this._popIframe.push({ifrmEle:ifrmEle,top:0,left:0});
			}else{

				var parent = this._popIframe[this._popIframe.length-1].ifrmEle;
				var top = parent.getBoundingClientRect().top + _childPosition.top;
				var left = parent.getBoundingClientRect().left + _childPosition.left;

				this._popIframe.push({ifrmEle:ifrmEle,top:top,left:left});
				
			}
			var state = 0;
			if(ifOldIE){
				ifrmEle.onload = function(e){
					if(state ==0){
						self._onloadPopUpAnimate(e,_childPosition,iframeData,url);
					}
					state =1;
					
				}
			} else {
				ifrmEle.attachEvent('onload',function(){
					
					if(state ==0){
						document.getElementById("__iTalent_pop_loading").style.display = "none";
						ifrmEle.contentWindow.name = self._convertMessageParams(iframeData);
						ifrmEle.contentWindow.location.href = url;
					}
					state =1;
				});
			}
			return ifrmEle;
		}
		,_onloadPopUpAnimate : function(e,_childPosition,iframeData,url){
			var self = this;
			document.getElementById("__iTalent_pop_loading").style.display = "none";
			var iframe = e.target;
			if(_childPosition){
				var parent = self._popIframe[self._popIframe.length -1];
				var documentH = window.innerHeight;
				var documentW = window.innerWidth;
				var top = (documentH - iframe.clientHeight) / 2;
				var left = (documentW - iframe.clientWidth) / 2;
				setTimeout(function(){
					iframe.style.transform = "scale(1)";
					iframe.style.top = top + "px";
					iframe.style.left = left + "px";
				},500);
			}else{
				setTimeout(function(){
						
					iframe.style.top = "50%";
				},200);
			}
					
			iframe.contentWindow.name = this._convertMessageParams(iframeData);
			iframe.contentWindow.location.href = url;
		}
		,_setIframeAminateAttr : function(_childPosition,ifrmEle){
			var self = this;
			var index = this._popIframe.length + 10000;
			if(_childPosition && _childPosition.top !='undefined' && _childPosition.left !='undefined'){

				var parent = this._popIframe[this._popIframe.length -1].ifrmEle;
				var top = parent.getBoundingClientRect().top + _childPosition.top;
				var left = parent.getBoundingClientRect().left + _childPosition.left;

				ifrmEle.setAttribute('style','position:fixed;transform:scale(0.1);overflow:hidden;transform-origin:left top;transition:transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), left 0.5s cubic-bezier(0.25, 0.1, 0.25, 1); z-index: '+ index +';top:'+top+'px;left:'+left+"px");
			
			}else{
				
				ifrmEle.setAttribute('style','position:fixed;left:50%;transform:translate(-50%, -50%);opacity: 1;overflow:hidden;transition:top 0.5s cubic-bezier(0.44, 1.53, 0.32, 0.92), transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);top:-800px; z-index: '+ index +';');
			}
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
			
			//兼容ie8
			if(typeof(params) =='string' && params =='undefined'){
				return "";
			}

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
			var ifOldIE = this._checkBrowserVersion();
			if(!ifOldIE){
				width && (node.style.marginLeft = '-' + width);
				height && (node.style.marginTop =  '-' + height);
			}
			
			return node;
		}
		,_convertMetricToPX : function(metric, half){

			//宽度和高度取偶数,transform 字体模糊
			if(typeof metric == 'string') {
				metric = (metric == "undefined" || metric == "null" || metric == "NaN" || !metric) ? '0' : metric;
				metric = metric.replace(/(px)?/, '') == '' ? 0 : metric;
				//return (metric.indexOf("%") == -1) ? (half ? (parseInt(metric)/2 + 1) : (parseInt(metric) + 1)) + 'px' : metric;
				if(metric.indexOf("%") == -1){
					if(half){
						var isEven = this._checkNumberIsEven(metric);
						return isEven ? parseInt(metric)/2 + 2 : parseInt(metric)/2 + 1; 
						
					}else{
						var isEven = this._checkNumberIsEven(metric);
						return isEven ? parseInt(metric) + 2 + 'px' : parseInt(metric) + 1 + 'px';
					}
				}else{
					return metric;
				}
			} else if(typeof metric == 'number') {
				if(half){
					var isEven = this._checkNumberIsEven(parseInt(metric));
					return isEven ? parseInt(metric)/2+2 : parseInt(metric)/2 + 1;
				}else{
					var isEven = this._checkNumberIsEven(parseInt(metric));
					return isEven ? parseInt(metric) + 2 + 'px' : parseInt(metric) + 1 + 'px'; 
				}
			}
			
		}
		,_checkNumberIsEven : function(metric){
			return parseInt(metric)%2==0 ? true : false;
		}
	}
	
	root.iTalentSDK = iTalentSDK;

}).call(this)