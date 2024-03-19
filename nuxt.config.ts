import { ofetch } from 'ofetch'
import { logger } from '@nuxt/kit'
import { isWindows } from 'std-env'

function normalizedDirPath (path?: string) {
  if (!path || !isWindows) {
    return path
  }

  const windowsPath = path.replace(/\\/g, '/')
  return windowsPath.startsWith('file:///') ? windowsPath : `file:///${windowsPath}`
}

const docsSourceBase = normalizedDirPath(process.env.NUXT_DOCS_PATH)
const examplesSourceBase = normalizedDirPath(process.env.NUXT_EXAMPLES_PATH)

const docsSource: any = {
  name: 'nuxt-docs',
  driver: 'github',
  repo: 'nuxt/nuxt',
  branch: 'main',
  dir: 'docs',
  prefix: '/1.docs',
  token: process.env.NUXT_GITHUB_TOKEN || ''
}
if (docsSourceBase) {
  docsSource.driver = 'fs'
  docsSource.base = docsSourceBase
}

const examplesSource: any = {
  name: 'nuxt-examples',
  driver: 'github',
  repo: 'nuxt/examples',
  branch: 'main',
  dir: '.docs',
  prefix: '/docs/4.examples',
  token: process.env.NUXT_GITHUB_TOKEN || ''
}
if (examplesSourceBase) {
  examplesSource.driver = 'fs'
  examplesSource.base = examplesSourceBase
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'
  ],
  // @ts-ignore
  modules: [
    'nuxt-content-twoslash',
    'nuxt-build-cache',
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/plausible',
    '@nuxt/fonts',
    '@nuxtjs/turnstile',
    '@nuxthq/studio',
    '@vueuse/nuxt',
    'nuxt-og-image',
    () => {
      if (docsSourceBase) { logger.success(`Using local Nuxt docs from ${docsSourceBase}`) }
      if (examplesSourceBase) { logger.success(`Using local Nuxt examples from ${examplesSourceBase}`) }
    }
  ],
  routeRules: {
    // Pre-render
    '/api/search.json': { prerender: true },
    '/api/templates.json': { prerender: true },
    '/api/showcase.json': { prerender: true },
    '/api/sponsors.json': { prerender: true },
    '/blog/rss.xml': { prerender: true },
    // '/sitemap.xml': { prerender: true },
    '/newsletter': { prerender: true },
    // '/modules': { prerender: true },

    '/enterprise': { redirect: '/enterprise/support', prerender: false }
  },
  nitro: {
    prerender: {
      // failOnError: false
      // TODO: investigate
      // Ignore weird url from crawler on some modules readme
      ignore: ['/modules/%3C/span', '/modules/%253C/span', '/docs/getting-started/</span', '/docs/getting-started/%3C/span']
    },
    hooks: {
      'prerender:generate' (route) {
        // TODO: fix issue with recursive fetches with query string, e.g.
        // `/enterprise/agencies?region=europe&amp;amp;amp;service=ecommerce&amp;amp;service=ecommerce&amp;service=content-marketing`
        if (route.route?.includes('&amp;')) {
          route.skip = true
        }
      }
    }
  },
  // hooks: {
  //   async 'prerender:routes' (ctx) {
  //     // Add Nuxt 2 modules to the prerender list
  //     const { modules } = await ofetch<{ modules: [] }>('https://syrincs-com.vercel.app/api/showmodule.json').catch(() => ({ modules: [] }))
  //     for (const module of modules) {
  //       ctx.routes.add(`/modules/${module.name}`)
  //     }
  //   }
  // },

  $development: {
    runtimeConfig: {
      public: {
        website: {
          url: 'http://localhost:3000'
        }
      }
    }
  },
  colorMode: {
    preference: 'dark'
  },
  ui: {
    icons: ['simple-icons', 'ph', 'uil', 'heroicons', 'octicon', 'logos']
  },
  content: {
    navigation: {
      fields: ['titleTemplate']
    },
    sources: {
      docsSource,
      examplesSource
    },
    highlight: {
      theme: {
        default: 'material-theme-lighter',
        dark: 'material-theme-palenight'
      },
      langs: [
        'js',
        'ts',
        'vue',
        'css',
        'scss',
        'sass',
        'html',
        'bash',
        'md',
        'mdc',
        'json'
      ]
    }
  },
  twoslash: {
    floatingVueOptions: {
      classMarkdown: 'prose prose-primary dark:prose-invert'
    },
    // Skip Twoslash in dev to improve performance. Turn this on when you want to explictly test twoslash in dev.
    enableInDev: false,
    // Do not throw when twoslash fails, the typecheck should be down in github.com/nuxt/nuxt's CI
    throws: false
  },
  typescript: {
    strict: false
  },
  experimental: {
    headNext: true,
    sharedPrerenderData: true,
    appManifest: true
  },
  devtools: {
    enabled: false
  }
})
