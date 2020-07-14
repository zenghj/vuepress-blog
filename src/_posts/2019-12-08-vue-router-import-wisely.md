---
title: vue-router动态路由组件智能预加载
date: 2019-12-08
tags: 
  - Vue
author: Julianzeng
location: Beijing  
---

## 现象
通常我们会对路由组件使用动态import，在打包时会分开打包，使用到时才按需加载，但是这个时候第一次打开一个之前没加载过的路由页面就会需要先发请求路由页面的JS资源，通常都会出现一定的延时现象（等待路由页面组件JS资源加载），造成体验上卡顿的后果。

所以，如果可以按需提前预加载将会是更好的解决方案；

## 已有的解决案例

* [vue-router-prefetch](https://github.com/egoist/vue-router-prefetch)

能实现：
* 当RouteLink组件进入视口时预加载该路由组件及其配置的预加载项
  * 通过router.getMatchedComponents获取需要预加载的异步路由组件（异步组件为异步返回组件的函数，执行该函数会自行根据业务逻辑加载路由组件）
  * 同时更加route配置项异步加载那些配置的文件

它的想法来源于[quicklink](https://github.com/GoogleChromeLabs/quicklink) 和 [nuxt-link的优化issue](https://github.com/nuxt/nuxt.js/pull/4574/)

存在的问题：
如果点击时跳转不是通过Route-Link组件实现的，而是通过监听点击事件然后JS做的跳转，对这种场景该如何实现智能预加载呢？

改进方式
添加指令v-prefetch实现预加载，便于更加灵活处理这种场景
实现见[v-prefetch](https://github.com/zenghj/pratices/tree/master/v-prefetch)

## 疑问

vue-cli在打包时会在head里插入`<link href="async-route-xxx.js" rel="prefetch">`，但是并没有如想象中预先加载，原因是什么？

关于prefetch
* [Prefetching, preloading, prebrowsing](https://css-tricks.com/prefetching-preloading-prebrowsing/)
  * 还可以预渲染（Prerendering）某个页面
* [资源提示 —— 什么是 Preload，Prefetch 和 Preconnect？](https://github.com/fi3ework/blog/issues/32)
* [Link prefetching FAQ](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Link_prefetching_FAQ)

通过观察及测试发现link prefetch技术可能并不可靠，浏览器自行确定下载时机可能并不太符合我们的预期，所以还是有必要使用`v-prefetch`这种方式强制提前加载的。

另外除了这种路由组件资源预取，还有更多的场景优化可以做，比如预取下一屏将会出现的图片资源。
