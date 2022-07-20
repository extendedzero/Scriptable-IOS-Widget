//Version 1.0
//Sorry for my English. 
//This Scriptable Widget is coded by eXtendedZero
//Very Thanks all known and unknown people whose codes parts I used. 

//--- WhereIsWebb ---
//Description. 
//Minimalist widget that show major deployment/commissioning schedule phases, its current deployment/commissioning state and status of that state James Webb space telescope.


var url="https://webb.nasa.gov/content/webbLaunch/whereIsWebb.html"

let html = await loadHTML(url)

//get title
let ttl=html.match(/"title":".*",/g)
let ttl_count=ttl.length
var title=new Array(ttl_count)
for (let i=0; i<ttl_count;i++)
{
  title[i]=ttl[i].replace(/"title":"/g, '').replace(/",/g, '')

}

//get subtitle
let sbttl=html.match(/"subtitle": ".*",/g)
let sbttl_count=sbttl.length
var subtitle=new Array(sbttl_count)
for (let i=0; i<sbttl_count;i++)
{
  subtitle[i]=sbttl[i].replace(/"subtitle": "/g, '').replace(/",/g, '')

}

//get nominalEventTime
let net=html.match(/"nominalEventTime": ".*",/g)
let net_count=net.length
var nominalEventTime=new Array(net_count)
for (let i=0; i<net_count;i++)
{
  nominalEventTime[i]=net[i].replace(/"nominalEventTime": "/g, '').replace(/",/g, '')

// delete html tags
nominalEventTime[i]=nominalEventTime[i].replace(/(<([^>]+)>)/g, "").trim()

}

//get status
let stts=html.match(/"status" : ".*",/g)
let stts_count=stts.length
var status=new Array(stts_count)
for (let i=0; i<stts_count;i++)
{
  status[i]=stts[i].replace(/"status" : "/g, '').replace(/",/g, '')

// delete html tags
status[i]=status[i].replace(/(<([^>]+)>)/g, "").trim()

}

//get icon image url 
//not used now
let icn=html.match(/"thumbnailUrl":".*",/g)
let icn_count=icn.length
var icon_url=new Array(icn_count)
for (let i=0; i<icn_count;i++)
{
  icon_url[i]="https://jwst.nasa.gov"+icn[i].replace(/"thumbnailUrl":"/g, '').replace(/",/g, '')

if (icon_url[i].includes("gif"))
  {
  icon_url[i]="https://i.postimg.cc/3wqZzhgs/so.png"
  }
  
}

//get state image url 
let siu=html.match(/"stateImageUrl":".*",/g)
let siu_count=siu.length
var image_url=new Array(siu_count)
for (let i=0; i<siu_count;i++)
{
  image_url[i]="https://jwst.nasa.gov"+siu[i].replace(/"stateImageUrl":"/g, '').replace(/",/g, '')

}

var icon = await loadImage(icon_url[icn_count-1])

var image = await loadImage(image_url[siu_count-1])


//main 
if (config.runsInWidget) 
  {
const w = new ListWidget()

const bgColor = new LinearGradient();
bgColor.colors = [new Color("#18191a"), new Color("#232357")];
bgColor.locations = [0.0, 1.0];
w.backgroundGradient = bgColor;

let padding = 5;
w.setPadding(15, padding, padding, padding);

//title
const titlew= w.addText('WHERE IS WEBB?')
titlew.textColor = new Color("#ffffff")
titlew.font = Font.boldSystemFont(12)
titlew.centerAlignText()

w.addSpacer(1)

let webb_data = w.addStack()
webb_data.layoutHorizontally()

webb_data.addSpacer()

let viewStack1 = webb_data.addStack()
viewStack1.layoutVertically()

createTextStack(viewStack1, "Current State/Step:", 8, "sky")
createTextStack(viewStack1, title[ttl_count-1], 12, "yellow")

createTextStack(viewStack1, subtitle[sbttl_count-1], 10, "white")

viewStack1.addSpacer(3)
createTextStack(viewStack1,"Nominal Event Time:", 7, "white")
createTextStack(viewStack1,nominalEventTime[net_count-1], 7, "yellow")

viewStack1.addSpacer(3)
createTextStack(viewStack1,"Status:", 7, "white")
createTextStack(viewStack1,status[net_count-1], 7, "yellow")

viewStack1.addSpacer()

const image_webb=webb_data.addImage(image)
image_webb.imageSize=new Size(100, 100)

webb_data.addSpacer()

w.presentMedium()
if (config.runsInWidget) 
  {
  let widget = w  
  Script.setWidget(widget)
  Script.complete()
  }

 } else
 {
  Safari.open(url)
 }


function createTextStack(stack, text, size, color) 
  {
  const tmpStack = stack.addStack()
  tmpStack.size = new Size(180, 0)
  widgetText = tmpStack.addText(text)
  tmpStack.addSpacer()//left align
  widgetText.font=Font.boldSystemFont(size)
  widgetText.textColor=colorForString(color)
  }

function colorForString(colorString) {
  if (colorString == "sky") 
    {
    return new Color("99ccff");
    }
  if (colorString == "blueGreen") 
    {
    return new Color("088f8f");
    }
  if (colorString == "blue") 
    {
    return new Color("4169e1");
    }
  if (colorString == "yellow") 
    {
    return Color.yellow();
    }
  if (colorString == "red") 
    {
    return Color.red();
    }
  if (colorString == "green") 
    {
    return Color.green();
    }
  if (colorString == "lightGray") 
    {
    return Color.lightGray();
    }
  if (colorString == "gray") 
    {
    return Color.gray();
    }
  return Color.white();
}

async function loadHTML(url) 
{ 
let req = new Request(url) 
let html = await req.loadString()
return html 
}

async function  loadImage(imgUrl) 
 {
 let req = new Request(imgUrl)
 let image = await req.loadImage()
 return image
 }
