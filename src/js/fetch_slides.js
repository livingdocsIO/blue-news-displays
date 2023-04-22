import config from '../config'
import previewData from './preview_data'

export async function fetchSlides ({list}) {
  try {
    const options = {}
    if (list) options.name = list
    else console.warn('fetchSlides(): "list" query parameter missing, falling back to first list.')

    const documentList = await findList(options)
    const documents = await getListDocuments({listId: documentList.id})
    return documents.reverse().map(toSlideData)
  } catch (err) {
    console.error(err)
    return previewData
  }
}

function toSlideData (document) {
  const metadata = document.metadata
  if (!metadata) return

  const articleUrl = `${config.canonicalBaseUrl}${metadata.routing.path}`
  const qrOverride = metadata.cinemaQrCodeContent
  return {
    id: document.systemdata.documentId,
    flag: metadata.cinemaSlideLead,
    title: metadata.cinemaSlideTitle || metadata.title,
    imageSource: metadata.cinemaSlideImageSource,
    imageUrl: extractImageUrl(metadata),
    imageCrops: extractImageCrops(metadata),
    brightcoveId: metadata.cinemaSlideBrightcoveId,
    qrLink: qrOverride || articleUrl,
    config: {
      dateSchedule: metadata.cinemaDateSchedule,
      daysSchedule: metadata.cinemaDaysSchedule,
      timeSchedule: metadata.cinemaTimeSchedule,
      duration: metadata.cinemaSlideDuration,
      qrHidden: metadata.cinemaQrCodeHidden,
      qrPosition: metadata.cinemaQrCodePosition,
      ctaText: metadata.cinemaCtaText
    }
  }
}

async function findList ({name}) {
  const lists = await fetchPublicApi({
    resource: `document-lists${name ? `?name=${name}` : ''}`
  })
  if (!lists || !lists.length) throw fallbackError()

  return lists[0]
}

async function getListDocuments ({listId}) {
  const documentList = await fetchPublicApi({
    resource: `document-lists/${listId}`
  })
  if (!documentList || !documentList.documents.length) {
    throw fallbackError(`List with id "${listId}" has no documents.`)
  }

  return documentList.documents
}

async function fetchPublicApi ({resource}) {
  const res = await fetch(`${config.api.url}/de/api/${resource}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Accept': 'application/json'
    }
  })
  const data = await res.json()
  if (data.error) throw fallbackError(data.error)
  return data
}

function fallbackError (message) {
  return new Error(`Unable to retrieve a list from the public api${message ? `: ${message}` : ''}. Falling back to preview data.`)
}

function extractImageUrl (metadata) {
  if (!metadata.cinemaSlideImage) {
    return metadata.teaserImage && metadata.teaserImage.url
  }
  return metadata.cinemaSlideImage.url
}

function extractImageCrops (metadata) {
  if (!metadata.cinemaSlideImage) {
    return metadata.teaserImage && metadata.teaserImage.crops
  }
  return metadata.cinemaSlideImage.crops
}
