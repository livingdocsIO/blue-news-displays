import $ from 'jquery'
import QRCode from 'qrcode'
import config from '../config'
import { attachScript } from './attach_script'
import { getQueryParams } from './get_query_params'
import { fetchSlides } from './fetch_slides'
import { filterSlides } from './filter_slides'
import { appendQueryParams } from './append_query_params'

const state = {
  plugins: {
    brightcove: {
      loaded: false,
      scriptSrc: config.brightcoveScriptSrc
    },
    load (handle, cb) {
      const target = state.plugins[handle]
      const scriptSrc = target && target.scriptSrc
      const loaded = target && target.loaded
      if (!scriptSrc) return cb(new Error(`No script source configured for ${handle}`), {loaded})
      if (loaded) return cb(null, {loaded})

      return attachScript({
        elem: window.document,
        src: scriptSrc,
        crossOrigin: 'anonymous'
      }, () => {
        state.plugins[handle].loaded = true
        cb(null, {loaded: true})
      })
    }
  },
  qrProxyParams: [],
  slides: [],
  currentSlideIndex: 0,
  getCurrentSlide () {
    return this.slides[this.currentSlideIndex]
  },
  getLastSlide ({offset} = {}) {
    if (!offset) offset = 0
    const targetIdx = this.currentSlideIndex - (1 + offset)
    if (targetIdx < 0) return this.slides[this.slides.length + targetIdx]
    return this.slides[targetIdx]
  },
  applyScheduling () {
    const prevSlidesCount = this.slides.length
    this.slides = filterSlides(this.slides)
    const afterSlidesCount = this.slides.length
    const diff = afterSlidesCount - prevSlidesCount
    this.currentSlideIndex += diff
  },
  activateNextSlide () {
    // eagerly filter based on schedule
    this.applyScheduling()

    if (this.hasNextSlide()) {
      this.incrementIndex()
    } else {
      this.resetIndex()
    }
  },
  incrementIndex () {
    this.currentSlideIndex += 1
  },
  resetIndex () {
    this.currentSlideIndex = 0
  },
  hasNextSlide () {
    return (this.currentSlideIndex + 1) < this.slides.length
  }
}

export async function init () {
  const {list, variant, qrProxyParams} = getQueryParams()
  if (qrProxyParams.length) {
    console.info('init(): using the following query parameters in the qr link:')
    console.table(qrProxyParams)
    state.qrProxyParams = qrProxyParams
  } else {
    console.warn('init(): no query parameters found for the qr link')
  }

  const slides = await fetchSlides({list})
  if (slides && slides.length) {
    // initial filter based on schedule
    state.slides = filterSlides(slides)
    // load plugins
    const enabledPlugins = state.slides.reduce((acc, curr) => {
      if (!acc.brightcove) {
        acc.brightcove = !!curr.brightcoveId
      }
      return acc
    }, {})
    Object.keys(enabledPlugins).forEach((pluginHandle) => {
      if (!enabledPlugins[pluginHandle]) return
      state.plugins.load(pluginHandle, (err, state) => {
        if (err) console.error(err)
        if (state) console.info(`Plugin "${pluginHandle}"`, state)
      })
    })
  }

  $('.t-display').addClass(`t-display--variant-${variant || 1}`).addClass('is-initialized')
  if (!variant) console.warn('init(): "variant" query parameter missing, falling back to variant 1.')

  await isDisplayInitialized()

  if (state.slides.length > 1) {
    fillContentIntoNextSlide()
    state.activateNextSlide()
    scheduleNextSlide({initial: true})
    swapSlides({initial: true})
  }

  // scope toggle
  $('.t-display').on('click', function() {
    $('.a-scope-mask').toggleClass('is-active')
  })
}

function isDisplayInitialized () {
  return new Promise((resolve) => {
    const intervalId = window.setInterval(() => {
      const isInitialized = $('.t-display').hasClass('is-initialized')
      if (!isInitialized) return

      window.clearInterval(intervalId)
      return resolve()
    }, 100)
  })
}

function scheduleNextSlide ({initial}) {
  const slideData = state.getLastSlide({offset: initial ? 0 : 1})
  // NOTE: Reload slides after a full run
  if (!initial && state.slides[0].id === slideData.id) {
    window.location.reload()
  }
  const duration = slideData.config.duration || config.defaults.slideDuration
  const durationMs = duration * 1000
  $('.a-progress__bar').css('transition-duration', `${durationMs}ms`)
  window.setTimeout(() => swapSlides({initial: false}), durationMs)
}

