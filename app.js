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
  jobName: '',
  task: '',
  taskName: '',
  ClockID: 1,
  LastServerTime: 0,
  LastLocalTime: 0,

  // Generic Functions ========================================================
  diagnostic(text) {
    console.log(text)
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
    this.formatted = `${month1}/${day1}/${year1} ${hours1}:${minutes1}${amOrPm}`
    this.LastLocalTime = digital
    this.LastServerTime = digital
  },

  // Update Display Functions =================================================
  blob() {
    this.diagnostic(`mode: ${this.mode} -- card: ${this.card} -- employee: ${this.employeeName} -- dept: ${this.dept} -- dname: ${this.deptName} -- task: ${this.task} -- tname: ${this.taskName}`)
  },

  displayReady() {
    return this.mode == 'waiting' ? this.ready : ''
  },

  displayMakeSelection() {
    return !this.autoEnter && this.employeeName && this.mode == 'card' ? x+x+x+x+x+x+x+x+x+'Make Selections' : x
  },

  displayPressEnter() {
    return !this.autoEnter && this.employeeName && this.mode == 'card' ? x+x+x+x+x+x+x+'Then Press [ENTER]' : x
  },

  displayCardLine() {
    if (this.mode == 'waiting') {
      return x
    }
    const total = this.employeeName.length + this.card.length
    const spaces = this.spaces.substring(0, 23 - total)
    var ending = ''
    if (this.io_status == 'I') {
      ending = x+'(IN)'
    } else if (this.io_status == 'O') {
      ending = '(OUT)'
    }
    return `Card:${this.card}${x}${this.employeeName}${spaces}${x}${ending}`
  },

  displayDeptLine() {
    if (!this.deptName&&this.mode!='dept') {
      return x
    }
    const total = this.dept.length + this.deptName.length
    const dept = `Dept:${this.dept}${x}${this.deptName}`
    return dept
  },

  displayJobLine() {
    if (this.mode == 'dept') {
      const dept = this.deptType ? '(Transfer)' : '(Override)'
      return x+x+x+x+x+x+dept
    }
    if (!(this.mode == 'job' || this.mode == 'task')) {
      return x
    }
    return x + 'Job:' + this.job + x + this.jobName
  },

  displayTaskLine() {
    if (this.mode != 'task') {
      return x
    }
    return 'Task:' + this.task + x + this.taskName
  },

  displayUpdate() {
    this.line2 = this.displayCardLine()
    this.line3 = this.displayDeptLine() + this.displayReady()
    this.line4 = this.displayJobLine()
    this.line5 = this.displayTaskLine()
    this.line6 = x
    this.line7 = this.displayMakeSelection()
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
        this.employeeName = this.employees[this.card]['fullname'].substring(0, 29)
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
        this.deptName = this.departments[this.dept]['departmentname']
        this.diagnostic(`- Dept: ${this.deptName}`)
      } else {
        this.deptName = ''
        this.diagnostic('- Dept: -- Not Found --')
      }
    } else if(this.mode == 'job' && this.job.length < 10) {
      this.job = this.job + digit
      this.diagnostic(`- key ${digit}`)
      if (this.jobs[this.job]) {
        this.jobName = (this.jobs[this.job]['jobname']+' '+ this.jobs[this.job]['jobdescription']).substring(0,20)
        this.diagnostic(`- Job: ${this.jobName}`)
      } else {
        this.jobName = ''
        this.diagnostic('- Job: -- Not Found --')
      }
    } else if(this.mode == 'task' && this.task.length < 4) {
      this.task = this.task + digit
      this.diagnostic(`- key ${digit}`)
      if (this.tasks[this.task]) {
        this.taskName = (this.tasks[this.task]['taskname']+' '+ this.tasks[this.task]['taskdescription']).substring(0,29 - this.task.length)
        this.diagnostic(`- Task: ${this.taskName}`)
      } else {
        this.taskName = ''
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


  // Timer Functions ==========================================================
  enableClock() {
    this.timer = window.setInterval(() => this.formatTime(), 1000)
  },

  disableClock() {
    window.clearTimeout(this.timer)
  },


  // Main Function ============================================================
  startUp() {
    this.diagnostic('App Starting ------')
    this.mode = 'waiting'
    this.enableClock()
    this.getDepartments()
    this.getEmployees()
    this.getJobs()
    this.getTasks()
    this.displayUpdate()
  },
}).mount()
