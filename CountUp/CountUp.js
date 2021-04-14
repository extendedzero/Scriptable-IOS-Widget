// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: weight;
//Version 1.1 
//Sorry for my English. 
//This Scriptable Widget is coded by eXtendedZero
//Very Thanks all known and unknown people whose codes parts I used. 

//---CountUp widget---
//Description. 
//Minimalistic widget that Count Up number full days from set date.
//
//Features.
//Ability to dynamically (without changing the code) configure/change the widget.
//Setting title, date, time, color.
//Ability to use multiple copies of the widget with different settings.
//
//Setup. 
//Easy installation. You only need to specify a unique ID for each copy of the widget.
//
//How to use.
//Add a widget and specify a unique ID in the Parameter. 
//It can be a number/numbers or a letter / word.  For example "7", "1239", "new", "qwerty11", etc. (without quotes).
//
//How it work.
//Tap the widget to set your own settings.  In the new window you can set/change your own settings.
//•Title - anything, even smileys (Warning!  Do not use the "|" symbol. This is a reserved character).
//•Date - format dd.mm.yyyy
//•Time - format hh:mm
//•Color - you can use reserved keyword(base colors) or set color at format #rrggbb(hex). Reserved color keyword: red, green, blue, yellow, orange, gray, purple, brown, cyan, magenta. 

//The current date and time are set by default. The title is "Now 😎", the background color is red.
//

//Some details. 
//Each copy of the widget creates a unique file based on a given ID where the settings match.
//

var widgetId = args.widgetParameter;
var fm = FileManager.iCloud()
var dir = fm.documentsDirectory()
var path = fm.joinPath(dir, "CountUpSet_"+widgetId+".txt")

if (!fm.fileExists(path))   
  {
  let td = new Date
  let d = new Intl.DateTimeFormat("es",{day: "2-digit"}).format(td)
  let m = new Intl.DateTimeFormat("es",{month: "2-digit"}).format(td)
  let y = new Intl.DateTimeFormat("es",{year: "numeric"}).format(td)
  let h = new Intl.DateTimeFormat("es",{hour: "2-digit"}).format(td)
  let mi = new Intl.DateTimeFormat("es",{minute: "2-digit"}).format(td)
  
  fm.writeString(path, "Now 😎|"+`${d}.${m}.${y}`+"|"+`${h}:${mi}`+"|red")
  }

//load and parse data from file line by line
//t0 - title
//t1 - date -> dd.mm.yyyy
//t2 - time -> hh:mm
//t3 - color -> Color: #rrggbb(hex) or keyword(base colors)
var mydatR = fm.readString(path)  
var arr = mydatR.split("|")
var t0 = arr[0]
var t1 = arr[1]
var t2 = arr[2]
var t3 = arr[3]

let day0 = t1.split(".")
let time0 = t2.split(":")

var mydat = new Date(parseInt(day0[2],10),parseInt(day0[1]-1, 10),parseInt(day0[0],10),parseInt(time0[0], 10),parseInt(time0[1],10),0,0)

var today = new Date

if (config.runsInWidget) {
  
  //title
  titl = t0
  
  //date
  let date = today.getDate()  
  
//To calc the time difference of two dates 
  let Dif_Time = today.getTime()- mydat.getTime()
  
  
//To calc the no. of days between two dates 
  var Dif_Days = Math.trunc(Dif_Time / (1000 * 3600 * 24)); 

  let widget = createWidget(titl, `${Dif_Days}`, 'Start at', t1+", "+t2, t3)
  
  Script.setWidget(widget)
  Script.complete()
} 

if (config.runsInApp)
{
var myTextInput = new Alert()
myTextInput.title = "Settings:"
myTextInput.addAction("Ok") 
myTextInput.addCancelAction("Cancel") 

myTextInput.addTextField("Title:", t0)
myTextInput.addTextField("Date: dd.mm.yyyy", t1)
myTextInput.addTextField("Time: гг-хх", t2);
myTextInput.addTextField("Color: #rrggbb(hex) or keyword(base colors)", t3);

let inPut = await myTextInput.presentAlert()

let mydatW = myTextInput.textFieldValue(0)+"|"+myTextInput.textFieldValue(1)+"|"+myTextInput.textFieldValue(2)+"|"+myTextInput.textFieldValue(3)+"|"

switch(inPut)
{
  case 0:
    //Ok
    fm.writeString(path, mydatW)
    break;
    
  case -1:
    //Cancel
    break;
  }
 
}

function createWidget(pretitle, title, title2, subtitle, color) 
  {
  let w = new ListWidget()
  w.setPadding(7, 10, 7, 7)
  
  switch(color)
  {
  case "red":
    color = "ff0000";
    break;
  case "green":
    color = "008000";
    break;
  case "blue":
    color = "0000ff";
    break;
  case "yellow":
    color = "ffd700";
    break;
  case "orange":
    color = "ffa500";
    break;
  case "gray":
    color = "808080";
    break;
  case "purple":
    color = "0000ff";
    break;
  case "brown":
    color = "a52a2a";
    break;
  case "cyan":
    color = "00ffff";
    break;
  case "magenta":
    color = "ff00ff"
    break;
  }
  w.backgroundColor = new Color(color)
 
  let preTxt = w.addText(pretitle)  
  preTxt.textColor = Color.white()
  preTxt.textOpacity = 0.9
  preTxt.font = Font.boldSystemFont(16)
  
  if (Dif_Days>999) {w.addSpacer(14)} else
  {w.addSpacer(4)}
  
  let titleTxt = w.addText(title)
  titleTxt.textColor = Color.white()
  titleTxt.shadowColor = Color.black()
  titleTxt.shadowOffset = new Point(1,1)
  titleTxt.shadowRadius = 1
  if (Dif_Days>999)
  {
  titleTxt.font = Font.boldSystemFont(40)
  } else
  {
  titleTxt.font = Font.boldSystemFont(60)
  }
  titleTxt.centerAlignText()
  
    
  if (Dif_Days>999) {w.addSpacer(12)} else
  {w.addSpacer(6)}
  
  let titleTxt2 = w.addText(title2)
  titleTxt2.textColor = Color.white()
  titleTxt2.font = Font.boldSystemFont(11)
  
  w.addSpacer(0)
  let subTxt = w.addText(subtitle)
  subTxt.textColor = Color.white()
  subTxt.textOpacity = 1.0
  subTxt.font = Font.systemFont(11)
  return w
}
 

