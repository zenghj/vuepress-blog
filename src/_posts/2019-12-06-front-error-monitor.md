---
title: 关于前端错误监控
date: 2019-12-06
# tags: 
#   - Node.js
author: Julianzeng
location: Beijing  
---


## 错误捕获

### try...catch...

特点：可捕获同步异常错误，无法捕获异步Promise错误

```
try {
  throw new Error("oops");
} catch (e) {
  console.error(e)
}
```

### window.onerror 或者 window.addEventListener('error')

特点：捕获全局的同步异常错误，无法捕获异步Promise错误
```js
window.onerror = function(message, source, lineno, colno, error) { 
  // ...
}
```

```js
window.addEventListener('error', function(event) { 
// ... 
/**
ErrorEvent.prototype.message:  字符串，包含了所发生错误的描述信息。
ErrorEvent.prototype.filename:  字符串，包含了发生错误的脚本文件的文件名。
ErrorEvent.prototype.lineno:  数字，包含了错误发生时所在的行号。
ErrorEvent.prototype.colno:  数字，包含了错误发生时所在的列号。
ErrorEvent.prototype.error:   发生错误时所抛出的 Error 对象。
*/
})
```

### window.onunhandledrejection 或者 window.addEventListener('unhandledrejection')

特定：可以捕获未明确捕获的所有异步错误；

通过event.promise可以获取到相关的错误信息

```js
window.onunhandledrejection = function(message, source, lineno, colno, error) { }
```
```js
window.addEventListener('unhandledrejection', function (event) { ... });
```

## 跨域脚本错误，Script Error

当加载自不同域的脚本中发生语法错误时，为避免信息泄露，语法错误的细节将不会报告，而是使用简单的"Script error."代替

解决办法
服务端添加Access-Control-Allow-Origin，页面在script标签中配置 crossorigin="anonymous"。这样，便解决了因为跨域而带来的"Script Error"问题。

并不是所有的浏览器都支持crossorigin="anonymous"，也不是所有的服务端都能及时配置Access-Control-Allow-Origin，这种情况下可以通过劫持原生方法获取详细信息 (通常情况不推荐劫持，可能会有意料之外的风险)
```js
const nativeAddEventListener = EventTarget.prototype.addEventListener; // 先将原生方法保存起来。
EventTarget.prototype.addEventListener = function (type, func, options) { // 重写原生方法。
    const wrappedFunc = function (...args) { // 将回调函数包裹一层try catch
        try { 
			return func.apply(this, args);
		} catch (e) {
			const errorObj = {
                ...
                error_name: e.name || '',
				error_msg: e.message || '',
				error_stack: e.stack || (e.error && e.error.stack),
				error_native: e,
                ...
			};
            // 接下来可以将errorObj统一进行处理。
        }
    }
    return nativeAddEventListener.call(this, type, wrappedFunc, options); // 调用原生的方法，保证addEventListener正确执行
}

```

后面再通过addEventListener捕获 'error 和 'unhandledrejection' 异常

## 接口异常监控

劫持Ajax或者业务使用的发请求的工具

```js

    if (!XMLHttpRequest) {
        return;
    }

    const nativeAjaxSend = XMLHttpRequest.prototype.send; // 首先将原生的方法保存。
    const nativeAjaxOpen = XMLHttpRequest.prototype.open;


    XMLHttpRequest.prototype.open = function (mothod, url, ...args) { // 劫持open方法，是为了拿到请求的url
        const xhrInstance = this; 
        xhrInstance._url = url;
        return nativeAjaxOpen.apply(this, [mothod, url].concat(args));
    }

    XMLHttpRequest.prototype.send = function (...args) { // 对于ajax请求的监控，主要是在send方法里处理。

        const oldCb = this.onreadystatechange;
        const oldErrorCb = this.onerror;
        const xhrInstance = this;

        xhrInstance.addEventListener('error', function (e) { // 这里捕获到的error是一个ProgressEvent。e.target 的值为 XMLHttpRequest的实例。当网络错误(ajax并没有发出去)或者发生跨域的时候，会触发XMLHttpRequest的error, 此时，e.target.status 的值为:0，e.target.statusText 的值为:''
          
            const errorObj = {
                ...
                error_msg: 'ajax filed',
                error_stack: JSON.stringify({
                    status: e.target.status,
                    statusText: e.target.statusText
                }),
                error_native: e,
                ...
            }
          
            /*接下来可以对errorObj进行统一处理*/
          
        });


        xhrInstance.addEventListener('abort', function (e) { // 主动取消ajax的情况需要标注，否则可能会产生误报
            if (e.type === 'abort') { 
                xhrInstance._isAbort = true;
            }
        });


        this.onreadystatechange = function (...innerArgs) {
            if (xhrInstance.readyState === 4) {
                if (!xhrInstance._isAbort && xhrInstance.status !== 200) { // 请求不成功时，拿到错误信息
                   const errorObj = {
                        error_msg: JSON.stringify({
                            code: xhrInstance.status,
                            msg: xhrInstance.statusText,
                            url: xhrInstance._url
                        }),
                        error_stack: '',
                        error_native: xhrInstance
                    };
                    
                    /*接下来可以对errorObj进行统一处理*/
                    
                }
                
            }
            oldCb && oldCb.apply(this, innerArgs);
        }
        return nativeAjaxSend.apply(this, args);
    }
}

```
## sourceMap错误定位
todo...

## vue中的错误捕获

## react中的错误捕获



## 参考资料
* [前端开发中的Error以及异常捕获](https://juejin.im/post/5c2d60616fb9a049dc025c39)