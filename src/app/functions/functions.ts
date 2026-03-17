import figlet from "figlet";
import moment from "moment-timezone";
import * as shared from '@mydir/shared-utils.js';
import standard from "figlet/fonts/Standard";

figlet.parseFont("Standard", standard);

const { getWarnTimeExpireCalc, setHouseNumZero, getTimeNow, getDateNow, getTimezone, getDateByTimezone, getTimeByTimezone, getDateTimeByTimezone, generateJoke, generateQuote, getListModels, roundNum, genRandomNumbersSimple, shuffleNums, getCountdownResult, getCountupResult, getDataSizeConversion, getTimeConversion, getTemperatureConversion, getLengthConversion, getWeightConversion, getSpeedConversion, getPressureConversion, getVolumeConversion, getEnergyConversion, getInspiredBy, getMotivation, getColorListHex, getCurrencyConversion, getRadioStationsByCountry, getYoutubeSearch, getListAllTimeZones, getWelcomeMessage } = shared;


async function getMyWelcomeMessage() {
  const is3d = true;
  const title = await figlet.text("LCP", {
    font: is3d ? "3D-ASCII" : "Standard",
    horizontalLayout: "full",
    verticalLayout: "full",
    width: 100,
    whitespaceBreak: true,
    showHardBlanks: false,
  });
  return `<span class="titlewelcome">${title}</span><p class="mt-3 txtwelcome">Welcome to our chatbot! How can I assist you today?</p>`;
}

async function getMyRulesMessage() {
  const is3d = true;

  const title = await figlet.text("LCP", {
    font: is3d ? "3D-ASCII" : "Standard",
    horizontalLayout: "full",
    verticalLayout: "full",
    width: 100,
    whitespaceBreak: true,
    showHardBlanks: false,
  });

  return `
    <span class="titlerules">${title}</span>
    <p class="mt-3 txtrules">
      THE CHATBOT RULES:

      1º - Use this chatbot as tool but use it with moderate and responsibility;
      2º - Don't insult to this chatbot and also, ai and/or users or the chatbot will get timeout (max warnings are 3);
      3º - Be cool and dont be afraid to use this chatbot (if you have doubts, please use the command: $feedback msg:[your message here]);
      4º - This chatbot is for people with +18 years old and for people below of 18 years old, they will not able to use to this chatbot due to law of age verification;
      5º - Don't send anything bad things for this chatbot (spam, piracy, etc) or you will get banned and the chatbot will get timeout.

      Enjoy!

      Date: 2026-03-17 17:16:00

      Regards,
      The administration of LCP
    </p>
  `;
}

function getMyByeMessage() {
  const dh = new Date().getHours();
  const statusmsg = dh >= 7 && dh <= 12 ? "morning" : (dh >= 13 && dh <= 18 ? "afternoon" : (dh >= 19 && dh <= 0 ? "night" : "early morning"));
  return "Goodbye! Have a good "+statusmsg+"!";
}

function getMyWarnTimeExpireCalc(v = 1) {
  return v * 60 * 1000;
}

function setMyHouseNumZero(num: number = 1) {
  return num < 10 ? '0' + parseInt(""+num) : parseInt(""+num);
}

function getMyTimeNow() {
  const dt = new Date();
  const dtobj = {
    datev: dt.getFullYear() + "-" + setMyHouseNumZero(dt.getUTCMonth()+1) + "-" + setMyHouseNumZero(dt.getUTCDate()),
    timev: setMyHouseNumZero(dt.getUTCHours()) + ":" + setMyHouseNumZero(dt.getUTCMinutes()) + ":" + setMyHouseNumZero(dt.getUTCSeconds())
  }
  return dtobj.timev;
}

function getMyDateNow() {
  const dt = new Date();
  return dt.getFullYear() + "-" + setMyHouseNumZero(dt.getUTCMonth()+1) + "-" + setMyHouseNumZero(dt.getUTCDate());
}

function getMyTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getMyDateByTimezone(timeZone: string) {
    try {
        // Validate that timeZone is a non-empty string
        if (typeof timeZone !== "string" || !timeZone.trim()) {
            throw new Error("Invalid timezone string.");
        }

        // Format the date for the given timezone
        const formatter = new Intl.DateTimeFormat("pt-PT", {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour12: false // 24-hour format
        });

        return formatter.format(new Date());
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
}

function getMyTimeByTimezone(timeZone: string) {
    try {
        // Validate that timeZone is a non-empty string
        if (typeof timeZone !== "string" || !timeZone.trim()) {
            throw new Error("Invalid timezone string.");
        }

        // Format the date for the given timezone
        const formatter = new Intl.DateTimeFormat("pt-PT", {
            timeZone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false // 24-hour format
        });

        return formatter.format(new Date());
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
}

function getMyDateTimeByTimezone(timeZone: string) {
    try {
        // Validate that timeZone is a non-empty string
        if (typeof timeZone !== "string" || !timeZone.trim()) {
            throw new Error("Invalid timezone string.");
        }

        // Format the date for the given timezone
        const formatter = new Intl.DateTimeFormat("pt-PT", {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false // 24-hour format
        });

        return formatter.format(new Date());
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
}

function getMyListAllTimeZones(method = "native") {
  //methods: native -> IANA time zones, thirdpartylib -> moment-timezone
  let timeZones;

  try {
    if(method == "native") {
      timeZones = Intl.supportedValuesOf("timeZone").map((x, i) => { return "<p>" + i + ": " + x + "</p>";}).toString().replaceAll(",", "");
    } else {
      timeZones = moment.tz.names().map((x, i) => { return "<p>" + i + ": " + x + "</p>";}).toString().replaceAll(",", "");
    }
  } catch (err) {
    console.error("Error:", err);
    timeZones = err;
  }
  
  return ""+timeZones;
}

async function getHelpCmds() {
  const {cmds} = JSON.parse(await require('@mydir/list_help_cmds.json'));
  return cmds || [];
}

function getMyColorListHex() {
  const colors = [
    { name: "Red", hex: "#FF0000" },
    { name: "Green", hex: "#00FF00" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Cyan", hex: "#00FFFF" },
    { name: "Magenta", hex: "#FF00FF" },
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Gray", hex: "#808080" },
    { name: "Orange", hex: "#FFA500" },
    { name: "Purple", hex: "#800080" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Brown", hex: "#A52A2A" },
    { name: "Lime", hex: "#00FF00" },
    { name: "Navy", hex: "#000080" },
  ];

  return colors.map(c => `
    <div class="mcolorblk">
      <span>${c.name}</span>
      <span class="ms-1">-</span>
      <span class="ms-1">${c.hex}</span>
      <span class="ms-1">-&gt;</span>
      <div class="colorblk ms-1" style="background-color: ${c.hex};"></div>
    </div>`).join('\n');
}

function getMyInspiredBy() {
  const inspirations = [
    "The chatbot is inspired by the idea of creating a versatile and interactive assistant that can provide information, answer questions, and engage in conversations on a wide range of topics.",
    "It draws inspiration from the concept of a digital companion that can assist users in their daily lives, offering support, entertainment, and knowledge at their fingertips.",
    "The chatbot is also influenced by the advancements in natural language processing and artificial intelligence, aiming to leverage these technologies to create a more human-like and responsive experience for users."
  ];
  return inspirations[Math.floor(Math.random() * inspirations.length)];
}

function getMyMotivation() {
  const motivations = [
    "The motivation behind this chatbot is to provide users with a convenient and accessible way to obtain information, seek assistance, and engage in meaningful conversations without the need for human intervention.",
    "The chatbot aims to enhance user experience by offering quick and accurate responses, making it easier for individuals to find answers to their questions and access resources on various topics.",
    "The development of this chatbot is driven by the desire to create a tool that can help users save time, increase productivity, and provide a source of entertainment and companionship in the digital age."
  ];
  return motivations[Math.floor(Math.random() * motivations.length)];
}

export { getMyWarnTimeExpireCalc as getWarnTimeExpireCalc, getMyTimezone as getTimezone, getMyTimeNow as getTimeNow, getMyTimeByTimezone as getTimeByTimezone, getMyDateNow as getDateNow, getMyDateByTimezone as getDateByTimezone, getMyDateTimeByTimezone as getDateTimeByTimezone, getHelpCmds, generateJoke, generateQuote, getCountdownResult, getCountupResult, getDataSizeConversion, getTemperatureConversion, getTimeConversion, getCurrencyConversion, getLengthConversion, getWeightConversion, getVolumeConversion, getPressureConversion, getSpeedConversion, getEnergyConversion, getMyInspiredBy as getInspiredBy, getMyMotivation as getMotivation, getRadioStationsByCountry, getYoutubeSearch, getMyColorListHex as getColorListHex, shuffleNums, genRandomNumbersSimple as genRandomNumbers, getMyListAllTimeZones, getWelcomeMessage, getMyWelcomeMessage, getMyRulesMessage, getMyByeMessage };