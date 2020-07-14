module.exports = {
  title: 'Julianzeng\'s Space',
  description: 'Just playing around',
  theme: '@vuepress/blog',
  themeConfig: {
    // sidebar: 'auto',
    // nav: [
    //   { text: 'Home', link: '/' },
    //   { text: 'Guide', link: '/guide/' },
    //   { text: 'External', link: 'https://google.com' },
    // ],
    // sidebar: 'auto'
    // sidebar: [
    //   {
    //     title: 'Group 1',   // 必要的
    //     path: '/foo/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    //     collapsable: false, // 可选的, 默认值是 true,
    //     sidebarDepth: 1,    // 可选的, 默认值是 1
    //     children: [
    //       ['/', 'Home'],
    //       '/page-a',
    //       // ['/page-a', 'Page A'],
    //       ['/page-b', 'Explicit link text']
    //     ]
    //   },
    //   {
    //     title: 'Node.js',
    //     children: [
    //       ['/nodejs/1.nodejs-best-practices', 'Node.js最佳实践']
    //     ]
    //   }
      
    // ],
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/vuepressjs/vuepress-theme-blog',
        },
      ],
      copyright: [
        {
          text: 'Copyright © 2020-present Vue.js',
          link: '',
        },
      ],
    },
    comment: {
      service: 'disqus',
      shortname: 'vuepress-plugin-blog',
    },

  }
}