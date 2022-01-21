import { createApp } from 'https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js'
const x = String.fromCharCode(160)
var that = ''
var t1 = ''

function getId() {
  return `${Date.now()}:${Math.random()}`
}

function runWithLock(key, fn, { timeout=1000, lockWriteTime=50, checkTime=10, retry=true} = {}) {
  const timerRunWithLock = () => setTimeout(runWithLock.bind(null, key, fn, { timeout, lockWriteTime, checkTime, retry }), checkTime);
  const result = localStorage.getItem(key);
  if (result) {

    // Check to make sure the lock hasn't expired
    const data = JSON.parse(result);
    if (data.time >= Date.now() - timeout) {
      if (retry) {
        timerRunWithLock();
      }
      return;
    } else {
      localStorage.removeItem(key);
    }
  }
  const id = getId();
  localStorage.setItem(key, JSON.stringify({id, time: Date.now()}));

  // Delay a bit, to see if another worker is in this section
  setTimeout(() => {
    const currentResult = localStorage.getItem(key);
    const data = JSON.parse(currentResult);
    if (data.id !== id) {
      if (retry) {
        timerRunWithLock();
      }
      return;
    }

    try {
      fn();
    } finally {
      localStorage.removeItem(key);
    }
  }, lockWriteTime);
}

// https://github.com/taylorhakes/localstorage-lock
function tryRunWithLock(key, fn, { timeout=1000, lockWriteTime=50, checkTime=10}) {
  runWithLock(key, fn, {timeout, lockWriteTime, checkTime, retry: false});
}

