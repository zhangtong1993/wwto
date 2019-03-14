function getInstance() {
  var wx = swan;
  wx['has_baidu_hook_flag'] = true;

  const getStorageSync = swan['getStorageSync'];
  wx['getStorageSync'] = (key) => {
    const val = getStorageSync(key);
    if (val === 'undefined') {
      return '';
    }
    return val;
  };

  const request = wx.request;
  wx.request = (opt) => {
    // 方法名必须大写
    if (opt.method) {
      opt.method = opt.method.toUpperCase();
    }

    // post请求会将数据序列化，字符串序列化会前后多一个双引号导致后端接口异常
    // TOO 还需要对返回结果处理
    if (opt.method === 'POST' && typeof opt.data === 'string') {
      opt.header = opt.header || {};
      opt.header['content-type'] = 'application/x-www-form-urlencoded';
    }

    // 默认按text解析！
    if (!opt.responseType) {
      opt.responseType = 'json';
    }

    // 处理requestTask对象字段缺失
    let requestTask = request.call(this,opt) ? request.call(this,opt):{};
    requestTask["abort"] = (()=>{});
    requestTask["offHeadersReceived"] = (()=>{});
    requestTask["onHeadersReceived"] = (()=>{});
    return requestTask;
  };

  const createAnimation = wx.createAnimation;
  wx.createAnimation = function() {
    let animation = createAnimation.call(this, arguments);

    // 处理option字段缺失的问题
    if (!animation.option) {
      animation.option = {
        transformOrigin: animation.transformOrigin,
        transition: {
          delay: animation.delay,
          duration: animation.duration,
          timingFunction: animation.timingFunction
        }
      };
    }

    // 处理step方法链式调用BUG
    let step = animation.__proto__.step;
    animation.__proto__.step = function() {
      return step.apply(this, arguments) || this;
    };

    return animation;
  };

  // 画布导出为图片
  // const canvasToTempFilePath = wx.canvasToTempFilePath;
  // wx.canvasToTempFilePath = function(opt, self) {
  //   const success = opt.success;
  //   opt.success = function(res) {
  //     if (res) {
  //       res.tempFilePath = res.tempFilePath || res.tempImagePath;
  //     }
  //     success(res);
  //   };
  //   canvasToTempFilePath.call(this, opt, self);
  // };

  // 上传
  const uploadFile = wx.uploadFile;
  wx.uploadFile = function(opt){
    let uploadTasks = uploadFile.call(this,opt);
    // 处理uploadTask对象字段abort、offHeadersReceived缺失问题(百度文档写的有问题)
    uploadTasks["abort"] = uploadTasks["abort"] || (()=>{});
    uploadTasks["offHeadersReceived"] = (()=>{});
    uploadTasks["offProgressUpdate"] = (()=>{});
    uploadTasks["onHeadersReceived"] = (()=>{});
    uploadTasks["onProgressUpdate"] = uploadTasks["onProgressUpdate"] || (()=>{});

    return uploadTasks;
  };

  // wx.downloadFile; 此api参数中百度无filePath(指定文件下载后存储的路径)
  const downloadFile = wx.downloadFile;
  wx.downloadFile = function(opt){
    let downloadTasks = downloadFile.call(this,opt);
    // 处理downloadTask对象字段abort、offHeadersReceived缺失问题(百度文档写的有问题)
    downloadTasks["offHeadersReceived"] = (()=>{});
    downloadTasks["abort"]= downloadTasks["abort"] || (()=>{});
    downloadTasks["offProgressUpdate"] = (()=>{});
    downloadTasks["onHeadersReceived"] = (()=>{});
    downloadTasks["onProgressUpdate"] = downloadTasks["onProgressUpdate"] || (()=>{});
    return downloadTasks;
  };

  // websocket

  // wx.connectSocket = wx.connectSocket;  此api百度中无参数tcpNoDelay
  // wx.onSocketOpen = wx.onSocketOpen
  // wx.onSocketError = wx.onSocketError
  // wx.onSocketMessage = wx.onSocketMessage
  // wx.closeSocket = wx.closeSocket
  // wx.onSocketClose = wx.onSocketClose
  // wx.sendSocketMessage = wx.sendSocketMessage

  // mDNS
  wx.stopLocalServiceDiscovery = wx.stopLocalServiceDiscovery || ((opt)=>{});
  wx.startLocalServiceDiscovery = wx.startLocalServiceDiscovery || ((opt)=>{});
  wx.onLocalServiceResolveFail = wx.onLocalServiceResolveFail || ((opt)=>{});
  wx.onLocalServiceLost = wx.onLocalServiceLost || ((opt)=>{});
  wx.onLocalServiceFound = wx.onLocalServiceFound || ((opt)=>{});
  wx.onLocalServiceDiscoveryStop = wx.onLocalServiceDiscoveryStop || ((opt)=>{});
  wx.offLocalServiceResolveFail = wx.offLocalServiceResolveFail || ((opt)=>{});
  wx.offLocalServiceLost = wx.offLocalServiceLost || ((opt)=>{});
  wx.offLocalServiceFound = wx.offLocalServiceFound || ((opt)=>{});
  wx.offLocalServiceDiscoveryStop = wx.offLocalServiceDiscoveryStop || ((opt)=>{});

  // 媒体
  // 图片
  // wx.chooseImage = wx.chooseImage
  // wx.previewImage = wx.previewImage
  // wx.getImageInfo = wx.getImageInfo
  // wx.saveImageToPhotosAlbum = wx.saveImageToPhotosAlbum
  wx.chooseMessageFile = wx.chooseMessageFile || ((opt) => {});
  wx.compressImage = wx.compressImage || ((opt)=>{});

  // 录音
  wx.stopRecord = wx.stopRecord || ((opt)=>{});
  wx.startRecord = wx.startRecord || ((opt)=>{});
  const recorderManager = wx.getRecorderManager;
  wx.getRecorderManager = function(opt){
    let recorderManagers = recorderManager.call(this,opt);
    // 处理recorderManager对象字段缺失问题
    recorderManagers["onFrameRecorded"] = (()=>{});
    recorderManagers["onInterruptionBegin"] = (()=>{});
    recorderManagers["onInterruptionEnd"] = (()=>{});
    recorderManagers["onResume"] = (()=>{});
    // recorderManager.start百度中无frameSize,audioSource两个参数,且采样率和码率有效值微信和百度不一样,具体可参考api进行传值
    return recorderManagers;
  };


  // 背景音频
  wx.stopBackgroundAudio = wx.stopBackgroundAudio || ((opt)=>{});
  wx.seekBackgroundAudio = wx.seekBackgroundAudio || ((opt)=>{});
  wx.playBackgroundAudio = wx.playBackgroundAudio || ((opt)=>{});
  wx.pauseBackgroundAudio = wx.pauseBackgroundAudio || ((opt)=>{});
  wx.onBackgroundAudioStop = wx.onBackgroundAudioStop || ((opt)=>{});
  wx.onBackgroundAudioPlay = wx.onBackgroundAudioPlay || ((opt)=>{});
  wx.onBackgroundAudioPause = wx.onBackgroundAudioPause || ((opt)=>{});
  wx.getBackgroundAudioPlayerState = wx.getBackgroundAudioPlayerState || ((opt)=>{});
  const getBackgroundAudioManager = wx.getBackgroundAudioManager;
  wx.getBackgroundAudioManager = function(opt){
    let getBackgroundAudioManagers = getBackgroundAudioManager.call(this,opt);
    // 处理getBackgroundAudioManagers对象字段(包括属性和方法)缺失问题
    getBackgroundAudioManagers["webUrl"] = '';
    getBackgroundAudioManagers["protocol"] = '';
    getBackgroundAudioManagers["buffered"] = 0;
    getBackgroundAudioManagers["onNext"] = (()=>{});
    getBackgroundAudioManagers["onPrev"] = (()=>{});
    getBackgroundAudioManagers["onSeeking"] = (()=>{});
    getBackgroundAudioManagers["onSeeked"] = (()=>{});
    return getBackgroundAudioManagers;
  };

  // 音频
  wx.stopVoice = wx.stopVoice || ((opt)=>{});
  wx.playVoice = wx.playVoice || ((opt)=>{});
  wx.pauseVoice = wx.pauseVoice || ((opt)=>{});
  wx.getAvailableAudioSources = wx.getAvailableAudioSources || ((opt)=>{});
  wx.createAudioContext = wx.createAudioContext || ((opt)=>{
    return{
      seek: (()=>{}),
      setSrc: (()=>{}),
      pause: (()=>{}),
      play: (()=>{})
    }
  });
  // wx.setInnerAudioOption = wx.setInnerAudioOption // obeyMuteSwitch字段在baidu中缺失
  const innerAudioContext = wx.createInnerAudioContext;
  wx.createInnerAudioContext = function(opt){
    let innerAudioContexts = innerAudioContext.call(this,opt);
    // 处理innerAudioContext对象字段(buffered)缺失问题
    innerAudioContext["buffered"] =  0;
    return innerAudioContexts;
  };

  // 视频
  // wx.chooseVideo = wx.chooseVideo // camera字段在baidu中缺失,success回调返回值微信中有thumbTempFilePath、和errMsg字段(文档未说明)
  // wx.saveVideoToPhotosAlbum = wx.saveVideoToPhotosAlbum
  const videoContext = wx.createVideoContext;
  wx.createVideoContext = function(opt){
    let videoContexts = videoContext.call(this,opt);
    // 处理videoContexts对象字段缺失问题
    videoContexts["playbackRate"] = (()=>{});
    videoContexts["stop"] = (()=>{});
    videoContexts["exitFullScreen"] = videoContexts["exitFullScreen"] || (()=>{});
    videoContexts["hideStatusBar"] = videoContexts["hideStatusBar"] || (()=>{});
    videoContexts["play"] = videoContexts["play"] || (()=>{});
    videoContexts["requestFullScreen"] = videoContexts["requestFullScreen"] || (()=>{});
    videoContexts["seek"] = videoContexts["seek"] || (()=>{});
    videoContexts["sendDanmu"] = videoContexts["sendDanmu"] || (()=>{});
    videoContexts["showStatusBar"] = videoContexts["showStatusBar"] || (()=>{});
    videoContexts["pause"] = videoContexts["pause"] || (()=>{});
    // videoContext.requestFullScreen 进入全屏百度中无direction参数
    // 百度videoContexts对象中无方法(api文档有问题)
    return videoContexts;
  };

  // 实时音视频
  // wx.createLivePlayerContext = wx.createLivePlayerContext
  wx.createLivePusherContext = wx.createLivePusherContext || ((opt)=>{
    return{
      pause: (()=>{}),
      pauseBGM: (()=>{}),
      playBGM: (()=>{}),
      resume: (()=>{}),
      resumeBGM: (()=>{}),
      setBGMVolume: (()=>{}),
      snapshot: (()=>{}),
      start: (()=>{}),
      stop: (()=>{}),
      stopBGM: (()=>{}),
      switchCamera: (()=>{}),
      toggleTorch: (()=>{})
    }
  });

  // 相机组件控制
  // wx.createCameraContext = wx.createCameraContext
  // const cameraContext = wx.createCameraContext;
  // cameraContext.startRecord 百度中无此timeoutCallback参数

  // 文件
  const saveFile = wx.saveFile;
  wx.saveFile = function(opt){
    const success = opt.success;
    opt.success = function(res) {
      if (res) {
        // 处理成功回调参数savedFilePath类型
        res.savedFilePath = res.savedFilePath.toString();
      }
      success(res);
    };
    return saveFile.call(this, opt);
  };
  // wx.getSavedFileList = wx.getSavedFileList // 微信success返回值中有errMsg
  // wx.getSavedFileInfo = wx.getSavedFileInfo // 百度success返回值有message、status字段
  // wx.removeSavedFile = wx.removeSavedFile
  // wx.openDocument = wx.openDocument
  // wx.getFileInfo = wx.getFileInfo
  wx.getFileSystemManager = wx.getFileSystemManager || ((opt)=>{
    return {
      access: (()=>{}),
      accessSync: (()=>{}),
      appendFile: (()=>{}),
      appendFileSync: (()=>{}),
      copyFile: (()=>{}),
      copyFileSync: (()=>{}),
      getFileInfo:(()=>{}),
      getSavedFileList:(()=>{}),
      mkdir:(()=>{}),
      mkdirSync:(()=>{}),
      readdir:(()=>{}),
      readdirSync:(()=>{}),
      readFile:(()=>{}),
      readFileSync:(()=>{}),
      removeSavedFile:(()=>{}),
      rename:(()=>{}),
      renameSync:(()=>{}),
      rmdir:(()=>{}),
      rmdirSync:(()=>{}),
      saveFile:(()=>{}),
      saveFileSync:(()=>{}),
      stat:(()=>{}),
      statSync:(()=>{}),
      unlink:(()=>{}),
      unlinkSync:(()=>{}),
      unzip:(()=>{}),
      writeFile:(()=>{}),
      writeFileSync:(()=>{})
    }
  });

  // 数据存储
  // wx.setStorage = wx.setStorage
  // wx.setStorageSync = wx.setStorageSync // 此api百度中参数data类型和小程序不完全一样，但无影响
  // wx.getStorage = wx.getStorage
  // wx.getStorageSync = wx.getStorageSync
  // wx.getStorageInfo = wx.getStorageInfo
  // wx.getStorageInfoSync = wx.getStorageInfoSync
  // wx.removeStorage = wx.removeStorage
  // wx.removeStorageSync = wx.removeStorageSync
  // wx.clearStorage = wx.clearStorage
  // wx.clearStorageSync() = wx.clearStorageSync()

  // 位置
  // wx.getLocation = wx.getLocation
  // wx.getLocation中回调参数,百度中有以下参数,微信中没有
  // street、cityCode、city、province、streetNumber、district、country

  // wx.chooseLocation = wx.chooseLocation
  const openLocation = wx.openLocation;
  wx.openLocation = (opt)=>{
    // 处理参数latitude、longitude、scale类型百度和小程序不一样问题
    opt.latitude = parseFloat(opt.latitude);
    opt.longitude = parseFloat(opt.longitude);
    opt.scale = parseInt(opt.scale);
    return openLocation(opt);
  };
  // const mapContext = wx.createMapContext;
  // mapContext.translateMarker百度api文档中无success,complete参数
  // mapContext.includePoints百度api文档中无success,file,complete参数

  // 界面
  // wx.canvasGetImageData = wx.canvasGetImageData;
  // wx.canvasPutImageData = wx.canvasPutImageData
  // wx.canvasToTempFilePath = wx.canvasToTempFilePath
  const createCanvasContext = wx.createCanvasContext;
  wx.createCanvasContext = function(opt){
    let canvasContext = createCanvasContext.call(this, opt);
    // 处理canvasContext对象某些字段更新
    canvasContext["lineCap"] = canvasContext.setLineCap;
    canvasContext["lineJoin"] = canvasContext.setLineJoin;
    canvasContext["lineDashOffset"] = canvasContext.setLineDash;
    canvasContext["miterLimit"] = canvasContext.setMiterLimit;
    //微信中canvasContext.setShadow从基础库 1.9.90 开始，接口停止维护，
    //请使用 CanvasContext.shadowOffsetX|CanvasContext.shadowOffsetY|CanvasContext.shadowColor|CanvasContext.shadowBlur 代替
    //这些是属性,不是方法
    return canvasContext;
  };
  // wx.showToast = wx.showToast
  // wx.showLoading = wx.showLoading
  // wx.hideToast = wx.hideToast // 百度中没有填写success,fail，complate回调,但是有
  // wx.hideLoading = wx.hideLoading // 百度中没有填写success,fail，complate回调,但是有
  // wx.showModal = wx.showModal
  // wx.showActionSheet = wx.showActionSheet 参数itemColor的默认值不同
  // wx.setNavigationBarTitle = wx.setNavigationBarTitle
  // wx.showNavigationBarLoading = wx.showNavigationBarLoading // 百度中没有填写success,fail，complate回调,但是有
  // wx.hideNavigationBarLoading = wx.hideNavigationBarLoading // 百度中没有填写success,fail，complate回调,但是有
  // wx.setNavigationBarColor = wx.setNavigationBarColor
  // wx.setTabBarBadge = wx.setTabBarBadge
  // wx.removeTabBarBadge = wx.removeTabBarBadge
  // wx.showTabBarRedDot = wx.showTabBarRedDot
  // wx.hideTabBarRedDot = wx.hideTabBarRedDot
  // wx.setTabBarStyle = wx.setTabBarStyle
  // wx.setTabBarItem = wx.setTabBarItem
  // wx.showTabBar = wx.showTabBar
  // wx.hideTabBar = wx.hideTabBar
  // wx.navigateTo = wx.navigateTo
  // wx.redirectTo = wx.redirectTo
  // wx.switchTab = wx.switchTab
  // wx.navigateBack = wx.navigateBack
  // wx.reLaunch = wx.reLaunch

  const animation = wx.createAnimation;
  wx.createAnimation = function (opt) {
    let animations = animation.call(this, opt);
    // 处理animation对象中无export、step字段
    animations["export"] = (()=>{});
    animations["step"] = (()=>{});
    return animations;
  };
  // wx.pageScrollTo = wx.pageScrollTo
  // wx.setBackgroundColor = wx.setBackgroundColor
  // wx.setBackgroundTextStyle = wx.setBackgroundTextStyle
  // wx.startPullDownRefresh = wx.startPullDownRefresh
  // wx.stopPullDownRefresh = wx.stopPullDownRefresh // 百度中没有填写success,fail，complate回调,但是有
  // wx.nextTick = wx.nextTick

  //节点信息

  // wx.createIntersectionObserver = wx.createIntersectionObserver
  // wx.createSelectorQuery = wx.createSelectorQuery;
  // selectorQuery调用方法的返回对象nodesRef.fields方法参数中，微信中有context字段，百度中无此字段
  const createSelectorQuery = wx.createSelectorQuery;
  wx.createSelectorQuery = function(opt){
    let createSelectorQuerys = createSelectorQuery.call(this,opt);

    let exec = createSelectorQuerys.exec;
    let select = createSelectorQuerys.select;
    let selectAll = createSelectorQuerys.selectAll;
    let selectViewport = createSelectorQuerys.selectViewport;
    // 处理NodesRef对象字段context方法缺失问题
    createSelectorQuerys.exec = function(fn){
      let f = fn;
      return exec.call(this,function(res){
        f({context: res.context || (()=>{})})
      })
    };
    createSelectorQuerys.select = function(){
      return select.call(this,function(res){
        if(res){
          res.content = res.context || (()=>{})
        }
      })
    };
    createSelectorQuerys.selectAll = function(){
      return selectAll.call(this,function(res){
        if(res){
          res.content = res.context || (()=>{})
        }
      })
    };
    createSelectorQuerys.selectViewport = function(){
      return selectViewport.call(this,function(res){
        if(res){
          res.content = res.context || (()=>{})
        }
      })
    };

    return createSelectorQuerys;
  };

  wx.loadFontFace = wx.loadFontFace || ((opt)=>{}); // 字体
  wx.setTopBarText = wx.setTopBarText || ((opt)=>{});
  wx.getMenuButtonBoundingClientRect = wx.getMenuButtonBoundingClientRect || ((opt)=>{});
  wx.onWindowResize = wx.onWindowResize || ((opt)=>{});
  wx.offWindowResize = wx.offWindowResize || ((opt)=>{});

  // 设备

  // 系统信息
  // wx.getSystemInfo = wx.getSystemInfo;
  // wx.getSystemInfoSync = wx.getSystemInfoSync;

  // 系统信息api返回值微信中有以下字段，百度没有
  // benchmarkLevel、albumAuthorized、locationAuthorized、microphoneAuthorized、notificationAuthorized、notificationAlertAuthorized
  // notificationBadgeAuthorized、notificationSoundAuthorized、bluetoothEnabled、locationEnabled、wifiEnabled、cameraAuthorized

  // wx.canIUse = wx.canIUse
  // wx.onMemoryWarning = wx.onMemoryWarning
  // wx.getNetworkType = wx.getNetworkType
  // wx.onNetworkStatusChange = wx.onNetworkStatusChange
  // wx.onAccelerometerChange = wx.onAccelerometerChange
  // wx.startAcceleromete = wx.startAcceleromete
  // wx.stopAccelerometer = wx.stopAccelerometer

  //  罗盘
  const onCompassChange= wx.onCompassChange;
  wx.onCompassChange = function(fn){
    let f = fn;
    // 处理回调返回值字段accuracy缺失问题
    return onCompassChange.call(this,function(res){
      f({direction:res.direction,accuracy:res.accuracy || ""});
    });
  };
  // wx.startCompass = wx.startCompass
  // wx.stopCompass = wx.stopCompass

  //扫码
  const scanCode = wx.scanCode;
  wx.scanCode = function(opt){
    const success = opt.success;
    opt.success = function(res){
      // 处理success回调字段缺失
      if(res){
        res["path"] = '';
        res['rawData'] = '';
      }
      success(res);
    };
    return scanCode.call(this,opt);
  };

  // 屏幕亮度
  // wx.setScreenBrightness = wx.setScreenBrightness
  // wx.getScreenBrightnes = wx.getScreenBrightnes
  // wx.setKeepScreenOn = wx.setKeepScreenOn
  // wx.onUserCaptureScreen = wx.onUserCaptureScreen
  // 振动
  // wx.vibrateShort = wx.vibrateShort
  // wx.vibrateLong = wx.vibrateLong
  // 手机联系人
  // wx.addPhoneContact = wx.addPhoneContact
  // wx.makePhoneCall = wx.makePhoneCall
  // 剪贴板
  // wx.setClipboardData = wx.setClipboardData
  // wx.getClipboardData = wx.getClipboardData

  // 陀螺仪
  wx.onGyroscopeChange = wx.onGyroscopeChange || ((opt)=>{});
  wx.stopGyroscope = wx.stopGyroscope || ((opt)=>{});
  wx.startGyroscope = wx.startGyroscope || ((opt)=>{});
  // 设备方向
  wx.onDeviceMotionChange = wx.onDeviceMotionChange || ((opt)=>{});
  wx.startDeviceMotionListening = wx.startDeviceMotionListening || ((opt)=>{});
  wx.stopDeviceMotionListening = wx.stopDeviceMotionListening || ((opt)=>{});
  // NFC
  wx.stopHCE = wx.stopHCE || ((opt)=>{});
  wx.startHCE = wx.startHCE || ((opt)=>{});
  wx.sendHCEMessage = wx.sendHCEMessage || ((opt)=>{});
  wx.onHCEMessage = wx.onHCEMessage || ((opt)=>{});
  wx.getHCEState = wx.getHCEState || ((opt)=>{});
  // 电量
  wx.getBatteryInfoSync = wx.getBatteryInfoSync || ((opt)=>{});
  wx.getBatteryInfo = wx.getBatteryInfo || ((opt)=>{});
  // 蓝牙
  wx.stopBluetoothDevicesDiscovery = wx.stopBluetoothDevicesDiscovery || ((opt)=>{});
  wx.startBluetoothDevicesDiscovery = wx.startBluetoothDevicesDiscovery || ((opt)=>{});
  wx.openBluetoothAdapte = wx.openBluetoothAdapte || ((opt)=>{});
  wx.onBluetoothDeviceFound = wx.onBluetoothDeviceFound || ((opt)=>{});
  wx.onBluetoothAdapterStateChange = wx.onBluetoothAdapterStateChange || ((opt)=>{});
  wx.getConnectedBluetoothDevices = wx.getConnectedBluetoothDevices || ((opt)=>{});
  wx.getBluetoothDevices = wx.getBluetoothDevices|| ((opt)=>{});
  wx.getBluetoothAdapterState = wx.getBluetoothAdapterState || ((opt)=>{});
  wx.closeBluetoothAdapter = wx.closeBluetoothAdapter || ((opt)=>{});
  // 低功耗蓝牙
  wx.readBLECharacteristicValue = wx.readBLECharacteristicValue || ((opt)=>{});
  wx.onBLEConnectionStateChange = wx.onBLEConnectionStateChange || ((opt)=>{});
  wx.onBLECharacteristicValueChange = wx.onBLECharacteristicValueChange || ((opt)=>{});
  wx.notifyBLECharacteristicValueChange = wx.notifyBLECharacteristicValueChange || ((opt)=>{});
  wx.getBLEDeviceServices = wx.getBLEDeviceServices || ((opt)=>{});
  wx.getBLEDeviceCharacteristics = wx.getBLEDeviceCharacteristics || ((opt)=>{});
  wx.createBLEConnection = wx.createBLEConnection || ((opt)=>{});
  wx.closeBLEConnection = wx.closeBLEConnection || ((opt)=>{});
  wx.writeBLECharacteristicValue = wx.writeBLECharacteristicValue || ((opt)=>{});
  // iBeacon
  wx.stopBeaconDiscovery = wx.stopBeaconDiscovery || ((opt)=>{});
  wx.startBeaconDiscovery = wx.startBeaconDiscovery || ((opt)=>{});
  const onBeaconUpdate = wx.onBeaconUpdate || ((opt)=>{});
  wx.onBeaconUpdate = function(fn){
    // 处理回调返回值缺失字段beacons
    let f = fn;
    return onBeaconUpdate.call(this,function(res){
      f({beacons: res.beacons || []});
    });
  };
  wx.onBeaconServiceChange = wx.onBeaconServiceChange || ((opt)=>{});
  wx.getBeacons = wx.getBeacons || ((opt)=>{});
  // WI_FI
  wx.stopWifi = wx.stopWifi || ((opt)=>{});
  wx.startWifi = wx.startWifi || ((opt)=>{});
  wx.setWifiList = wx.setWifiList || ((opt)=>{});
  wx.onWifiConnected = wx.onWifiConnected || ((opt)=>{});
  const onGetWifiList = wx.onGetWifiList || ((opt)=>{});
  wx.onGetWifiList = function(fn){
    //  处理回调返回值
    let f = fn;
    return onGetWifiList.call(this,function(res){
      f({wifiList:res.wifiList || []});
    });
  };
  wx.getWifiList = wx.getWifiList || ((opt)=>{});
  wx.getConnectedWifi = wx.getConnectedWifi || ((opt)=>{});
  wx.connectWifi = wx.connectWifi || ((opt)=>{});

  // 小程序声明周期
  wx.getLaunchOptionsSync = wx.getLaunchOptionsSync || (()=>{});
  // 应用级事件
  wx.onPageNotFound = wx.onPageNotFound || (()=>{});
  wx.onError = wx.onError || (()=>{});
  wx.onAudioInterruptionBegin = wx.onAudioInterruptionBegin || (()=>{});
  wx.onAppShow = wx.onAppShow || (()=>{});
  wx.onAppHide = wx.onAppHide || (()=>{});
  wx.offPageNotFound = wx.offPageNotFound || (()=>{});
  wx.offError = wx.offError || (()=>{});
  wx.offAudioInterruptionBegin = wx.offAudioInterruptionBegin || (()=>{});
  wx.offAppShow = wx.offAppShow|| (()=>{});
  wx.offAppHide  = wx.offAppHide || (()=>{});

  // 第三方平台
  // wx.getExtConfig = wx.getExtConfig;
  // wx.getExtConfigSync = wx.getExtConfigSync;

  // 开放接口

  // wx.login = wx.login
  // wx.checkSession = wx.checkSession
  // wx.authorize = wx.authorize // 传递参数scope列表百度和微信不完全一样,百度中无scope.invoice、scope.werun,百度中是7个,微信是9个
  // 更新
  // wx.getUpdateManager = wx.getUpdateManager
  // 调试
  // wx.setEnableDebug = wx.setEnableDebug // 百度中没有填写success,fail，complate回调,但是有
  wx.getLogManager = wx.getLogManager || ((opt)=>{
    return{
      debug:(()=>{}),
      info: (()=>{}),
      log: (()=>{}),
      warn: (()=>{})
    }
  });

  // 小程序跳转
  wx.navigateBackMiniProgram = wx.navigateToSmartProgram; // 打开另一个小程序(百度中多两个参数appKey、path)
  wx.navigateBackMiniProgram = function(opt){
    // 处理传入参数微信appid与百度appKey映射问题
    if(opt){
      opt.appId = opt.appKey
    }
    return opt;
  };
  wx.navigateToMiniProgram = wx.navigateBackSmartProgram; // 返回到上一个小程序

  // 发票
  const chooseInvoiceTitle = wx.chooseInvoiceTitle;
  wx.chooseInvoiceTitle = function(opt){
    const success = opt.success;
    opt.success = function(res){
      // 处理success回调字段errMsg缺失问题
      if(res){
        res["errMsg"] = '';
      }
      success(res);
    };
    return chooseInvoiceTitle.call(this,opt);
  };
  wx.chooseInvoice = wx.chooseInvoice || (()=>{});

  // 收获地址
  const chooseAddress = wx.chooseAddress;
  wx.chooseAddress = function(opt){
    const success = opt.success;
    opt.success = function(res){
      // 处理success回调字段errMsg缺失问题
      if(res){
        res["errMsg"] = '';
      }
      success(res);
    };
    return chooseAddress.call(this, opt);
  };

  // 设置
  // wx.getSetting = wx.getSetting
  // wx.openSetting = wx.openSetting

  // 用户信息
  const getUserInfo = wx.getUserInfo;
  wx.getUserInfo = function(opt){
    const success = opt.success;
    opt.success = function(res){
      // 处理success回调字段rawData、signature缺失及字段名称encryptedData不对应问题
      if(res){
        res["rawData"] = '';
        res["signature"] = '';
        res["encryptedData"] = res.data;
        let userInfo = res.userInfo;
        userInfo['country'] = '';
        userInfo['province'] = '';
        userInfo['city'] = '';
        userInfo['language'] = '';
        // userInfo['isAnonymous'] = false; // 表示用户信息是否为匿名，若是用户未登录或者拒绝授权为true，正常流程为false。
      }
      success(res);
    };
    return getUserInfo.call(this,opt);
  };

  // 帐号信息
  wx.getAccountInfoSync = wx.getAccountInfoSync || ((opt)=>{});

  // 数据上报
  wx.reportMonitor = wx.reportMonitor || ((opt)=>{});

  // 支付
  wx.requestPayment = wx.requestPayment || ((opt)=>{});

  // 卡劵
  wx.openCard = wx.openCard || ((opt)=>{});
  wx.addCard = wx.addCard || ((opt)=>{});
  wx.startSoterAuthentication = wx.startSoterAuthentication || ((opt)=>{});
  wx.checkIsSupportSoterAuthentication = wx.checkIsSupportSoterAuthentication || ((opt)=>{});
  wx.checkIsSoterEnrolledInDevice = wx.checkIsSoterEnrolledInDevice || ((opt)=>{});
  // 微信运动
  // wx.getWeRunData = wx.getWeRunData

  // 数据分析
  // wx.reportAnalytics = wx.reportAnalytics

  // 定时器
  // clearInterval = clearInterval
  // clearTimeout = clearTimeout
  // setInterval = setInterval
  // setTimeout = setTimeout

  // 转发
  wx.updateShareMenu = wx.updateShareMenu || (()=>{});
  wx.showShareMenu = wx.showShareMenu || (()=>{});
  wx.hideShareMenu = wx.hideShareMenu || (()=>{});
  wx.getShareInfo = wx.getShareInfo || (()=>{});

  // Worker
  wx.createWorker = wx.createWorker || ((opt)=>{
    return{
      postMessage: (()=>{}),
      onMessage: (()=>{}),
      terminate: (()=>{})
    }
  });
  return wx;
}

export default getInstance();