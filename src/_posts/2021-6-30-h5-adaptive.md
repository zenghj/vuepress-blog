---
title: 移动端完美适配方案
date: 2021-06-30
tags: 
  - 移动端开发
author: Julianzeng
location: Beijing  
---

## rem + vm

以前使用rem单位需要引入lib-flexible.js处理，这被视作vw支持性不好的过渡阶段解决方案，现在vw单位支持性基本都能满足了，但是vw单位存在的问题是，会随着窗口大小无限缩放，没有边界，对于移动端H5页面使用PC打开时就会放大到无法看，通常H5页面可能不会有用户用PC打开，不过“老板们”用PC打开看到不爽，还是少不了挨骂。这里我们利用vm单位达到缩放，利用rem单位实现边界限制

```scss
// common.scss

html {
  font-size: 10vw;
  // 同时，通过Media Queries 限制根元素最大最小值
  @media screen and (max-width: 360px) {
      font-size: 36px;
  }
  @media screen and (min-width: 540px) {
      font-size: 54px;
  }
}
// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小
body {
  max-width: 540px;
  min-width: 360px;
  margin: 0 auto;
}
```

在业务代码中使用rem单位，通过scss函数编译或者直接书写px单位使用postcss px2rem插件编译都行
```scss
// func.scss

@function px2rem($px) {
  @return $px * 10rem / 750;
}

```