//Version 1.0
//Sorry for my English. 
//This Scriptable Widget is coded by eXtendedZero.
//Very Thanks all known and unknown people whose codes parts I used. 

//--- 🚀 Upcoming Launches ---
//Description. 
//Minimalist widget that show upcoming launches in Space.
//Widget updates no more than once an hour.

//Data format:
//• [date time] - date, time upcoming launch
//• color icon - showing curren launch status
//   🚀 - the launch vehicle successfully inserted its payload into the target orbit
//   🔵 - in flight
//   🟢 - current T-0 confirmed by official or reliable resources
//   🟡 - await official confirmation - current date is known with some certainty
//   ⚪️ - current date is placeholder or rough estimation based on unreliable or interpreted sources
//   🔴 - launch failure occurred
//• flag - rocket launch country flag
//• nane - mission name


const rec_count=5

var atNow = new Date
let hh=atNow.getHours()
let mm=atNow.getMinutes()

if (hh < 10) hh = '0' + hh;
if (mm < 10) mm = '0' + mm;

var time_upd=hh+":"+mm

//file 
var fm = FileManager.iCloud()
var dir = fm.documentsDirectory()
var path = fm.joinPath(dir, "space.txt")

if (!fm.fileExists(path))   
  {  
  fm.writeString(path, (hh-1)+":"+mm)
  }

var tt = fm.readString(path)
let h0=tt.split(":")[0]
let m0=tt.split(":")[1]

var dat0=new Date()
    dat0.setHours(h0)
    dat0.setMinutes(m0)
    
var dat2=new Date()
    dat2.setHours(hh)
    dat2.setMinutes(mm)
    
let dif=Math.abs((dat2-dat0)/(1000*60))

//updates no more than once an hour
if (dif>60) 
{

fm.writeString(path, hh+":"+mm)

let req = new Request('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?format=json&limit='+rec_count+'&mode=normal');

//load JSON
let res = await req.loadJSON();

const w = new ListWidget()
const bgColor = new LinearGradient();
bgColor.colors = [new Color("#18191a"), new Color("#0b0b45")];
bgColor.locations = [0.0, 1.0];
w.backgroundGradient = bgColor;

let padding = 10;
w.setPadding(5, padding, padding, padding);

//title
const titlew= w.addText('🚀 Upcoming Launches')
titlew.textColor = new Color("#ffffff")
titlew.font = Font.boldSystemFont(12)
titlew.centerAlignText()

w.addSpacer(4)/

for (let i=0; i<rec_count; i++)
  {
  
  //date-time
  let record_dt = w.addStack()
  record_dt.layoutHorizontally()
  addDataViewCentr(record_dt,"["+makeDateTime(res.results[i].net)+"]",8,"white")
  
  //mission
  let record_text = w.addStack()
  record_text.layoutHorizontally()
  
  //flag
  let flag_rt =getFlagEmoji(res.results[i].pad.location.country_code)
  
  //status
  let status_rt=res.results[i].status.abbrev
  let color_rt="lightGray"
  let pim_rt="⚪️"
  
  if (status_rt=="Success") 
        {
        color_rt="blue"
        pim_rt="🚀"
        }
        
  if (status_rt=="In Flight") 
        {
        color_rt="sky"
        pim_rt="🔵"
        }
        
  if (status_rt=="Go") 
        {
        color_rt="green"
        pim_rt="🟢"
        }
  
  if (status_rt=="TBC") 
        {
        color_rt="yellow"
        pim_rt="🟡"
        }
        
  if (status_rt=="TBD") 
        {
        color_rt="gray"
        pim_rt="⚪️"
        }
  if (status_rt=="Failure") 
        {
        color_rt="red"
        pim_rt="🔴"
        }
    
  //text
  let tx_rt=pim_rt+" | "+flag_rt+" | "+(res.results[i].name).replace(" | ", "|")
  
addDataViewLeft(record_text,tx_rt,11,color_rt)
  

  }

w.presentMedium()
if (config.runsInWidget) 
  {
  let widget = w  
  Script.setWidget(widget)
  Script.complete()
  }
  
} 

