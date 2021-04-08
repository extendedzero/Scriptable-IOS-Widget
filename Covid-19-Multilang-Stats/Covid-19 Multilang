//Version 1.2
//This widget shows daily current statistics of COVID-19 in Ukraine.
//Displayed (for today):
//- the number of identified patients today (updated in the morning around 9:00);
//- the total number of patients;
//- number of deaths;
//- number of recovered.
//Ukraine language.

//This Scriptable Wodget is coded by eXtendedZero.
//Very Thanks all known and unknown people whose codes parts I used. :-)

// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.

//For country(language) setting use Parameter when Run Script. 
//UA  - Ukraine and ukrainian language, 
//UK - United Kingdom and english language, 
//IT - Italy and italy language,
//PL - Poland and poland language,
//DE - Germany and germany language.

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
  case "IT":
    id = 2
    break;
  case "PL":
    id = 3
    break;
  case "DE":
    id = 4
    break;
  }

var lang = [{
    country: "Ukraine",
    cName: "Україна",
    total: "Всього",
    today: "Сьогодні",
    cases: "Захворіло",
    death: "Померло",
    recovered: "Одужало",
    statistic: "Статистика"
    },    
   {country: "UK",
    cName: "England",
    total:"Total",
    today: "Today",
    cases: "Cases",
    death: "Deaths",
    recovered: "Recovered",
    statistic: "Statistic"
    },
    {country: "Italy",
    cName: "Italia",
    total: "Totale",
    today: "Oggi",
    cases: "Contagiati",
    death: "Decessi",
    recovered: "Guarriti",
    statistic: "Statistica"
    },
    {
    country: "Poland",
    cName: "Polska",
    total: "Ogólem",
    today: "Dzisiaj",
    cases: "Zakażenia", 
    death: "Zgony",
    recovered: "Wyzdrowienia",
    statistic: "Statystyka"
    },
    {
    country: "Germany",
    cName: "Deutschland",
    total:"Gesamt", 
    today: "Heute",
    cases: "Fälle",
    death: "Todesfälle",
    recovered: "Genesene", 
    statistic: "Statistik"
    }
    ];

const url = `https://coronavirus-19-api.herokuapp.com/countries/${lang[id].country}`
const req = new Request(url)
const res = await req.loadJSON()

if (config.runsInWidget) {
  // create and show widget
  let widget = await createWidget(
  "COVID-19",
  lang[id].cName,
  lang[id].cases+` ${res.todayCases}`, 
  lang[id].death+` ${res.todayDeaths}`, 
  lang[id].cases+` ${res.cases}`, 
  lang[id].death+` ${res.deaths}`, 
  lang[id].recovered+` ${res.recovered}`, 
  "#8b0000")

  Script.setWidget(widget)
  Script.complete()
} else {
  // make table
  let table = new UITable()
  
  // add header
  let row = new UITableRow()
  row.isHeader = true
  row.addText(lang[id].statistic+` Covid-19 - ${lang[id].cName}`)
  table.addRow(row)
  
  // fill data
  table.addRow(createRow(lang[id].today,""))
  table.addRow(createRow(lang[id].cases, res.todayCases))
  table.addRow(createRow(lang[id].death, res.todayDeaths))
  
  table.addRow(createRow(lang[id].total, ""))
  table.addRow(createRow(lang[id].cases, res.cases))
  table.addRow(createRow(lang[id].death, res.deaths))
  table.addRow(createRow(lang[id].recovered, res.recovered))
  
  if (config.runsWithSiri)
    Speech.speak(`There are ${res.cases} cases in ${lang[id].country}, and ${res.todayCases} cases today.`)
  
  // present table
  table.present()
} 

function createRow(title, number) {
  let row = new UITableRow()
  row.addText(title)
  row.addText(number.toString()).rightAligned()
  return row
}

async function createWidget(pretitle, title, today, todayDead, total, dead, recov, color) {
  
  let w = new ListWidget()
     
  w.backgroundColor = new Color(color)
  w.setPadding(0, 14, 0, 10)

  let row = w.addStack()

  let column = row.addStack()
  column.layoutVertically()

  let preText = column.addText(pretitle)
  preText.font=Font.systemFont(14)
  row.addSpacer(1)

  let titleTxt = column.addText(title)
  titleTxt.font=Font.systemFont(16)
  row.addSpacer(1)

  let req = new Request("https://i.imgur.com/OZLYIp5.png")
  let icon = await req.loadImage()

  row.layoutHorizontally()
  row.addSpacer(16)

  let iconImg = row.addImage(icon)
  iconImg.imageSize = new Size(36, 36)
  
  w.addSpacer(0)
  let todayTxtLabel = w.addText(lang[id].today)
  todayTxtLabel.textColor = Color.white()
  todayTxtLabel.textOpacity = 1.0
  todayTxtLabel.font=Font.boldSystemFont(12)
  todayTxtLabel.centerAlignText()
  
  w.addSpacer(0)
  let todayTxt = w.addText(today)
  todayTxt.textColor = Color.white()
  todayTxt.textOpacity = 1.0
  todayTxt.font=Font.systemFont(12)
  
  w.addSpacer(0)
  let todayTxtDead = w.addText(todayDead)
  todayTxtDead.textColor = Color.white()
  todayTxtDead.textOpacity = 1.0
  todayTxtDead.font=Font.systemFont(12)
  
  w.addSpacer(0)
  let totalTxtLabel = w.addText(lang[id].total)
  totalTxtLabel.textColor = Color.white()
  totalTxtLabel.textOpacity = 0.8
  totalTxtLabel.font=Font.boldSystemFont(12)
  totalTxtLabel.centerAlignText()
  
  w.addSpacer(0)
  let totalTxt = w.addText(total)
  totalTxt.textColor = Color.white()
  totalTxt.textOpacity = 0.8
  totalTxt.font = Font.systemFont(12)
  
  w.addSpacer(0)
  let deadTxt = w.addText(dead)
  deadTxt.textColor = Color.white()
  deadTxt.textOpacity = 0.8
  deadTxt.font = Font.systemFont(12)
  
  w.addSpacer(0) 
  let recovTxt = w.addText(recov)
  recovTxt.textColor = Color.white()
  recovTxt.textOpacity = 0.8
  recovTxt.font = Font.systemFont(12)
  
  return w
}

