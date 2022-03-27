//Рускій воєний карабль - іді нахуй!


//Version 1.0
//Sorry for my English. 
//This Scriptable Widget is coded by eXtendedZero.
//Very Thanks all known and unknown people whose codes parts I used. 
//Special thanks https://github.com/Juniorchen2012 for his script I used as template. 

//All data from pravda.com.ua.
//Military icons from uawar.net.

//---Losses of russia widget---
//Description. 
//This widget shows russia's current losses in the war against Ukraine.
//The widget is updated once a day around 10:00 Kyiv time.
//For language setting use Parameter when Run Script. 
//UA  - ukrainian language, 
//UK - english language.


var langId = args.widgetParameter
var id = 0 //default UA

switch(langId)
  {
  case "UA":
    id = 0
    break;    
  case "UK":
    id = 1
    break;
  }

//get day, hours, min from war start
let diffTime = Math.abs(new Date().valueOf() - new Date('2022-02-24T04:48:00').valueOf());
let days = diffTime / (24*60*60*1000);
let hours = (days % 1) * 24;
let minutes = (hours % 1) * 60;
let secs = (minutes % 1) * 60;
[days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)]

//titles
switch(id)
  {
  case 0://UA
    var title="Втрати росії:"
    var title2="Війна триває "+days+' днів '+ hours+' годин '+ minutes+' хвилин'
    break;    
  case 1://UK
    var title="Losses of russia:"
    var title2="The war lasts "+days+' days '+ hours+' hours '+ minutes+' minutes'
    break;
  }

//load to array icon images
var imgArray = new Array()
imgArray[0] = await loadImage(`https://i.postimg.cc/W34xvvXc/0.png`)

imgArray[1] = await loadImage(`https://i.postimg.cc/QC9PFJ26/1.png`)

imgArray[2] = await loadImage(`https://i.postimg.cc/sX0qfNNQ/2.png`)

imgArray[3] = await loadImage(`https://i.postimg.cc/QC2z1Wsj/3.png`)

imgArray[4] = await loadImage(`https://i.postimg.cc/FscrqyYg/4.png`)

imgArray[5] = await loadImage(`https://i.postimg.cc/P5jXkCZG/5.png`)

imgArray[6] = await loadImage(`https://i.postimg.cc/c1P1X9LL/6.png`)

imgArray[7] = await loadImage(`https://i.postimg.cc/vZtQ8GL4/7.png`)

imgArray[8] = await loadImage(`https://i.postimg.cc/PxPhMYGD/8.png`)

imgArray[9] = await loadImage(`https://i.postimg.cc/vBky2TMN/9.png`)

imgArray[10] = await loadImage(`https://i.postimg.cc/6QHtRzPw/10.png`)

imgArray[11] = await loadImage(`https://i.postimg.cc/MHBSCwpK/11.png`)

//get main data
const url = 'https://pravda.com.ua'
const wv = new WebView()
await wv.loadURL(url)

let js = `Array.from(document.querySelectorAll('div.war_block div.war_item')).map( div => Array.from(div.children).map(span=>span.innerText))`

var data = await wv.evaluateJavaScript(js)

const name = [["Солдати","Літаки","Гелікоптери","Танки","ББМ","Артилерія","ППО","РСЗВ","Цистерни","БПЛА","Кораблі"," Автомобілі"],["Soldiers","Aircrafts","Helicopters","Tanks","APV","Artillery","AAW","MLRS","Fuel tanks","UAV","Boats"," Vehicles"]]

//console.log(data)
for (let i=0; i<13; i++)
 {
  temp=data[i][1]
  //remove space and +...     
  data[i][1]=(data[i][1].replace(/\s/g, ``)).replace(/[+]\d+/g, ``)

  //remove space and ~...
  data[i][0]=(temp.replace(/\s/g, ``)).replace(/~\d+|^\d+/g, ``)
 }

//remove полонені
data.splice(1, 1)

//completed data
//format: name, count, progress
var res=[[],[]]
for (let i=0; i<12; i++)
{
res[i]=[name[id][i],data[i][1],data[i][0]]
}
//console.log(res)

const w = new ListWidget()
w.backgroundColor = new Color("#46482e")

const titlew= w.addText(title)
titlew.textColor = new Color("#ffffff")
titlew.font = Font.boldSystemFont(12)
titlew.centerAlignText()

w.addSpacer(4)//2


for (let p=0; p<6; p++) 
{

const stack = w.addStack()
stack.layoutHorizontally()
stack.centerAlignContent()  
  
const imgwidget=stack.addImage(imgArray[p])
imgwidget.imageSize=new Size(16, 16)

createTextStack(stack, `${res[p][0]}`, 65, "#ffffff")
createTextStack(stack, `${res[p][1]}`, 40, "#ffffff")
createTextStack(stack, `${res[p][2]}`, 40, "#ff1a00")

const imgwidget2=stack.addImage(imgArray[p+6])
imgwidget2.imageSize=new Size(16, 16)
   
createTextStack(stack, `${res[p+6][0]}`, 70, "#ffffff")
 createTextStack(stack, `${res[p+6][1]}`, 30, "#ffffff")
createTextStack(stack, `${res[p+6][2]}`, 30, "#ff1a00")

w.addSpacer(2)

}

const titlew2= w.addText(title2)
titlew2.textColor = new Color("#ffffff")
titlew2.font = Font.boldSystemFont(9)
titlew2.centerAlignText()


w.presentMedium()
if (config.runsInWidget) 
  {
  let widget = w  
  Script.setWidget(widget)
  Script.complete()
  }
  

function createTextStack(stack, text, width, color) 
  {
  const tmpStack = stack.addStack()
  tmpStack.size = new Size(width, 14)//20  
  widgetText = tmpStack.addText(text)
  //tmpStack.addSpacer()
  widgetText.font=Font.boldSystemFont(10)
  widgetText.textColor = new Color(color)
  widgetText.textOpacity = 0.9
  return widgetText
  }


async function  loadImage(imgUrl) 
 {
 let req = new Request(imgUrl)
 let image = await req.loadImage()
 return image
 }
