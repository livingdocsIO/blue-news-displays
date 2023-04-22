const environmentConfigs = {
  local: {
    canonicalBaseUrl: 'https://0.0.0.0:9999',
    brightcoveScriptSrc: 'http://cdn.skyjs.org/bluecinema/int.min.js',
    api: {
      url: 'http://0.0.0.0:9999',
    }
  },
  integration: {
    canonicalBaseUrl: 'https://bluewin.livingdocs.io',
    brightcoveScriptSrc: 'http://cdn.skyjs.org/bluecinema/int.min.js',
    api: {
      url: 'https://bluewin.livingdocs.io',
    }
  },
  development: {
    canonicalBaseUrl: 'https://bluewin.dev.sctv.ch',
    brightcoveScriptSrc: 'http://cdn.skyjs.org/bluecinema/int.min.js',
    api: {
      url: 'https://bluewin.dev.sctv.ch'
    }
  },
  staging: {
    canonicalBaseUrl: 'https://bluewin.sta.sctv.ch',
    brightcoveScriptSrc: 'http://cdn.skyjs.org/bluecinema/int.min.js',
    api: {
      url: 'https://bluewin.sta.sctv.ch'
    }
  },
  production: {
    canonicalBaseUrl: 'https://www.bluewin.ch',
    brightcoveScriptSrc: 'http://cdn.skyjs.org/bluecinema/int.min.js',
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
