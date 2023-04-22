export function attachScript ({elem, appendTo, src, crossOrigin}, cb) {
  const doc = elem.ownerDocument || elem
  const s = doc.createElement('script')
  s.src = src
  s.async = true
  s.crossOrigin = crossOrigin

  let loaded = false
  s.onload = s.onerror = s.onreadystatechange = function () {
    if ((s.readyState && !(/^c|loade/.test(s.readyState))) || loaded) return
    s.onload = s.onreadystatechange = null
    loaded = true
    cb && cb()
  }

  const target = appendTo || elem.head || elem
  target.appendChild(s)
}
