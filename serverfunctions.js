import fs from 'fs';
import axios from 'axios';
import figlet from "figlet";
import standard from "figlet/fonts/Standard";
import { create, all } from 'mathjs';
import { htmlToText } from "html-to-text";
import * as shared from './shared-utils.mjs';

figlet.parseFont("Standard", standard);

const math = create(all);

const { getWarnTimeExpireCalc, getTimeNow, getDateNow, getTimezone, getDateByTimezone, getTimeByTimezone, getDateTimeByTimezone, generateJoke, generateQuote, getListModels, genRandomNumbersSimple, shuffleNums, getCountdownResult, getCountupResult, getDataSizeConversion, getTimeConversion, getTemperatureConversion, getLengthConversion, getWeightConversion, getSpeedConversion, getPressureConversion, getVolumeConversion, getEnergyConversion, getInspiredBy, getMotivation, getColorListHex, getCurrencyConversion, getRadioStationsByCountry, getYoutubeSearch, getListAllTimeZones, getWeather } = shared;

function getRules() {
  const {rules} = JSON.parse(fs.readFileSync('./rules.json', 'utf-8')) || {};
  const ruleslist = rules && Array.isArray(rules) ? rules : [];
  const ruleslen = ruleslist.length;

  const rulesitems = ruleslist.map((x, i) => {
    return `<li><b>${(i+1)}.</b> ${x.desc}${(i==ruleslen-1 ? "." : ";")}</li>`;
  }).toString().replaceAll(",", "")

  return ruleslist && ruleslen > 0 ? `<ul class="ruleslist m-0">${rulesitems}</ul>` : `No rules!`;
}

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

  const rules = getRules();

  return `
    <span class="titlerules">${title}</span>
    <div class="mt-3 txtrules">
      <p>THE CHATBOT RULES:</p>
      ${rules}
      <p>If you have doubts or any issues, please use the command: $feedback from:[from] name:[name] subject:[subject] content:[content] contenthtml:[contenthtml?] or contact us at: <a href="mailto:luiscarvalho239@gmail.com">LCP's official email creator</a>.</p>
      <p>Enjoy!</p>
      <p>Date: 2026-03-17 17:16:00</p>
      <p>Regards,</p>
      <p>The administration of LCP</p>
    </div>
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
      text: ""+content,
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

async function getNews(a, srch, lang = "en", category = "technology", country = "pt") {
  return axios.get('https://gnews.io/api/v4/top-headlines', {
    params: {
      apikey: process.env.API_GNEWS_KEY,
      lang: lang || "en",
      country: country || "pt",
      category: category || "technology",
      max: 5,
      p: 1,
      q: srch ? srch.trim() : ""
    },
    headers: {
      'Accept': 'application/json; charset=utf-8',
      'Content-Type': 'application/json; charset=utf-8'
    }
  }).then(response => {
    const articles = response.data.articles;
    if (articles.length === 0) {
      return "No news found.";
    }
    return "Top news:\n" + articles.map(article => `
      <div class="newsarticle">
        <h3>${article.title} - ${article.source.name}</h3>
        <p>(${article.description})</p>
        <a href="${article.source.url ?? article.url}" target="_blank" rel="noopener noreferrer">Read more</a>
      </div>
    `).join("\n");
  }).catch(error => {
    console.error("GNews API error:", error);
    return "Error fetching news: " + error.message;
  });
}

function getVideo(id, islocal = false) {
  return "<div class='myvideoblk "+(islocal ? 'localblk' : 'youtubeblk')+"'><iframe width='560' height='315' src='"+(islocal ? id : 'https://www.youtube.com/embed/' + id)+"' title='"+(islocal ? 'Local video player' : 'YouTube video player')+"' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe></div>";
}

function getAudio(id, islocal = false) {
  return "<div class='myaudioblk "+(islocal ? 'localblk' : 'spotifyblk')+"'><iframe width='560' height='315' src='"+(islocal ? id : 'https://open.spotify.com/embed/track/' + id)+"' title='"+(islocal ? 'Local audio player' : 'Spotify audio player')+"' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe></div>";
}

function getByeMessage() {
  const dh = new Date().getHours();
  const statusmsg = dh >= 6 && dh < 12 ? "morning" : (dh >= 12 && dh < 18 ? "afternoon" : (dh >= 18 && dh < 22 ? "evening" : "night"));
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
    return `You are approximately ${parseInt(age, 10)} years old.`;
  }
  catch (error) {
    return "Error calculating age: " + error.message;
  }
}

function listDefThemes() {
  return ["default", "matrix", "liquidglass", "glassmorphism", "visionglass", "red", "green", "blue", "yellow", "orange", "purple", "ocean", "earth", "gold", "silver", "bronze", "dark", "white", "rgb"];
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

async function getSpotifyAccessToken() {
  const clientId = process.env.API_SPOTIFY_CLIENTID;
  const clientSecret = process.env.API_SPOTIFY_CLIENTSECRET;
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error);
    throw new Error('Failed to get Spotify access token');
  }
}

async function getSpotifyMusic(q) {
  // Implement Spotify music search functionality here, using public Spotify API

  const token = await getSpotifyAccessToken();

  await axios.get('https://api.spotify.com/v1/search', {
    params: {
      q: q,
      type: 'track',
      limit: 5
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
    const tracks = response.data.tracks.items;
    if (tracks.length === 0) {
      return "No tracks found for: " + q;
    }
    return "Top Spotify tracks for '" + q + "':\n" + tracks.map(track => `${track.name} by ${track.artists.map(artist => artist.name).join(", ")}`).join("\n");
  }).catch(error => {
    console.error("Spotify API error:", error);
    return "Error fetching Spotify tracks: " + error.message;
  });
}

function getHelloMessageCMD() {
  return "Hello world!";
}

function getHelpListCMD() {
  return "HELP: With prefix (! or $), use this avaliable list of commands: \r\n\n" + getHelpCmds().map(x => `${x.id}. <b>${x.cmd}</b> - ${x.description}`).join("\r\n");
}

async function sendFeedbackCMD(a, nodemailer) {
  const IsContentHTMLRequired = false;
  const defemailsender = process.env.EMAILSENDER ?? process.env.CONTACT_EMAIL;

  const feedbackmatch = a.match(/from:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|name:(\w+)|subject:(\w+)|content:(\w+)|contenthtml:(\w+)$/gim);
  const from = feedbackmatch ? feedbackmatch[0].split(":")[1] : defemailsender;
  const name = feedbackmatch ? feedbackmatch[1].split(":")[1] : "";
  const subject = feedbackmatch ? feedbackmatch[2].split(":")[1] : "";
  const content = feedbackmatch ? feedbackmatch[3].split(":")[1].toString() : "";
  const contenthtml = IsContentHTMLRequired ? feedbackmatch ? feedbackmatch[4].split(":")[1].toString() : "" : "";

  const usagecmd = "Usage: $feedback from:[from] name:[name] subject:[subject] content:[content] contenthtml:[contenthtml?]";

  if(!from || from.length == 0) throw new Error("Please provide the email recipient! \r\n" + usagecmd);
  if(!name || name.length == 0) throw new Error("Please provide the name from email recipient! \r\n" + usagecmd);
  if(!subject || subject.length == 0) throw new Error("Please provide the subject! \r\n" + usagecmd);
  if(!content || content.length == 0) throw new Error("Please provide the content (write something of text here...)! \r\n" + usagecmd);
  if(IsContentHTMLRequired && (!contenthtml || contenthtml.length == 0)) throw new Error("Please provide the html content (write something of html here...)! \r\n" + usagecmd);

  return await sendFeedback(nodemailer, from, name, subject, content, contenthtml);
}

function setThemeCMD(a, localStorage) {
  const themematch = a.match(/name:(\w+)$/gim);
  const theme = themematch ? themematch[0].split(":")[1] : "default";
  const options = f.listDefThemes();
  const usagecmd = "Usage: $theme name:[name] (options: " + options.toString().split(",") + ")";

  if(!theme || theme.length == 0) throw new Error("Please provide the theme name! \r\n" + usagecmd);
  if(!options.includes(theme)) throw new Error("This theme "+ theme +" does not exist. Please request it through the $feedback command or send email to creator of this webapp.");

  return setTheme(localStorage, theme);
}

function setTimeCMD(a) {
  const tz = a.match(/^zone:(.*)/)?.[1]?.trim();
  return "The time is: " + (tz ? getTimeByTimezone(tz) : getTimeNow());
}

function setDateCMD(a) {
  const tz = a.match(/^zone:(.*)/)?.[1]?.trim();
  return "Today's date is: " + (tz ? getDateByTimezone(tz) : getDateNow());
}

function setDateTimeCMD(a) {
  const tz = a.match(/^zone:(.*)/)?.[1]?.trim();
  return (
    "The date and time is: " +
    (tz ? getDateTimeByTimezone(tz) : getDateNow() + " " + getTimeNow())
  );
}

function getTimeZoneCMD(a) {
  return "The current timezone is: " + getTimezone();
}

function getListTimeZonesCMD(a) {
  const listmethods = ['native', 'thirdpartylib'];
  const methodMatch = a.match(/^method:(.*)/);
  const mval = methodMatch ? methodMatch[1].trim() : "native";
  if (!listmethods.includes(mval)) throw new Error("Invalid method. (list of methods: "+listmethods.split(",")+")");
  return getListAllTimeZones(mval);
}

function getListAIModelsCMD() {
  return "Here are the available models:\n" + getListModels();
}

function getEMAILAddressCMD() {
  return "You can contact us at: " + process.env.CONTACT_EMAIL;
}

async function setWeatherCMD(a) {
  const cityMatch = a.match(/^city:(.*)/);
  const city = cityMatch ? cityMatch[1].trim() : process.env.DEFAULT_CITY || "New York";
  return await getWeather("city", city);
}

function getRNGCMD(a) {
  const matchvalue = a.match(/number:(\d+)/gim)[0].split(":")[1].toString();
  const num = matchvalue && typeof parseInt(matchvalue) === "number" ? parseInt(""+matchvalue) : 10;
  return shuffleNums(num);
}

function getCountdownCMD(a) {
  const matchto = a.match(/^to:(.*)/);
  const date = matchto ? matchto[1].trim() : 1;
  return getCountdownResult(date);
}

function getCountupCMD(a) {
  const matchfrom = a.match(/^from:(.*)/);
  const date = matchfrom ? matchfrom[1].trim() : 1;
  return getCountupResult(date);
}

function getDataSizeConversionCMD(a) {
  const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
  const size = matchvalue ? matchvalue[0].split(":")[1] : 1;
  const unit = matchvalue ? matchvalue[1].split(":")[1]: "MB";
  const tounit = matchvalue ? matchvalue[2].split(":")[1] : "GB";

  // Validation
  const validUnits = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (isNaN(size) || size <= 0) throw new Error("Invalid value: must be a positive number.");
  if (!validUnits.includes(unit.toUpperCase())) throw new Error("Invalid from unit.");
  if (!validUnits.includes(tounit.toUpperCase())) throw new Error("Invalid to unit.");

  console.log("Converting data size:", { a, unit, tounit });
  return getDataSizeConversion(size, unit, tounit);
}

function getTemperatureConversionCMD(a) {
  const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
  const temp = matchvalue ? matchvalue[0].split(":")[1] : 1;
  const unit = matchvalue ? matchvalue[1].split(":")[1]: "C";
  const tounit = matchvalue ? matchvalue[2].split(":")[1] : "F";

  // Validation
  const validUnits = ['C', 'F', 'K'];
  if (isNaN(temp)) throw new Error("Invalid value: must be a number.");
  if (!validUnits.includes(unit.toUpperCase())) throw new Error("Invalid from unit.");
  if (!validUnits.includes(tounit.toUpperCase())) throw new Error("Invalid to unit.");

  console.log("Converting temperature:", { a, unit, tounit });
  return getTemperatureConversion(temp, unit, tounit);
}

function getLengthConversionCMD(a) {
  const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
  const length = matchvalue ? matchvalue[0].split(":")[1] : 1;
  const unit = matchvalue ? matchvalue[1].split(":")[1]: "m";
  const tounit = matchvalue ? matchvalue[2].split(":")[1] : "ft";

  // Validation
  const validUnits = ['m', 'km', 'mi', 'ft'];
  if (isNaN(length) || length <= 0) throw new Error("Invalid value: must be a positive number.");
  if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
  if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

  console.log("Converting length:", { a, unit, tounit });
  return getLengthConversion(length, unit, tounit);
}

function getTimeConversionCMD(a) {
  const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
  const time = matchvalue ? matchvalue[0].split(":")[1] : 1;
  const unit = matchvalue ? matchvalue[1].split(":")[1]: "sec";
  const tounit = matchvalue ? matchvalue[2].split(":")[1] : "min";

  // Validation
  const validUnits = ['milisec', 'sec', 'min', 'hour', 'day', 'week', 'month', 'year'];
  if (isNaN(time) || time <= 0) throw new Error("Invalid value: must be a positive number.");
  if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
  if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

  console.log("Converting time:", { a, unit, tounit });
  return getTimeConversion(time, unit, tounit);
}

function getWeightConversionCMD(a) {
  const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
  const weight = matchvalue ? matchvalue[0].split(":")[1] : 1;
  const unit = matchvalue ? matchvalue[1].split(":")[1]: "kg";
  const tounit = matchvalue ? matchvalue[2].split(":")[1] : "lb";

  // Validation
  const validUnits = ['g', 'kg', 'lb', 'oz'];
  if (isNaN(weight) || weight <= 0) throw new Error("Invalid value: must be a positive number.");
  if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
  if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

  console.log("Converting weight:", { a, unit, tounit });
  return getWeightConversion(weight, unit, tounit);
}

function getCurrencyConversionCMD(a) {
  const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
  const amount = matchvalue ? matchvalue[0].split(":")[1] : 1;
  const from = matchvalue ? matchvalue[1].split(":")[1]: "USD";
  const to = matchvalue ? matchvalue[2].split(":")[1] : "EUR";

  // Validation
  if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount: must be a positive number.");
  if (!/^[A-Z]{3}$/.test(from)) throw new Error("Invalid from currency code.");
  if (!/^[A-Z]{3}$/.test(to)) throw new Error("Invalid to currency code.");

  console.log("Converting currency:", { a, amount, from, to });
  return getCurrencyConversion(amount, from, to);
}

function getVolumeConversionCMD(a) {
  const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
  const volume = matchvalue ? matchvalue[0].split(":")[1] : 1;
  const unit = matchvalue ? matchvalue[1].split(":")[1]: "L";
  const tounit = matchvalue ? matchvalue[2].split(":")[1] : "mL";

  // Validation
  const validUnits = ['l', 'ml', 'gal', 'cup'];
  if (isNaN(volume) || volume <= 0) throw new Error("Invalid value: must be a positive number.");
  if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
  if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

  console.log("Converting volume:", { a, unit, tounit });
  return getVolumeConversion(volume, unit, tounit);
}

function getPressureConversionCMD(a) {
  const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
  const pressure = matchvalue ? matchvalue[0].split(":")[1] : 1;
  const unit = matchvalue ? matchvalue[1].split(":")[1]: "Pa";
  const tounit = matchvalue ? matchvalue[2].split(":")[1] : "atm";

  // Validation
  const validUnits = ['pa', 'kpa', 'bar', 'psi'];
  if (isNaN(pressure) || pressure <= 0) throw new Error("Invalid value: must be a positive number.");
  if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
  if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

  console.log("Converting pressure:", { a, unit, tounit });
  return getPressureConversion(pressure, unit, tounit);
}

function getSpeedConversionCMD(a) {
  const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
  const speed = matchvalue ? matchvalue[0].split(":")[1] : 1;
  const unit = matchvalue ? matchvalue[1].split(":")[1]: "km/h";
  const tounit = matchvalue ? matchvalue[2].split(":")[1] : "mph";

  // Validation
  const validUnits = ['m/s', 'km/h', 'mph'];
  if (isNaN(speed) || speed < 0) throw new Error("Invalid value: must be a non-negative number.");
  if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
  if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

  console.log("Converting speed:", { a, unit, tounit });
  return getSpeedConversion(speed, unit, tounit);
}

function getEnergyConversionCMD(a) {
  const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
  const energy = matchvalue ? matchvalue[0].split(":")[1] : 1;
  const unit = matchvalue ? matchvalue[1].split(":")[1]: "J";
  const tounit = matchvalue ? matchvalue[2].split(":")[1] : "kWh";

  // Validation
  const validUnits = ['j', 'kj', 'cal', 'kcal'];
  if (isNaN(energy) || energy <= 0) throw new Error("Invalid value: must be a positive number.");
  if (!validUnits.includes(unit.toLowerCase())) throw new Error("Invalid from unit.");
  if (!validUnits.includes(tounit.toLowerCase())) throw new Error("Invalid to unit.");

  console.log("Converting energy:", { a, unit, tounit });
  return getEnergyConversion(energy, unit, tounit);
}

function getAllConversionsCMD(a) {
  const matchvalue = a.match(/value:(\d+)|unit:(\w+)|to:(\w+)/gim);
  const value = matchvalue ? matchvalue[0].split(":")[1] : 1;
  const unit = matchvalue ? matchvalue[1].split(":")[1] : "m";
  const tounit = matchvalue ? matchvalue[2].split(":")[1] : "ft";

  // Auto-detect unit type and route to appropriate converter
  const lengthUnits = ['m', 'km', 'mi', 'ft'];
  const tempUnits = ['c', 'f', 'k'];
  const weightUnits = ['g', 'kg', 'lb', 'oz'];
  const dataUnits = ['b', 'kb', 'mb', 'gb', 'tb'];
  const timeUnits = ['milisec', 'sec', 'min', 'hour', 'day', 'week', 'month', 'year'];
  const volumeUnits = ['l', 'ml', 'gal', 'cup'];
  const speedUnits = ['m/s', 'km/h', 'mph'];
  const pressureUnits = ['pa', 'kpa', 'bar', 'psi'];
  const energyUnits = ['j', 'kj', 'cal', 'kcal'];
  const currencyRegex = /^[A-Z]{3}$/;

  const unitLower = unit.toLowerCase();
  const tunitLower = tounit.toLowerCase();

  try {
    if (lengthUnits.includes(unitLower) && lengthUnits.includes(tunitLower)) {
      return getLengthConversion(value, unit, tounit);
    } else if (tempUnits.includes(unitLower) && tempUnits.includes(tunitLower)) {
      return getTemperatureConversion(value, unit, tounit);
    } else if (weightUnits.includes(unitLower) && weightUnits.includes(tunitLower)) {
      return getWeightConversion(value, unit, tounit);
    } else if (dataUnits.includes(unitLower) && dataUnits.includes(tunitLower)) {
      return getDataSizeConversion(value, unit, tounit);
    } else if (timeUnits.includes(unitLower) && timeUnits.includes(tunitLower)) {
      return getTimeConversion(value, unit, tounit);
    } else if (volumeUnits.includes(unitLower) && volumeUnits.includes(tunitLower)) {
      return getVolumeConversion(value, unit, tounit);
    } else if (speedUnits.includes(unitLower) && speedUnits.includes(tunitLower)) {
      return getSpeedConversion(value, unit, tounit);
    } else if (pressureUnits.includes(unitLower) && pressureUnits.includes(tunitLower)) {
      return getPressureConversion(value, unit, tounit);
    } else if (energyUnits.includes(unitLower) && energyUnits.includes(tunitLower)) {
      return getEnergyConversion(value, unit, tounit);
    } else if (currencyRegex.test(unit.toUpperCase()) && currencyRegex.test(tounit.toUpperCase())) {
      return getCurrencyConversion(value, unit, tounit);
    } else {
      throw new Error(`Unknown unit type: '${unit}' to '${tounit}'. Please use a specific convert command like $convertlength, $converttemp, etc.`);
    }
  } catch (error) {
    throw new Error(error.message || `Conversion failed: ${error}`);
  }
}

async function getYouTubeSearchResultsCMD(a) {
  const queryMatch = a.match(/^search:(\w+)/gim);
  const query = queryMatch ? queryMatch[0].split(":")[1] : "angular";
  return await getYoutubeSearch(query);
}

function setResetWarningsCMD(forceResetWarnings) {
  forceResetWarnings(true);
  return warn > 0 ? "The warnings were reseted!" : "The warnings already reseted!";
}

function setChatClosedCMD(resetWarnings, warn, maxwarn, warnExpireTime) {
  resetWarnings();
  warn = localStorage.getItem("warningCount") ? parseInt(localStorage.getItem("warningCount")) : 0;
  return getProfMsgWarnList(warn, maxwarn, warnExpireTime);
}

async function setTranslationCMD(a, openai) {
  // Extract text and target language
  const textMatch = a.match(/text:([^]*)(?=\s+(?:to|lang):|$)/i);
  const langMatch = a.match(/(?:to|lang):(\w+)/i);
  
  const text = textMatch ? textMatch[1].trim().replace(/^["']|["']$/g, '') : "";
  const targetLang = langMatch ? langMatch[1].toLowerCase() : "english";

  // Validation
  if (!text || text.length === 0) {
    throw new Error("Please provide text to translate. Usage: $translate text:\"your text here\" to:spanish (or lang:es)");
  }

  const validLangShortCodes = {
    en: 'en',
    es: 'es',
    fr: 'fr',
    de: 'de',
    it: 'it',
    pt: 'pt',
    ru: 'ru',
    zh: 'zh',
    ja: 'ja',
    ko: 'ko',
    ar: 'ar',
    hi: 'hi',
    nl: 'nl',
    pl: 'pl',
    tr: 'tr',
    vi: 'vi',
    th: 'th',
    he: 'he',
    el: 'el',
    sv: 'sv',
    uk: 'uk', 
  };

  const validLanguages = {
    english: 'en',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    italian: 'it',
    portuguese: 'pt',
    russian: 'ru',
    chinese: 'zh',
    japanese: 'ja',
    korean: 'ko',
    arabic: 'ar',
    hindi: 'hi',
    dutch: 'nl',
    polish: 'pl',
    turkish: 'tr',
    vietnamese: 'vi',
    thai: 'th',
    hebrew: 'he',
    greek: 'el',
    swedish: 'sv',
    ukrainian: 'uk',
    ...validLangShortCodes
  };

  if (!validLanguages[targetLang]) {
    throw new Error(`Invalid language: '${targetLang}'. Supported languages: English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Hindi, Dutch, Polish, Turkish, Vietnamese, Thai, Hebrew, Greek, Swedish`);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the user's text to ${validLanguages[targetLang]} language. Only respond with the translated text, nothing else.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 1,
    });

    const translatedText = completion.choices[0]?.message?.content || "Translation failed";
    console.log("Translation:", { originalText: text, targetLanguage: targetLang, translatedText });
    
    return `**Translated to ${targetLang}:**\n${translatedText}`;
  } catch (error) {
    throw new Error(`Translation error: ${error.message}`);
  }
}

async function setNewsCMD(a) {
  const langMatch = a.match(/lang:(\w+)/);
  const lang = langMatch ? langMatch[1].trim() : "en";
  const srchMatch = a.match(/search:([^]*?)(?=\s+(?:lang:|category:|country:|$))/i);
  const srch = srchMatch ? srchMatch[1].trim() : "";
  const catMatch = a.match(/category:(\w+)/);
  const category = catMatch ? catMatch[1].trim() : "general";
  const countryMatch = a.match(/country:(\w+)/);
  const country = countryMatch ? countryMatch[1].trim() : "pt";

  if (!lang || lang.length === 0) throw new Error("Please provide the language code! Usage: $news lang:en category:technology country:us");
  if (!category || category.length === 0) throw new Error("Please provide the news category! Usage: $news lang:en category:technology country:us");
  if (!country || country.length === 0) throw new Error("Please provide the country code! Usage: $news lang:en category:technology country:us");
  // if (!srch || srch.length === 0) throw new Error("Please provide the search query! Usage: $news search:bitcoin lang:en category:technology country:us");

  return await getNews(a, srch, lang, category, country);
}

async function setSpotifyMusicCMD(a) {
  const queryMatch = a.match(/^search:(\w+)/gim);
  const query = queryMatch ? queryMatch[0].split(":")[1] : "top hits";
  return await getSpotifyMusic(query);
}

async function setVideoCMD(a) {
  const idMatch = a.match(/^id:(\w+)/gim);
  const id = idMatch ? idMatch[0].split(":")[1] : null;
  const pathMatch = a.match(/^path:(\/.*\.(mp4|webm|ogg))$/gim);
  const path = pathMatch ? pathMatch[0].split(":")[1] : null;
  const islocal = a.match(/^local:(true|false)/gim) ? a.match(/^local:(true|false)/gim)[0].split(":")[1].toLowerCase() === "true" : false;
  if (!id && !islocal) throw new Error("Please provide a YouTube video ID. Usage: $video id:VIDEO_ID local:false");
  if (!path && islocal) throw new Error("Please provide your local video file path. Usage: $video path:/path/to/video.mp4 local:true");
  return getVideo(islocal ? path : id, islocal);
}

async function setAudioCMD(a) {
  const idMatch = a.match(/^id:(\w+)/gim);
  const id = idMatch ? idMatch[0].split(":")[1] : null;
  const pathMatch = a.match(/^path:(\/.*\.(mp3|wav|ogg|flac|aac))$/gim);
  const path = pathMatch ? pathMatch[0].split(":")[1] : null;
  const islocal = a.match(/^local:(true|false)/gim) ? a.match(/^local:(true|false)/gim)[0].split(":")[1].toLowerCase() === "true" : false;
  if (!id && !islocal) throw new Error("Please provide a Spotify track ID. Usage: $audio id:TRACK_ID local:false");
  if (!path && islocal) throw new Error("Please provide your local audio file path. Usage: $audio path:/path/to/audio.mp3 local:true");
  return getAudio(islocal ? path : id, islocal);
}

export { getWarnTimeExpireCalc, getTimezone, getTimeNow, getTimeByTimezone, getDateNow, getDateByTimezone, getDateTimeByTimezone, getHelpCmds, generateJoke, generateQuote, getListModels, getCalculatorResult, getCalcAgeResult, getCountdownResult, getCountupResult, getDataSizeConversion, getTemperatureConversion, getTimeConversion, getCurrencyConversion, getLengthConversion, getWeightConversion, getVolumeConversion, getPressureConversion, getSpeedConversion, getEnergyConversion, getInspiredBy, getMotivation, getRadioStationsByCountry, getYoutubeSearch, getColorListHex, shuffleNums, genRandomNumbersSimple as genRandomNumbers, getListAllTimeZones, getWelcomeMessage, getByeMessage, getRulesMessage, sendFeedback, setTheme, getTheme, listDefThemes, getHelloMessageCMD, getHelpListCMD, sendFeedbackCMD, setThemeCMD, setTimeCMD, setDateCMD, setDateTimeCMD, getTimeZoneCMD, getListTimeZonesCMD, getListAIModelsCMD, getEMAILAddressCMD, setWeatherCMD, getRNGCMD, getCountdownCMD, getCountupCMD, getDataSizeConversionCMD, getTemperatureConversionCMD, getLengthConversionCMD, getTimeConversionCMD, getWeightConversionCMD, getCurrencyConversionCMD, getVolumeConversionCMD, getPressureConversionCMD, getSpeedConversionCMD, getEnergyConversionCMD, getAllConversionsCMD, getYouTubeSearchResultsCMD, setResetWarningsCMD, setChatClosedCMD, setTranslationCMD, setSpotifyMusicCMD, setNewsCMD, setVideoCMD, setAudioCMD };