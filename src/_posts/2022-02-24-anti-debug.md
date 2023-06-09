---
title: 防止网站被窥探的几种方式
date: 2021-06-30
tags: 
  - 移动端开发
author: Julianzeng
location: Beijing  
---


```JS
		setInterval(function(){
			check();
		}, 2000);
		var check = function(){
			function doCheck(a){
				if (('' + a / a)['length'] !== 1 || a % 20 === 0){
					(function() {}['constructor']('debugger')());
				} else {
					(function() {}['constructor']('debugger')());
				}
				doCheck(++a);
			}
			try {
				doCheck(0);
			}catch(err){}
		};
		check();
```

其实就是函数`function() {debugger}`不断递归执行，打开控制台会不断吃内存直至页面卡死；