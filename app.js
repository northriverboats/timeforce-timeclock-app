import { createApp } from 'https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js'
const x = String.fromCharCode(160)

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
  formatted: '00/00/0000  00:00AM',

  card: '',
  employeeName: '',
  io_Status: '?',         // ?=none, I=In, O=Out
  Status: 0,             // 0=Idle, 1=card, 2=Waiting
  dept: '',
  deptName: '',
  deptType: 0,            // 0=Override, 1=Transfer
  job: '',
  Task: '',
  ClockID: 1,
  LastServerTime: 0,
  LastLocalTime: 0,

  // Generic Functions ========================================================
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
   
    this.formatted = `${month1}/${day1}/${year1} ${hours1}:${minutes1}${amOrPm}`
    this.LastLocalTime = digital
    this.LastServerTime = digital
  },

  // Update Display Functions =================================================
  displayMakeSelection() {
    if (!this.autoEnter && this.employeeName) {
      this.line7 = x+x+x+x+x+x+x+x+x+'Make Selections'
      this.line8 = x+x+x+x+x+x+x+'Then Press [ENTER]'
    } else {
      this.line7 = x
      this.line8 = x
    }
  },

  displayCardLine() {
    if (this.mode == 'waiting') {
      console.log('- showing ready line')
      this.line2 = x
      this.line3 = this.ready
      this.line7 = x
      this.line8 = x
      return
    }
    const total = this.employeeName.length + this.card.length
    const spaces = this.spaces.substring(0, 23 - total)
    var ending = ''
    if (this.io_status == 'I') {
      ending = x+'(IN)'
    } else if (this.io_status == 'O') {
      ending = '(OUT)'
    }

    this.line2 = `Card:${this.card}${x}${this.employeeName}${spaces}${x}${ending}`
    this.displayMakeSelection()
  },

  displayDeptLine() {
    if (this.mode != 'dept') {
      this.line3 = x
      return
    }
    const total = this.dept.length + this.deptName.length
    const spaces = this.spaces.substring(0, 18 - total)
    const dept = this.deptType ? '(Transfer)' : '(Override)'
    this.line3 = `Dept:${this.dept}${x}${this.deptName}${spaces}${x}${dept}`
    this.displayMakeSelection()
  },
  
  displayJobLine() {
    this.line4 = x+'Job:'
    this.displayMakeSelection()
  },

  displayTaskLine() {
    this.line5 = 'Task:'
  },


  // Handle Click Functions ===================================================
  digitClick(digit) {
    if (this.mode == 'waiting') {
      this.mode = 'card'
      this.line3 = x
    }
    if (this.mode == 'card' && this.card.length < 4) {
      this.card = this.card + digit
      if (this.employees[this.card]) {
        this.employeeName = this.employees[this.card]['fullname'].substring(0, 19)
      } else {
        this.employeeName = ''
      }
      this.displayCardLine()
    } else if (this.mode == 'dept' && this.dept.length < 4) {
      this.dept = this.dept + digit
      if (this.departments[this.dept]) {
        this.deptName = this.departments[this.dept]['departmentname'].substring(0, 16)
        } else {
          this.deptName = ''
        }
      this.displayDeptLine()
    } else if(this.mode == 'job' && this.job.length < 4) {
       this.displayJobLine() 
    }
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
    this.displayCardLine()
  },

  enterClick() {
    if(this.mode == 'card' && this.employeeName )  {
        console.log('submitting card')
    }
  },

  clearClick() {
    if (this.mode=='dept' && this.dept) {
      console.log('clear to dept')
      this.dept = ''
      this.deptName = ''
      this.displayDeptLine()
    } else if (this.mode=='dept') {
      console.log('clear to card')
      this.mode = 'card'
      this.deptType = 0
      this.displayDeptLine()
      this.displayCardLine()
    } else if (this.mode == 'card' && this.card) {
      console.log('clear to card')
      this.card = ''
      this.employeeName = ''
      this.io_status = '?'
      this.displayCardLine()
    } else if (this.mode == 'card') {
      console.log('clear to waiting')
      this.mode = 'waiting'
      this.displayCardLine()
    } else {
      console.log('do nothing')
    }
  },

  deptClick() {
    if (this.mode == 'dept') {
      this.deptType = this.deptType ? 0 : 1
      this.displayDeptLine()
    } else if (this.mode == 'card' && this.employeeName) {
      this.mode = 'dept'
      this.displayDeptLine()
    }
  },

  jobClick() {
    if (this.mode == 'dept' && this.deptName) {
      this.mode = 'job'
      this.displayJobLine()
    } else if (this.mode == 'card' && this.employeeName) {
      this.mode = 'job'
      this.displayJobLine()
    }
  },


  // Load Data From Server ====================================================
  async getEmployees(url = `/employees.json`) {
    const resp = await fetch(url).then((res) => res.json())
    this.employees = resp
  },

  async getDepartments(url = `/departments.json`) {
    const resp = await fetch(url).then((res) => res.json())
    this.departments = resp
  },

  async getJobs(url = `/jobs.json`) {
    const resp = await fetch(url).then((res) => res.json())
    this.jobs = resp
  },

  async getTasks(url = `/tasks.json`) {
    const resp = await fetch(url).then((res) => res.json())
    this.tasks = resp
  },


  // Timer Functions ==========================================================
  enableClock() {
    this.timer = window.setInterval(() => this.formatTime(), 1000)
  },

  disableClock() {
    window.clearTimeout(this.timer)
  },


  // Main Function ============================================================
  startUp() {
    this.mode = 'waiting'
    this.enableClock()
    this.getDepartments()
    this.getEmployees()
    this.getJobs()
    this.getTasks()
    this.line3 = this.ready
  },




}).mount()
