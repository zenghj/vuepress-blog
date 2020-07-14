---
title: Nodejs模块机制及热更新实现
date: 2020-06-29
tags: 
  - Node.js
author: Julianzeng
location: Beijing  
---

## Nodejs模块机制

## 热更新实现

方案1: 监听文件变更，然后重启应用，比如[node-supervisor](https://github.com/petruisfan/node-supervisor)、[PM2](https://github.com/Unitech/PM2)、[node-dev](https://github.com/fgnass/node-dev)
方案2: 监听文件变更，更新模块，不重启应用

在日常开发过程中，重启开发server可能耗时比较长，所以这种时候不重启server的方案还是比较有吸引力的（仅在开发环境时使用）

### 热更新且不重启

为实现热更新且不重启server，需要解决以下几个问题：

* 更新模块代码；
* 使用新模块处理请求；
* 释放老模块的资源；

## 参考

* [The Node.js Way - How `require()` Actually Works](http://fredkschott.com/post/2014/06/require-and-the-module-system/)
* [Node.js Web应用代码热更新的另类思路](https://fex.baidu.com/blog/2015/05/nodejs-hot-swapping/)
* https://github.com/rlidwka/node-hotswap