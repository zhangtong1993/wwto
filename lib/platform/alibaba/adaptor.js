function getInstance(){var e=my;function t(e,t={}){let n={};for(let s in e){n[t.hasOwnProperty(s)?t[s]:s]=e[s]}return n}e.has_ali_hook_flag=!0;let n={};["getStorageSync","setStorageSync","removeStorageSync"].forEach(t=>{n[t]=e[t],e[t]=((e,s)=>{let o={};"string"==typeof e?(o.key=e,s&&(o.data=s)):o=e;let c=n[t](o).data;return"getStorageSync"===t&&(c=c||""),c})});const s=e.getStorage;e.getStorage=function(e){let t=e.success;e.success=function(n){n.data?t(n):e.fail({errMsg:"getStorage:fail data not found"})},s.call(this,e)},e.request=function(n){n.headers=n.header||n.headers||{},n.headers.referer="",n.headers["content-type"]=n.headers["content-type"]||"application/json";let s=n.success||emptyFn;return n.success=function(e){s.call(this,t(e,{headers:"header",status:"statusCode"}))},e.httpRequest(n)},e.setNavigationBarTitle=e.setNavigationBar,e.setNavigationBarColor=e.setNavigationBar,e.login=(t=>{let n={success:t.success,fail:t.fail,complete:t.complete};return t.success=function(e){e.code=e.authCode,delete e.authCode,n.success&&n.success(e)},e.getAuthCode(t)});const o=e.getAuthUserInfo;e.getUserInfo=(e=>{let t={success:e.success,fail:e.fail,complete:e.complete};return e.success=function(e){let n={};for(let t in e)n["avatar"===t?"avatarUrl":t]=e[t];t.success&&t.success({userInfo:n})},o(e)}),e.showShareMenu=e.showShareMenu||(e=>{});const c=e.createSelectorQuery;e.createSelectorQuery=function(){let e=c.apply(this,arguments);return e.in=function(){return e},e};const a=e.connectSocket;e.connectSocket=function(){return setTimeout(()=>{a.apply(this,arguments)},100),{send:function(){e.sendSocketMessage.apply(this,arguments)},close:function(){e.closeSocket.apply(this,arguments)},onOpen:function(t){e.onSocketOpen(t)},onClose:function(t){e.onSocketClose(t)},onError:function(t){e.onSocketError(t)},onMessage:function(t){e.onSocketMessage(t)}}},e.showModal=e.showModal||function(n){let s=t(n),o=s.showCancel;void 0===o&&(o=!0),o?(s.confirmButtonText=s.confirmText,s.cancelButtonText=s.cancelText):s.buttonText=s.confirmText,e[o?"confirm":"alert"](s)};const r=e.showToast;e.showToast=function(e){r.call(this,t(e,{title:"content",icon:"type"}))};const i=e.previewImage;e.previewImage=function(e){let n=t(e),s=n.current;s&&(s=e.urls.indexOf(s)),-1!==s&&s||(s=0),n.current=s,i.call(this,n)};const u=e.makePhoneCall;e.makePhoneCall=function(e){u.call(this,t(e,{phoneNumber:"number"}))};const l=e.getSystemInfo;e.getSystemInfo=function(e){let t=e.success||emptyFn;e.success=function(e){e.system=e.platform+" "+e.system,e.windowHeight||(e.windowHeight=parseInt(e.screenHeight*e.windowWidth/e.screenWidth,10)-40),t(e)},l.call(this,e)};const f=e.showActionSheet;e.showActionSheet=function(e){let n=t(e,{itemList:"items"}),s=n.success||emptyFn,o=n.fail||emptyFn;n.success=function({index:e}){-1===e?o({errMsg:"showActionSheet:fail cancel"}):s({tapIndex:e})},f.call(this,n)};const h=e.tradePay;return e.requestPayment=function(e){let n=t(e,{alipay_trade_body:"orderStr"}),s=n.success||emptyFn,o=n.fail||emptyFn;n.success=function(e){9e3===e.resultCode?s():o()},h.call(this,n)},e}export default getInstance();