//Рускій воєний карабль - іді нахуй!


//Version 2.0
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
//солдати
imgArray[0] = await loadImage(`https://i.postimg.cc/W34xvvXc/0.png`)
//літаки
imgArray[6] = await loadImage(`https://i.postimg.cc/bJp53Nh0/1.png`)
//гелікоп
imgArray[7] = await loadImage(`https://i.postimg.cc/Gtv7n4CC/2.png`)
//танки
imgArray[1] = await loadImage(`https://i.postimg.cc/QC2z1Wsj/3.png`)
//ббм
imgArray[2] = await loadImage(`https://i.postimg.cc/FscrqyYg/4.png`)
//арта
imgArray[3] = await loadImage(`https://i.postimg.cc/P5jXkCZG/5.png`)
//ппо
imgArray[5] = await loadImage(`https://i.postimg.cc/c1P1X9LL/6.png`)
//рсзв
imgArray[4] = await loadImage(`https://i.postimg.cc/vZtQ8GL4/7.png`)
//автотехніка
imgArray[11] = await loadImage(`https://i.postimg.cc/PxPhMYGD/8.png`)
//бпла
imgArray[8] = await loadImage(`https://i.postimg.cc/6pf00s9n/9.png`)
//клраблі
imgArray[10] = await loadImage(`https://i.postimg.cc/76Zw6yLp/10.png`)
//ракети
imgArray[9] = await loadImage(`https://i.postimg.cc/bwRNmdcJ/12.png`)

//get main data
const url = 'https://zsu.gov.ua/oriientovni-vtraty-protyvnyka'
const wv = new WebView()
await wv.loadURL(url)

let js = `Array.from(document.querySelectorAll('div.Container_container__Gk_z0')).map( div =>Array.from(div.children).map(span=>span.innerText))`

var data = await wv.evaluateJavaScript(js)

const name = [["Солдати","Танки","ББМ","Артилерія","РСЗВ","ППО","Літаки","Гелікоптери","БПЛА","Ракети","Кораблі","Підводні човни","Автотехніка"],["Soldiers","Tanks","APV","Artillery","MLRS","AAW","Aircrafts","Helicopters","UAV","Missiles","Boats","Submarines","Vehicles"]]// 

var jsn=JSON.parse(data[3][0])


//completed data
//format: name, count, progress

var res=[[],[]]
var _c //count
var _p //progress

for (let i=0; i<13; i++)//12
{
  temp=(jsn.itemListElement[i].description).split(" ")
_c=temp[0]

if (temp.length >1) 
{ 
  _p=temp[1]  
} else {_p=''} 

res[i]=[name[id][i],_c,_p]
}
 
// видаляємо "підводні човни"
res.splice(11,1)

//------------
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

if ((p+6)!=12)
  {
const imgwidget2=stack.addImage(imgArray[p+6])
imgwidget2.imageSize=new Size(16, 16)

   
  createTextStack(stack, `${res[p+6][0]}`, 70, "#ffffff")
  createTextStack(stack, `${res[p+6][1]}`, 30, "#ffffff")
  createTextStack(stack, `${res[p+6][2]}`, 30, "#ff1a00")
  }

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

  //було 9 стало 8 бо невлазить
  widgetText.font=Font.boldSystemFont(8)
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
