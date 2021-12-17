<%
	Set rsUser = cnnMain.Execute("SELECT timeoffset FROM userLogin WHERE user_id = "&guserID)
	IF NOT rsUser.EOF THEN
		TimeOffset=rsUser.fields("timeoffset")
	ELSE
		TimeOffset
	END IF
	Set rsUser = nothing
	
	Minutes = Round(TimeOffset * 60)


	currenttime = now()
	currenttime = DateAdd("n",Minutes,currenttime)
%>

<Script language="JavaScript" type="text/javascript">

var Status = 0; //0=Idle, 1=Card, 2=Waiting
var Field = new String();
var Space = "&nbsp";
var Card = new String();
var Dept = new String();
var DeptType = 0;//0=Override, 1=Transfer
var Tips = new String();
var Job = new String();
var JobQty = new String();
var Task = new String();
var TaskQty = new String();
var IOStatus = "?";//?=none, I=In, O=Out
var LBStatus = "?";//?=None, L=Lunch, B=Break
var ClockID = 1;
var LastServerTime = new Date('<%= currentime %>');
var LastLocalTime = new Date();


function StartClock() 
{
 if (!document.layers && !document.all) return;
 UpdateTimeClockDisplay();
 setTimeout("StartClock()", 1000);
}

function UpdateTimeClockDisplay()
{
  var Line1 = TimeLine();
  var Line2 = "";
  var Line3 = Space+Space+Space+Space+"-- READY --";
  var Line4 = "";
  
  switch (Status)
  {
    case 1: Line1 = "Card: " + Field;
            Line2 = "";
            Line3 = "";
            Line4 = "";
            break;
    case 2: Line1 = "Card: " + Card;
            Line2 = "";
            Line3 = Space+Space+"Make Selections";
            Line4 = Space+"Then Press [ENTER]";
            break;
    case 3: Line1 = "Card: " + Card;
            Line2 = "Dept: " + Field;
            Line3 = "";
            switch (DeptType)
            {
              case 0: Line4 = Line4 = Space+Space+Space+Space+Space+"(Override)";
                      break;
              case 1: Line4 = Line4 = Space+Space+Space+Space+Space+"(Transfer)";
                      break;
            }
            break;
    case 4: Line1 = "Card: " + Card;
            Line2 = "Tips: " + Field;
            Line3 = "";
            Line4 = "";
						break;
    case 5: Line1 = "Card: " + Card;
            Line2 = "Job: "+Field;
            Line3 = "";
            Line4 = "";
            break;
    case 6: Line1 = "Card: " + Card;
            Line2 = "Job: "+Job;
            Line3 = "";
            Line4 = "Job Qty: "+Field;
            break;
    case 7: Line1 = "Card: " + Card;
            Line2 = "Job: "+Job;
            if (JobQty != "") {Line2 = Line2+" Qty:"+JobQty;}
            Line3 = "Task: "+Field;
            Line4 = "";
            break;
    case 8: Line1 = "Card: " + Card;
            Line2 = "Job: "+Job;
            if (JobQty != "") {Line2 = Line2+" Qty:"+JobQty;}
            Line3 = "Task: "+Task;
            Line4 = "Task Qty: "+Field;
            break;
  }
	//rsEmp = cnnMain.Execute("SELECT employee_id FROM empMain");
	//Line4 = rsEmp.fields("employee_id");

	if (IOStatus != "?"){Line1 = Line1 + Space+"("+IOStatus+")";}
	if (LBStatus != "?"){Line1 = Line1 + Space+"("+LBStatus+")";}
	RefreshDisplay(Line1,Line2,Line3,Line4);

}