function makeDateTime(localDate)
 {
  let dat=new Date(localDate)
  let dd=dat.getDate()
  let mo=dat.getMonth()+1
  let yy=dat.getFullYear()
  
  let hh=dat.getHours()
  let mm=dat.getMinutes()
  
  if (dd < 10) dd = '0' + dd;
  if (mo < 10) mo = '0' + mo;
  
  if (hh < 10) hh = '0' + hh;
  if (mm < 10) mm = '0' + mm;
  
  return dd+"."+mo+"."+yy+" "+hh+":"+mm 

 }

function addDataViewLeft(widget, data, textSize, textColor) 
{
 let viewStack = widget.addStack()
 viewStack.layoutVertically()
    
 let viewStack1 = widget.addStack()
 viewStack1.layoutHorizontally() 

 let label = viewStack1.addText(data)
 label.font = Font.regularMonospacedSystemFont(textSize)

 label.textColor = colorForString(textColor) 
 viewStack1.addSpacer()
}

function addDataViewCentr(widget, data, textSize, textColor) 
{
 let viewStack = widget.addStack()
 viewStack.layoutVertically()
    
 let viewStack1 = widget.addStack()
 viewStack1.layoutHorizontally()

 viewStack1.addSpacer()

 let label = viewStack1.addText(data)
 label.font = Font.regularMonospacedSystemFont(textSize)

 label.textColor = colorForString(textColor) 
 viewStack1.addSpacer()
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

function getFlagEmoji(countryCode) {
  var countryISOMapping = {
  AFG: "AF",
  ALA: "AX",
  ALB: "AL",
  DZA: "DZ",
  ASM: "AS",
  AND: "AD",
  AGO: "AO",
  AIA: "AI",
  ATA: "AQ",
  ATG: "AG",
  ARG: "AR",
  ARM: "AM",
  ABW: "AW",
  AUS: "AU",
  AUT: "AT",
  AZE: "AZ",
  BHS: "BS",
  BHR: "BH",
  BGD: "BD",
  BRB: "BB",
  BLR: "BY",
  BEL: "BE",
  BLZ: "BZ",
  BEN: "BJ",
  BMU: "BM",
  BTN: "BT",
  BOL: "BO",
  BIH: "BA",
  BWA: "BW",
  BVT: "BV",
  BRA: "BR",
  VGB: "VG",
  IOT: "IO",
  BRN: "BN",
  BGR: "BG",
  BFA: "BF",
  BDI: "BI",
  KHM: "KH",
  CMR: "CM",
  CAN: "CA",
  CPV: "CV",
  CYM: "KY",
  CAF: "CF",
  TCD: "TD",
  CHL: "CL",
  CHN: "CN",
  HKG: "HK",
  MAC: "MO",
  CXR: "CX",
  CCK: "CC",
  COL: "CO",
  COM: "KM",
  COG: "CG",
  COD: "CD",
  COK: "CK",
  CRI: "CR",
  CIV: "CI",
  HRV: "HR",
  CUB: "CU",
  CYP: "CY",
  CZE: "CZ",
  DNK: "DK",
  DJI: "DJ",
  DMA: "DM",
  DOM: "DO",
  ECU: "EC",
  EGY: "EG",
  SLV: "SV",
  GNQ: "GQ",
  ERI: "ER",
  EST: "EE",
  ETH: "ET",
  FLK: "FK",
  FRO: "FO",
  FJI: "FJ",
  FIN: "FI",
  FRA: "FR",
  GUF: "GF",
  PYF: "PF",
  ATF: "TF",
  GAB: "GA",
  GMB: "GM",
  GEO: "GE",
  DEU: "DE",
  GHA: "GH",
  GIB: "GI",
  GRC: "GR",
  GRL: "GL",
  GRD: "GD",
  GLP: "GP",
  GUM: "GU",
  GTM: "GT",
  GGY: "GG",
  GIN: "GN",
  GNB: "GW",
  GUY: "GY",
  HTI: "HT",
  HMD: "HM",
  VAT: "VA",
  HND: "HN",
  HUN: "HU",
  ISL: "IS",
  IND: "IN",
  IDN: "ID",
  IRN: "IR",
  IRQ: "IQ",
  IRL: "IE",
  IMN: "IM",
  ISR: "IL",
  ITA: "IT",
  JAM: "JM",
  JPN: "JP",
  JEY: "JE",
  JOR: "JO",
  KAZ: "KZ",
  KEN: "KE",
  KIR: "KI",
  PRK: "KP",
  KOR: "KR",
  KWT: "KW",
  KGZ: "KG",
  LAO: "LA",
  LVA: "LV",
  LBN: "LB",
  LSO: "LS",
  LBR: "LR",
  LBY: "LY",
  LIE: "LI",
  LTU: "LT",
  LUX: "LU",
  MKD: "MK",
  MDG: "MG",
  MWI: "MW",
  MYS: "MY",
  MDV: "MV",
  MLI: "ML",
  MLT: "MT",
  MHL: "MH",
  MTQ: "MQ",
  MRT: "MR",
  MUS: "MU",
  MYT: "YT",
  MEX: "MX",
  FSM: "FM",
  MDA: "MD",
  MCO: "MC",
  MNG: "MN",
  MNE: "ME",
  MSR: "MS",
  MAR: "MA",
  MOZ: "MZ",
  MMR: "MM",
  NAM: "NA",
  NRU: "NR",
  NPL: "NP",
  NLD: "NL",
  ANT: "AN",
  NCL: "NC",
  NZL: "NZ",
  NIC: "NI",
  NER: "NE",
  NGA: "NG",
  NIU: "NU",
  NFK: "NF",
  MNP: "MP",
  NOR: "NO",
  OMN: "OM",
  PAK: "PK",
  PLW: "PW",
  PSE: "PS",
  PAN: "PA",
  PNG: "PG",
  PRY: "PY",
  PER: "PE",
  PHL: "PH",
  PCN: "PN",
  POL: "PL",
  PRT: "PT",
  PRI: "PR",
  QAT: "QA",
  REU: "RE",
  ROU: "RO",
  RUS: "RU",
  RWA: "RW",
  BLM: "BL",
  SHN: "SH",
  KNA: "KN",
  LCA: "LC",
  MAF: "MF",
  SPM: "PM",
  VCT: "VC",
  WSM: "WS",
  SMR: "SM",
  STP: "ST",
  SAU: "SA",
  SEN: "SN",
  SRB: "RS",
  SYC: "SC",
  SLE: "SL",
  SGP: "SG",
  SVK: "SK",
  SVN: "SI",
  SLB: "SB",
  SOM: "SO",
  ZAF: "ZA",
  SGS: "GS",
  SSD: "SS",
  ESP: "ES",
  LKA: "LK",
  SDN: "SD",
  SUR: "SR",
  SJM: "SJ",
  SWZ: "SZ",
  SWE: "SE",
  CHE: "CH",
  SYR: "SY",
  TWN: "TW",
  TJK: "TJ",
  TZA: "TZ",
  THA: "TH",
  TLS: "TL",
  TGO: "TG",
  TKL: "TK",
  TON: "TO",
  TTO: "TT",
  TUN: "TN",
  TUR: "TR",
  TKM: "TM",
  TCA: "TC",
  TUV: "TV",
  UGA: "UG",
  UKR: "UA",
  ARE: "AE",
  GBR: "GB",
  USA: "US",
  UMI: "UM",
  URY: "UY",
  UZB: "UZ",
  VUT: "VU",
  VEN: "VE",
  VNM: "VN",
  VIR: "VI",
  WLF: "WF",
  ESH: "EH",
  YEM: "YE",
  ZMB: "ZM",
  ZWE: "ZW",
  XKX: "XK"
}

if (countryCode!="")
   {
   const codePoints =    countryISOMapping[countryCode]
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
   return String.fromCodePoint(...codePoints);
   } else
   {
    return "🏁"
   }
}
