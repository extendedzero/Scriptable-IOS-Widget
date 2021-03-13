// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: procedures;
//Version 1.1
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

// change "country" to a value from https://coronavirus-19-api.herokuapp.com/countries/

const country = "Ukraine"
const url = `https://coronavirus-19-api.herokuapp.com/countries/${country}`
const req = new Request(url)
const res = await req.loadJSON()

if (config.runsInWidget) {
  // create and show widget
  let widget = await createWidget("COVID-19", "Україна", `Сьогодні ${res.todayCases}`, `Всього ${res.cases}`, `Померло ${res.deaths}`, `Одужало ${res.recovered}`, "#8b0000")

  Script.setWidget(widget)
  Script.complete()
} else {
  // make table
  let table = new UITable()
  
  // add header
  let row = new UITableRow()
  row.isHeader = true
  row.addText(`Статистика Covid-19 по ${country}`)
  table.addRow(row)
  
  // fill data
  table.addRow(createRow("Всього", res.cases))
  table.addRow(createRow("Сьогодні", res.todayCases))
  table.addRow(createRow("Померло", res.deaths))
  table.addRow(createRow("Одужало", res.recovered))
  
  if (config.runsWithSiri)
    Speech.speak(`There are ${res.cases} cases in ${country}, and ${res.todayCases} cases today.`)
  
  // present table
  table.present()
} 

function createRow(title, number) {
  let row = new UITableRow()
  row.addText(title)
  row.addText(number.toString()).rightAligned()
  return row
}

async function createWidget(pretitle, title, today, total, dead, recov, color) {
  
  let w = new ListWidget()
     
  w.backgroundColor = new Color(color)
  w.setPadding(10, 10, 10, 10)

  //
  let row = w.addStack()

  let column = row.addStack()
  column.layoutVertically()

  let preText = column.addText(pretitle)
  row.addSpacer(1)

  let titleTxt = column.addText(title)
  row.addSpacer(1)

  let req = new Request("https://i.imgur.com/OZLYIp5.png")
  let icon = await req.loadImage()

  row.layoutHorizontally()
  row.addSpacer(7)

  let iconImg = row.addImage(icon)
  iconImg.imageSize = new Size(40, 40)
  //
  
  w.addSpacer(4)
  let todayTxt = w.addText(today)
  todayTxt.textColor = Color.white()
  todayTxt.textOpacity = 1.0
  todayTxt.font=Font.boldSystemFont(14)
  
  w.addSpacer(2)
  let totalTxt = w.addText(total)
  totalTxt.textColor = Color.white()
  totalTxt.textOpacity = 0.8
  totalTxt.font = Font.systemFont(13)
  
  w.addSpacer(2)
  let deadTxt = w.addText(dead)
  deadTxt.textColor = Color.white()
  deadTxt.textOpacity = 0.8
  deadTxt.font = Font.systemFont(13)
  
  w.addSpacer(2) 
  let recovTxt = w.addText(recov)
  recovTxt.textColor = Color.white()
  recovTxt.textOpacity = 0.8
  recovTxt.font = Font.systemFont(13)
  
  return w
}
 


