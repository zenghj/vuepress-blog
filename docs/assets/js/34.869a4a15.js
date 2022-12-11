(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{477:function(e,t,r){"use strict";r.r(t);var v=r(9),s=Object(v.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("h2",{attrs:{id:"什么是服务器端渲染-ssr-？"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#什么是服务器端渲染-ssr-？"}},[e._v("#")]),e._v(" 什么是服务器端渲染 (SSR)？")]),e._v(" "),r("p",[e._v('Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。')]),e._v(" "),r("p",[e._v('服务器渲染的 Vue.js 应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在服务器和客户端上运行。')]),e._v(" "),r("h2",{attrs:{id:"为什么使用服务器端渲染-ssr-？"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#为什么使用服务器端渲染-ssr-？"}},[e._v("#")]),e._v(" 为什么使用服务器端渲染 (SSR)？")]),e._v(" "),r("p",[e._v("与传统 SPA (单页应用程序 (Single-Page Application)) 相比，服务器端渲染 (SSR) 的优势主要在于：")]),e._v(" "),r("ul",[r("li",[e._v("更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。")]),e._v(" "),r("li",[e._v("更快的内容到达时间 (time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。")])]),e._v(" "),r("p",[e._v("使用服务器端渲染 (SSR) 时还需要有一些权衡之处：")]),e._v(" "),r("ul",[r("li",[e._v("相比于CSR,开发变得更复杂；\n"),r("ul",[r("li",[e._v("node.js环境获取不到浏览器环境中的变量 （开发时要注意代码执行的环境）\n"),r("ul",[r("li",[e._v("浏览器特定的代码，只能在某些生命周期钩子函数中使用；")]),e._v(" "),r("li",[e._v("一些外部扩展库 (external library) 可能需要特殊处理，才能在服务器渲染应用程序中运行；")])])])])]),e._v(" "),r("li",[e._v("需要构建和部署Node.js server 运行环境；")]),e._v(" "),r("li",[e._v("更多的服务器端负载；\n"),r("ul",[r("li",[e._v("在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 (high traffic) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。")])])])]),e._v(" "),r("h2",{attrs:{id:"其他注意事项"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#其他注意事项"}},[e._v("#")]),e._v(" 其他注意事项")]),e._v(" "),r("ul",[r("li",[r("p",[e._v("服务器上的组件的数据不会处理成响应式数据（没有必要和减少性能开销）；")])]),e._v(" "),r("li",[r("p",[e._v("由于没有动态更新，所有的生命周期钩子函数中，只有 beforeCreate 和 created 会在服务器端渲染 (SSR) 过程中被调用。这就是说任何其他生命周期钩子函数中的代码（例如 beforeMount 或 mounted），只会在客户端执行；")]),e._v(" "),r("ul",[r("li",[e._v("你应该避免在 beforeCreate 和 created 生命周期时产生全局副作用的代码，比如使用 setInterval 设置 timer，请将副作用代码移动到 beforeMount 或 mounted 生命周期中。")])])]),e._v(" "),r("li",[r("p",[e._v("避免状态单例")]),e._v(" "),r("ul",[r("li",[e._v("如果创建一个单例对象，它将在每个传入的请求之间共享，很容易导致交叉请求状态污染；")])])]),e._v(" "),r("li",[r("p",[e._v("客户端激活时确保virtual DOM和浏览器DOM一致;")])])])])}),[],!1,null,null,null);t.default=s.exports}}]);