function swapSlides ({initial}) {
  const previousSlide = $('.m-slide.is-previous')
  const currentSlide = $('.m-slide.is-current')
  const nextSlide = $('.m-slide.is-next')

  nextSlide.removeClass('is-next').addClass('is-current').removeClass('is-uninitialized')
  currentSlide.removeClass('is-current').addClass('is-previous')
  previousSlide.removeClass('is-previous').addClass('is-next')

  fillContentIntoNextSlide()

  state.activateNextSlide()

  if (!initial) {
    scheduleNextSlide({initial})
  }
}

function fillContentIntoNextSlide () {
  const nextSlide = $('.m-slide.is-next')
  const flag = nextSlide.find('.m-slide__flag')
  const title = nextSlide.find('.m-slide__title')
  const source = nextSlide.find('.m-slide__source')
  const imageWrapper = nextSlide.find('.m-slide__image')
  if (!$('img', imageWrapper).length) {
    imageWrapper.append('<img />')
  }
  const image = nextSlide.find('.m-slide__image img')
  const setImageSource = (imgSrc) => {
    if (!imgSrc) return

    const currentImageElementWidth = Math.ceil((image.width() || 0) * 1.2)
    try {
      const imgSrcUrl = new URL(imgSrc)
      const imgSrcWidth = parseInt(imgSrcUrl.searchParams.get('w'))
      if (isNaN(imgSrcWidth) || imgSrcWidth > currentImageElementWidth) {
        image.attr('src', imgSrc)
      } else {
        imgSrcUrl.searchParams.set('w', currentImageElementWidth)
        image.attr('src', imgSrcUrl.toString())
      }
    } catch (err) {
      console.error(err)
      image.attr('src', imgSrc)
    }
  }
  const qrWrapper = nextSlide.find('.a-qr-code')
  const qr = nextSlide.find('.a-qr-code__code')
  const slideData = state.getCurrentSlide()

  if (slideData.flag) {
    flag.text(slideData.flag)
  } else {
    flag.text(config.defaults.slideText)
  }

  if (slideData.title) {
    title.text(slideData.title)
  } else {
    title.text(config.defaults.slideText)
  }

  if (slideData.imageSource) {
    source.text(slideData.imageSource)
  } else {
    source.text(config.defaults.slideText)
  }

  // First tries to get the closest ratio in case there are crops
  // Otherwise takes the regular url with original ratio
  // Fallback is empty image
  if (slideData.imageCrops) {
    const imageRatio = image.width() / image.height()
    const closest = slideData.imageCrops.reduce((prev, curr) => {
      const prevRatio = prev.width / prev.height
      const currRatio = curr.width / curr.height
      if (Math.abs(currRatio - imageRatio) < Math.abs(prevRatio - imageRatio)) {
        return curr
      }
      return prev
    })
    if (closest && closest.url) {
      setImageSource(closest.url)
    } else {
      setImageSource(slideData.imageUrl)
    }
  } else if (slideData.imageUrl) {
    setImageSource(slideData.imageUrl)
  } else {
    setImageSource(config.defaults.slideImage)
  }

  $('.acm_ads_banner_config', imageWrapper).remove()
  $('.acm_ads__container', imageWrapper).remove()
  if (slideData.brightcoveId) {
    imageWrapper.append(`
      <script class="acm_ads_banner_config" type="application/json">
        {"background":{"blur":0,"bid":"${slideData.brightcoveId}"}}
      </script>
    `)
  }

  if (slideData.config.qrHidden) {
    qrWrapper.addClass('is-hidden')
  } else {
    qrWrapper.removeClass('is-hidden')
  }

  if (slideData.config.ctaText) {
    qrWrapper.attr('data-content', slideData.config.ctaText)
  } else {
    qrWrapper.attr('data-content', config.defaults.qrCtaText)
  }

  const qrLinkWithParams = appendQueryParams(slideData.qrLink, state.qrProxyParams)
  QRCode.toDataURL(qrLinkWithParams, {margin: 1})
    .then(url => {
      qr.attr('src', url)
    })
    .catch(err => {
      console.error(err)
    })
}
