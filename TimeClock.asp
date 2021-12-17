<%@ LANGUAGE = VBScript.Encode %>
<!-- #include Virtual="/qqest/include/settings.asp"-->
<!--#include virtual="/qqest/styles/nav/header.asp"-->
<!--#include virtual="/qqest/styles/nav/footer.asp"-->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
<HEAD>
<TITLE>Time Clock</TITLE>
<!-- #INCLUDE Virtual="qqest/NetClock/iqclock.asp"-->
</HEAD>
<%
Dim  bAllowView
bAllowView = False
If gUserTypeID = 4 Then
        bAllowView = True
End If
If bAllowView Then
        SimpleHeader("Net Clock")
        Body()
        Footer 1, 0 
Else
        Response.Redirect ("/qqest/login/login.asp?action=security")
End If

Function body()
%>
	<style>
	.NavAux
{
  font-weight: bold;
  font-size: 7pt;
  cursor: hand;
  color: #ffffff;
  font-family: verdana;
}
	.NavAux:hover
{
  font-weight: bold;
  font-size: 7pt;
  cursor: hand;
  color: #ffffff;
  font-family: verdana;
}
</style>
	<body onLoad="StartClock();" bgcolor=#eeeeee onkeypress="KeyPress()">
  <table width=100% cellpadding=0 cellspacing=1>
  <tr>
    <td width=485>
	  <span id="Line0" style="font-family:terminal;font-size:9pt;position:absolute;left:216;top:193;"><a href="/qqest/Login/Logout.asp" class=NavAux><font color=#000000>Exit</font></a></span>
	  <span id="Line1" style="font-family:terminal;font-size:9pt;position:absolute;left:121;top:86;"></span>
	  <span id="Line2" style="font-family:terminal;font-size:9pt;position:absolute;left:121;top:98;"></span>
	  <span id="Line3" style="font-family:terminal;font-size:9pt;position:absolute;left:121;top:110;"></span>
	  <span id="Line4" style="font-family:terminal;font-size:9pt;position:absolute;left:121;top:122;"></span>
	  <img src="IQClock.jpg" usemap="#clock" border="0">
	  <map name="clock">
	  <area shape="rect" coords="100,219,128,237" nohref onclick="ButtonNumberClick('1')" ondblclick="ButtonNumberClick('1')" title="">
	  <area shape="rect" coords="140,218,173,239" nohref onclick="ButtonNumberClick('2')" ondblclick="ButtonNumberClick('2')" title="">
	  <area shape="rect" coords="180,217,215,238" nohref onclick="ButtonNumberClick('3')" ondblclick="ButtonNumberClick('3')" title="">
	  <area shape="rect" coords="97,247,131,267" nohref onclick="ButtonNumberClick('4')" ondblclick="ButtonNumberClick('4')" title="">
	  <area shape="rect" coords="139,246,173,269" nohref onclick="ButtonNumberClick('5')" ondblclick="ButtonNumberClick('5')" title="">
	  <area shape="rect" coords="180,246,214,269" nohref onclick="ButtonNumberClick('6')" ondblclick="ButtonNumberClick('6')" title="">
	  <area shape="rect" coords="97,274,131,298" nohref onclick="ButtonNumberClick('7')" ondblclick="ButtonNumberClick('7')" title="">
	  <area shape="rect" coords="139,275,174,297" nohref onclick="ButtonNumberClick('8')" ondblclick="ButtonNumberClick('8')" title="">
	  <area shape="rect" coords="180,275,214,297" nohref onclick="ButtonNumberClick('9')" ondblclick="ButtonNumberClick('9')" title="">
	  <area shape="rect" coords="138,304,173,326" nohref onclick="ButtonNumberClick('0')" ondblclick="ButtonNumberClick('0')" title="">
	  <area shape="rect" coords="181,304,214,327" nohref onclick="ButtonNumberClick('.')" ondblclick="ButtonNumberClick('.')" title="">
	  <area shape="rect" coords="96,304,131,326" nohref onClick="ButtonCLRClick()" ondblClick="ButtonCLRClick()" title="">
	  <area shape="rect" coords="95,334,151,356" nohref onClick="ButtonMenuClick()" ondblClick="ButtonMenuClick()" title="">
	  <area shape="rect" coords="157,333,214,356" nohref onClick="ButtonEnterClick()" ondblClick="ButtonEnterClick()" title="">
	  <area shape="rect" coords="221,217,257,240" nohref onClick="ButtonDeptClick()" ondblClick="ButtonDeptClick()" title="">

	  <% if gJobTracking > 0 thJ %>
	  <area shape="rect" coords="220,245,256,269" nohref onClick="ButtonJobClick()" ondblClick="ButtonJobClick()" title="">
	  <area shape="rect" coords="219,274,256,298" nohref onClick="ButtonTaskClick()" ondblClick="ButtonTaskClick()" title="">
	  <area shape="rect" coords="220,304,257,327" nohref onClick="ButtonQtyClick()" ondblClick="ButtonQtyClick()" title="">
	  <% end if %>

	  <area shape="rect" coords="220,333,257,357" nohref onClick="ButtonTipsClick()" ondblClick="ButtonTipsClick()" title="">
	  <area shape="rect" coords="266,222,295,257" nohref onClick="ButtonInClick()" ondblClick="ButtonInClick()" title="">
	  <area shape="rect" coords="263,261,298,283" nohref onClick="ButtonLunchClick()" ondblClick="ButtonLunchClick()" title="">
	  <area shape="rect" coords="263,290,299,313" nohref onClick="ButtonBreakClick()" ondblClick="ButtonBreakClick()" title="">
	  <area shape="rect" coords="266,316,296,355" nohref onClick="ButtonOutClick()" ondblClick="ButtonOutClick()" title="">
	  <area shape="rect" coords="153,192,184,207" nohref onClick="ButtonSoft1Click()" ondblClick="ButtonSoft1Click()" title="">
	  <area shape="rect" coords="209,191,242,207" nohref onClick="ButtonSoft2Click()" ondblClick="ButtonSoft2Click()" title="">
	  <area shape="rect" coords="118,81,280,135" nohref title="">
	  <area shape="default" nohref>
	  </map>
	  </td>
	  <td width=10>&nbsp;</td>
    <td>

    <table width=170 cellpadding=0 cellspacing=1 style='border: <%= gTableHeadTextColor %> 1px solid;'>
    <tr>
      <th colspan=2 class=headerRow>&nbsp;<font color=<% gTableHeadTextColor %>>Keybord Shortcuts</font></th>
    </tr>
    <tr>
      <th width=30 bgcolor=<% gTableHeadColor %>>&nbsp;<font color=<% gTableHeadTextColor %>>Key</font></th>
      <th align=left bgcolor=<% gTableHeadColor %>>&nbsp;<font color=<% gTableHeadTextColor %>>Button</font></th>
    </tr>
    <tr>
      <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>0-9</font></th>
      <td>&nbsp;Number Buttons</td>
    </tr>
    <tr>
      <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>B, b</font></th>
      <td>&nbsp;Break</td>
    </tr>
    <tr>
      <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>C, c</font></th>
      <td>&nbsp;Clear</td>
    </tr>
    <tr>
      <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>D, d</font></th>
      <td>&nbsp;<%= GetKeyword(gkDepartment) %></td>
    </tr>
    <tr>
      <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>E, e</font></th>
      <td>&nbsp;Enter</td>
    </tr>
    <tr>
      <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>I, i</font></th>
      <td>&nbsp;In</td>
    </tr>
    <%# if gJobTracking = 1 then %>
      <tr>
        <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>J, j</font></th>
        <td>&nbsp;<%= GetKeyword(gkJobs) %></td>
      </tr>
      <tr>
        <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>K, k</font></th>
        <td>&nbsp;<%= GetKeyword(gkTask) %></td>
      </tr>
    <%# end if %>
    <tr>
      <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>L, l</font></th>
      <td>&nbsp;Lunch</td>
    </tr>
    <tr>
      <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>O, o</font></th>
      <td>&nbsp;Out</td>
    </tr>
    <tr>
      <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>T, t</font></th>
      <td>&nbsp;Tips</td>
    </tr>
    <tr>
      <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>Q, q</font></th>
      <td>&nbsp;Qty</td>
    </tr>
    <tr>
      <th bgcolor=<% gTableCellColor %>>&nbsp;<font color=<% gTableCellTextColor %>>X, x</font></th>
      <td>&nbsp;Exit</td>
    </tr>
    </table><br>
    *<font color=<%= gDisabledTextColor %>><i>You can use your mouse and click on the image to the left, 
      or you can use keys on your keyboard to activate the netclock.</i> </font>
    </td>
  </tr>
	</body>
	</html>
<% IF request.querystring("accepted") = "yes" THEN %>
		<script language=javascript>
			alert("<% request.querystring("carderror") %>")
		</script>
<%
    END IF
  END Function
%>

