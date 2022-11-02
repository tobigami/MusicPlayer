/**
 * 1. Render Song
 * 2. Scroll top
 * 3. Play, pause, seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view 
 * 10. Play song when click
 */

const PLAYER_STORAGE_KEY = 'Music-Player'
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playList = $('.playlist')
const cd = $('.cd')
const h2 = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')



const app = {
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  currentIndex: 0,
  songs: [
    {
      name: 'Seeking Change',
      singer: 'Yasumu',
      path: './src/music/song3.mp3',
      image: 'https://i.scdn.co/image/ab67616d00001e020a45e522ae21b0ad6f7d9120'
    },
    {

      name: 'Riverside',
      singer: 'Slo Loris',
      path: './src/music/song1.mp3',
      image: 'https://f4.bcbits.com/img/a4281264070_10.jpg'
    },
    {
      name: 'The Broken Parts',
      singer: 'Dimension 32',
      path: './src/music/song2.mp3',
      image: 'https://i.scdn.co/image/ab67616d00001e02b637b8d767b8ae9887f0dc52'
    },

    {
      name: 'your colors',
      singer: "Nvmb",
      path: './src/music/song4.mp3',
      image: 'https://i.scdn.co/image/ab67616d00001e02074d6d1e3f2320b11eb61dba'
    },
    {
      name: 'Towards The Mountains',
      singer: 'Plant Guy',
      path: './src/music/song5.mp3',
      image: 'https://f4.bcbits.com/img/a1824673371_16.jpg'
    },
    {
      name: 'Nuit Douce',
      singer: 'Phlocalyst x Myríad',
      path: './src/music/song6.mp3',
      image: 'https://i.scdn.co/image/ab67616d00001e02471defe38bdefc20d54d96a6'
    },
    {
      name: 'Midnight blue',
      singer: 'softy x Otis Ubaka',
      path: './src/music/song7.mp3',
      image: 'https://i.scdn.co/image/ab67616d00001e025bf7d67baf99ac6e986f8ecc'
    },
    {
      name: 'Stuck in Æther',
      singer: 'Raimu',
      path: './src/music/song8.mp3',
      image: 'https://i.scdn.co/image/ab67616d00001e02036293f7436030635f167559'
    }
  ],
  defineProperties() {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex]
      }
    })
  },
  render() {
    let x = this.songs.map((song, index) => {
      return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
      <div
        class="thumb"
        style="
          background-image: url('${song.image}');
        "
      ></div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>
  `}).join('')
    playList.innerHTML = x
  },
  handleEvents() {

    /** xoay cd */
    const cdAnimate = cdThumb.animate([{
      transform: 'rotate(360deg)'
    }], {
      duration: 30000,
      iterations: Infinity
    })
    cdAnimate.pause()


    /** handle scroll top */
    const that = this
    const cdWidth = cd.offsetWidth
    document.onscroll = function () {
      const newCdWidth = cdWidth - window.scrollY
      cd.style.width = newCdWidth < 0 ? 0 : newCdWidth + 'px'
      cd.style.opacity = newCdWidth / cdWidth
    }

    /** handle btn play and pause */
    playBtn.onclick = function () {
      if (that.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
    }

    /** handle logic khi audio play and pause */
    audio.onplay = function () {
      cdAnimate.play()
      that.isPlaying = true
      player.classList.add('playing')
    }

    audio.onpause = function () {
      cdAnimate.pause()
      that.isPlaying = false
      player.classList.remove('playing')
    }

    /** handle process bar  */
    audio.ontimeupdate = function () {
      if (audio.duration) {
        progress.value = Math.floor(audio.currentTime / audio.duration * 100)
      }
    }

    /** handle tua bai hat*/
    progress.onchange = function (e) {
      audio.currentTime = e.target.value / 100 * audio.duration
    }

    /** next song */
    nextBtn.onclick = function () {
      if (that.isRandom) {
        that.randomSong()
      } else {
        that.nextSong()
      }
      audio.play()
      that.render()
      that.scrollToActiveSong()

    }
    /** pre song */
    preBtn.onclick = function () {
      if (that.isRandom) {
        that.randomSong()
      } else {
        that.preSong()
      }
      audio.play()
      that.render()
      that.scrollToActiveSong()
    }

    /** random song */
    randomBtn.onclick = function () {
      that.isRandom = !that.isRandom
      randomBtn.classList.toggle('active', that.isRandom)
    }

    /** repeat song */
    repeatBtn.onclick = function () {
      that.isRepeat = !that.isRepeat
      repeatBtn.classList.toggle('active', that.isRepeat)
    }

    /** xu ly khi het bai hat */
    audio.onended = function () {
      if (that.isRepeat) {
        audio.play()
      } else {
        nextBtn.click()
      }
    }

    /** xu ly chuyen bai khi click vào list */
    playList.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)')
      console.log(songNode)
      if (songNode || e.target.closest('.option')) {
        if (songNode) {
          that.currentIndex = Number(songNode.dataset.index)
          that.loadCurrentSong()
          that.render()
          audio.play()
        }
        if (e.target.closest('.option')) {
          console.log('...')
        }
      }
    }
  },

  randomSong() {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },

  nextSong() {
    this.currentIndex++
    if (this.currentIndex > (this.songs.length - 1)) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },

  preSong() {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },
  loadCurrentSong() {
    h2.innerText = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },
  scrollToActiveSong() {
    setTimeout(() => {

      $('.song.active').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    }, 200)

  },

  start: function () {
    this.defineProperties()
    this.loadCurrentSong()
    this.handleEvents()
    this.render()
  }
}

app.start()
