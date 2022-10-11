/**
 * 1. Render Song -> oke
 * 2. Scroll top -> oke
 * 3. Play, pause, seek -> oke
 * 4. CD rotate -> oke
 * 5. Next / prev -> oke
 * 6. Random -> oke
 * 7. Next / Repeat when ended -> oke
 * 8. Active song -> oke
 * 9. Scroll active song into view 
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const process = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
  currentIndex: 0,
  isRepeat: false,
  isPlaying: false,
  isRandom: false,
  songs: [
    {
      name: 'Enemy',
      singer: 'Imagine Dragons; JID',
      path: 'https://data25.chiasenhac.com/download2/2204/2/2203663-f258f539/128/Enemy%20-%20Imagine%20Dragons_%20JID.mp3',
      image: 'https://data.chiasenhac.com/data/cover/150/149149.jpg'
    },
    {
      name: 'Prisoner',
      singer: 'Miley Cyrus; Dua Lipa',
      path: 'https://data17.chiasenhac.com/downloads/2153/2/2152008-22fa8023/32/Prisoner%20-%20Miley%20Cyrus_%20Dua%20Lipa.m4a',
      image: 'https://data.chiasenhac.com/data/cover/136/135633.jpg'
    },
    {
      name: 'Bones',
      singer: "Imagine Dragons",
      path: 'https://data.chiasenhac.com/down2/2230/2/2229772-6cece5f8/128/Bones%20-%20Imagine%20Dragons.mp3',
      image: 'https://data.chiasenhac.com/data/cover/158/157119.jpg'
    },
    {
      name: 'Bang Bang',
      singer: "Dua Lipa",
      path: 'https://data00.chiasenhac.com/downloads/1839/2/1838543-26bce20f/128/Bang%20Bang%20-%20Dua%20Lipa.mp3',
      image: 'https://data.chiasenhac.com/data/cover/79/78460.jpg'
    },
    {
      name: 'Sweetest Pie',
      singer: 'Megan Thee Stallion; Dua Lipa',
      path: 'https://data.chiasenhac.com/down2/2230/2/2229771-1b776d5d/128/Sweetest%20Pie%20-%20Megan%20Thee%20Stallion_%20Dua.mp3',
      image: 'https://data.chiasenhac.com/data/cover/158/157118.jpg'
    },
    {
      name: 'Lost In Your Light',
      singer: 'Dua Lipa',
      path: 'https://data3.chiasenhac.com/downloads/1783/2/1782726-92d2dbcc/32/Lost%20In%20Your%20Light%20-%20Dua%20Lipa_%20Miguel.m4a',
      image: 'https://data.chiasenhac.com/data/cover/71/70925.jpg'
    },
    {
      name: 'No Lie',
      singer: 'Dua Lipa',
      path: 'https://data38.chiasenhac.com/downloads/1867/2/1866014-959dd19d/32/No%20Lie%20-%20Sean%20Paul_%20Dua%20Lipa.m4a',
      image: 'https://data.chiasenhac.com/data/cover/83/82078.jpg'
    },
    {
      name: 'Bên Trên Tầng Lầu',
      singer: 'Tăng Duy Tân',
      path: 'https://data.chiasenhac.com/down2/2270/2/2269173-465faf9b/128/Ben%20Tren%20Tang%20Lau%20House%20Remix_%20-%20Tang%20Du.mp3',
      image: 'https://data.chiasenhac.com/data/cover/172/171912.jpg'
    }

  ],
  // Render songs (DOM event)
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${index === this.currentIndex ? 'active' : ""}" data-index="${index}">
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
      `
    })
    playList.innerHTML = htmls.join('');
  },
  // create new property get current song  for Object app
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      }
    })
  },
  handleEvents: function () {
    const that = this
    // xu ly hoat anh xoay cua cd
    const cdThumbAnimate = cdThumb.animate(
      [{ transform: 'rotate(360deg)' }], {
      duration: 30000,
      iterations: Infinity
    })
    cdThumbAnimate.pause()
    // scroll top
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrolltop = document.documentElement.scrollTop || window.scrollY
      const newCdWidth = cdWidth - scrolltop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    }
    // playing song
    playBtn.onclick = function () {
      if (that.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }

      audio.onplay = function () {
        that.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
      }

      audio.onpause = function () {
        that.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      }

      // xu ly nut process chay theo % bai hat
      audio.ontimeupdate = function () {
        if (audio.duration) {
          const processPercen = Math.floor(audio.currentTime / audio.duration * 100);
          process.value = processPercen
        }
      }
      //  xu ly hanh dong tua bai hat
      process.onchange = function (e) {
        const seek = e.target.value / 100 * audio.duration
        audio.currentTime = seek
      }

    }
    // next song
    nextBtn.onclick = function () {
      if (that.isRandom) {
        that.playRandomSong()
      } else {
        that.nextsong()
      }
      playBtn.click()
      audio.play()
      that.render()
      that.scrollToActiveSong()
      // console.log(that.currentIndex)
    }

    prevBtn.onclick = function () {
      if (that.isRandom) {
        that.playRandomSong()
      } else {
        that.prevsong()
      }
      playBtn.click()
      audio.play()
      that.render()
      that.scrollToActiveSong()
      // console.log(that.currentIndex)
    }
    // chuc nang phat nhac random
    randomBtn.onclick = function (e) {
      that.isRandom = !that.isRandom
      randomBtn.classList.toggle('active', that.isRandom)
    }

    // next bai khi ket thuc
    audio.onended = function () {
      if (that.isRepeat) {
        audio.play()
      } else {
        nextBtn.click()
      }
    }
    // repeat bai hat
    repeatBtn.onclick = function () {
      that.isRepeat = !that.isRepeat
      repeatBtn.classList.toggle('active', that.isRepeat)
    }

    // listen hanh vi click vao playList 
    playList.onclick = function (e) {
      const songOption = e.target.closest('.option')
      const songNode = e.target.closest('.song:not(.active)')
      if (songNode || songOption) {
        if (songNode && !songOption) {
          that.currentIndex = Number(songNode.dataset.index)
          that.loadCurrentSong()
          that.render()
          playBtn.click()
          audio.play()
        }

      }

      function newFunction() {
        console.log(songNode.datset.index)
      }
    }
  },

  nextsong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
    // console.log(this.currentIndex, this.songs.length) show for debug
  },
  prevsong: function () {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
    // console.log(this.currentIndex, this.songs.length) show for debug
  },
  playRandomSong: function () {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },

  scrollToActiveSong: function () {
    setTimeout(function () {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 50)
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path

  },
  start: function () {
    // new properties
    this.defineProperties()

    // process behavior
    this.handleEvents()

    // loading current song
    this.loadCurrentSong()

    // render list song 
    this.render()

  }

}
app.start();