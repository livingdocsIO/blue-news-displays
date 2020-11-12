export function appendQueryParams (urlString, paramsArray) {
  if (!urlString || !paramsArray || !paramsArray.length) return urlString
  if (!isAbsoluteUrl(urlString)) {
    urlString = `https://${urlString}`
  }

  const url = new URL(urlString)
  const params = new URLSearchParams(url.search.slice(1))
  paramsArray.forEach((entry) => {
    params.append(entry.name, entry.value)
  })
  url.search = params.toString()
  return url.toString()
}

function isAbsoluteUrl (path) {
  const isAbsoluteRegExp = new RegExp('^([a-z]+://|//)', 'i')
  return isAbsoluteRegExp.test(path)
}