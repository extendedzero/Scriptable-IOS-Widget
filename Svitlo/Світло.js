
//Version 1.0
//This Scriptable Widget is created by eXtendedZero.
//Very Thanks all known and unknown people whose code parts I used. 

//Використано дані з https://github.com/yaroslav2901/OE_OUTAGE_DATA
//За що Велика Подяка Автору!!!

//--- Віджет "Світло" ---
//Опис.
//Цей віджет показує періоди відключення електроенергії згідно з розкладів для кожної групи. 
//В кольорових прямокутниках відображається період дії стану електромережі. 
//Жовтий прямокутник - є електропостачання. 
//Сірий прямокутник - можливе відключення. 
//Чорний прямокутник - відключення. 
//Біла рамка вказує на поточний період часу. 

//Актуальні дані про відключення:
//Черкасиобленерго (Черкаси)
//Чернігівобленерго (Чернігів)
//Хмельницькобленерго (Хмельницький)
//Харківобленерго (Харків)
//Львівобленерго (Львів)
//Прикарпаттяобленерго (Івано-Франківськ)
//Полтаваобленерго (Полтава)
//Рівнеобленерго (Рівне)
//Тернопільобоенерго (Тернопіль)
//Закарпаттяобленерго (Ужгород)
//Запоріжжяобленерго (Запоріжжя)
//Житомиробленерго (Житомир)

//Для початкового налаштування введіть в якості Parameter віджета Ваше місто і групу. 
//Приклад 1. 
//Для м.Тернопіль, 2.1 група: Тернопіль,2.1
//Приклад 2.
//Для м.Ужгород, 3.1 група: Ужгород,3.1
//Уточнення: ввід українською мовою; міста з великої літери; номер групи через крапку; місто і група розділяються комою без пробілів; по замовчуваню встановлено Тернопіль,1.1.


var input_param_str = args.widgetParameter ?? "Тернопіль,1.1"

const [city, group] = input_param_str.split(",").map(item => item.trim());

const BASE_URL = "https://raw.githubusercontent.com/yaroslav2901/OE_OUTAGE_DATA/refs/heads/main/data/";

const REGION_MAP = {
  "Черкаси": "Cherkasyoblenergo",
  "Чернігів": "Chernihivoblenergo",
  "Хмельницький": "Khmelnytskoblenerho",
  "Львів": "Lvivoblenerho",
  "Полтава": "Poltavaoblenergo",
  "Івано-Франківськ": "Prykarpattiaoblenerho",
  "Рівне": "Rivneoblenergo",
  "Ужгород": "Zakarpattiaoblenerho",
  "Запоріжжя": "Zaporizhzhiaoblenergo",
  "Житомир": "Zhytomyroblenergo",
  "Тернопіль": "Ternopiloblenerho",
  "Харків": "Kharkivoblenerho"
};

const regionFile = REGION_MAP[city];

if (!regionFile) {
  throw new Error(`City "${city}" is not supported.`);
}

const url = `${BASE_URL}${regionFile}.json`;

// Створюємо об'єкт запиту
const req = new Request(url);
const data = await req.loadJSON();

//console.log("Дані успішно завантажено:");
    
const todayTimestamp = data.fact.today.toString();
const scheduleForToday = data.fact.data[todayTimestamp];
const myGroupSchedule = scheduleForToday["GPV"+group]

const period = data.preset.time_zone
const date_upd = data.fact.update.split(" ")

var res=[[],[]]
var res2=[[],[]]
//format: start time, end time, status
//res[0]=["00:00","01:00","yes"]

//спочатку формуємо свій список як format
for(let x = 1; x <25 ; x++)
  {
  res[x]=[period[x.toString()][1],
          period[x.toString()][2],
          myGroupSchedule[x.toString()]
         ]
  }
  
//можливо для сумісності треба додати 0 і 25 елемент - yes
res[0]=["xx:xx","xx:xx","yes"]
res[25]=["xx:xx","xx:xx","yes"]
  
//mfirst,msecond,firs,second - ділимо де період розділений
let x=1
while (x < res.length)
{
 let etime=(res[x][0].split(":"))[0] +":30"
     
  if (res[x][2] == "mfirst")
   {
    res.splice(x, 1, 
       [res[x][0], etime, "maybe"],
       [etime,res[x][1],res[x+1][2]] )
   }//if mfirst

   if (res[x][2] == "msecond")
   {
    res.splice(x, 1, 
       [res[x][0], etime, res[x-1][2]],
       [etime,res[x][1],"maybe"] 
      )
   } //if msecond

  if (res[x][2] == "first")
   {
    res.splice(x, 1, 
       [res[x][0], etime, res[x-1][2]],
       [etime,res[x][1],res[x+1][2]] )
   }//if first

   if (res[x][2] == "second")
   {     
    res.splice(x, 1,
       [res[x][0], etime, res[x-1][2]],
       [etime,res[x][1],res[x+1][2]] 
      )
   } //if second
      
x++
}//while
//виходить -1 таке як внизу, -2 як вверху

//міняємо 24:00 на 00:00
res[res.length-2][1]="00:00"