function RefreshDisplay(Value1,Value2,Value3,Value4)
{
 if (document.layers) 
 { 
 	document.layers.Line1.document.write(Value1);
 	document.layers.Line1.document.close();
 	document.layers.Line2.document.write(Value2);
 	document.layers.Line2.document.close();
 	document.layers.Line3.document.write(Value3);
 	document.layers.Line3.document.close();
 	document.layers.Line4.document.write(Value4);
 	document.layers.Line4.document.close();
 }
 else
 {
 	if (document.all)
 	{
 		Line1.innerHTML = Value1;
 		Line2.innerHTML = Value2;
 		Line3.innerHTML = Value3;
 		Line4.innerHTML = Value4;
 	}
 }
}

function Clear()
{
  Field = "";
  Card = "";
  Dept = "";
  Tips = "";
  DeptType = 0;
  Status = 0;
  Job = "";
  JobQty = "";
  Task = "";
  TaskQty = "";
  IOStatus = "?";
  LBStatus = "?";
}

function KeyPress()
{
	switch (event.keyCode)
  {
		case 120: //x
		case 88:  //X
			location.href = '/qqest/Login/Logout.asp';
			break;
		case 113: //q
		case 81:  //Q
			ButtonQtyClick();
			break;
		case 106: //j 
		case 74:  //J
        	    ButtonJobClick();
							break;
		case 107: //k 
		case 75:  //K
        	    ButtonTaskClick();
							break;
		case 98:  //b 
		case 66:  //B
		          ButtonBreakClick();
							break;
		case 27:  //ESC 
		case 99:  //C 
		case 67:  //c
		          ButtonCLRClick();
		          break;
		case 100: //D
		case 68:  //d
		          ButtonDeptClick();
							break;
		case 13:  //ENTER 
		case 101: //E 
		case 69:  //e
		          ButtonEnterClick();
							break;
		case 105: //I
		case 73:  //i
		          ButtonInClick();
							break;
		case 108: //L 
		case 76:  //l
		          ButtonLunchClick();
							break;
		case 111: //O 
		case 79:  //o
		          ButtonOutClick();
							break;
		case 116: //T 
		case 84:  //t
		          ButtonTipsClick();
							break;
		case 48:  ButtonNumberClick("0");
							break;
		case 49:  ButtonNumberClick("1");
							break;
		case 50:  ButtonNumberClick("2");
							break;
		case 51:  ButtonNumberClick("3");
							break;
		case 52:  ButtonNumberClick("4");
							break;
		case 53:  ButtonNumberClick("5");
							break;
		case 54:  ButtonNumberClick("6");
							break;
		case 55:  ButtonNumberClick("7");
							break;
		case 56:  ButtonNumberClick("8");
							break;
		case 57:  ButtonNumberClick("9");
							break;
	}
}

function ButtonNumberClick(Button)
{
  var MaxSize = 10;
	if (Button == "."){
		//return;
	}
  switch (Status)
  {
    case 0: 
			MaxSize = 10
			Status = 1;
            break;            
    case 1: 
			MaxSize = 10;
            break;
    case 2: 
			Status = 1;
			Field=Card;
			MaxSize = 10;		
            break;
  }
  var addKey = true; 
  if(Button == 0 && Field.length == 0)
  {
    addKey = false;
  }
  if(addKey){
  Field = Field + Button;
    if (Field.length > MaxSize)
    {
        Field = Field.substring(1, MaxSize + 1);
    }
    UpdateTimeClockDisplay();
  }
}

function ButtonEnterClick()
{
  switch (Status)
  {
    case 0: break;
    case 1: Status = 2;
            Card = Field;
            Field="";
            break;
    case 2: SaveSwipe();
            break;
    case 3: Dept=Field;
            SaveSwipe();
            break;
    case 4: Tips=Field;
            SaveSwipe();
            break;
    case 5: Job=Field;
            SaveSwipe();
            break;
    case 6: JobQty=Field;
            SaveSwipe();
            break;
    case 7: Task=Field;
            SaveSwipe();
            break;
    case 8: TaskQty=Field;
            SaveSwipe();
            break;
  }
  UpdateTimeClockDisplay();
}