createApp({
  // exposed to all expressions
  spaces: x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x+x,
  autoEnter : false,
  mode: 'waiting',
  ready: x+x+x+x+x+x+x+x+x+x+x+'-- READY --',
  line1: x,
  line2: x,
  line3: x,
  line4: x,
  line5: x,
  line6: x,
  line7: x,
  line8: x,

  employees: {},
  departments: {},
  jobs: {},
  tasks: {},

  count: 0,
  timer: 0,
  line1: '00/00/0000  00:00AM',

  ipAddress: '10.10.200.254',

  punch5min: 70,
  punch5sec: 0,
  punch15min: 70,
  punch15sec: 0,

  card: '',
  employeeName: '',
  io_Status: '?',         // ?=none, I=In, O=Out
  Status: 0,             // 0=Idle, 1=card, 2=Waiting
  dept: '',
  deptName: '',
  deptType: 0,            // 0=Override, 1=Transfer
  job: '',
  jobName: '',
  task: '',
  taskName: '',
  taskDeptName: '',
  ClockID: 1,
  LastServerTime: 0,
  LastLocalTime: 0,

  // Generic Functions ========================================================
  diagnostic(text) {
    console.log(text)
  },

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  },

  handleTimeEvents() {
    this.formatTime()
    var digital = new Date()
    const seconds = digital.getSeconds()
    const minutes = digital.getMinutes()
    const hours = digital.getHours()
    if (seconds == this.punch5sec && minutes % 5 == 0 && minutes != this.punch5min) {
      this.sendPunches()
      this.punch5min = minutes
      this.punch5sec = this.getRandomInt(12) * 5
    }
    if (seconds == this.punch15sec && minutes % 15 == 1 && minutes != this.punch15min) {
      this.refreshTimeforceData()
      this.punch15min = minutes
      this.punch15sec = this.getRandomInt(12) * 5
    }
  },

  formatTime() {
    var digital = new Date()
    var hours1 = digital.getHours()
    var minutes1 = digital.getMinutes()
    var month1 = digital.getMonth()+1
    var day1 = digital.getDate()
    var year1 = digital.getYear()
    var amOrPm = "AM"

    if (day1 < 10) day1 = "0" + day1
    if (month1 < 10) month1 = "0" + month1
    if (hours1 > 11) amOrPm = "PM"
    if (hours1 > 12) hours1 = hours1 - 12
    if (hours1 == 0) hours1 = 12
    if (hours1 < 10) hours1 = "0" + hours1
    if (minutes1 <= 9) minutes1 = "0" + minutes1;
    this.line1 = `${month1}/${day1}/${year1} ${hours1}:${minutes1}${amOrPm}`
    this.LastLocalTime = digital
    this.LastServerTime = digital
  },

  refreshTimeforceData() {
    this.getDepartments()
    this.getEmployees()
    this.getJobs()
    this.getTasks()
  },

  sendPunches() {
    // future home of send punches code
  },

  // Update Display Functions =================================================
  blob() {
    this.diagnostic(`mode: ${this.mode} -- card: ${this.card} -- employee: ${this.employeeName} -- dept: ${this.dept} -- dname: ${this.deptName} -- task: ${this.task} -- tname: ${this.taskName}`)
  },

  displayReady() {
    return this.mode == 'waiting' ? this.ready : ''
  },

  displayMakeSelection() {
    if (!this.autoEnter && this.employeeName && this.mode == 'card') {
      return x+x+x+x+x+x+x+x+x+'Make Selections'
    } else if (this.mode == 'job' && this.jobName ) {
      return x+x+x+x+x+x+x+x+x+'Make Selections'
    }
    return x
  },

  displayPressEnter() {
    if (!this.autoEnter && this.employeeName && this.mode == 'card') {
      return x+x+x+x+x+x+x+'Then Press [ENTER]'
    } else if (this.mode == 'dept' && this.deptName) {
      return x+x+x+x+x+x+x+x+x+'Press [ENTER]'
    } else if (this.mode == 'task' && this.taskName) {
      return x+x+x+x+x+x+x+x+x+'Press [ENTER]'
    } else if (this.mode == 'job' && this.jobName ) {
      return x+x+x+x+x+x+x+'Then Press [ENTER]'
    }
    return x
  },

  displayCardLine() {
    if (this.mode == 'waiting') {
      return x
    }
    const total = this.employeeName.length + this.card.length
    const spaces = this.spaces.substring(0, 19)
    var ending = ''
    if (this.io_status == 'I') {
      ending = x+'(IN)'
    } else if (this.io_status == 'O') {
      ending = '(OUT)'
    }
    return `Card:${this.card}${x}${spaces}${x}${ending}`
  },

  displayNameLine() {
    return this.employeeName ? x+x+x+x+x+this.employeeName.substring(0,30) : x
  },

  displayDeptLine() {
    if (!this.deptName&&this.mode!='dept') {
      return x
    }
    const total = this.dept.length + this.deptName.length
    const dept = `Dept:${this.dept}${x}${this.deptName}`
    return dept
  },

  displayTransferOverride() {
    if (this.mode == 'dept') {
      const dept = this.deptType ? '(Transfer)' : '(Override)'
      return x+x+x+x+x+x+x+x+x+x+x+dept
    }
    return x 
  },

  displayJobLine() {
    return (!(this.mode == 'job' || this.mode == 'task')) ? x : `Job:${this.job}`
  },

  displayJobNameLine() {
    return this.jobName ? x+x+x+x+this.jobName.substring(0,30) : x
  },

  displayTaskLine() {
    return this.mode == 'task' ? 'Task:' + (this.task+x+x+x+x).substring(0,4) + this.taskDeptName : x
  },

  displayTaskName() {
    return this.mode == 'task' ? x+x+x+x+this.taskName.substring(0, 30) : x
  },

  // only the first item on line needs to return an 'x' if it is unused
  displayUpdate() {
    this.line2 = this.displayCardLine()
    this.line3 = this.displayNameLine()
    this.line4 = this.displayDeptLine() + this.displayJobLine() + this.displayReady()
    this.line5 = this.displayTransferOverride() + this.displayJobNameLine()
    this.line6 = this.displayTaskLine()
    this.line7 = this.displayMakeSelection() + this.displayTaskName()
    this.line8 = this.displayPressEnter()

  },

  // Handle Click Functions ===================================================
  digitClick(digit) {
    if (this.mode == 'waiting') {
      this.diagnostic('Mode: card')
      this.mode = 'card'
    }
    if (this.mode == 'card' && this.card.length < 4) {
      this.card = this.card + digit
      this.diagnostic(`- key ${digit}`)
      if (this.employees[this.card]) {
        this.employeeName = this.employees[this.card]['fullname']
        this.diagnostic(`- Employee: ${this.employeeName}`)
      } else {
        this.employeeName = ''
        if (this.card.length == 4) {
          this.diagnostic('- Employee: -- Not Found --')
        }
      }
    } else if (this.mode == 'dept' && this.dept.length < 4) {
      this.dept = this.dept + digit
      this.diagnostic(`- key ${digit}`)
      if (this.departments[this.dept]) {
        this.deptName = this.departments[this.dept]['departmentname'] || ''
        this.diagnostic(`- Dept: ${this.deptName}`)
      } else {
        this.deptName = ''
        this.diagnostic('- Dept: -- Not Found --')
      }
    } else if(this.mode == 'job' && this.job.length < 10) {
      this.job = this.job + digit
      this.diagnostic(`- key ${digit}`)
      if (this.jobs[this.job]) {
        this.jobName = this.jobs[this.job]['jobname']+ ' ' + (this.jobs[this.job]['jobdescription'] || '')
        this.diagnostic(`- Job: ${this.jobName}`)
      } else {
        this.jobName = ''
        this.diagnostic('- Job: -- Not Found --')
      }
    } else if(this.mode == 'task' && this.task.length < 4) {
      this.task = this.task + digit
      this.diagnostic(`- key ${digit}`)
      if (this.tasks[this.task]) {
        this.taskName = this.tasks[this.task]['taskname'] || ''
        this.taskDeptName = this.tasks[this.task]['departmentname'] || ''
        this.taskDeptName = (this.taskDeptName == 'Out' ? 'Outfitting' : this.taskDeptName)
        this.taskDeptName = (this.taskDeptName == 'Fab' ? 'Fabrication' : this.taskDeptName)
        this.diagnostic(`- Task: ${this.taskName}`)
      } else {
        this.taskName = ''
        this.taskDeptName = ''
        this.diagnostic('- Task: -- Not Found --')
      }
    }
    this.displayUpdate()
  },

  inoutClick(type) {
    if (!this.card) {
      return
    }
    const char = type.charAt(0)
    if (char === 'I' && this.io_status == 'I') {
      this.io_status = '?'
    } else if (char === 'I'){
      this.io_status = char
    } else if (char === 'O' && this.io_status == 'O') {
      this.io_status = '?'
    } else if (char === 'O'){
      this.io_status = char
    }
    this.displayUpdate()
  },

  enterClick() {
    if(this.mode == 'card' && this.employeeName )  {
        this.diagnostic('submitting card')
    }
  },

  clearClick() {
    if (this.mode=='task' && this.task) {            // task
      this.diagnostic('- clear job')
      this.task = ''
      this.taskName = ''
      this.taskDeptName = ''
    } else if (this.mode=='task') {
      this.diagnostic('Mode: job')
      this.mode = 'job'
    } else if (this.mode=='job' && this.job) {       // job
      this.diagnostic('- clear job')
      this.job = ''
      this.jobName = ''
    } else if (this.mode=='job') {
      this.diagnostic('Mode: card')
      this.mode = 'card'
      this.deptType = 0
    } else if (this.mode=='dept' && this.dept) {    // dept
      this.diagnostic('- clear dept')
      this.dept = ''
      this.deptName = ''
    } else if (this.mode=='dept') {
      this.diagnostic('Mode: card')
      this.mode = 'card'
      this.deptType = 0
    } else if (this.mode == 'card' && this.card) {   // card
      this.diagnostic('- clear card')
      this.card = ''
      this.employeeName = ''
      this.io_status = '?'
    } else if (this.mode == 'card') {
      this.diagnostic('Mode: waiting')
      this.mode = 'waiting'
    } else {
      this.diagnostic('Mode: -----')
    }
    this.displayUpdate()
  },

  deptClick() {
    if (this.mode == 'dept') {
      this.deptType = this.deptType ? 0 : 1
      this.diagnostic(`- toggle: ${this.deptType}`)
    } else if (this.mode == 'card' && this.employeeName) {
      this.mode = 'dept'
      this.diagnostic('Mode: dept')
    }
    this.displayUpdate()
  },

  jobClick() {
    if (this.mode == 'dept' && this.deptName) {
      // pass
    } else if (this.mode == 'card' && this.employeeName) {
      this.mode = 'job'
      this.diagnostic('Mode: Job')
    }
    this.displayUpdate()
  },

  taskClick() {
    if (this.mode == 'job' && this.jobName) {
      this.mode = 'task'
      this.diagnostic('Mode: task')
    }
    this.displayUpdate()
  },


  // Load Data From Server ====================================================
  async getEmployees(url = `/api/v1/employees`) {
    const resp = await fetch(url).then((res) => res.json())
    this.employees = resp
  },

  async getDepartments(url = `/api/v1/departments`) {
    const resp = await fetch(url).then((res) => res.json())
    this.departments = resp
  },

  async getJobs(url = `/api/v1/jobs`) {
    const resp = await fetch(url).then((res) => res.json())
    this.jobs = resp
  },

  async getTasks(url = `/api/v1/tasks`) {
    const resp = await fetch(url).then((res) => res.json())
    this.tasks = resp
  },

  async getIpAddress(url = `/api/v1/ip`) {
    const resp = await fetch(url).then((res) => res.json())
    this.ipAddress = resp.ip
  },


  // Keyboad Functions ========================================================
  enableKeyboard() {
    window.addEventListener('keydown', this.keyboardEvent)
  },
  disableKeyborad() {
    window.removeEventListener('keydown', this.keyboardEvent)
  },
  keyboardEvent(e) {
    switch(e.code) {
      case 'Numpad7':
        window.that.digitClick('7')
        break
      case 'Numpad8':
        window.that.digitClick('8')
        break
      case 'Numpad9':
        window.that.digitClick('9')
        break
      case 'Numpad4':
        window.that.digitClick('4')
        break
      case 'Numpad5':
        window.that.digitClick('5')
        break
      case 'Numpad6':
        window.that.digitClick('6')
        break
      case 'Numpad1':
        window.that.digitClick('1')
        break
      case 'Numpad2':
        window.that.digitClick('2')
        break
      case 'Numpad3':
        window.that.digitClick('3')
        break
      case 'Numpad0':
        window.that.digitClick('0')
        break
      case 'Tab':
        window.that.inoutClick("I")
        break
      case 'Equal':
        window.that.inoutClick("O")
        break
      case 'O':
        window.that.inputClick("0")
        break
      case 'Backspace':
        window.that.deptClick()
        break
      case 'NumpadSubtract':
        window.that.jobClick()
        break
      case 'NumpadAdd':
        window.that.taskClick()
        break
      case 'NumpadDecimal':
        window.that.clearClick()
        break
      case 'Escape':
        window.that.clearClick()
        break
      case 'NumpadEnter':
        window.that.enterClick()
        break
    }
  },

  afterThing() {
    console.log("After Thing")
  },

  // Timer Functions ==========================================================
  enableClock() {
    this.punch5sec = this.getRandomInt(12) * 5
    this.punch15sec = this.getRandomInt(12) * 5
    this.timer = window.setInterval(() => this.handleTimeEvents(), 1000)
  },

  disableClock() {
    window.clearTimeout(this.timer)
  },


  // Main Function ============================================================
  startUp() {
    this.diagnostic('App Starting ------')
    this.mode = 'waiting'
    this.enableClock()
    this.enableKeyboard()
    this.getIpAddress()
    this.refreshTimeforceData()
    this.displayUpdate()
    window.that = this
  },
  shutDown() {
    this.diagnostic('App Ending ------')
    disableClock()
    disableKeyboard()
  },
}).mount()
