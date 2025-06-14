
if (typeof gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded !== "undefined") {
  gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded = {};


gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded.userFunc0x2689860 = function(runtimeScene, eventsFunctionContext) {
"use strict";
var Newgrounds = {};
"undefined"==typeof Newgrounds&&(Newgrounds={}),Newgrounds.io={GATEWAY_URI:"//newgrounds.io/gateway_v3.php"},Newgrounds.io.events={},Newgrounds.io.call_validators={},Newgrounds.io.model={checkStrictValue:function(e,t,r,n,o,s,i){if("mixed"==n)return!0
if(null===r||"undefined"==typeof r)return!0
if(n&&r.constructor===n)return!0
if(n==Boolean&&r.constructor===Number)return!0
if(o&&r.constructor===Newgrounds.io.model[o])return!0
if(r.constructor===Array&&(s||i)){for(var u=0;u<r.length;u++)this.checkStrictValue(e,t,r[u],s,i,null,null)
return!0}if(e)throw new Error("Illegal '"+t+"' value set in model "+e)
return!1}},Newgrounds.io.events.OutputEvent=function(e,t,r){this.type=e,this.call=t,this.data=r,this.success=r&&r.success?!0:!1,this.preventDefault=!1},Newgrounds.io.events.OutputEvent.prototype.constructor=Newgrounds.io.events.OutputEvent,Newgrounds.io.events.SessionEvent=function(e){this.type=e,this.user=null,this.passport_url=null},Newgrounds.io.events.SessionEvent.USER_LOADED="user-loaded",Newgrounds.io.events.SessionEvent.SESSION_EXPIRED="session-expired",Newgrounds.io.events.SessionEvent.REQUEST_LOGIN="request-login",Newgrounds.io.events.SessionEvent.prototype.constructor=Newgrounds.io.events.SessionEvent,Newgrounds.io.events.EventDispatcher=function(){},Newgrounds.io.events.EventDispatcher.prototype={_event_listeners:{},addEventListener:function(e,t){if(e.constructor!==String)throw new Error("Event names must be a string format.")
if(t.constructor!==Function)throw new Error("Event listeners must be functions.")
"undefined"==typeof this._event_listeners[e]&&(this._event_listeners[e]=[]),this._event_listeners[e].push(t)},removeEventListener:function(e,t){if("undefined"!=typeof this._event_listeners[e]){var r=-1
for(var i=0;i<this._event_listeners[e].length;i++)if(this._event_listeners[e][i]===t){r=i
break}return r>=0?(this._event_listeners[e].splice(r,1),!0):!1}},removeAllEventListeners:function(e){if("undefined"==typeof this._event_listeners[e])return 0
var t=this._event_listeners[e].length
return this._event_listeners[e]=[],t},dispatchEvent:function(e){var t,r=!1
for(var n in Newgrounds.io.events)if(e.constructor===Newgrounds.io.events[n]){r=!0
break}if(!r)throw new Error("Unsupported event object")
if("undefined"==typeof this._event_listeners[e.type])return!1
for(var o=0;o<this._event_listeners[e.type].length;o++)if(t=this._event_listeners[e.type][o],t(e)===!1||e.preventDefault)return!0
return!0}},Newgrounds.io.events.EventDispatcher.prototype.constructor=Newgrounds.io.events.EventDispatcher,Newgrounds.io.core=function(e,t){function r(){return"undefined"!=typeof localStorage&&localStorage&&localStorage.getItem.constructor==Function?!0:(console.warn("localStorage unavailable. Are you running from a web server?"),!1)}function n(){if(!r())return null
var e=localStorage.getItem(p)
return e?e:null}function o(e){return r()?void localStorage.setItem(p,e):null}function s(){return r()?void localStorage.removeItem(p):null}var i,u,l,a,c=this,d=new Newgrounds.io.urlHelper
if(d.getRequestQueryParam("ngio_session_id")&&(u=d.getRequestQueryParam("ngio_session_id")),Object.defineProperty(this,"app_id",{get:function(){return i}}),Object.defineProperty(this,"user",{get:function(){return this.getCurrentUser()}}),Object.defineProperty(this,"session_id",{set:function(e){if(e&&"string"!=typeof e)throw new Error("'session_id' must be a string value.")
u=e?e:null},get:function(){return u?u:null}}),Object.defineProperty(this,"debug",{set:function(e){l=e?!0:!1},get:function(){return l}}),!e)throw new Error("Missing required 'app_id' in Newgrounds.io.core constructor")
if("string"!=typeof e)throw new Error("'app_id' must be a string value in Newgrounds.io.core constructor")
i=e,t?a=CryptoJS.enc.Base64.parse(t):console.warn("You did not set an encryption key. Some calls may not work without this.")
var p="Newgrounds-io-app_session-"+i.split(":").join("-")
!u&&n()&&(u=n()),this.addEventListener("App.endSession",function(e){c.session_id=null,s()}),this.addEventListener("App.startSession",function(e){e.success&&(c.session_id=e.data.session.id)}),this.addEventListener("App.checkSession",function(e){e.success?e.data.session.expired?(s(),this.session_id=null):e.data.session.remember&&o(e.data.session.id):(this.session_id=null,s())}),this._encryptCall=function(e){if(!e||!e.constructor==Newgrounds.io.model.call_model)throw new Error("Attempted to encrypt a non 'call' object")
var t=CryptoJS.lib.WordArray.random(16),r=CryptoJS.AES.encrypt(JSON.stringify(e.toObject()),a,{iv:t}),n=CryptoJS.enc.Base64.stringify(t.concat(r.ciphertext))
return e.secure=n,e.parameters=null,e}},Newgrounds.io.core.prototype={_session_loader:null,_call_queue:[],_event_listeners:{},addEventListener:Newgrounds.io.events.EventDispatcher.prototype.addEventListener,removeEventListener:Newgrounds.io.events.EventDispatcher.prototype.removeEventListener,removeAllEventListeners:Newgrounds.io.events.EventDispatcher.prototype.removeAllEventListeners,dispatchEvent:Newgrounds.io.events.EventDispatcher.prototype.dispatchEvent,getSessionLoader:function(){return null==this._session_loader&&(this._session_loader=new Newgrounds.io.SessionLoader(this)),this._session_loader},getSession:function(){return this.getSessionLoader().session},getCurrentUser:function(){var e=this.getSessionLoader()
return e.session?e.session.user:null},getLoginError:function(){return this.getSessionLoader().last_error},getValidSession:function(e,t){this.getSessionLoader().getValidSession(e,t)},requestLogin:function(e,t,r,n){function o(){i&&clearInterval(i),u.removeEventListener("cancelLoginRequest",s),l.closePassport()}function s(){r&&r.constructor===Function?r.call(n):t.call(n),o()}if(!e||e.constructor!==Function)throw"Missing required callback for 'on_logged_in'."
if(!t||t.constructor!==Function)throw"Missing required callback for 'on_login_failed'."
var i,u=this,l=this.getSessionLoader()
u.addEventListener("cancelLoginRequest",s),u.getCurrentUser()?e.call(n):(l.loadPassport(),i=setInterval(function(){l.checkSession(function(r){!r||r.expired?111==l.last_error.code?s():(o(),t.call(n)):r.user&&(o(),e.call(n))})},3e3))},cancelLoginRequest:function(){event=new Newgrounds.io.events.OutputEvent("cancelLoginRequest",null,null),this.dispatchEvent(event)},logOut:function(e,t){this.getSessionLoader().endSession(e,t)},queueComponent:function(e,t,r,n){t&&t.constructor===Function&&!r&&(r=t,t=null)
var o=new Newgrounds.io.model.call(this)
o.component=e,"undefined"!=typeof t&&(o.parameters=t),this._validateCall(o),this._call_queue.push([o,r,n])},executeQueue:function(){for(var e=[],t=[],r=[],n=0;n<this._call_queue.length;n++)e.push(this._call_queue[n][0]),t.push(this._call_queue[n][1]),r.push(this._call_queue[n][2])
this._doCall(e,t,r),this._call_queue=[]},callComponent:function(e,t,r,n){t.constructor!==Function||r||(r=t,t=null)
var o=new Newgrounds.io.model.call(this)
o.component=e,"undefined"!=typeof t&&(o.parameters=t),this._validateCall(o),this._doCall(o,r,n)},_doCallback:function(e,t,r,n){var o,s,i,u={success:!1,error:{code:0,message:"Unexpected Server Response"}}
if("undefined"==typeof r&&(r=null),e.constructor===Array&&t&&t.constructor===Array)for(o=0;o<e.length;o++)s=r&&"undefined"!=typeof r[o]?r[o]:u,i="undefined"==typeof t[o]?null:t[o],this._doCallback(e[o],i,s,n[o])
else{if(r&&"undefined"!=typeof r.data){var l
if(r.data.constructor===Array)for(l=[],o=0;o<r.data.length;o++)l.push(this._formatResults(r.component,r.data[o]))
else l=this._formatResults(r.component,r.data)
r.data=l}var a
r?"undefined"!=typeof r.data?a=r.data:(console.warn("Received empty data from '"+e.component+"'."),a=null):a=u
var c
if(a.constructor===Array)for(o=0;o<a.length;o++)c=new Newgrounds.io.events.OutputEvent(e.component,e[o],a[o]),this.dispatchEvent(c)
else c=new Newgrounds.io.events.OutputEvent(e.component,e,a),this.dispatchEvent(c)
t&&t.constructor===Function&&t.call(n,a)}},_formatResults:function(e,t){var r,n,o,s,i,u=null
if("undefined"!=typeof t.success&&t.success&&(u=Newgrounds.io.call_validators.getValidator(e)),!u)return t
var l=u.returns
for(n in l)if("undefined"!=typeof t[n]||t.success===!1){if("undefined"!=typeof l[n].array){if(i="undefined"!=typeof l[n].array.object?l[n].array.object:l[n].array,"undefined"==typeof Newgrounds.io.model[i]){console.warn("Received unsupported model '"+i+"' from '"+e+"'.")
continue}if(t[n].constructor!==Array){console.warn("Expected array<"+i+"> value for '"+n+"' in '"+e+"' data, got "+typeof t[n])
continue}for(s=[],o=0;o<t[n].length;o++)r=new Newgrounds.io.model[i](this),r.fromObject(t[n][o]),s.push(r)
t[n]=s}else if("undefined"!=typeof l[n].object&&t[n]){if(i=l[n].object,"undefined"==typeof Newgrounds.io.model[i]){console.warn("Received unsupported model '"+i+"' from '"+e+"'.")
continue}r=new Newgrounds.io.model[i](this),r.fromObject(t[n]),t[n]=r}}else console.warn("Newgrounds.io server failed to return expected '"+n+"' in '"+e+"' data.")
return t},_doCall:function(e,t,r){function n(e){var t=Newgrounds.io.call_validators.getValidator(e.component)
if(t.hasOwnProperty("redirect")&&t.redirect){var r=e.parameters
if(!r||!r.hasOwnProperty("redirect")||r.redirect)return!0}return!1}if(!this.app_id)throw new Error("Attempted to call Newgrounds.io server without setting an app_id in Newgrounds.io.core instance.")
var o,s=!1
if(e.constructor===Array)for(o=[],i=0;i<e.length;i++){if(n(e[i]))throw new Error("Loader components can not be called in an array without a redirect=false parameter.")
o.push(e[i].toObject())}else o=e.toObject(),s=n(e)
var u={app_id:this.app_id,session_id:this.session_id,call:o}
if(this.debug&&(u.debug=1),s){var l=({success:!0,app_id:this.app_id,result:{component:e.component,data:{success:!0}}},document.createElement("form"))
l.action=Newgrounds.io.GATEWAY_URI,l.target="_blank",l.method="POST"
var a=document.createElement("input")
a.type="hidden",a.name="input",l.appendChild(a),document.body.appendChild(l),a.value=JSON.stringify(u),l.submit(),document.body.removeChild(l)}else{var c=new XMLHttpRequest,d=this
c.onreadystatechange=function(){if(4==c.readyState){var n
try{n=JSON.parse(c.responseText).result}catch(o){}d._doCallback(e,t,n,r)}}
var p=new FormData,_="undefined"!=typeof Array.prototype.toJSON?Array.prototype.toJSON:null
_&&delete Array.prototype.toJSON,p.append("input",JSON.stringify(u)),_&&(Array.prototype.toJSON=_),c.open("POST",Newgrounds.io.GATEWAY_URI,!0),c.send(p)}},_doValidateCall:function(e,t){var r,n,o,s,i=Newgrounds.io.call_validators.getValidator(e)
if(!i)throw new Error("'"+e+"' is not a valid server component.")
if(i.require_session&&!this.session_id)throw new Error("'"+e+"' requires a session id")
if(i["import"]&&i["import"].length>0)for(r=0;r<i["import"].length;r++)n=i["import"][r].split("."),this._doValidateCall(n[0],n[1],t)
var u
for(o in i.params)if(s=i.params[o],u=t&&"undefined"!=typeof t[o]?t[o]:null,!u&&s.extract_from&&s.extract_from.alias&&(u=t[s.extract_from.alias]),null!==u){if(s.extract_from&&u.constructor===Newgrounds.io.model[s.extract_from.object]&&(u=u[s.extract_from.property]),!Newgrounds.io.model.checkStrictValue(null,o,u,s.type,null,null,null))throw new Error("Illegal value for '"+o+"' parameter of '"+e+"': "+u)}else if(s.required)throw new Error("Missing required parameter for '"+e+"': "+o)},_validateCall:function(e){var t
if(e.constructor===Array){var r=[]
for(t=0;t<e.length;t++)r.push(this._validateCall(e[t]))
return r}if(e.constructor!==Newgrounds.io.model.call)throw new Error("Unexpected 'call_model' value. Expected Newgrounds.io.model.call instance.")
var n=e.component,o=e.parameters,s=e.echo
if(o&&o.constructor===Array)for(t=0;t<o.length;t++)this._doValidateCall(n,o[t])
else this._doValidateCall(n,o)
var i={component:e.component},u=Newgrounds.io.call_validators.getValidator(e.component)
if("undefined"!=typeof o)if(u.secure){var l=this._encryptCall(e)
i.secure=l.secure}else i.parameters=o
return"undefined"!=typeof s&&(i.echo=s),i}},Newgrounds.io.core.prototype.constructor=Newgrounds.io.core,Newgrounds.io.core.instance_id=0,Newgrounds.io.core.getNextInstanceID=function(){return Newgrounds.io.core.instance_id++,Newgrounds.io.core.instance_id},Newgrounds.io.urlHelper=function(){var e=window.location.href,t={},r=e.split("?").pop()
if(r)for(var n,o=r.split("&"),s=0;s<o.length;s++)n=o[s].split("="),t[n[0]]=n[1]
this.getRequestQueryParam=function(e,r){return"undefined"==typeof r&&(r=null),"undefined"==typeof t[e]?r:t[e]}},Newgrounds.io.model.call=function(e,t){var r,n,o,s
this.__property_names=["component","echo","parameters","secure"],this.__classname="Newgrounds.io.model.call",this.__ngio=e
var r
Object.defineProperty(this,"component",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"component",e,String,null,null,null),r=e}})
var n
Object.defineProperty(this,"echo",{get:function(){return"undefined"==typeof n?null:n},set:function(e){n=e}})
var o
Object.defineProperty(this,"parameters",{get:function(){return"undefined"==typeof o?null:o},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"parameters",e,Object,null,Object,null),o=e}})
var s
Object.defineProperty(this,"secure",{get:function(){return"undefined"==typeof s?null:s},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"secure",e,String,null,null,null),s=e}}),t&&this.fromObject(t)},Newgrounds.io.model.call.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.call.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.call.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],this[this.__property_names[r]]=t},Newgrounds.io.model.call.prototype.constructor=Newgrounds.io.model.call,Newgrounds.io.model.debug=function(e,t){var r,n
this.__property_names=["exec_time","input"],this.__classname="Newgrounds.io.model.debug",this.__ngio=e
var r
Object.defineProperty(this,"exec_time",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"exec_time",e,String,null,null,null),r=e}})
var n
Object.defineProperty(this,"input",{get:function(){return"undefined"==typeof n?null:n},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"input",e,null,"input",null,null),n=e}}),t&&this.fromObject(t)},Newgrounds.io.model.debug.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.debug.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.debug.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],"input"==this.__property_names[r]&&t&&(t=new Newgrounds.io.model.input(this.__ngio,t)),this[this.__property_names[r]]=t},Newgrounds.io.model.debug.prototype.constructor=Newgrounds.io.model.debug,Newgrounds.io.model.error=function(e,t){var r,n
this.__property_names=["code","message"],this.__classname="Newgrounds.io.model.error",this.__ngio=e
var r
Object.defineProperty(this,"code",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"code",e,Number,null,null,null),r=e}})
var n
Object.defineProperty(this,"message",{get:function(){return"undefined"==typeof n?null:n},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"message",e,String,null,null,null),n=e}}),t&&this.fromObject(t)},Newgrounds.io.model.error.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.error.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.error.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],this[this.__property_names[r]]=t},Newgrounds.io.model.error.get=function(e,t){var r=new Newgrounds.io.model.error
return r.message=e?e:"Unknown Error",r.code=t?t:0,r},Newgrounds.io.model.error.MISSING_INPUT=100,Newgrounds.io.model.error.INVALID_INPUT=101,Newgrounds.io.model.error.MISSING_PARAMETER=102,Newgrounds.io.model.error.INVALID_PARAMETER=103,Newgrounds.io.model.error.EXPIRED_SESSION=104,Newgrounds.io.model.error.DUPLICATE_SESSION=105,Newgrounds.io.model.error.MAX_CONNECTIONS_EXCEEDED=106,Newgrounds.io.model.error.MAX_CALLS_EXCEEDED=107,Newgrounds.io.model.error.MEMORY_EXCEEDED=108,Newgrounds.io.model.error.TIMED_OUT=109,Newgrounds.io.model.error.LOGIN_REQUIRED=110,Newgrounds.io.model.error.INVALID_APP_ID=200,Newgrounds.io.model.error.INVALID_ENCRYPTION=201,Newgrounds.io.model.error.INVALID_MEDAL_ID=202,Newgrounds.io.model.error.INVALID_SCOREBOARD_ID=203,Newgrounds.io.model.error.INVALID_SAVEGROUP_ID=204,Newgrounds.io.model.error.SERVER_UNAVAILABLE=504,Newgrounds.io.model.error.prototype.constructor=Newgrounds.io.model.error,Newgrounds.io.model.input=function(e,t){var r,n,o,s,i
this.__property_names=["app_id","call","debug","echo","session_id"],this.__classname="Newgrounds.io.model.input",this.__ngio=e
var r
Object.defineProperty(this,"app_id",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"app_id",e,String,null,null,null),r=e}})
var n
Object.defineProperty(this,"call",{get:function(){return"undefined"==typeof n?null:n},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"call",e,null,"call",null,"call"),n=e}})
var o
Object.defineProperty(this,"debug",{get:function(){return"undefined"==typeof o?null:o},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"debug",e,Boolean,null,null,null),o=e}})
var s
Object.defineProperty(this,"echo",{get:function(){return"undefined"==typeof s?null:s},set:function(e){s=e}})
var i
Object.defineProperty(this,"session_id",{get:function(){return"undefined"==typeof i?null:i},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"session_id",e,String,null,null,null),i=e}}),t&&this.fromObject(t)},Newgrounds.io.model.input.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.input.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.input.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],"call"==this.__property_names[r]&&t&&(t=new Newgrounds.io.model.call(this.__ngio,t)),this[this.__property_names[r]]=t},Newgrounds.io.model.input.prototype.constructor=Newgrounds.io.model.input,Newgrounds.io.model.medal=function(e,t){var r,n,o,s,i,u,l,a
this.__property_names=["description","difficulty","icon","id","name","secret","unlocked","value"],this.__classname="Newgrounds.io.model.medal",this.__ngio=e
var r
Object.defineProperty(this,"description",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"description",e,String,null,null,null),r=e}})
var n
Object.defineProperty(this,"difficulty",{get:function(){return"undefined"==typeof n?null:n},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"difficulty",e,Number,null,null,null),n=e}})
var o
Object.defineProperty(this,"icon",{get:function(){return"undefined"==typeof o?null:o},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"icon",e,String,null,null,null),o=e}})
var s
Object.defineProperty(this,"id",{get:function(){return"undefined"==typeof s?null:s},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"id",e,Number,null,null,null),s=e}})
var i
Object.defineProperty(this,"name",{get:function(){return"undefined"==typeof i?null:i},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"name",e,String,null,null,null),i=e}})
var u
Object.defineProperty(this,"secret",{get:function(){return"undefined"==typeof u?null:u},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"secret",e,Boolean,null,null,null),u=e}})
var l
Object.defineProperty(this,"unlocked",{get:function(){return"undefined"==typeof l?null:l},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"unlocked",e,Boolean,null,null,null),l=e}})
var a
Object.defineProperty(this,"value",{get:function(){return"undefined"==typeof a?null:a},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"value",e,Number,null,null,null),a=e}}),t&&this.fromObject(t)},Newgrounds.io.model.medal.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.medal.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.medal.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],this[this.__property_names[r]]=t},Newgrounds.io.model.medal.prototype.unlock=function(e){if(this._has_ngio_user())this.__ngio.callComponent("Medal.unlock",{id:this.id},function(t){t.success&&(this.unlocked=!0),e(t)})
else if("function"==typeof e){var t=Newgrounds.io.model.error.get("This function requires a valid user session.",Newgrounds.io.model.error.LOGIN_REQUIRED),r={success:!1,error:t}
e(r)}},Newgrounds.io.model.medal.prototype.constructor=Newgrounds.io.model.medal,Newgrounds.io.model.output=function(e,t){var r,n,o,s,i,u,l,a
this.__property_names=["api_version","app_id","debug","echo","error","help_url","result","success"],this.__classname="Newgrounds.io.model.output",this.__ngio=e
var r
Object.defineProperty(this,"api_version",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"api_version",e,String,null,null,null),r=e}})
var n
Object.defineProperty(this,"app_id",{get:function(){return"undefined"==typeof n?null:n},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"app_id",e,String,null,null,null),n=e}})
var o
Object.defineProperty(this,"debug",{get:function(){return"undefined"==typeof o?null:o},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"debug",e,null,"debug",null,null),o=e}})
var s
Object.defineProperty(this,"echo",{get:function(){return"undefined"==typeof s?null:s},set:function(e){s=e}})
var i
Object.defineProperty(this,"error",{get:function(){return"undefined"==typeof i?null:i},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"error",e,null,"error",null,null),i=e}})
var u
Object.defineProperty(this,"help_url",{get:function(){return"undefined"==typeof u?null:u},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"help_url",e,String,null,null,null),u=e}})
var l
Object.defineProperty(this,"result",{get:function(){return"undefined"==typeof l?null:l},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"result",e,null,"result",null,"result"),l=e}})
var a
Object.defineProperty(this,"success",{get:function(){return"undefined"==typeof a?null:a},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"success",e,Boolean,null,null,null),a=e}}),t&&this.fromObject(t)},Newgrounds.io.model.output.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.output.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.output.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],"debug"==this.__property_names[r]&&t?t=new Newgrounds.io.model.debug(this.__ngio,t):"error"==this.__property_names[r]&&t?t=new Newgrounds.io.model.error(this.__ngio,t):"result"==this.__property_names[r]&&t&&(t=new Newgrounds.io.model.result(this.__ngio,t)),this[this.__property_names[r]]=t},Newgrounds.io.model.output.prototype.constructor=Newgrounds.io.model.output,Newgrounds.io.model.result=function(e,t){var r,n,o
this.__property_names=["component","data","echo"],this.__classname="Newgrounds.io.model.result",this.__ngio=e
var r
Object.defineProperty(this,"component",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"component",e,String,null,null,null),r=e}})
var n
Object.defineProperty(this,"data",{get:function(){return"undefined"==typeof n?null:n},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"data",e,Object,null,Object,null),n=e}})
var o
Object.defineProperty(this,"echo",{get:function(){return"undefined"==typeof o?null:o},set:function(e){o=e}}),t&&this.fromObject(t)},Newgrounds.io.model.result.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.result.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.result.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],this[this.__property_names[r]]=t},Newgrounds.io.model.result.prototype.constructor=Newgrounds.io.model.result,Newgrounds.io.model.score=function(e,t){var r,n,o,s
this.__property_names=["formatted_value","tag","user","value"],this.__classname="Newgrounds.io.model.score",this.__ngio=e
var r
Object.defineProperty(this,"formatted_value",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"formatted_value",e,String,null,null,null),r=e}})
var n
Object.defineProperty(this,"tag",{get:function(){return"undefined"==typeof n?null:n},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"tag",e,String,null,null,null),n=e}})
var o
Object.defineProperty(this,"user",{get:function(){return"undefined"==typeof o?null:o},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"user",e,null,"user",null,null),o=e}})
var s
Object.defineProperty(this,"value",{get:function(){return"undefined"==typeof s?null:s},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"value",e,Number,null,null,null),s=e}}),t&&this.fromObject(t)},Newgrounds.io.model.score.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.score.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.score.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],"user"==this.__property_names[r]&&t&&(t=new Newgrounds.io.model.user(this.__ngio,t)),this[this.__property_names[r]]=t},Newgrounds.io.model.score.prototype.constructor=Newgrounds.io.model.score,Newgrounds.io.model.scoreboard=function(e,t){var r,n
this.__property_names=["id","name"],this.__classname="Newgrounds.io.model.scoreboard",this.__ngio=e
var r
Object.defineProperty(this,"id",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"id",e,Number,null,null,null),r=e}})
var n
Object.defineProperty(this,"name",{get:function(){return"undefined"==typeof n?null:n},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"name",e,String,null,null,null),n=e}}),t&&this.fromObject(t)},Newgrounds.io.model.scoreboard.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.scoreboard.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.scoreboard.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],this[this.__property_names[r]]=t},Newgrounds.io.model.scoreboard.prototype.postScore=function(e,t,r){if("function"!=typeof t||r||(r=t,t=null),t||(t=null),this._has_ngio_user())this.__ngio.callComponent("ScoreBoard.postScore",{id:this.id,value:e,tag:t},function(e){r(e)})
else if("function"==typeof r){var n=Newgrounds.io.model.error.get("This function requires a valid user session.",Newgrounds.io.model.error.LOGIN_REQUIRED),o={success:!1,error:n}
r(o)}},Newgrounds.io.model.scoreboard.prototype.constructor=Newgrounds.io.model.scoreboard,Newgrounds.io.model.session=function(e,t){var r,n,o,s,i
this.__property_names=["expired","id","passport_url","remember","user"],this.__classname="Newgrounds.io.model.session",this.__ngio=e
var r
Object.defineProperty(this,"expired",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"expired",e,Boolean,null,null,null),r=e}})
var n
Object.defineProperty(this,"id",{get:function(){return"undefined"==typeof n?null:n},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"id",e,String,null,null,null),n=e}})
var o
Object.defineProperty(this,"passport_url",{get:function(){return"undefined"==typeof o?null:o},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"passport_url",e,String,null,null,null),o=e}})
var s
Object.defineProperty(this,"remember",{get:function(){return"undefined"==typeof s?null:s},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"remember",e,Boolean,null,null,null),s=e}})
var i
Object.defineProperty(this,"user",{get:function(){return"undefined"==typeof i?null:i},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"user",e,null,"user",null,null),i=e}}),t&&this.fromObject(t)},Newgrounds.io.model.session.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.session.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.session.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],"user"==this.__property_names[r]&&t&&(t=new Newgrounds.io.model.user(this.__ngio,t)),this[this.__property_names[r]]=t},Newgrounds.io.model.session.prototype.constructor=Newgrounds.io.model.session,Newgrounds.io.model.user=function(e,t){var r,n,o,s
this.__property_names=["icons","id","name","supporter"],this.__classname="Newgrounds.io.model.user",this.__ngio=e
var r
Object.defineProperty(this,"icons",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"icons",e,null,"usericons",null,null),r=e}})
var n
Object.defineProperty(this,"id",{get:function(){return"undefined"==typeof n?null:n},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"id",e,Number,null,null,null),n=e}})
var o
Object.defineProperty(this,"name",{get:function(){return"undefined"==typeof o?null:o},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"name",e,String,null,null,null),o=e}})
var s
Object.defineProperty(this,"supporter",{get:function(){return"undefined"==typeof s?null:s},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"supporter",e,Boolean,null,null,null),s=e}}),t&&this.fromObject(t)},Newgrounds.io.model.user.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.user.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.user.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],"icons"==this.__property_names[r]&&t&&(t=new Newgrounds.io.model.usericons(this.__ngio,t)),this[this.__property_names[r]]=t},Newgrounds.io.model.user.prototype.constructor=Newgrounds.io.model.user,Newgrounds.io.model.usericons=function(e,t){var r,n,o
this.__property_names=["large","medium","small"],this.__classname="Newgrounds.io.model.usericons",this.__ngio=e
var r
Object.defineProperty(this,"large",{get:function(){return"undefined"==typeof r?null:r},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"large",e,String,null,null,null),r=e}})
var n
Object.defineProperty(this,"medium",{get:function(){return"undefined"==typeof n?null:n},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"medium",e,String,null,null,null),n=e}})
var o
Object.defineProperty(this,"small",{get:function(){return"undefined"==typeof o?null:o},set:function(e){Newgrounds.io.model.checkStrictValue(this.__classname,"small",e,String,null,null,null),o=e}}),t&&this.fromObject(t)},Newgrounds.io.model.usericons.prototype._has_ngio_user=function(){return this.__ngio&&this.__ngio.user},Newgrounds.io.model.usericons.prototype.toObject=function(){for(var e={},t=0;t<this.__property_names.length;t++)"undefined"!=typeof this[this.__property_names[t]]&&(e[this.__property_names[t]]=this[this.__property_names[t]])
return e},Newgrounds.io.model.usericons.prototype.fromObject=function(e){for(var t,r=0;r<this.__property_names.length;r++)t=e[this.__property_names[r]],this[this.__property_names[r]]=t},Newgrounds.io.model.usericons.prototype.constructor=Newgrounds.io.model.usericons,Newgrounds.io.call_validators.getValidator=function(e){var t=e.split("."),r=t[0],n=t[1],o=Newgrounds.io.call_validators[r]&&Newgrounds.io.call_validators[r][n]?Newgrounds.io.call_validators[r][n]:null
return o},Newgrounds.io.call_validators.App={checkSession:{require_session:!0,secure:!1,redirect:!1,"import":!1,params:{},returns:{session:{object:"session",description:null}}},endSession:{require_session:!0,secure:!1,redirect:!1,"import":!1,params:{},returns:{}},getCurrentVersion:{require_session:!1,secure:!1,redirect:!1,"import":!1,params:{version:{type:String,extract_from:null,required:null,description:'The version number (in "X.Y.Z" format) of the client-side app. (default = "0.0.0")'}},returns:{}},getHostLicense:{require_session:!1,secure:!1,redirect:!1,"import":!1,params:{host:{type:String,extract_from:null,required:null,description:"The host domain to check (ei, somesite.com)."}},returns:{}},logView:{require_session:!1,secure:!1,redirect:!1,"import":!1,params:{host:{type:String,extract_from:null,required:!0,description:'The domain hosting your app. Examples: "www.somesite.com", "localHost"'}},returns:{}},startSession:{require_session:!1,secure:!1,redirect:!1,"import":!1,params:{force:{type:Boolean,extract_from:null,required:null,description:"If true, will create a new session even if the user already has an existing one.\n\nNote: Any previous session ids will no longer be valid if this is used."}},returns:{session:{object:"session",description:null}}}},Newgrounds.io.call_validators.Event={logEvent:{require_session:!1,secure:!1,redirect:!1,"import":!1,params:{event_name:{type:String,extract_from:null,required:!0,description:"The name of your custom event as defined in your Referrals & Events settings."},host:{type:String,extract_from:null,required:!0,description:'The domain hosting your app. Example: "newgrounds.com", "localHost"'}},returns:{}}},Newgrounds.io.call_validators.Gateway={getDatetime:{require_session:!1,secure:!1,redirect:!1,"import":!1,params:{},returns:{}},getVersion:{require_session:!1,secure:!1,redirect:!1,"import":!1,params:{},returns:{}},ping:{require_session:!1,secure:!1,redirect:!1,"import":!1,params:{},returns:{}}},Newgrounds.io.call_validators.Loader={loadAuthorUrl:{require_session:!1,secure:!1,redirect:!0,"import":!1,params:{host:{type:String,extract_from:null,required:!0,description:'The domain hosting your app. Example: "www.somesite.com", "localHost"'},redirect:{type:Boolean,extract_from:null,required:!1,description:"Set this to false to get a JSON response containing the URL instead of doing an actual redirect."}},returns:{}},loadMoreGames:{require_session:!1,secure:!1,redirect:!0,"import":!1,params:{host:{type:String,extract_from:null,required:!0,description:'The domain hosting your app. Example: "www.somesite.com", "localHost"'},redirect:{type:Boolean,extract_from:null,required:!1,description:"Set this to false to get a JSON response containing the URL instead of doing an actual redirect."}},returns:{}},loadNewgrounds:{require_session:!1,secure:!1,redirect:!0,"import":!1,params:{host:{type:String,extract_from:null,required:!0,description:'The domain hosting your app. Example: "www.somesite.com", "localHost"'},redirect:{type:Boolean,extract_from:null,required:!1,description:"Set this to false to get a JSON response containing the URL instead of doing an actual redirect."}},returns:{}},loadOfficialUrl:{require_session:!1,secure:!1,redirect:!0,"import":!1,params:{host:{type:String,extract_from:null,required:!0,description:'The domain hosting your app. Example: "www.somesite.com", "localHost"'},redirect:{type:Boolean,extract_from:null,required:!1,description:"Set this to false to get a JSON response containing the URL instead of doing an actual redirect."}},returns:{}},loadReferral:{require_session:!1,secure:!1,redirect:!0,"import":!1,params:{host:{type:String,extract_from:null,required:!0,description:'The domain hosting your app. Example: "www.somesite.com", "localHost"'},redirect:{type:Boolean,extract_from:null,required:!1,description:"Set this to false to get a JSON response containing the URL instead of doing an actual redirect."},referral_name:{type:String,extract_from:null,required:!0,description:'The name of the referral (as defined in your "Referrals & Events" settings).'}},returns:{}}},Newgrounds.io.call_validators.Medal={getList:{require_session:!1,secure:!1,redirect:!1,"import":!1,params:{},returns:{medals:{array:{object:"medal"},description:"An array of medal objects."}}},unlock:{require_session:!0,secure:!0,redirect:!1,"import":!1,params:{id:{type:Number,extract_from:{object:"medal",alias:"medal",property:"id"},required:!0,description:"The numeric ID of the medal to unlock."}},returns:{medal:{object:"medal",description:"The #medal that was unlocked."}}}},Newgrounds.io.call_validators.ScoreBoard={getBoards:{require_session:!1,secure:!1,redirect:!1,"import":!1,params:{},returns:{scoreboards:{array:{object:"scoreboard"},description:"An array of #scoreboard objects."}}},getScores:{require_session:!1,secure:!1,redirect:!1,"import":!1,params:{id:{type:Number,extract_from:{object:"scoreboard",alias:"scoreboard",property:"id"},required:!0,description:"The numeric ID of the scoreboard."},limit:{type:Number,extract_from:null,required:null,description:"An integer indicating the number of scores to include in the list. Default = 10."},period:{type:String,extract_from:null,required:null,description:"The time-frame to pull scores from (see notes for acceptable values)."},skip:{type:Number,extract_from:null,required:null,description:"An integer indicating the number of scores to skip before starting the list. Default = 0."},social:{type:Boolean,extract_from:null,required:null,description:"If set to true, only social scores will be loaded (scores by the user and their friends). This param will be ignored if there is no valid session id and the 'user' param is absent."},tag:{type:String,extract_from:null,required:null,description:"A tag to filter results by."},user:{type:"mixed",extract_from:null,required:null,description:"A user's ID or name.  If 'social' is true, this user and their friends will be included. Otherwise, only scores for this user will be loaded. If this param is missing and there is a valid session id, that user will be used by default."}},returns:{scoreboard:{object:"scoreboard",description:"The #scoreboard being queried."},scores:{array:{object:"score"},description:"An array of #score objects."},user:{object:"user",description:"The #user the score list is associated with (either as defined in the 'user' param, or extracted from the current session when 'social' is set to true)"}}},postScore:{require_session:!0,secure:!0,redirect:!1,"import":!1,params:{id:{type:Number,extract_from:{object:"scoreboard",alias:"scoreboard",property:"id"},required:!0,description:"The numeric ID of the scoreboard."},tag:{type:String,extract_from:null,required:null,description:"An optional tag that can be used to filter scores via ScoreBoard.getScores"},value:{type:Number,extract_from:null,required:!0,description:"The int value of the score."}},returns:{score:{object:"score",description:"The #score that was posted to the board."},scoreboard:{object:"scoreboard",description:"The #scoreboard that was posted to."}}}},Newgrounds.io.SessionLoader=function(e){if(!e||e.constructor!==Newgrounds.io.core)throw new Error("'ngio' must be a 'Newgrounds.io.core' instance.")
this.__ngio=e
var t=null
Object.defineProperty(this,"session",{set:function(e){if(e&&!e.constructor===Newgrounds.io.model.session)throw new Error("'session' must be a 'Newgrounds.io.model.session' instance.")
t=e},get:function(){return t}})},Newgrounds.io.SessionLoader.prototype={_event_listeners:{},last_error:null,passport_window:null,addEventListener:Newgrounds.io.events.EventDispatcher.prototype.addEventListener,removeEventListener:Newgrounds.io.events.EventDispatcher.prototype.removeEventListener,removeAllEventListeners:Newgrounds.io.events.EventDispatcher.prototype.removeAllEventListeners,dispatchEvent:Newgrounds.io.events.EventDispatcher.prototype.dispatchEvent,getValidSession:function(e,t){var r=this
r.checkSession(function(n){!n||n.expired?r.startSession(e,t):e.call(t,n)})},startSession:function(e,t){var r=new Newgrounds.io.events.SessionEvent,n=this
this.__ngio.callComponent("App.startSession",function(o){o.success&&o.session?(r.type=Newgrounds.io.events.SessionEvent.REQUEST_LOGIN,r.passport_url=o.session.passport_url,n.session=o.session):(o.error?n.last_error=o.error:(n.last_error=new Newgrounds.io.model.error,n.last_error.message="Unexpected Error"),r.type=Newgrounds.io.events.SessionEvent.SESSION_EXPIRED,n.session=null),n.__ngio.session_id=n.session?n.session.id:null,n.dispatchEvent(r),e&&e.constructor===Function&&e.call(t,n.session)})},checkSession:function(e,t){var r=new Newgrounds.io.events.SessionEvent,n=this
n.session&&n.session.user?(r.type=Newgrounds.io.events.SessionEvent.USER_LOADED,r.user=n.session.user,n.dispatchEvent(r),e&&e.constructor===Function&&e.call(t,n.session)):this.__ngio.session_id?this.__ngio.callComponent("App.checkSession",function(o){o.success&&o.session&&!o.session.expired?o.session.user?(r.type=Newgrounds.io.events.SessionEvent.USER_LOADED,r.user=o.session.user,n.session=o.session):(r.type=Newgrounds.io.events.SessionEvent.REQUEST_LOGIN,r.passport_url=o.session.passport_url,n.session=o.session):(r.type=Newgrounds.io.events.SessionEvent.SESSION_EXPIRED,n.session=null,o.error?n.last_error=o.error:(n.last_error=new Newgrounds.io.model.error,o.session&&o.session.expired?n.last_error.message="Session is Expired":n.last_error.message="Unexpected Error")),n.__ngio.session_id=n.session?n.session.id:null,n.dispatchEvent(r),e&&e.constructor===Function&&e.call(t,n.session)}):(r.type=Newgrounds.io.events.SessionEvent.SESSION_EXPIRED,n.session=null,n.dispatchEvent(r),e&&e.constructor===Function&&e.call(t,null))},endSession:function(e,t){var r=this,n=this.__ngio
this.__ngio.callComponent("App.endSession",function(o){r.session=null,n.session_id=null
var s=new Newgrounds.io.events.SessionEvent(Newgrounds.io.events.SessionEvent.SESSION_EXPIRED)
r.dispatchEvent(s),e&&e.constructor===Function&&e.call(t,r.session)}),this.__ngio.session_id=null,this.session=null},loadPassport:function(e){return"string"!=typeof e&&(e="_blank"),this.session&&this.session.passport_url?(this.passport_window=window.open(this.session.passport_url,e),this.passport_window||console.warn("Unable to detect passport window. Pop-up blockers will prevent loading Newgrounds Passport if loadPassport() or requestLogin() are not called from within a mouse click handler."),this.passportOpen()):(console.warn("Attempted to open Newgrounds Passport without a valid passport_url. Be sure you have called getValidSession() first!."),!1)},closePassport:function(){return this.passport_window?(this.passport_window.close(),this.passportOpen()):!1},passportOpen:function(){return this.passport_window&&this.passport_window.parent?!0:!1}},Newgrounds.io.SessionLoader.prototype.constructor=Newgrounds.io.SessionLoader
var CryptoJS=CryptoJS||function(e,t){var r={},n=r.lib={},o=function(){},s=n.Base={extend:function(e){o.prototype=this
var t=new o
return e&&t.mixIn(e),t.hasOwnProperty("init")||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend()
return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t])
e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},i=n.WordArray=s.extend({init:function(e,r){e=this.words=e||[],this.sigBytes=r!=t?r:4*e.length},toString:function(e){return(e||l).stringify(this)},concat:function(e){var t=this.words,r=e.words,n=this.sigBytes
if(e=e.sigBytes,this.clamp(),n%4)for(var o=0;e>o;o++)t[n+o>>>2]|=(r[o>>>2]>>>24-8*(o%4)&255)<<24-8*((n+o)%4)
else if(65535<r.length)for(o=0;e>o;o+=4)t[n+o>>>2]=r[o>>>2]
else t.push.apply(t,r)
return this.sigBytes+=e,this},clamp:function(){var t=this.words,r=this.sigBytes
t[r>>>2]&=4294967295<<32-8*(r%4),t.length=e.ceil(r/4)},clone:function(){var e=s.clone.call(this)
return e.words=this.words.slice(0),e},random:function(t){for(var r=[],n=0;t>n;n+=4)r.push(4294967296*e.random()|0)
return new i.init(r,t)}}),u=r.enc={},l=u.Hex={stringify:function(e){var t=e.words
e=e.sigBytes
for(var r=[],n=0;e>n;n++){var o=t[n>>>2]>>>24-8*(n%4)&255
r.push((o>>>4).toString(16)),r.push((15&o).toString(16))}return r.join("")},parse:function(e){for(var t=e.length,r=[],n=0;t>n;n+=2)r[n>>>3]|=parseInt(e.substr(n,2),16)<<24-4*(n%8)
return new i.init(r,t/2)}},a=u.Latin1={stringify:function(e){var t=e.words
e=e.sigBytes
for(var r=[],n=0;e>n;n++)r.push(String.fromCharCode(t[n>>>2]>>>24-8*(n%4)&255))
return r.join("")},parse:function(e){for(var t=e.length,r=[],n=0;t>n;n++)r[n>>>2]|=(255&e.charCodeAt(n))<<24-8*(n%4)
return new i.init(r,t)}},c=u.Utf8={stringify:function(e){try{return decodeURIComponent(escape(a.stringify(e)))}catch(t){throw Error("Malformed UTF-8 data")}},parse:function(e){return a.parse(unescape(encodeURIComponent(e)))}},d=n.BufferedBlockAlgorithm=s.extend({reset:function(){this._data=new i.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=c.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(t){var r=this._data,n=r.words,o=r.sigBytes,s=this.blockSize,u=o/(4*s),u=t?e.ceil(u):e.max((0|u)-this._minBufferSize,0)
if(t=u*s,o=e.min(4*t,o),t){for(var l=0;t>l;l+=s)this._doProcessBlock(n,l)
l=n.splice(0,t),r.sigBytes-=o}return new i.init(l,o)},clone:function(){var e=s.clone.call(this)
return e._data=this._data.clone(),e},_minBufferSize:0})
n.Hasher=d.extend({cfg:s.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){d.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(t,r){return new e.init(r).finalize(t)}},_createHmacHelper:function(e){return function(t,r){return new p.HMAC.init(e,r).finalize(t)}}})
var p=r.algo={}
return r}(Math)
!function(){var e=CryptoJS,t=e.lib.WordArray
e.enc.Base64={stringify:function(e){var t=e.words,r=e.sigBytes,n=this._map
e.clamp(),e=[]
for(var o=0;r>o;o+=3)for(var s=(t[o>>>2]>>>24-8*(o%4)&255)<<16|(t[o+1>>>2]>>>24-8*((o+1)%4)&255)<<8|t[o+2>>>2]>>>24-8*((o+2)%4)&255,i=0;4>i&&r>o+.75*i;i++)e.push(n.charAt(s>>>6*(3-i)&63))
if(t=n.charAt(64))for(;e.length%4;)e.push(t)
return e.join("")},parse:function(e){var r=e.length,n=this._map,o=n.charAt(64)
o&&(o=e.indexOf(o),-1!=o&&(r=o))
for(var o=[],s=0,i=0;r>i;i++)if(i%4){var u=n.indexOf(e.charAt(i-1))<<2*(i%4),l=n.indexOf(e.charAt(i))>>>6-2*(i%4)
o[s>>>2]|=(u|l)<<24-8*(s%4),s++}return t.create(o,s)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),function(e){function t(e,t,r,n,o,s,i){return e=e+(t&r|~t&n)+o+i,(e<<s|e>>>32-s)+t}function r(e,t,r,n,o,s,i){return e=e+(t&n|r&~n)+o+i,(e<<s|e>>>32-s)+t}function n(e,t,r,n,o,s,i){return e=e+(t^r^n)+o+i,(e<<s|e>>>32-s)+t}function o(e,t,r,n,o,s,i){return e=e+(r^(t|~n))+o+i,(e<<s|e>>>32-s)+t}for(var s=CryptoJS,i=s.lib,u=i.WordArray,l=i.Hasher,i=s.algo,a=[],c=0;64>c;c++)a[c]=4294967296*e.abs(e.sin(c+1))|0
i=i.MD5=l.extend({_doReset:function(){this._hash=new u.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(e,s){for(var i=0;16>i;i++){var u=s+i,l=e[u]
e[u]=16711935&(l<<8|l>>>24)|4278255360&(l<<24|l>>>8)}var i=this._hash.words,u=e[s+0],l=e[s+1],c=e[s+2],d=e[s+3],p=e[s+4],_=e[s+5],f=e[s+6],h=e[s+7],m=e[s+8],g=e[s+9],y=e[s+10],v=e[s+11],w=e[s+12],N=e[s+13],S=e[s+14],b=e[s+15],E=i[0],O=i[1],k=i[2],j=i[3],E=t(E,O,k,j,u,7,a[0]),j=t(j,E,O,k,l,12,a[1]),k=t(k,j,E,O,c,17,a[2]),O=t(O,k,j,E,d,22,a[3]),E=t(E,O,k,j,p,7,a[4]),j=t(j,E,O,k,_,12,a[5]),k=t(k,j,E,O,f,17,a[6]),O=t(O,k,j,E,h,22,a[7]),E=t(E,O,k,j,m,7,a[8]),j=t(j,E,O,k,g,12,a[9]),k=t(k,j,E,O,y,17,a[10]),O=t(O,k,j,E,v,22,a[11]),E=t(E,O,k,j,w,7,a[12]),j=t(j,E,O,k,N,12,a[13]),k=t(k,j,E,O,S,17,a[14]),O=t(O,k,j,E,b,22,a[15]),E=r(E,O,k,j,l,5,a[16]),j=r(j,E,O,k,f,9,a[17]),k=r(k,j,E,O,v,14,a[18]),O=r(O,k,j,E,u,20,a[19]),E=r(E,O,k,j,_,5,a[20]),j=r(j,E,O,k,y,9,a[21]),k=r(k,j,E,O,b,14,a[22]),O=r(O,k,j,E,p,20,a[23]),E=r(E,O,k,j,g,5,a[24]),j=r(j,E,O,k,S,9,a[25]),k=r(k,j,E,O,d,14,a[26]),O=r(O,k,j,E,m,20,a[27]),E=r(E,O,k,j,N,5,a[28]),j=r(j,E,O,k,c,9,a[29]),k=r(k,j,E,O,h,14,a[30]),O=r(O,k,j,E,w,20,a[31]),E=n(E,O,k,j,_,4,a[32]),j=n(j,E,O,k,m,11,a[33]),k=n(k,j,E,O,v,16,a[34]),O=n(O,k,j,E,S,23,a[35]),E=n(E,O,k,j,l,4,a[36]),j=n(j,E,O,k,p,11,a[37]),k=n(k,j,E,O,h,16,a[38]),O=n(O,k,j,E,y,23,a[39]),E=n(E,O,k,j,N,4,a[40]),j=n(j,E,O,k,u,11,a[41]),k=n(k,j,E,O,d,16,a[42]),O=n(O,k,j,E,f,23,a[43]),E=n(E,O,k,j,g,4,a[44]),j=n(j,E,O,k,w,11,a[45]),k=n(k,j,E,O,b,16,a[46]),O=n(O,k,j,E,c,23,a[47]),E=o(E,O,k,j,u,6,a[48]),j=o(j,E,O,k,h,10,a[49]),k=o(k,j,E,O,S,15,a[50]),O=o(O,k,j,E,_,21,a[51]),E=o(E,O,k,j,w,6,a[52]),j=o(j,E,O,k,d,10,a[53]),k=o(k,j,E,O,y,15,a[54]),O=o(O,k,j,E,l,21,a[55]),E=o(E,O,k,j,m,6,a[56]),j=o(j,E,O,k,b,10,a[57]),k=o(k,j,E,O,f,15,a[58]),O=o(O,k,j,E,N,21,a[59]),E=o(E,O,k,j,p,6,a[60]),j=o(j,E,O,k,v,10,a[61]),k=o(k,j,E,O,c,15,a[62]),O=o(O,k,j,E,g,21,a[63])
i[0]=i[0]+E|0,i[1]=i[1]+O|0,i[2]=i[2]+k|0,i[3]=i[3]+j|0},_doFinalize:function(){var t=this._data,r=t.words,n=8*this._nDataBytes,o=8*t.sigBytes
r[o>>>5]|=128<<24-o%32
var s=e.floor(n/4294967296)
for(r[(o+64>>>9<<4)+15]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),r[(o+64>>>9<<4)+14]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8),t.sigBytes=4*(r.length+1),this._process(),t=this._hash,r=t.words,n=0;4>n;n++)o=r[n],r[n]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8)
return t},clone:function(){var e=l.clone.call(this)
return e._hash=this._hash.clone(),e}}),s.MD5=l._createHelper(i),s.HmacMD5=l._createHmacHelper(i)}(Math),function(){var e=CryptoJS,t=e.lib,r=t.Base,n=t.WordArray,t=e.algo,o=t.EvpKDF=r.extend({cfg:r.extend({keySize:4,hasher:t.MD5,iterations:1}),init:function(e){this.cfg=this.cfg.extend(e)},compute:function(e,t){for(var r=this.cfg,o=r.hasher.create(),s=n.create(),i=s.words,u=r.keySize,r=r.iterations;i.length<u;){l&&o.update(l)
var l=o.update(e).finalize(t)
o.reset()
for(var a=1;r>a;a++)l=o.finalize(l),o.reset()
s.concat(l)}return s.sigBytes=4*u,s}})
e.EvpKDF=function(e,t,r){return o.create(r).compute(e,t)}}(),CryptoJS.lib.Cipher||function(e){var t=CryptoJS,r=t.lib,n=r.Base,o=r.WordArray,s=r.BufferedBlockAlgorithm,i=t.enc.Base64,u=t.algo.EvpKDF,l=r.Cipher=s.extend({cfg:n.extend(),createEncryptor:function(e,t){return this.create(this._ENC_XFORM_MODE,e,t)},createDecryptor:function(e,t){return this.create(this._DEC_XFORM_MODE,e,t)},init:function(e,t,r){this.cfg=this.cfg.extend(r),this._xformMode=e,this._key=t,this.reset()},reset:function(){s.reset.call(this),this._doReset()},process:function(e){return this._append(e),this._process()},finalize:function(e){return e&&this._append(e),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(t,r,n){return("string"==typeof r?f:_).encrypt(e,t,r,n)},decrypt:function(t,r,n){return("string"==typeof r?f:_).decrypt(e,t,r,n)}}}})
r.StreamCipher=l.extend({_doFinalize:function(){return this._process(!0)},blockSize:1})
var a=t.mode={},c=function(t,r,n){var o=this._iv
o?this._iv=e:o=this._prevBlock
for(var s=0;n>s;s++)t[r+s]^=o[s]},d=(r.BlockCipherMode=n.extend({createEncryptor:function(e,t){return this.Encryptor.create(e,t)},createDecryptor:function(e,t){return this.Decryptor.create(e,t)},init:function(e,t){this._cipher=e,this._iv=t}})).extend()
d.Encryptor=d.extend({processBlock:function(e,t){var r=this._cipher,n=r.blockSize
c.call(this,e,t,n),r.encryptBlock(e,t),this._prevBlock=e.slice(t,t+n)}}),d.Decryptor=d.extend({processBlock:function(e,t){var r=this._cipher,n=r.blockSize,o=e.slice(t,t+n)
r.decryptBlock(e,t),c.call(this,e,t,n),this._prevBlock=o}}),a=a.CBC=d,d=(t.pad={}).Pkcs7={pad:function(e,t){for(var r=4*t,r=r-e.sigBytes%r,n=r<<24|r<<16|r<<8|r,s=[],i=0;r>i;i+=4)s.push(n)
r=o.create(s,r),e.concat(r)},unpad:function(e){e.sigBytes-=255&e.words[e.sigBytes-1>>>2]}},r.BlockCipher=l.extend({cfg:l.cfg.extend({mode:a,padding:d}),reset:function(){l.reset.call(this)
var e=this.cfg,t=e.iv,e=e.mode
if(this._xformMode==this._ENC_XFORM_MODE)var r=e.createEncryptor
else r=e.createDecryptor,this._minBufferSize=1
this._mode=r.call(e,this,t&&t.words)},_doProcessBlock:function(e,t){this._mode.processBlock(e,t)},_doFinalize:function(){var e=this.cfg.padding
if(this._xformMode==this._ENC_XFORM_MODE){e.pad(this._data,this.blockSize)
var t=this._process(!0)}else t=this._process(!0),e.unpad(t)
return t},blockSize:4})
var p=r.CipherParams=n.extend({init:function(e){this.mixIn(e)},toString:function(e){return(e||this.formatter).stringify(this)}}),a=(t.format={}).OpenSSL={stringify:function(e){var t=e.ciphertext
return e=e.salt,(e?o.create([1398893684,1701076831]).concat(e).concat(t):t).toString(i)},parse:function(e){e=i.parse(e)
var t=e.words
if(1398893684==t[0]&&1701076831==t[1]){var r=o.create(t.slice(2,4))
t.splice(0,4),e.sigBytes-=16}return p.create({ciphertext:e,salt:r})}},_=r.SerializableCipher=n.extend({cfg:n.extend({format:a}),encrypt:function(e,t,r,n){n=this.cfg.extend(n)
var o=e.createEncryptor(r,n)
return t=o.finalize(t),o=o.cfg,p.create({ciphertext:t,key:r,iv:o.iv,algorithm:e,mode:o.mode,padding:o.padding,blockSize:e.blockSize,formatter:n.format})},decrypt:function(e,t,r,n){return n=this.cfg.extend(n),t=this._parse(t,n.format),e.createDecryptor(r,n).finalize(t.ciphertext)},_parse:function(e,t){return"string"==typeof e?t.parse(e,this):e}}),t=(t.kdf={}).OpenSSL={execute:function(e,t,r,n){return n||(n=o.random(8)),e=u.create({keySize:t+r}).compute(e,n),r=o.create(e.words.slice(t),4*r),e.sigBytes=4*t,p.create({key:e,iv:r,salt:n})}},f=r.PasswordBasedCipher=_.extend({cfg:_.cfg.extend({kdf:t}),encrypt:function(e,t,r,n){return n=this.cfg.extend(n),r=n.kdf.execute(r,e.keySize,e.ivSize),n.iv=r.iv,e=_.encrypt.call(this,e,t,r.key,n),e.mixIn(r),e},decrypt:function(e,t,r,n){return n=this.cfg.extend(n),t=this._parse(t,n.format),r=n.kdf.execute(r,e.keySize,e.ivSize,t.salt),n.iv=r.iv,_.decrypt.call(this,e,t,r.key,n)}})}(),function(){for(var e=CryptoJS,t=e.lib.BlockCipher,r=e.algo,n=[],o=[],s=[],i=[],u=[],l=[],a=[],c=[],d=[],p=[],_=[],f=0;256>f;f++)_[f]=128>f?f<<1:f<<1^283
for(var h=0,m=0,f=0;256>f;f++){var g=m^m<<1^m<<2^m<<3^m<<4,g=g>>>8^255&g^99
n[h]=g,o[g]=h
var y=_[h],v=_[y],w=_[v],N=257*_[g]^16843008*g
s[h]=N<<24|N>>>8,i[h]=N<<16|N>>>16,u[h]=N<<8|N>>>24,l[h]=N,N=16843009*w^65537*v^257*y^16843008*h,a[g]=N<<24|N>>>8,c[g]=N<<16|N>>>16,d[g]=N<<8|N>>>24,p[g]=N,h?(h=y^_[_[_[w^y]]],m^=_[_[m]]):h=m=1}var S=[0,1,2,4,8,16,32,64,128,27,54],r=r.AES=t.extend({_doReset:function(){for(var e=this._key,t=e.words,r=e.sigBytes/4,e=4*((this._nRounds=r+6)+1),o=this._keySchedule=[],s=0;e>s;s++)if(r>s)o[s]=t[s]
else{var i=o[s-1]
s%r?r>6&&4==s%r&&(i=n[i>>>24]<<24|n[i>>>16&255]<<16|n[i>>>8&255]<<8|n[255&i]):(i=i<<8|i>>>24,i=n[i>>>24]<<24|n[i>>>16&255]<<16|n[i>>>8&255]<<8|n[255&i],i^=S[s/r|0]<<24),o[s]=o[s-r]^i}for(t=this._invKeySchedule=[],r=0;e>r;r++)s=e-r,i=r%4?o[s]:o[s-4],t[r]=4>r||4>=s?i:a[n[i>>>24]]^c[n[i>>>16&255]]^d[n[i>>>8&255]]^p[n[255&i]]},encryptBlock:function(e,t){this._doCryptBlock(e,t,this._keySchedule,s,i,u,l,n)},decryptBlock:function(e,t){var r=e[t+1]
e[t+1]=e[t+3],e[t+3]=r,this._doCryptBlock(e,t,this._invKeySchedule,a,c,d,p,o),r=e[t+1],e[t+1]=e[t+3],e[t+3]=r},_doCryptBlock:function(e,t,r,n,o,s,i,u){for(var l=this._nRounds,a=e[t]^r[0],c=e[t+1]^r[1],d=e[t+2]^r[2],p=e[t+3]^r[3],_=4,f=1;l>f;f++)var h=n[a>>>24]^o[c>>>16&255]^s[d>>>8&255]^i[255&p]^r[_++],m=n[c>>>24]^o[d>>>16&255]^s[p>>>8&255]^i[255&a]^r[_++],g=n[d>>>24]^o[p>>>16&255]^s[a>>>8&255]^i[255&c]^r[_++],p=n[p>>>24]^o[a>>>16&255]^s[c>>>8&255]^i[255&d]^r[_++],a=h,c=m,d=g
h=(u[a>>>24]<<24|u[c>>>16&255]<<16|u[d>>>8&255]<<8|u[255&p])^r[_++],m=(u[c>>>24]<<24|u[d>>>16&255]<<16|u[p>>>8&255]<<8|u[255&a])^r[_++],g=(u[d>>>24]<<24|u[p>>>16&255]<<16|u[a>>>8&255]<<8|u[255&c])^r[_++],p=(u[p>>>24]<<24|u[a>>>16&255]<<16|u[c>>>8&255]<<8|u[255&d])^r[_++],e[t]=h,e[t+1]=m,e[t+2]=g,e[t+3]=p},keySize:8})
e.AES=t._createHelper(r)}();
window._newgrounds = {
    Newgrounds
};
};
gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded.userFunc0x2689860(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded.func = function(runtimeScene, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
},
  _behaviorNamesMap: {
},
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded.eventsList0(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded.registeredGdjsCallbacks = [];
gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded.registeredGdjsCallbacks.push((runtimeScene) => {
    gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded.func(runtimeScene, runtimeScene);
})
gdjs.registerFirstRuntimeSceneLoadedCallback(gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded.registeredGdjsCallbacks[gdjs.evtsExt__NewgroundsAPI__onFirstSceneLoaded.registeredGdjsCallbacks.length - 1]);
