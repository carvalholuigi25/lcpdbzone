import fs from 'fs';
import figlet from "figlet";
import standard from "figlet/fonts/Standard";
import { create, all } from 'mathjs';
import { htmlToText } from "html-to-text";
import * as shared from './shared-utils.mjs';

figlet.parseFont("Standard", standard);

const math = create(all);

const { getWarnTimeExpireCalc, getTimeNow, getDateNow, getTimezone, getDateByTimezone, getTimeByTimezone, getDateTimeByTimezone, generateJoke, generateQuote, getListModels, genRandomNumbersSimple, shuffleNums, getCountdownResult, getCountupResult, getDataSizeConversion, getTimeConversion, getTemperatureConversion, getLengthConversion, getWeightConversion, getSpeedConversion, getPressureConversion, getVolumeConversion, getEnergyConversion, getInspiredBy, getMotivation, getColorListHex, getCurrencyConversion, getRadioStationsByCountry, getYoutubeSearch, getListAllTimeZones } = shared;

async function getWelcomeMessage() {
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

async function getRulesMessage() {
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
      3º - Be cool and dont be afraid to use this chatbot;
      4º - This chatbot is for people with +18 years old and for people below of 18 years old, they will not able to use to this chatbot due to law of age verification;
      5º - Don't send anything bad things for this chatbot (spam, piracy, etc) or the chatbot will get timeout and you will get banned temporarily (1 week is max ban time).

      If you have doubts or any issues, please use the command: $feedback from:[from] name:[name] subject:[subject] content:[content] contenthtml:[contenthtml?] or contact us at: <a href="mailto:luiscarvalho239@gmail.com">LCP's official email creator</a>.

      Enjoy!

      Date: 2026-03-17 17:16:00

      Regards,
      The administration of LCP
    </p>
  `;
}

async function sendFeedback(nodemailer, from, name, subject, content, contenthtml) {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAILSERVICE ?? 'gmail',
      host: process.env.EMAILHOST ?? 'smtp.gmail.com',
      port: process.env.EMAILPORT ?? 465,
      secure: process.env.EMAILSECURE ?? true,
      auth: {
        user: process.env.EMAILSMTPUSER || '',
        pass: process.env.EMAILSMTPPASS || '',
      }
    });

    const to = process.env.CONTACT_EMAIL || process.env.EMAILSENDER;

    const objdata = {
      from: name ? '"'+name+'" <'+from+'>' : ""+from,
      to: to,
      subject: ""+subject,
      text: '"'+content+'"',
      html: htmlToText(contenthtml ?? content)
    };

    console.log(objdata);

    return await transporter.sendMail(objdata).then(r => {
      console.log(r);
      return "The feedback has been sent to " + to;
    }).catch(err => {
      console.error(err);
      return "Error when trying to send feedback to someone: " + err;
    });
  } catch(err) {
    return "Error when trying to send feedback to someone: " + err;
  }
}

function getByeMessage() {
  const dh = new Date().getHours();
  const statusmsg = dh >= 7 && dh <= 12 ? "morning" : (dh >= 13 && dh <= 18 ? "afternoon" : (dh >= 19 && dh <= 0 ? "night" : "early morning"));
  return "Goodbye! Have a good "+statusmsg+"!";
}

function getHelpCmds() {
  const {cmds} = JSON.parse(fs.readFileSync('./list_help_cmds.json', 'utf-8'));
  return cmds || [];
}

function getCalculatorResult(expression) {
  try {
    // Validate the expression to allow only numbers and basic operators
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      throw new Error("Invalid characters in expression.");
    }

    // Evaluate the expression safely using mathjs
    const result = math.evaluate(expression);
    return `The result of ${expression} is: ${result}`;
  }
  catch (error) {
    return "Error evaluating expression: " + error.message;
  }
}

function getCalcAgeResult(birthYear) {
  try {
    const currentYear = new Date().getFullYear();
    if (isNaN(birthYear) || birthYear < 0 || birthYear > currentYear) {
      throw new Error("Invalid birth year.");
    }
    const age = currentYear - birthYear;
    return `You are approximately ${age} years old.`;
  }
  catch (error) {
    return "Error calculating age: " + error.message;
  }
}

function setTheme(ls, themeName = "default") {
  try {
    if(ls && ls.getItem("cbsettings")) {
      ls.removeItem("cbsettings");
    }

    if(themeName && !ls.getItem("cbsettings")) {
      ls.setItem("cbsettings", JSON.stringify({appearence: {theme: themeName}}));
    }

    const theme = ls.getItem("cbsettings") ? JSON.parse(ls.getItem("cbsettings")).appearence.theme : themeName;
    return theme && theme !== "" ? "The theme has been set it sucessfully." : "Something wrong with setting with theme...";
  } catch (error) {
    return "Error: The theme couldn't be set. Here's details: " + error;
  }
}

function getTheme(ls, theme) {
  return ls.getItem("cbsettings") && JSON.parse(ls.getItem("cbsettings")).appearence.theme || (theme ?? "default");
}

export { getWarnTimeExpireCalc, getTimezone, getTimeNow, getTimeByTimezone, getDateNow, getDateByTimezone, getDateTimeByTimezone, getHelpCmds, generateJoke, generateQuote, getListModels, getCalculatorResult, getCalcAgeResult, getCountdownResult, getCountupResult, getDataSizeConversion, getTemperatureConversion, getTimeConversion, getCurrencyConversion, getLengthConversion, getWeightConversion, getVolumeConversion, getPressureConversion, getSpeedConversion, getEnergyConversion, getInspiredBy, getMotivation, getRadioStationsByCountry, getYoutubeSearch, getColorListHex, shuffleNums, genRandomNumbersSimple as genRandomNumbers, getListAllTimeZones, getWelcomeMessage, getByeMessage, getRulesMessage, sendFeedback, setTheme, getTheme };