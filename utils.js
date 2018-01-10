  var ieVersion = Number(document.documentMode)
  var MOZ_HACK_REGEXP = /^moz([A-Z])/;
  var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  var nativeIsArray = Array.isArray
  var toString = Object.prototpye.toString
  /**
   *  trim string
  */
  var trim = function (string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
  }
  /**
   * 驼峰写法
  */
  function camelCase(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
  };
  /**
   * Array is equal ? 
  */
  function isArrEqual(v1, v2) {
    if (!arguments.length && arguments.length != 2) return false;
    if (v1.length != v2.length) return false;
    for (var i = 0; i < v1.length; i++) {
      if (v1[i] != v2[i]) return false
    }
    return true
  }
  /**
   * isArray
   */
  var isArray = nativeIsArray ? nativeIsArray : function(obj){
    return toString.call(obj) === "[Object Array]"
  }
  /**
   * 工厂函数数组
   * ex:var a = Array.call(null, { length: 20 }, 12,15,15,65,874,848,848)
  */
  function arrFactory(s,arr){
    return Array.call(null, {length: `${s}`}, ...arr)
  }
  /* 
   * hasclass
   */
  function hasClass(el, cls) {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
      return el.classList.contains(cls);
    } else {
      return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
  };
  /**
   * 添加样式
   */
  function addClass(el, cls) {
    if (!el) return;
    var curClass = el.className;
    var classes = (cls || '').split(' ');

    for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i];
      if (!clsName) continue;

      if (el.classList) {
        el.classList.add(clsName);
      } else if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
    if (!el.classList) {
      el.className = curClass;
    }
  };
  /**
   * 删除样式
   */
  function removeClass(el, cls) {
    if (!el || !cls) return;
    var classes = cls.split(' ');
    var curClass = ' ' + el.className + ' ';

    for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i];
      if (!clsName) continue;

      if (el.classList) {
        el.classList.remove(clsName);
      } else if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
    if (!el.classList) {
      el.className = trim(curClass);
    }
  }
  /**
   * 获取样式
   */
  var getStyle = ieVersion < 9 ? function (element, styleName) {
    if (isServer) return;
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
      styleName = 'styleFloat';
    }
    try {
      switch (styleName) {
        case 'opacity':
          try {
            return element.filters.item('alpha').opacity / 100;
          } catch (e) {
            return 1.0;
          }
        default:
          return element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null;
      }
    } catch (e) {
      return element.style[styleName];
    }
  } : function (element, styleName) {
    if (isServer) return;
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
      styleName = 'cssFloat';
    }
    try {
      var computed = document.defaultView.getComputedStyle(element, '');
      return element.style[styleName] || computed ? computed[styleName] : null;
    } catch (e) {
      return element.style[styleName];
    }
  };
  /**
   * 设置cookies
   * 
   */
  function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
      ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString())
  }
  /**
   * 
   * 获取cookie
   */
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
  }

  function clearCookie(name) {
    setCookie(name, "", -1);
  }
  /**
   * 动态添加script
   * */
  function loadScript(sScriptSrc, callbackfunction) {
    //gets document head element  
    var oHead = document.getElementsByTagName('head')[0];
    if (oHead) {
      //creates a new script tag        
      var oScript = document.createElement('script');

      //adds src and type attribute to script tag  
      oScript.setAttribute('src', sScriptSrc);
      oScript.setAttribute('type', 'text/javascript');

      //calling a function after the js is loaded (IE)  
      var loadFunction = function () {
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
          callbackfunction();
        }
      };
      oScript.onreadystatechange = loadFunction;

      //calling a function after the js is loaded (Firefox)  
      oScript.onload = callbackfunction;

      //append the script tag to document head element          
      oHead.appendChild(oScript);
    }
  }
  /**
   * 
   * @desc 获取浏览器类型和版本
   * @return {String} 
   */
  function getExplore() {
    var sys = {},
      ua = navigator.userAgent.toLowerCase(),
      s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1]:
      (s = ua.match(/msie ([\d\.]+)/)) ? sys.ie = s[1] :
      (s = ua.match(/edge\/([\d\.]+)/)) ? sys.edge = s[1] :
      (s = ua.match(/firefox\/([\d\.]+)/)) ? sys.firefox = s[1] :
      (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? sys.opera = s[1] :
      (s = ua.match(/chrome\/([\d\.]+)/)) ? sys.chrome = s[1] :
      (s = ua.match(/version\/([\d\.]+).*safari/)) ? sys.safari = s[1] : 0;
    // 根据关系进行判断
    if (sys.ie) return ('IE: ' + sys.ie)
    if (sys.edge) return ('EDGE: ' + sys.edge)
    if (sys.firefox) return ('Firefox: ' + sys.firefox)
    if (sys.chrome) return ('Chrome: ' + sys.chrome)
    if (sys.opera) return ('Opera: ' + sys.opera)
    if (sys.safari) return ('Safari: ' + sys.safari)
    return 'Unkonwn'
  }
  /**
   * 
   * @desc 获取操作系统类型
   * @return {String} 
   */
  function getOS() {
    var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
    var vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '';
    var appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';

    if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent) || /ipod/i.test(userAgent)) return 'ios'
    if (/android/i.test(userAgent)) return 'android'
    if (/win/i.test(appVersion) && /phone/i.test(userAgent)) return 'windowsPhone'
    if (/mac/i.test(appVersion)) return 'MacOSX'
    if (/win/i.test(appVersion)) return 'windows'
    if (/linux/i.test(appVersion)) return 'linux'
  }
  /*
   * 滑动到底部
   * body,html不能定位和定死高度
   * */
  function scrollBase(callback) {
    document.addEventListener('scroll', function () {
      var docHeight = document.documentElement.clientHeight;
      var bodyHeight = document.body.clientHeight;
      var scrollTop = document.body.scrollTop;
      if (scrollTop >= bodyHeight - docHeight) {
        callback && callback()
      }
    })
  }
  /**
   * url参数转对象
   * 
   * **/
  function parseQueryString(url) {
    if (!url) return;

  }