function ButtonCLRClick()
{
  if (Field > "")
  {
  	Field = "";
  }
  else
  {
    Clear();
  }
  UpdateTimeClockDisplay();
}

function ButtonDeptClick()
{
  switch (Status)
  {
    case 1: Card=Field;
            Field="";
            Status=3;
            DeptType=0;
            break;
    case 2: Field="";
            Status=3;
            DeptType=0;
            break;
    case 3: switch (DeptType)
            {
              case 0:  DeptType=1;
                       break;
              case 1:  DeptType=0;
                       break;
              default: DeptType=0;
            }
            break;
  }
  UpdateTimeClockDisplay();
}

function ButtonJobClick()
{
  switch (Status)
  {
  	case 1: Card=Field;
            Field="";
  			JobQty="";
  			Task="";
  			TaskQty="";
  	        Status=5;
  	        break;
  	case 2: Status=5;
  	        break;
  	case 6:
  	case 7:
  	case 8: Status=5;
  			JobQty="";
  			Task="";
  			TaskQty="";
  			Field=Job;
  			Job="";
  	        break;
  }
  UpdateTimeClockDisplay();
}

function ButtonTaskClick()
{
  switch (Status)
  {
    case 5: Job=Field;
            Field="";
            Status=7;
            TaskQty="";
            break;
    case 6: JobQty=Field;
            Field="";
            TaskQty="";
            Status=7;
            break;
  	case 8: Status=7;
  	        Field=Task;
  	        Task="";
  			TaskQty="";
  	        break;
  }
  UpdateTimeClockDisplay();
}

function ButtonQtyClick()
{
  switch (Status)
  {
    case 5: Job=Field;
            Field="";
            Task="";
            TaskQty="";
            Status=6;
            break;
    case 7: Task=Field;
            Field="";
            Status=8;
            break;
  }
  UpdateTimeClockDisplay();
}

function ButtonTipsClick()
{
  switch (Status)
  {
    case 1: Card=Field;
            Field="";
            Status=4;
            break;
    case 2: Field="";
            Status=4;
            break;
    case 3: Dept=Field;
            Field="";
            Status=4;
            break;
  }
  UpdateTimeClockDisplay();
}

function ButtonInClick()
{
  if (Status==0) return;
  if (IOStatus != "I")
    {IOStatus="I";} 
  else 
    {IOStatus="?";}
  UpdateTimeClockDisplay();
}

function ButtonLunchClick()
{
  if (Status==0) return;
  if (LBStatus=="L"){LBStatus="?";}else{LBStatus="L";}
  UpdateTimeClockDisplay();
}

function ButtonBreakClick()
{
  if (Status==0) return;
  if (LBStatus=="B"){LBStatus="?";}else{LBStatus="B";}
  UpdateTimeClockDisplay();
}

function ButtonOutClick()
{
  if (Status==0) return;
  if (IOStatus != "O") 
    {IOStatus="O";} 
  else 
    {IOStatus="?";}
  UpdateTimeClockDisplay();
}

function ButtonMenuClick()
{}

function ButtonSoft1Click()
{}

function ButtonSoft2Click()
{}

function DateTime()
{
	var digital = new Date();
	
	digital.setTime(digital.getTime()+(LastServerTime.getTime()-LastLocalTime.getTime()));
	return digital;
}

function TimeLine() 
{
 var digital = DateTime(); 
 var hours1 = digital.getHours();
 var minutes1 = digital.getMinutes();
 var month1 = digital.getMonth()+1;
 var day1 = digital.getDate();
 var year1 = digital.getYear();
 var amOrPm = "AM";

 if (day1 < 10) day1 = "0" + day1;
 if (month1 < 10) month1 = "0" + month1; 
 if (hours1 > 11) amOrPm = "PM";
 if (hours1 > 12) hours1 = hours1 - 12;
 if (hours1 == 0) hours1 = 12;
 if (hours1 < 10) hours1 = "0" + hours1;
 if (minutes1 <= 9) minutes1 = "0" + minutes1;
 
return "&nbsp" + month1 + "\/" + day1 + "\/" + year1 + " " + hours1 + ":" + minutes1 + amOrPm;
}

