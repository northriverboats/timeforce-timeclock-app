# FONTS
[Google Font Families](http://somadesign.ca/demos/better-google-fonts/)  
[Best Fonts for buttons](https://www.quora.com/What-are-some-of-the-best-fonts-for-a-buy-button)  

* Pick a Sans serif font
* The Button Text Should Be Uppercase
* Padding

<img src="https://qph.fs.quoracdn.net/main-qimg-4f589d7a7feb964d208958e873e358fb-lq">

## Font Size
Font size should be slightly bigger than normal text on the page, and it should be bold

<img src="https://qph.fs.quoracdn.net/main-qimg-1e7740859374d4ba8d92a15e42c4fb95-pjlq">

&nbsp;  

## Font Style
It is a matter of state, but there are a lot of good fonts for buttons:
* Lato
* Montserrat
* Helvetica
* Open Sans
* Roboto
* Avenir

&nbsp;  

## Google web font for buttons
Robot regular-400
```
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=B612+Mono&family=Inconsolata&family=Roboto&display=swap" rel="stylesheet">

font-family: 'Roboto', sans-serif;
```

&nbsp;  

## Google web font for LCD Display
Inconsolata regular-400
```
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inconsolata&display=swap" rel="stylesheet">

font-family: 'Inconsolata', monospace;
```
B612 Mono
```
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=B612+Mono&family=Inconsolata&display=swap" rel="stylesheet">

font-family: 'B612 Mono', monospace;
```
&nbsp;  

## Custom Button Sizes
```
.btn-square-md {
width: 80px !important;
max-width: 80% !important;
max-height: 80% !important;
height: 80px !important;
text-align: center;
padding: 0px;
font-size:12px;
font-family: 'Roboto', sans-serif;
}
```

&nbsp;  

## A Better Kiosk Setup
As seen [here](https://baldbeardedbuilder.com/blog/setting-up-raspberry-pi-for-use-in-kiosk-mode-with-chromium/)  

Will need unclutter:
```
sudo apt-get install x11-xserver-utils unclutter
```

Edit ``` /home/pi/.config/lxsession/LXDE-pi/autostart``` to turn off the screensaver, hide the cursor and enter kiosk mode:
```
@xset s noblank
@xset s off
@xset -dpms
@unclutter -idle 0.1 -roo
@chromium-browser --kiosk --incognito --disable-pinch --overscroll-history-navigation=0 http://localhost:5000
```


Edit ```/etc/rc.local``` and add before ```exit 0``` to disable wifi power saver mode:
```
iwconfig wlan0 power off
```

&nbsp;  

## Decrypting Encrypted Visual Basic
Go to [VBScript encrypter and decrypter](https://master.ayra.ch/vbs/vbs.aspx)

&nbsp;  

## Status codes
Code  | Description
------------- | -------------
1  | Entering card# (line 1)
2  | Show fulll card# (line 1) and Make Selection (line 3)/Then Press  Enter (line 4)
3  | Show full card#(line 1) and entering digts on Dept (line 2)<br />DeptType 0 = Override (line 4)<br />DeptType 1 = Transfer (line 4)
4  | ** Not Used ** Show full card# (line 1) and entering tips (line 2)
5  | Show full card# (line 1) and entering Job (line 2)
6  | ** Not Used ** Show full card# (line 1) and show Job (line 2) and entering job qty (line 4)
7  | Show full card# (line 1) and show Job (line 2) and show optional job qty (line 3), and entering task (line 4)
8  | ** Not Used ** Show full card# (line 1) and show Job (line 2) and show optional job qty (line 3), and show task (line 3) and entering task qty (line 4)

&nbsp;   

Lines | Function | Key | Description
-------|--------------|-----|--------------
19-33||| variables the program will use. field is where visible key strokes are stored. IE the digits of the clock punch
36-41|StartClock()||If the page has loaded set a ONE time timer to display update the display
44-109|UpdateTimeClockDisplay()||update the 4 values that will be displayed on screen once every 5 seconds. Then do an actual RefreshDisplay()
111-134|RefreshDisplay()||actually display the 4 lines on screen
136-150|Clear()||reset all the variables to set clock ready for next punch
152-227|KeyPress()||Read the current key pressed and dispatch it to the proper function
229-263|ButtonNumberClick()|0-9.|Handle key press. update the field value to include the digit 0-9 just pressed and then update the display
265-296|ButtonEnterClick()|ENTER|Handle key press. Move the contents of field to card/dept/job/task and submit to server if necessary
298-309|ButtonClearClick()|CLEAR|Handle key press by clearing current field or clearing out everything related to the current punch (card/dept/job/task)
310-335|ButtonJobClick()|JOB|Handle key press
363-384|ButtonTaskClick()|TASK|Handle key press
386-402|ButtonQtyClick()|QTY|Handle key press
404-421|ButtonTipClick()|TIP|Handle key press
423-431|ButtonInClick()|IN|Handle key press
443-439|ButtonLunchClick()|LUNCH|Handle key press
440-445|ButtonBreakClick()|BREAK|Handle key press
447-455|ButtonOutClick()|OUT|Handle key press|
457-458|ButtonMenuClick()|MENU|Handle key press -- do nothing --
460-461|ButtonSoft1Click()|SOFT1|Handle key press -- do nothing --
463-464|ButtonSoft2Click()|SOFT2|Handle key press -- do nothing --
466-472|DateTime()||Adjust for difference between server time and local pc clock drift
474-493|TimeLine()||Format time string to display on screen
495-506|PunchDate()||Format punch date
508-518|PunchTime()||Format punch time
520-546|AttendancePunches()||Format time punch info to send to server
548-556|JTSPunches()||Format job/task/qty punch info to send to server
558-615|SaveSwipe()||Verify that punch is valid and send punch to server

&nsbsp;  

## async background http request
```
async getPeople(url = `https://swapi.dev/api/people`) {
    const resp = await fetch(url).then((res) => res.json());
    this.items = this.items.concat(resp.results);e
```
&nbsp;  

## Employees
**SQL:**
```sql
SELECT cardnumber, firstname, SUBSTRING(middlename,1,1) as middlename, lastname, 
       SUBSTRING(CASE
           WHEN LEN(SUBSTRING(middlename,1,1)) = 1 THEN firstname + ' ' + SUBSTRING(middlename,1,1) + ' ' + lastname
           ELSE firstname + ' ' + lastname
       END,1,19) as fullname,
       employeeid, employee_id, department_id, supervisor_id
  FROM dbo.empMain 
 WHERE company_id = 201 AND active_yn = 1 AND cardnumber > 0
 
SELECT jobnumber, Jobname, Jobdescription 
  FROM job
 WHERE company_id = 201 and complete_yn = 0 
```
**Python:**
```python
import csv
import json

employees = {}
with open('employees.csv') as csvfile:
    rows = csv.DictReader(csvfile)
    for row in rows:
        cardnumber = row.pop('cardnumber', 0)
        employees[cardnumber] = row

with open('employees.json', 'w') as outfile:
    json.dump(employees, outfile)

```

&nbsp;  

## Departments
**SQL:**
```sql
   SELECT  departmentnumber, departmentname, department_id
     FROM  tblDepartment
    WHERE  company_id = 201
```
**Python:**
```python
import csv
import json

departments = {}
with open('departments.csv') as csvfile:
    rows = csv.DictReader(csvfile)
    for row in rows:
        departmentnumber = row.pop('departmentnumber', 0)
        departments[departmentnumber] = row

with open('departments.json', 'w') as outfile:
    json.dump(departments, outfile)

```

&nbsp;  

## Jobs
**SQL:**
```sql
SELECT jobnumber, Jobname, Jobdescription 
  FROM job
 WHERE company_id = 201 and complete_yn = 0 
```
**Python:**
```python
import csv
import json

jobs = {}
with open('jobs.csv') as csvfile:
    rows = csv.DictReader(csvfile)
    for row in rows:
        jobnumber = row.pop('jobnumber', 0)
        jobs[jobnumber] = row

with open('jobs.json', 'w') as outfile:
    json.dump(jobs, outfile)
```

&nbsp;  

## Tasks
**SQL:**
```sql
   SELECT t.tasknumber, t.taskname,
          CASE
              WHEN d.departmentname = 'Fabrication' THEN 'Fab'
              WHEN d.departmentname = 'Paint' THEN 'Paint'
              WHEN d.departmentname = 'Canvas/Upholstery' THEN 'Canvas'
              WHEN d.departmentname = 'Canvas/Upholstery Hourly' THEN 'Canvas'
              WHEN d.departmentname = 'Outfitting Hourly' THEN 'Out'
              WHEN d.departmentname = 'Outfitting' THEN 'Out'
              ELSE ''
          END AS departmentname
     FROM task as t
LEFT JOIN tblDepartment as d on t.department_id = d.department_id 
    WHERE t.company_id = 201
```

**Python:**
```python
import csv
import json

tasks = {}
with open('tasks.csv') as csvfile:
    rows = csv.DictReader(csvfile)
    for row in rows:
        tasknumber = row.pop('tasknumber', 0)
        tasks[tasknumber] = row

with open('tasks.json', 'w') as outfile:
    json.dump(tasks, outfile)
```

