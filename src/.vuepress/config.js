const authAppConfig = {
  owner: 'zenghj',
  repo: 'vuepress-blog',
  clientId: '16c7d85a4157b848f3d0',
  clientSecret: '7c6ee601a1c68acce2c874eb63677822563aa7c0',
};

module.exports = {
  base: '/vuepress-blog/',
  dest: './docs',
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
          link: 'https://github.com/zenghj/vuepress-blog',
        },
      ],
      copyright: [
        {
          text: 'Copyright © 2020-present Vue.js',
          link: '/#',
        },
      ],
    },
    // https://vuepress-theme-blog.ulivz.com/config/#comment
    comment: {
      service: 'vssue',
      ...authAppConfig
    },
    // globalPagination: {}
    hostname: 'https://zenghj.github.io', // enable sitemap
    canonical_base: 'https://zenghj.github.io', // enable feed
    // pwa: true

  },
  plugins: {
    '@vssue/vuepress-plugin-vssue': {
      // set `platform` rather than `api`
      platform: 'github',

      // all other options of Vssue are allowed
      ...authAppConfig
    },
    '@vuepress/medium-zoom': {
      selector: '.vuepress-blog-theme-content :not(a) > img',
      // medium-zoom options here
      // See: https://github.com/francoischalifour/medium-zoom#options
      options: {
        margin: 16
      }
    }
  },
}