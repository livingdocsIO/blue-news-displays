const environmentConfigs = {
  local: {
    canonicalBaseUrl: 'https://0.0.0.0:9999',
    api: {
      url: 'http://0.0.0.0:9999',
    }
  },
  integration: {
    canonicalBaseUrl: 'https://bluewin.livingdocs.io',
    api: {
      url: 'https://bluewin.livingdocs.io',
    }
  },
  development: {
    canonicalBaseUrl: 'https://bluewin.dev.sctv.ch',
    api: {
      url: 'https://bluewin.dev.sctv.ch'
    }
  },
  staging: {
    canonicalBaseUrl: 'https://bluewin.sta.sctv.ch',
    api: {
      url: 'https://bluewin.sta.sctv.ch'
    }
  },
  production: {
    canonicalBaseUrl: 'https://www.bluewin.ch',
    api: {
      url: 'https://www.bluewin.ch'
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