function PunchDate()
{
 var digital = DateTime();
 var month = digital.getMonth();
 var day = digital.getDate();
 var year = digital.getYear();

 if (day < 10) day = "0" + day;
 if (month < 10) month = "0" + month;
 
 return month + "\/" + day + "\/" + year;
}

function PunchTime()
{
 var digital = DateTime();
 var hours = digital.getHours();
 var minutes = digital.getMinutes();

 if (hours < 10) hours = "0" + hours;
 if (minutes < 10) minutes = "0" + minutes;
 
 return hours + ":" + minutes;
}

function AttendancePunches()
{
  var Punches = new String();
	if (Dept != "") 
	{
	  if (DeptType == 1)
		{
			Punches = "<% Request.ServerVariables('REMOTE_ADDR') %>--><!--DeptTransfer="+ClockID+","+Card+","+PunchDate()+","+PunchTime()+","+Dept+"-->";
	 	  }
		else
		{
		  Punches = "<% Request.ServerVariables('REMOTE_ADDR') %>--><!--Swipe="+ClockID+","+Card+","+PunchDate()+","+PunchTime()+","+IOStatus+","+LBStatus+"-->";
		  Punches = Punches + "\n<!--DeptOverride="+ClockID+","+Card+","+PunchDate()+","+PunchTime()+","+Dept+"-->";
		}
	}
	else
	{
		Punches = "<% Request.ServerVariables('REMOTE_ADDR') %>--><!--Swipe="+ClockID+","+Card+","+PunchDate()+","+PunchTime()+","+IOStatus+","+LBStatus+"-->";
	}
	
	if (Tips != "")
	{
		Punches = "<% Request.ServerVariables('REMOTE_ADDR') %>--><!--Tips="+ClockID+","+Card+","+PunchDate()+","+PunchTime()+","+Tips+"-->";
	}
	
  return Punches;
}

function JTSPunches()
{
  var Punches = new String();
	if (JobQty == "") {JobQty="0";}
	if (Task == "") {Task="0";}
	if (TaskQty == "") {TaskQty="0";}
	Punches = "<% Request.ServerVariables('REMOTE_ADDR') %>--><!--Job="+ClockID+","+Card+","+PunchDate()+","+PunchTime()+","+Job+","+JobQty+","+Task+","+TaskQty+","+IOStatus+"-->";
  return Punches;
}

function SaveSwipe()
{
	if (Card=="")
	{
	  alert("You Must Enter A Card Number");
		return;
	}
	if(Card=="0")
	{
		alert("0 is not a valid card number");
		return;
	}
	if (Status > 4) //JTS Entry
	{
	  if (Job == "") 
		{
		  alert("You Must Enter A Job Number");
			return;
		}
		if(Job=="0")
		{
			alert("0 is not a valid job number");
			return;
		}
		if (TaskQty != "")
		{
		  if (Task == "")
			{
		    alert("You Must Enter A <% getKeyword(gtTask) %> Number To Enter <% getKeyword(gtTask) %> Quantities");
			  return;
			}
			if(Task=="0")
			{
				alert("0 is not a valid task number");
				return;
			}
		}
	}
  switch (Status)
  {
    case 2: //Simple Swipe
		case 3: //Department
		case 4: //Tips
						var newswipe = AttendancePunches();
				 		window.location.href='processNetClock.asp?newswipe='+newswipe;
				 		break;
		case 5: //Job
		case 6: //Job Qty
		case 7: //Task
		case 8: //Task Qty
						var newswipe = JTSPunches();
				 		window.location.href='processNetClock.asp?newswipe='+newswipe;
				 		//alert(JTSPunches());
		     		break;
		
  }
  Clear();
}

</script>
