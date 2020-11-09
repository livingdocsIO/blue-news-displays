import $ from 'jquery'
import QRCode from 'qrcode'
import { getQueryParams } from './get_query_params'
import { fetchSlides } from './fetch_slides'
import config from '../config'
import { appendQueryParams } from './append_query_params'

const state = {
  qrProxyParams: [],
  slides: [],
  currentSlideIndex: 0,
  getCurrentSlide () {
    return this.slides[this.currentSlideIndex]
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

  $('.m-slide').addClass(`m-slide--variant-${variant || 1}`)
  if (!variant) console.warn('init(): "variant" query parameter missing, falling back to variant 1.')

  const slides = await fetchSlides({list})
  if (slides && slides.length) {
    state.slides = slides
  }

  if (state.slides.length > 1) {
    fillContentIntoNextSlide()
    state.activateNextSlide()
    scheduleNextSlide()
    swapSlides({initial: true})
  }

  // scope toggle
  $('.t-display').on('click', function() {
    $('.a-scope-mask').toggleClass('is-active')
  })
}

function scheduleNextSlide () {
  const slideData = state.getCurrentSlide()
  const duration = slideData.config.duration || config.defaults.slideDuration
  window.setTimeout(() => swapSlides({initial: false}), duration * 1000)
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
    scheduleNextSlide()
  }
}

function fillContentIntoNextSlide () {
  const nextSlide = $('.m-slide.is-next')
  const flag = nextSlide.find('.m-slide__flag')
  const title = nextSlide.find('.m-slide__title')
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

  if (slideData.imageUrl) {
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
  QRCode.toDataURL(qrLinkWithParams)
    .then(url => {
      qr.attr('src', url)
    })
    .catch(err => {
      console.error(err)
    })
}
