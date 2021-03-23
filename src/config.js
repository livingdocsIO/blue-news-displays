const environmentConfigs = {
  local: {
    canonicalBaseUrl: 'https://0.0.0.0:9999',
    api: {
      url: 'http://0.0.0.0:9090',
      token: process.env.LI_PUBLIC_API_TOKEN
    }
  },
  integration: {
    canonicalBaseUrl: 'https://bluewin.livingdocs.io',
    api: {
      url: 'https://bluewin-editor.livingdocs.io/proxy/li-server',
      token: process.env.LI_PUBLIC_API_TOKEN
    }
  },
  development: {
    canonicalBaseUrl: 'https://bluewin.dev.sctv.ch',
    api: {
      url: 'https://bluewin-cms.dev.sctv.ch/proxy/api',
      token: process.env.LI_PUBLIC_API_TOKEN
    }
  },
  staging: {
    canonicalBaseUrl: 'https://bluewin.sta.sctv.ch/',
    api: {
      url: 'https://bluewin-cms.sta.sctv.ch/proxy/api',
      token: process.env.LI_PUBLIC_API_TOKEN
    }
  },
  production: {
    canonicalBaseUrl: 'https://www.bluewin.ch',
    api: {
      url: 'https://bluewin-cms.sctv.ch/proxy/api',
      token: process.env.LI_PUBLIC_API_TOKEN
    }
  }
}

export default {
  ...(environmentConfigs[process.env.ENVIRONMENT]),
  defaults: {
    slideDuration: 15,
    slideText: '',
    slideImage: './assets/placeholder.png',
    qrCtaText: 'Zum Artikel'
  }
}
