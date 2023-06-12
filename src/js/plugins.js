import config from '../config'
import { attachScript } from './attach_script'

export function setupPlugins () {
  const plugins = {
    brightcove: {
      enabled: false,
      loaded: false,
      scriptSrc: config.brightcoveScriptSrc
    }
  }
  return {
    ...plugins,
    load (handle, cb) {
      const target = plugins[handle]
      const enabled = target && target.enabled
      if (!enabled) return cb(null, {enabled})

      const loaded = target && target.loaded
      const scriptSrc = target && target.scriptSrc
      if (!scriptSrc) return cb(new Error(`No script source configured for ${handle}`), {loaded})
      if (loaded) return cb(null, {loaded})

      return attachScript({
        elem: window.document,
        src: scriptSrc,
        crossOrigin: 'anonymous'
      }, () => {
        plugins[handle].loaded = true
        cb(null, {loaded: true})
      })
    }
  }
}
