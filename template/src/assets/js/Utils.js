/* eslint-disable */
import toast from '@/components/toast/toast';

{{#if_eq category "webapp" }}
/**
 * back.js
 * hplus webapp 物理返回键监听处理
 * 仅webapp使用
 */
;(function () {

  let first = null;

  document.addEventListener('plusready', function() {
    let webview = plus.webview.currentWebview();

    plus.key.addEventListener('backbutton', function() {
      webview.canBack(function(e) {
        let href = window.location.href;
        let name = href.split('#/')[1];

        if(e.canBack && href.indexOf('home') < 0 && !!name) {   // 首页、登录页面返回退出应用
          webview.back();
        } else {
          if (!first) {
            first = new Date().getTime();
            toast({
              message: '再按一次退出应用',
              duration: 1800
            });
            setTimeout(function() {
              first = null;
            }, 1790);
          } else {
            if (new Date().getTime() - first < 1800) {
              //webview.close(); //hide,quit
              plus.runtime.quit();
            }
          }
        }
      })
    }, false);
    plus.navigator.setStatusBarBackground('#5e8ff7');
  });
})();
{{/if_eq}}

{{#if_eq category "web-pc"}}{{else}}
  /**
   * mobileAdapt.js
   * 移动端高清适配脚本
   * 除pc端页面，移动端页面或者webapp均使用
   */
  function AdjustMethods (options) {
    this.fontEl = null;
    this.docEl = document.documentElement;
    this.metaEl = document.querySelector('meta[name="viewport"]');
    this.clientWidth = 0;
    this.dpr = window.devicePixelRatio || 1;
    this.scale = 1 / this.dpr;
    this.rem = 1;
    this.options = options;
  };

  AdjustMethods.prototype = {
    browser () {
      var u = navigator.userAgent;

      return {
        trident: u.indexOf('Trident') > -1,
        presto: u.indexOf('Presto') > -1,
        webKit: u.indexOf('AppleWebKit') > -1,
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
        mobile: (function() {
          var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
          var flag = true;
          var v;

          for (v = 0; v < Agents.length; v++) {
            if (u.indexOf(Agents[v]) > 0) {
              flag = false;
              break;
            }
          }
          return !flag;
        })(),
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
        iPad: u.indexOf('iPad') > -1,
        webApp: u.indexOf('Safari') === -1,
        QQbrw: u.indexOf('MQQBrowser') > -1,
        weiXin: u.indexOf('MicroMessenger') > -1,
        ucLowEnd: u.indexOf('UCWEB7.') > -1,
        ucSpecial: u.indexOf('rv:1.2.3.4') > -1,
        ucweb:(function () {
          try {
            return parseFloat(u.match(/ucweb\d+\.\d+/gi).toString().match(/\d+\.\d+/).toString()) >= 8.2;
          } catch (e) {
            if (u.indexOf('UC') > -1) {
              return true;
            } else {
              return false;
            }
          }
        })(),
        Symbian: u.indexOf('Symbian') > -1,
        ucSB: u.indexOf('Firefox/1.') > -1,
        Quark: u.indexOf('Quark') > -1,
        Hbuilder: u.indexOf('Html5Plus') > -1
      };
    },
    PC () {
      let styleStr;

      this.rem = 60;
      styleStr = 'html{font-size:' + this.rem + 'px!important;}';
      return styleStr;
    },
    Mobile () {
      let styleStr;

      this.rem = (this.clientWidth * this.dpr) * 100 / parseInt(this.options.standard, 10);
      styleStr = 'html{font-size:' + this.rem + 'px!important;}';
      // 设置viewport，进行缩放，达到高清效果
      this.metaEl.setAttribute('content', 'width=' + this.dpr * this.clientWidth + ',initial-scale=' + this.scale + ',maximum-scale=' + this.scale + ', minimum-scale=' + this.scale + ',user-scalable=no');
      return styleStr;
    },
    Quark () {
      let styleStr;

      this.rem = (this.clientWidth * this.dpr) * 100 / parseInt(this.options.standard, 10);
      styleStr = 'html{font-size:' + this.rem + 'px!important;}';
      // 设置viewport，进行缩放，达到高清效果
      // this.metaEl.setAttribute('content', 'width=' + this.clientWidth + ',initial-scale='+ this.scale +',maximum-scale='+ this.scale +', minimum-scale='+ this.scale +',user-scalable=no');\
      this.metaEl.setAttribute('content', 'width=' + this.clientWidth + ',initial-scale=1,maximum-scale=1, minimum-scale=1,user-scalable=no');
      return styleStr;
    },
    Hbuilder () {
      let styleStr;
      let curView = document.documentElement.clientWidth;

      // alert(this.dpr);

      // 判断当前的vebview是否支持initial-scale

      this.rem = (this.clientWidth * this.dpr) * 100 / parseInt(this.options.standard, 10);
      // this.rem = (this.clientWidth) * 100 / parseInt(this.options.standard, 10);
      styleStr = 'html{font-size:' + this.rem + 'px!important;}';
      // 设置viewport，进行缩放，达到高清效果
      this.metaEl.setAttribute('content', 'width=' + this.clientWidth + ',initial-scale=1,maximum-scale=1, minimum-scale=1,user-scalable=no');
      return styleStr;
    },
    applyView () {
      if (!this.fontEl) {
        this.fontEl = document.createElement('style');
        this.clientWidth = this.docEl.clientWidth;
      } else {
        this.clientWidth = this.docEl.clientWidth / this.dpr;
      }
      // 设置data-dpr属性，留作的css hack之用
      this.docEl.setAttribute('data-dpr', this.dpr);
      // 分支判断
      if (this.browser().Quark) { // 夸克浏览器
        this.fontEl.innerHTML = this.Quark();
      } else if (this.browser().mobile) {  // 普通移动端页面
        this.fontEl.innerHTML = this.Mobile();
      } else {  // pc页面
        this.fontEl.innerHTML = this.PC();
      };
      if (this.browser().Hbuilder) {  // Hbuilder webApp
        this.fontEl.innerHTML = this.Hbuilder();
      };
      // 动态写入样式
      this.docEl.firstElementChild.appendChild(this.fontEl);
    }
  };

export const Adapt = {
    init(opts = {
      'standard': 750
    }) {
      let time = +new Date();
      let mobileTransfer = (function () {
        let adjust;

        return function (options) {
          adjust = adjust || new AdjustMethods(options);
          adjust.applyView();

          // 给js调用的，某一dpr下rem和px之间的转换函数
          window.rem2px = function(v) {
            v = parseFloat(v);
            return v * adjust.rem;
          };
          window.px2rem = function(v) {
            v = parseFloat(v);
            return v / adjust.rem;
          };
          window.dpr = adjust.dpr;
          window.rem = adjust.rem;
        };
      })();

      window.addEventListener('resize', function () {
        if (+new Date() - time < 100) {
          return false;
        }
        mobileTransfer(opts);
      }, false);
      mobileTransfer(opts);
    }
  };
{{/if_eq}}

/**
 * 订阅发布者模式脚本
 *
 */
export const Listener = (function () {

  var global = this, Event, _default = 'default';

  Event = function () {
    var _listen, _trigger, _remove, _slice = Array.prototype.slice, _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift, namespaceCache = {},
      _create,
      find,
      each = function (ary, fn) {
        var ret;
        for (var i = 0, l = ary.length; i < l; i++) {
          var n = ary[i];
          ret = fn.call(n, i, n);
        }
        return ret;
      };

    _listen = function (key, fn, cache) {
      if (!cache[key]) {
        cache[key] = [];
      }
      cache[key].push(fn);
    };

    _remove = function (key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (var i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) {
              cache[key].splice(i, 1);
            }
          }
        } else {
          cache[key] = [];
        }
      }
    };

    _trigger = function () {
      var cache = _shift.call(arguments), key = _shift.call(arguments), args = arguments, _self = this, ret,
        stack = cache[key];

      if (!stack || !stack.length) {
        return;
      }

      return each(stack, function () {
        return this.apply(_self, args);
      });
    };

    _create = function (namespace) {
      var namespace = namespace || _default;
      var cache = {},
        offlineStack = [],    // 离线事件
        ret = {
          listen: function (key, fn, last) {
            _listen(key, fn, cache);
            if (offlineStack === null) {
              return;
            }
            if (last === 'last') {
              offlineStack.length && offlineStack.pop()();
            } else {
              each(offlineStack, function () {
                this();
              });
            }

            offlineStack = null;
          },
          one: function (key, fn, last) {
            _remove(key, cache);
            this.listen(key, fn, last);
          },
          remove: function (key, fn) {
            _remove(key, cache, fn);
          },
          trigger: function () {
            var fn, args, _self = this;

            _unshift.call(arguments, cache);
            args = arguments;
            fn = function () {
              return _trigger.apply(_self, args);
            };
            if (offlineStack) {
              return offlineStack.push(fn);
            }
            return fn();
          }
        };

      return namespace ? ( namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret ) : ret;
    };

    return {
      create: _create,
      one: function (key, fn, last) {
        var event = this.create();
        event.one(key, fn, last);
      },
      remove: function (key, fn) {
        var event = this.create();
        event.remove(key, fn);
      },
      listen: function (key, fn, last) {
        var event = this.create();
        event.listen(key, fn, last);
      },
      trigger: function () {
        var event = this.create();
        event.trigger.apply(this, arguments);
      }
    };
  }();
  return Event;
})();

/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        传入函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 * @return {function}             返回客户调用函数
 */
export const debounce = function (func, wait, immediate) {
  var timeout,
    args,
    context,
    timestamp,
    result;

  var later = function () {
    // 据上一次触发时间间隔
    var last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function () {
    context = this;
    args = arguments;
    timestamp = +new Date();
    var callNow = immediate && !timeout;

    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
};

/**
 * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
 *                                如果想忽略结尾边界上的调用，传入{trailing: false}
 * @return {function}             返回客户调用函数
 */
export const throttle = function (func, wait, options) {
  var context,
    args,
    result,
    timeout = null,
    previous = 0;  // 上次执行时间点

  if (!options) options = {};
  // 延迟执行函数
  var later = function () {
    // 若设定了开始边界不执行选项，上次执行时间始终为0
    previous = options.leading === false ? 0 : +new Date();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    var now = +new Date();
    // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
    if (!previous && options.leading === false) previous = now;
    // 延迟执行时间间隔
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
    // remaining大于时间窗口wait，表示客户端系统时间被调整过
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
      //如果延迟执行不存在，且没有设定结尾边界不执行选项
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

