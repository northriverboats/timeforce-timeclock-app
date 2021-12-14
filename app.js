import { createApp } from 'https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js'

createApp({
  // exposed to all expressions
  clock: true,
  line1: '',
  line2: '',
  line3: '',
  line4: '',
  line5: '',

  count: 0,
  timer: 0,
  formatted: '',
  ,

  // getters
  get plusOne() {
    return this.count + 1
  },

  // methods
  increment() {
    this.count++
  },

  formatTime() {
    const d = new Date();
    let time = d.getTime();
    let month = ("0"+ (d.getMonth()+1).toString()).slice(-2)
    let day = ("0"+ d.getDate().toString()).slice(-2)
    let year = d.getYear() + 1900
    let hrs =  ("0"+ d.getHours().toString()).slice(-2)
    let pm = 'AM'
    if (d.getHours() > 12) {
        hrs =  ("0"+ (d.getHours()-12).toString()).slice(-2)
        pm = 'PM'
    }
    let mins = d.getMinutes()
    this.formatted = `${month}/${day}/${year} ${hrs}:${mins}${pm}`
  },

  enableClock() {
     this.timer = window.setInterval(() => this.formatTime(), 1000)
  },

  disableClock() {
    window.clearTimeout(this.timer)
  },

  startUp() {
    console.log('starting')
    this.enableClock()
  },

}).mount()
