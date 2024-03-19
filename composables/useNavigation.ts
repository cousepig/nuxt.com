import { createSharedComposable } from '@vueuse/core'

const _useNavigation = () => {
  const headerLinks = computed(() => {
    const route = useRoute()

    return [
      {
        label: '品牌',
        icon: 'i-ph-book-bookmark-duotone',
        to: '/brand',
        search: false,
        children: [
          {
            label: '关于SYRINCS',
            description:
              '1981年,SYRINCS专业音响品牌由Wolfgang bartsch博士、Conrad Schucht和Jürgen Eggeling创建于德国柏林。',
            icon: 'i-ph-rocket-launch-duotone',
            to: '/brand/about',
            active: route.path.startsWith('/brand/about')
          },
          {
            label: '品牌历程',
            description:
              'SYRINCS,德国的音色,在音色的使用设计中使用壹种十分严密的数学秩序。',
            icon: 'i-ph-book-open-duotone',
            to: '/brand/history',
            active: route.path.startsWith('/brand/history')
          },
          {
            label: '品牌概述',
            description:
              'SYRINCS专业音响品牌,用于安装或移动、室内或室外、大型或小型, SYRINCS音箱、控制电子设备、机械附件和远程控制装置可完全满足各种应用条件及恶劣的气候环境。',
            icon: 'i-ph-code',
            to: '/brand/intro',
            active: route.path.startsWith('/brand/intro')
          }
        ]
      },
      {
        label: '新闻',
        to: '/news',
        search: false,
        active: route.path.startsWith('/news'),
        children: [
          {
            label: '新闻',
            description: '实时向您传递公司产品信息，展览动态及行业动态',
            icon: 'i-ph-puzzle-piece-duotone',
            to: '/news/company'
          },
          {
            label: '行业资讯',
            description: '行业动态资讯',
            icon: 'i-ph-rocket-launch-duotone',
            to: '/news/hang'
          }
        ]
      },
      {
        label: '产品',
        icon: 'i-ph-puzzle-piece-duotone',
        search: false,
        active: route.path.startsWith('/modules'),
        to: '/modules'
      },
      {
        label: '案例',
        icon: 'i-ph-projector-screen-duotone',
        search: false,
        to: '/showcase'
      },
      {
        label: '服务支持',
        icon: 'i-ph-buildings-duotone',
        to: '/enterprise',
        search: false,
        children: [
          {
            label: '服务支持',
            to: '/enterprise/support',
            description: '从SYRINCS的团队获得帮助。',
            icon: 'i-ph-lifebuoy-duotone'
          },
          {
            label: '资料下载',
            to: '/enterprise/download',
            description: '产品资料、说明书下载.',
            icon: 'i-ph-handshake-duotone'
          },
          {
            label: '软件下载',
            to: '/enterprise/soft',
            description: '',
            icon: 'i-ph-handshake-duotone'
          },
          {
            label: '视频课程',
            description: '通过观看视频课程学习',
            icon: 'i-ph-graduation-cap-duotone',
            to: '/video-courses'
          },
          {
            label: '赞助商',
            to: '/enterprise/sponsors',
            description: '成为赞助商,并获得您的徽标和您的网站链接。',
            icon: 'i-ph-hand-heart-duotone'
          },
          {
            label: '社会招聘',
            to: '/enterprise/jobs',
            description: '寻找工作或发布工作机会。',
            icon: 'i-ph-briefcase-duotone'
          }
        ]
      }
    ]
  })

  const footerLinks = [
    {
      label: '社群',
      children: [
        {
          label: 'Facebook',
          to: 'https://www.facebook.com/syrincs',
          target: '_blank'
        },
        {
          label: 'Youtube',
          to: 'https://www.youtube.com/@user-ms4bv3rc9f',
          target: '_blank'
        },
        {
          label: 'Team',
          to: '/team'
        },
        {
          label: 'Design Kit',
          to: '/design-kit'
        }
      ]
    },
    {
      label: '品牌',
      children: [
        {
          label: '支持服务',
          to: '/enterprise/support'
        },
        {
          label: 'Agencies',
          to: '/enterprise/agencies'
        },
        {
          label: '社会招聘',
          to: '/enterprise/jobs'
        },
        {
          label: '赞助商',
          to: '/enterprise/sponsors'
        }
      ]
    },
    {
      label: '方案',
      children: [
        {
          label: 'Party K',
          to: '/',
          target: '_blank'
        },
        {
          label: '酒吧',
          to: '/',
          target: '_blank'
        },
        {
          label: 'KTV',
          to: '/',
          target: '_blank'
        },
        {
          label: '娱乐DJ',
          to: '/',
          target: '_blank'
        }
      ]
    }
  ]

  const searchLinks = computed(() => [
    ...headerLinks.value
      .map((link) => {
        // Remove `/docs` and `/enterprise` links from command palette
        if (link.search === false) {
          return {
            label: link.label,
            icon: link.icon,
            children: link.children
          }
        }

        return link
      })
      .filter(Boolean),
    {
      label: '研发团队',
      icon: 'i-ph-users-duotone',
      to: '/team'
    },
    {
      label: '设计套件',
      icon: 'i-ph-palette-duotone',
      to: '/design-kit'
    },
    {
      label: 'Newsletter',
      icon: 'i-ph-envelope-simple-duotone',
      to: '/newsletter'
    }
  ])

  const searchGroups = [
    {
      key: 'modules-search',
      label: 'Modules',
      search: async (q) => {
        if (!q) {
          return []
        }

        const { modules, fetchList } = useModules()
        if (!modules.value.length) {
          await fetchList()
        }

        return modules.value
          .filter((module) =>
            ['name', 'npm', 'repo']
              .map((field) => module[field])
              .filter(Boolean)
              .some((value) => value.search(searchTextRegExp(q)) !== -1)
          )
          .map((module) => ({
            id: `module-${module.name}`,
            label: module.name,
            suffix: module.description,
            avatar: {
              src: moduleImage(module.icon)
            },
            to: `/modules/${module.name}`
          }))
      }
    },
    {
      key: 'hosting-search',
      label: 'Hosting',
      search: async (q) => {
        if (!q) {
          return []
        }

        const { providers, fetchList } = useHostingProviders()
        if (!providers.value.length) {
          await fetchList()
        }

        return providers.value
          .filter((hosting) =>
            ['title']
              .map((field) => hosting[field])
              .filter(Boolean)
              .some((value) => value.search(searchTextRegExp(q)) !== -1)
          )
          .map((hosting) => ({
            id: `hosting-${hosting._path}`,
            label: hosting.title,
            suffix: hosting.description,
            icon: hosting.logoIcon,
            avatar: hosting.logoSrc
              ? {
                  src: hosting.logoSrc
                }
              : undefined,
            to: hosting._path
          }))
      }
    },
    {
      key: 'articles-search',
      label: 'Articles',
      search: async (q) => {
        if (!q) {
          return []
        }

        const { articles, fetchList } = useBlog()
        if (!articles.value.length) {
          await fetchList()
        }

        return articles.value
          .filter((article) => article.title.search(searchTextRegExp(q)) !== -1)
          .map((article) => ({
            id: `article-${article._path}`,
            label: article.title,
            suffix: article.description,
            icon: 'i-ph-newspaper',
            to: article._path
          }))
      }
    }
  ]

  return {
    headerLinks,
    footerLinks,
    searchLinks,
    searchGroups
  }
}

export const useNavigation = createSharedComposable(_useNavigation)
