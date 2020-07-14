---
title: Nodejs最佳实践
date: 2020-07-13
tags: 
  - Node.js
author: Julianzeng
location: Beijing  
---

## 项目结构

* 组件式结构（按组件（模块）划分文件目录，避免按技术角色划分文件目录）
* 应用分层
  * 将组件代码分成web，services， DAL层
  * 分层的优点是逻辑清新，便于测试
* 封装公共模块成为NPM包
  * 比如日志，加密以及其他类似的公共组件，封装暴露成一个私有的npm包，否则您将不得不重造部署和依赖的轮子
* app和server分离
  * app(api声明)和server（网络相关配置（端口、协议））等分开
  * 优点
    * 能够快速执行测试
    * 允许在灵活多样的网络条件下部署相同的API
    * 关注点分离，更清晰的代码结构
* 使用环境感知，安全，分层的配置
  * 配置过大时，对json进行层级划分

## 异常处理实践

* 使用async-await和promise处理异步错误，避免callback回调地狱
* 仅使用内建的错误对象
  * ✅throw new Error("How can I add new product when no value provided?");
  * ❌throw ("How can I add new product when no value provided?");
  * 内建的错误保留了一些重要的信息，比如StackTrace
  * 更好的做法：派生出统一的的AppError
* 区分操作型错误和程序型错误
  * 操作型错误指的是您了解发生了什么情况及其影响的情形
  * 程序型错误指的是您不知道原因, 有时是错误不知道来自何处的情况
* 集中处理错误，通过但不是在中间件里处理错误
  * 集中在中间件处理的方式会无法覆盖到非web接口中抛出的错误
* 对API错误使用swagger文档化
  * 使用类似Swagger的工具告知调用者可能发生的错误
* 当一个特殊的情况产生，停掉服务是得体的
* 使用一个成熟的日志工具提高错误的可见性，比如Winston，Bunyan和Log4J，忘记console.log
* 使用你最喜欢的测试框架测试错误流
* 使用APM产品（监控和性能产品）发现错误和宕机时间
* 捕获未处理的promise rejections
  * 使用process.on（'unhandledrejection'，callback）确保任何promise错误都能得到处理
* 快速报错，使用专用库验证参数

## 编码风格实践

* 使用ESLint
* 不要忘记分号,加分号可读性，明确性更强；
* 不使用匿名函数，调试错误时会很有帮助
* 使用const优于let，废弃var
* 先require, 而不是在方法内部
  * 在Node.js中，require 是同步运行的。如果从函数中调用它们，它可能会阻塞其他请求，在更关键的时间得到处理
* require 文件夹，而不是文件
  * 否则: 更改文件内部结构或签名可能会破坏与客户端的接口

## 测试和总体的质量实践

* 至少，编写API（组件）测试
  * 有更多的时间，继续考虑单元测试、DB测试、性能测试
* 使用一个linter检测代码问题
* 仔细挑选您的持续集成（CI）平台
* 经常检查易受攻击的依赖
  * 使用社区和商业工具，比如`npm audit` ，集成在您的CI平台上，在每一次构建的时候都会被调用，这样可以很容易地解决漏洞问题
* 测试标签化
  * 不同的测试必须运行在不同的情景：quick smoke，IO-less，当开发者保存或提交一个文件，测试应该启动；完整的端到端的测试通常运行在一个新的pull request被提交之后
  * 否则: 运行所有的测试，包括执行数据库查询的几十个测试，任何时候开发者进行小的改动都可能很慢，这使得开发者不愿意运行测试
* 检查测试覆盖率，它有助于识别错误的测试模式
* 检查过期的依赖包
  * 使用您的首选工具 (例如 “npm outdated” or npm-check-updates 来检测已安装的过期依赖包, 将此检查注入您的 CI 管道, 甚至在严重的情况下使构建失败。
* 对于e2e testing，使用docker-compose
  * 端对端(e2e)测试包含现场数据，由于它依赖于很多重型服务如数据库，习惯被认为是CI过程中最薄弱的环节
  * Docker-compose通过制定类似生产的环境，并使用一个简单的文本文件和简单的命令，轻松化解了这个问题
  * 否则: 没有docker-compose，团队必须维护一个测试数据库在每一个测试环境上，包含开发机器，保持所有数据同步，这样测试结果不会因环境不同而不同

## 上线实践

* 监控
* 使用智能日志增加透明度
  * 日志采集 （例如Winston, Bunyan等）
  * 日志聚合 （例如Elastic stack）
  * 日志可视化 （例如Kibana (Elastic stack的一部分)）
* 锁住依赖
* 使用正确的工具保护进程正常运行
  * 如PM2
* 利用CPU多核
  * 您可以使用Node Cluster和PM2. 对于一个大的应用，可以考虑使用一些Docker cluster（例如k8s，ECS）复制进程或基于Linux init system（例如systemd）的部署脚本
* 使用APM产品发现错误和宕机时间
  * 监控和性能的产品（即APM）先前一步地评估代码库和API，自动的超过传统的监测，并测量在服务和层级上的整体用户体验。
* 测量和防范内存使用情况
  * V8引擎对内存的使用有稍微的限制（64位1.4GB， 32位 0.7GB）
* Node外管理您的前端资源
* 在每一个log语句中指明 ‘TransactionId’

## 安全最佳实践

* 拥护linter安全准则
  * 使用安全相关的linter插件，比如eslint-plugin-security，尽早捕获安全隐患或者问题，最好在编码阶段。这能帮助察觉安全的问题，比如使用eval，调用子进程，或者根据字面含义（比如，用户输入）引入模块等等。
* 使用中间件限制并发请求
  * DOS攻击非常流行而且相对容易处理。使用外部服务，比如cloud负载均衡, cloud防火墙, nginx, 或者（对于小的，不是那么重要的app）一个速率限制中间件(比如express-rate-limit)，来实现速率限制
* 把机密信息从配置文件中抽离出来，或者使用包对其加密
* 使用 ORM/ODM 库防止查询注入漏洞
* 使用非root用户运行Node.js， 否则: 在服务器上运行脚本的攻击者在本地计算机上获得无限制的权利 (例如，改变iptable，引流到他的服务器上)

## 参考

* https://github.com/goldbergyoni/nodebestpractices