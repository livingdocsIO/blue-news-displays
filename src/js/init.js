import $ from 'jquery'
import QRCode from 'qrcode'
import config from '../config'
import { getQueryParams } from './get_query_params'
import { fetchSlides } from './fetch_slides'
import { appendQueryParams } from './append_query_params'

const state = {
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
  activateNextSlide () {
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
    state.slides = slides
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
  const image = nextSlide.find('.m-slide__image img')
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
    const imageRatio = image.width / image.height
    const closest = slideData.imageCrops.reduce((prev, curr) => {
      const prevRatio = prev.width / prev.height
      const currRatio = curr.width / curr.height
      if (Math.abs(currRatio - imageRatio) < Math.abs(prevRatio - imageRatio)) {
        return curr
      }
      return prev
    })
    if (closest && closest.url) {
      image.attr('src', closest.url)
    } else {
      image.attr('src', slideData.imageUrl)
    }
  } else if (slideData.imageUrl) {
    image.attr('src', slideData.imageUrl)
  } else {
    image.attr('src', config.defaults.slideImage)
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
