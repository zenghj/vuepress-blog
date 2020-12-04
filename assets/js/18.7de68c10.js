(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{451:function(e,r,t){"use strict";t.r(r);var n=t(10),o=Object(n.a)({},(function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h2",{attrs:{id:"现象"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#现象"}},[e._v("#")]),e._v(" 现象")]),e._v(" "),t("p",[e._v("通常我们会对路由组件使用动态import，在打包时会分开打包，使用到时才按需加载，但是这个时候第一次打开一个之前没加载过的路由页面就会需要先发请求路由页面的JS资源，通常都会出现一定的延时现象（等待路由页面组件JS资源加载），造成体验上卡顿的后果。")]),e._v(" "),t("p",[e._v("所以，如果可以按需提前预加载将会是更好的解决方案；")]),e._v(" "),t("h2",{attrs:{id:"已有的解决案例"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#已有的解决案例"}},[e._v("#")]),e._v(" 已有的解决案例")]),e._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"https://github.com/egoist/vue-router-prefetch",target:"_blank",rel:"noopener noreferrer"}},[e._v("vue-router-prefetch"),t("OutboundLink")],1)])]),e._v(" "),t("p",[e._v("能实现：")]),e._v(" "),t("ul",[t("li",[e._v("当RouteLink组件进入视口时预加载该路由组件及其配置的预加载项\n"),t("ul",[t("li",[e._v("通过router.getMatchedComponents获取需要预加载的异步路由组件（异步组件为异步返回组件的函数，执行该函数会自行根据业务逻辑加载路由组件）")]),e._v(" "),t("li",[e._v("同时更加route配置项异步加载那些配置的文件")])])])]),e._v(" "),t("p",[e._v("它的想法来源于"),t("a",{attrs:{href:"https://github.com/GoogleChromeLabs/quicklink",target:"_blank",rel:"noopener noreferrer"}},[e._v("quicklink"),t("OutboundLink")],1),e._v(" 和 "),t("a",{attrs:{href:"https://github.com/nuxt/nuxt.js/pull/4574/",target:"_blank",rel:"noopener noreferrer"}},[e._v("nuxt-link的优化issue"),t("OutboundLink")],1)]),e._v(" "),t("p",[e._v("存在的问题：\n如果点击时跳转不是通过Route-Link组件实现的，而是通过监听点击事件然后JS做的跳转，对这种场景该如何实现智能预加载呢？")]),e._v(" "),t("p",[e._v("改进方式\n添加指令v-prefetch实现预加载，便于更加灵活处理这种场景\n实现见"),t("a",{attrs:{href:"https://github.com/zenghj/pratices/tree/master/v-prefetch",target:"_blank",rel:"noopener noreferrer"}},[e._v("v-prefetch"),t("OutboundLink")],1)]),e._v(" "),t("h2",{attrs:{id:"疑问"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#疑问"}},[e._v("#")]),e._v(" 疑问")]),e._v(" "),t("p",[e._v("vue-cli在打包时会在head里插入"),t("code",[e._v('<link href="async-route-xxx.js" rel="prefetch">')]),e._v("，但是并没有如想象中预先加载，原因是什么？")]),e._v(" "),t("p",[e._v("关于prefetch")]),e._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"https://css-tricks.com/prefetching-preloading-prebrowsing/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Prefetching, preloading, prebrowsing"),t("OutboundLink")],1),e._v(" "),t("ul",[t("li",[e._v("还可以预渲染（Prerendering）某个页面")])])]),e._v(" "),t("li",[t("a",{attrs:{href:"https://github.com/fi3ework/blog/issues/32",target:"_blank",rel:"noopener noreferrer"}},[e._v("资源提示 —— 什么是 Preload，Prefetch 和 Preconnect？"),t("OutboundLink")],1)]),e._v(" "),t("li",[t("a",{attrs:{href:"https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Link_prefetching_FAQ",target:"_blank",rel:"noopener noreferrer"}},[e._v("Link prefetching FAQ"),t("OutboundLink")],1)])]),e._v(" "),t("p",[e._v("通过观察及测试发现link prefetch技术可能并不可靠，浏览器自行确定下载时机可能并不太符合我们的预期，所以还是有必要使用"),t("code",[e._v("v-prefetch")]),e._v("这种方式强制提前加载的。")]),e._v(" "),t("p",[e._v("另外除了这种路由组件资源预取，还有更多的场景优化可以做，比如预取下一屏将会出现的图片资源。")])])}),[],!1,null,null,null);r.default=o.exports}}]);