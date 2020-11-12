export function getQueryParams () {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const variant = urlParams.get('variant')
  const list = urlParams.get('list')

  const qrProxyParamBlacklist = ['variant', 'list']
  const qrProxyParams = []
  urlParams.forEach((value, key) => {
    if (qrProxyParamBlacklist.includes(key)) return
    qrProxyParams.push({name: key, value})
  })

  return {
    variant,
    list,
    qrProxyParams
  }
}
