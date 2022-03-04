// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $site = $('.site');
var $addButton = $('.addButton');
var $inpWd = $('.search>input[name=wd]');
var xHasMapStr = localStorage.getItem('x');
var xHasMap = JSON.parse(xHasMapStr);
var hasMap = xHasMap || [{ url: 'https://www.bilibili.com', logo: 'B', logoType: 'text' }, { url: 'https://www.zhihu.com', logo: 'Z', logoType: 'text' }];

var simplifyUrl = function simplifyUrl(str) {
    return str.replace('http://', '').replace('https://', '').replace('www.', '').replace('/\/.*/', '');
};
var render = function render() {
    $siteList.find('.site').remove();
    hasMap.forEach(function (node, index) {
        var link = simplifyUrl(node.url);
        var $li = $('\n        <li class="site">\n            <div class="delete">\n                <i class="iconfont icon-chahao1"></i>\n            </div>\n            <a href="' + node.url + '">\n                <div class="logo">' + node.logo + '</div>\n                <div class="link">' + link + '</div>\n            </a>\n        </li>');
        $addButton.before($li);
        $li.on('click', '.delete', function (e) {
            e.stopPropagation();
            hasMap.splice(index, 1);
            render();
        });
    });
};
render();

$addButton.on('click', function () {
    var url = window.prompt('请输入要添加的网址！') || '';
    url = url && url.trim();
    var logo = url;
    if (url && url.indexOf('http') !== 0) {
        url = 'https://' + url;
    }
    logo = simplifyUrl(logo).substring(0, 1);
    if (logo) {
        hasMap.push({
            url: url,
            logo: logo,
            logoType: 'text'
        });
    }
    render();
    var hasMapStr = JSON.stringify(hasMap);
    localStorage.setItem('x', hasMapStr);
});

$inpWd.on('focus', function () {
    $(document).unbind('keyup');
});

$inpWd.on('blur', function () {
    if ($inpWd.val()) {
        $('.sub').attr('type', 'submit');
    }
    $(document).on('keyup', function (e) {
        keyUp(e);
    });
});
//当输入框失去焦点的时候才能通过键盘事件跳转
$(document).on('keyup', function (e) {
    keyUp(e);
});
function keyUp(e) {
    var key = e.key;
    for (var i = 0; i < hasMap.length; i++) {
        if (hasMap[i].logo === key || hasMap[i].logo === key.toUpperCase()) {
            window.open(hasMap[i].url, '_self');
        }
    }
}

// 移动端长按触发delete显示
var timeOutEvent = 0;
function longPress(node) {
    // node.find('.delete').css('display','block');
    node.parentNode.parentNode.firstElementChild.style.display = 'block';
}
var s = true;
$siteList.on({
    touchstart: function touchstart(e) {
        s = true;
        timeOutEvent = setTimeout(function () {
            longPress(e.target);
            s = false;
        }, 1000);
        e.preventDefault();
    },
    touchmove: function touchmove() {
        clearTimeout(timeOutEvent);
        timeOutEvent = 0;
    },
    touchend: function touchend(e) {
        clearTimeout(timeOutEvent);
        if (s) {
            e.target.click();
        }
    }
});

/*触摸delete以外的元素，将delete隐藏 */
document.addEventListener('touchstart', function (e) {});
var a = document.getElementsByClassName('delete')[0];
var arr = [];
arr.push(a); // 先推入当前元素
getParent(a); // 执行递归
arr.push(window); // 最后再加一个window
function getParent(obj) {
    if (obj.parentNode) {
        // 往树的上层追溯，直到最上层
        arr.push(obj.parentNode);
    } else {
        return;
    }
    getParent(obj.parentNode); // 递归追溯源头
}
var ObjStatus = document.getElementsByClassName('status')[0];
document.addEventListener('touchstart', function (e) {
    var t = document.getElementsByClassName('demo')[0]; // 最外层元素
    if (!e.path.includes(t)) {
        $siteList.find('.delete').css('display', 'none');
    }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.9622f880.map