//теоретично можна видалити 0 і останній елементи масиву res 
//res.splice(0, 1)
//res.splice(res.length-1, 1)

//console.log(res)

//обʼєднуємо в групи
let y=0
res2[y]=res[1]

for(let x = 1; x<res.length-2 ; x++)
{
 if (res[x][2]==res[x+1][2])
  {
    res2[y][1]=res[x+1][1]
  } 
  else
  {
    y=y+1
    res2[y]=res[x+1]
  }  
}//for

res=null

//беремо поточний час
const currentHour = String(new Date().getHours()).padStart(2, "0")
const currentMinute = String(new Date().getMinutes()).padStart(2, "0")
let now = currentHour + ":" + currentMinute

//шукаємо індекс в масиві куди потрапляє наш час. 
let index=res2.findIndex(item=> {
  let start=item[0]
  let end=item[1]
  
  let effectiveEnd = (end === "00:00") ? "24:00":end
  return now>=start&&now<effectiveEnd
}
  )
  
//console.log(index)
//console.log(res2)

//встановлюємо кількість записів для відображення
let reccount
if (res2.length>5)
{
  reccount = 5
}
else
{
  reccount = res2.length
}

//---------------------------
//створюємо віджет
let widget = new ListWidget();

const bgColor = new LinearGradient();
bgColor.colors = [new Color("#000000"), new Color("#1c1c1c")];
bgColor.locations = [0.0, 1.0];
widget.backgroundGradient = bgColor;

let padding = 10;//-5
widget.setPadding(padding, padding, padding, padding);

widget.addSpacer(1)

//кольоровий заголовок
let wrapper = widget.addStack()
wrapper.layoutHorizontally()
wrapper.centerAlignContent()
wrapper.addSpacer() 

let row = wrapper.addStack()
row.layoutHorizontally()
row.spacing = 0

let t1 = row.addText("Св")
t1.font = Font.boldRoundedSystemFont(16)
t1.textColor = Color.white()

let t2 = row.addText("і̲")
t2.font = Font.boldRoundedSystemFont(16)
t2.textColor = Color.yellow()

let t3 = row.addText("тло")
t3.font = Font.boldRoundedSystemFont(16)
t3.textColor = Color.white()

wrapper.addSpacer()
//кінець кольорового заголовка

//місто, група, дата
let cityw = widget.addText(city + ": " + group+" - " + date_upd[0]);
cityw.font = Font.boldRoundedSystemFont(8)
cityw.centerAlignText()

widget.addSpacer(3)

///знаходимо початок і кінець для нашого "вікна" даних. 
//innerIndex - це "внутрішній" індекс для заданого часу - не треба
const N = res2.length
//const WINDOW = reccount
const WINDOW = Math.min(5,reccount)

//const start = Math.min(N - WINDOW, Math.max(0, index - 2))
const start = Math.min(N - WINDOW, Math.max(0, index - Math.floor(WINDOW / 2)))
const end = start + WINDOW - 1
//const innerIndex = index - start;

//основний цикл
//for (let p=0; p<reccount; p++) 
for (let p=start; p<=end; p++) 
{
let inx
if (p==index)
  {inx=true} else {inx=false}

createTextStack(widget, 
  res2[p][0] +" - "+res2[p][1],
  12, 
  res2[p][2],
  inx)
}

//низ: час оновлення даних
let ender = widget.addText("оновлено: "+date_upd[1]);
ender.font = Font.boldRoundedSystemFont(6)
ender.centerAlignText()

widget.addSpacer(1);

Script.setWidget(widget);
Script.complete();
widget.presentSmall();



function createTextStack(stack, text, fontsize, status, activeIndex) 
  {

//кольори для статусу
 switch(status)
  {
  case "yes":
    txtcolor = "#000000"
    bgrcolor = "ffba00"//"ffea00"
    break;    
  case "no":
    txtcolor = "#ffffff"
    bgrcolor = "#202020"
    break;
  case "maybe":
    txtcolor = "#ffffff"
    bgrcolor = "#616569"
    break;
  }

//розміри плашок відповідно їх кількості
 switch(reccount)
  {
   case 5:
    pad = 2
    break
  case 4:
    pad = 5
    break
  case 3:
    pad = 10
    break
  case 2:
    pad = 20
    break
  case 1:
    pad = 48
    break
  }
  
 let rowStack=stack.addStack()
 rowStack.layoutHorizontally()
 rowStack.backgroundColor=new Color(bgrcolor)
 rowStack.cornerRadius=5
 rowStack.setPadding(pad, 0, pad, 0)//2

//обводка активної плашки
 rowStack.borderColor=new Color("#ffffff")
 if (activeIndex==true)
  {
    rowStack.borderWidth=3
  }
  else
  {
    rowStack.borderWidth=0
  }

 rowStack.addSpacer()//зліва пружина
 let txt=rowStack.addText(text)
 txt.font=Font.boldSystemFont(fontsize)
 txt.textColor = new Color(txtcolor)
 //txt.textOpacity = 0.9
 rowStack.addSpacer()//справа пружина

//txt.shadowColor = Color.black()
//txt.shadowOffset = new Point(1,1)
//txt.shadowRadius = 1

  widget.addSpacer(4)
}
  



