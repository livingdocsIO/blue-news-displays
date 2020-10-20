const data = {
  "slides":[
    {
      "flag":"Mehr 100 km/h zu schnell, illegale Strassenrennen und Gefährdung anderer Verkehrsteilnehmer",
      "title":"Raserrennen und Tempo-Exzesse",
      "imageUrl": "../assets/preview-content/teaser-image-1.jpg",
      "QRlink": "https://www.bluewin.ch/de/news/schweiz/gefaengnis-fuer-zwei-raser-gefordert-451194.html"
    },
    {
      "flag":"241 Kilogramm schwere Kirschtorte, die eine Zuger Confiserie Anfang Jahr gebacken hatte, ist offenbar die Grösste der Welt",
      "title":"Riesen-Kirschtorte aus Zug bricht Rekord",
      "imageUrl": "../assets/preview-content/teaser-image-2.jpg",
      "QRlink": "https://www.bluewin.ch/de/news/vermischtes/riesen-kirschtorte-aus-zug-bricht-rekord-451135.html"
    },
    {
      "flag":"Bei neuen Massenprotesten in Belarus gegen Staatschef Alexander Lukaschenko am Wochenende sind 280 Menschen festgenommen worden",
      "title":"280 Festnahmen bei Protesten gegen Lukaschenko",
      "imageUrl": "../assets/preview-content/teaser-image-3.jpg",
      "QRlink": "https://www.bluewin.ch/de/news/international/280-festnahmen-in-belarus-bei-protesten-gegen-lukaschenko-451223.html"
    },
    {
      "flag":"Über die Umbenennung der Basler St. Jakobshalle in Roger-Federer-Arena gibt es keine Volksabstimmung",
      "title":"Zu wenige Basler wollen eine Roger-Federer-Arena",
      "imageUrl": "../assets/preview-content/teaser-image-4.jpg",
      "QRlink": "https://www.bluewin.ch/de/sport/tennis/zu-wenige-basler-wollen-eine-roger-federer-arena-451227.html"
    },
    {
      "flag":"Bald ist es so weit: Am 20. Oktober startet die Champions-League-Saison 2020/21. Verfolgen Sie alle Spiele live auf blue Sport",
      "title":"2 Monate geschenkt - Die Champions League ist zurück – live auf blue Sport!",
      "imageUrl": "../assets/preview-content/teaser-image-5.jpg",
      "QRlink": "https://www.blue.ch/de/sport"
    },
    {
      "flag":"Britto fehlt dem FCZ mehrere Wochen",
      "title":"Der FC Zürich muss mehrere Wochen auf Willie Britto verzichten",
      "imageUrl": "../assets/preview-content/teaser-image-6.jpg",
      "QRlink": "https://www.bluewin.ch/de/sport/fussball-schweiz/britto-fehlt-dem-fcz-mehrere-wochen-451115.html"
    },
    {
      "flag":"Erfahren Sie, welche 17 Kandidatinnen Alanz Herzen erobern wollen",
      "title":"«What to Watch» Es wird wieder viel geflirtet und der Fremdschäm-Faktor ist garantiert",
      "imageUrl": "../assets/preview-content/teaser-image-7.jpg",
      "QRlink": "https://www.bluewin.ch/de/entertainment/tv-film/danke-bachelor-endlich-macht-der-montag-wieder-sinn-451226.html"
    },
    {
      "flag":"Momente, in denen Frau im Boden versinken möchte",
      "title":"Wie kommt es dazu, dass wir manchmal am liebsten im Boden versinken würden?",
      "imageUrl": "../assets/preview-content/teaser-image-8.jpg",
      "QRlink": "https://www.bluewin.ch/de/leben/lifestyle/momente-in-denen-frau-im-boden-versinken-moechte-449435.html"
    },
    {
      "flag":"Geht das wirklich? Wir haben es getestet",
      "title":"Google erkennt Lieder durch Vorsummen",
      "imageUrl": "../assets/preview-content/teaser-image-9.jpg",
      "QRlink": "https://www.bluewin.ch/de/digital/google-erkennt-lieder-durch-vorsummen-451139.html"
    },
    {
      "flag":"Endgegner für Playstation 5?",
      "title":"Die Xbox hat noch ein grosses Ass im Ärmel",
      "imageUrl": "../assets/preview-content/teaser-image-10.jpg",
      "QRlink": "https://www.bluewin.ch/de/digital/games/die-xbox-hat-noch-ein-grosses-ass-im-aermel-451114.html"
    },
    {
      "flag":"Scanne den Code und erhalte 2 Monate geschenkt",
      "title":"Birds of Prey auf blue TV",
      "imageUrl": "../assets/preview-content/teaser-image-11.jpg",
      "QRlink": "https://www.blue.ch/de/filme-und-serien/max"
    }
  ]
}

let indexSlide = 0
let numSlides = 0

function init() {
  const timePerSlide = 15000
  const timeToInitialize = 250
  numSlides = data.slides.length

  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const variant = urlParams.get('variant') || 1

  $('.m-slide').addClass(`m-slide--variant-${variant}`)

  window.setInterval(swapSlides, timePerSlide)

  fillContentIntoNextSlide()

  window.setTimeout(function(){
    if (numSlides > 1) indexSlide++

    swapSlides()
  }, timeToInitialize)

  $('.t-display').on( "click", function() {
    toggleScope()
  })
}

function fillContentIntoNextSlide() {
  const nextSlide = $('.m-slide.is-next')
  const flag = nextSlide.find('.m-slide__flag')
  const title = nextSlide.find('.m-slide__title')
  const image = nextSlide.find('.m-slide__image img')
  const QR = nextSlide.find('.a-qr-code__code')
  const slideData = data.slides[indexSlide]

  flag.text(slideData.flag)
  title.text(slideData.title)
  image.attr('src', slideData.imageUrl)
  QR.attr('src', `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${slideData.QRlink}`)
}

function swapSlides() {
  const previousSlide = $('.m-slide.is-previous')
  const currentSlide = $('.m-slide.is-current')
  const nextSlide = $('.m-slide.is-next')

  nextSlide.removeClass('is-next').addClass('is-current').removeClass('is-uninitialized')
  currentSlide.removeClass('is-current').addClass('is-previous')
  previousSlide.removeClass('is-previous').addClass('is-next')

  fillContentIntoNextSlide()

  indexSlide++
  if (indexSlide > numSlides) indexSlide = 0
}

function toggleScope() {
  $('.a-scope-mask').toggleClass('is-active')
}

$(window).on( "load", function() {
  init()
})
