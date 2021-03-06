--- 
title: 前端项目本地打包的风险
date: 2020-08-21
tags:
  - 前端
author: Julianzeng
location: Beijing  
---


背景：项目部署时，前端在本地执行build命令，打包生成静态资源，然后放到一个对应的nginx项目某个目录下，然后部署nginx项目
。

复现步骤：

1. master中使用package1 v1版本的库；
2. 开发分支因为需求原因需要升级package1到新的版本，比如v2, 升级完在开发中；
3. 突然线上有个需求需要紧急上线，这时切换到master，然后切出hotfix分支，修复，然后打包上线；（这时问题就出现了，本地打包使用的package1将会是v2的，因为一般node_modules不使用git追踪，切换分支不会有变化）；

意味着master无意间使用了v2版本的库进行了打包，如果v1和v2有兼容性问题，就产生了bug！！！

解决方案：

* 不使用本地打包的方式，在服务器上进行打包；
* 如果不得不使用本地打包的话，每次进行npm包的升级时就需要特别注意了，切换分支之后重新安装该分支之前使用的这个库对应的版本；
* 或者将node_modules加入git追踪，但通常都不建议这么干；