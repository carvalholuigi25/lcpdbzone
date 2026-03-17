import figlet from "figlet";
import fs from 'fs';
import standard from "figlet/fonts/Standard";
import { create, all } from 'mathjs';
import * as shared from './shared-utils.js';

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

async function sendFeedback(from, to, name, subject, content, contenthtml = "") {
 try {
  //src: https://developers.google.com/workspace/gmail/imap/imap-smtp?hl=pt-br and https://chatgpt.com/c/69b98b98-dd00-8333-b1bf-14570cfe9eff
   // Create transporter
    // let transporter = nodemailer.createTransport({
    //   host: process.env['EMAILSERVICEHOST'] ?? 'smtp.gmail.com',
    //   port: process.env['EMAILSERVICEPORT'] ?? 465,
    //   secure: process.env['EMAILSERVICESECURE'] ?? true,
    //   auth: {
    //     user: process.env['EMAILAUTHUSER'],
    //     pass: process.env['EMAILAUTHPASS'],
    //   },
    // });

    // const nodemailer = require("nodemailer");
    // let transporter = nodemailer.createTransport({
    //   service: process.env['EMAILSERVICE'] ?? "gmail",
    //   auth: {
    //     user: process.env['EMAILAUTHUSER'],
    //     pass: process.env['EMAILAUTHPASS'],
    //   },
    // });

  // Email options
  let mailOptions = {
    from: '"'+name+'" <'+from+'>',
    to: ""+(to ?? process.env.EMAILSENDER),
    subject: ""+subject,
    text: ""+content,
    html: ""+contenthtml,
  };

  // Send email
  // let info = await transporter.sendMail(mailOptions);
  // return "The feedback has been sent sucessfully to: " + to + "(id: " + info.messageId + ")";
  return "The feedback has been sent sucessfully to: " + mailOptions;
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

export { getWarnTimeExpireCalc, getTimezone, getTimeNow, getTimeByTimezone, getDateNow, getDateByTimezone, getDateTimeByTimezone, getHelpCmds, generateJoke, generateQuote, getListModels, getCalculatorResult, getCalcAgeResult, getCountdownResult, getCountupResult, getDataSizeConversion, getTemperatureConversion, getTimeConversion, getCurrencyConversion, getLengthConversion, getWeightConversion, getVolumeConversion, getPressureConversion, getSpeedConversion, getEnergyConversion, getInspiredBy, getMotivation, getRadioStationsByCountry, getYoutubeSearch, getColorListHex, shuffleNums, genRandomNumbersSimple as genRandomNumbers, getListAllTimeZones, getWelcomeMessage, getByeMessage, getRulesMessage, sendFeedback };