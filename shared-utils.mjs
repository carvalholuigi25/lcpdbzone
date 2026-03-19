import figlet from "figlet";
import moment from "moment-timezone";
import { htmlToText } from "html-to-text";

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

function getByeMessage() {
  const dh = new Date().getHours();
  return "Goodbye! Have a good "+(dh >= 7 && dh <= 12 ? "morning" : (dh >= 13 && dh <= 18 ? "afternoon" : (dh >= 19 ? "night" : "early morning")))+"!";
}

function getWarnTimeExpireCalc(v = 1) {
  return v * 60 * 1000;
}

function setHouseNumZero(num = 1) {
  return num < 10 ? '0' + parseInt(num) : parseInt(num);
}

function getTimeNow() {
  const dt = new Date();
  const dtobj = {
    datev: dt.getFullYear() + "-" + setHouseNumZero(dt.getUTCMonth()+1) + "-" + setHouseNumZero(dt.getUTCDate()),
    timev: setHouseNumZero(dt.getUTCHours()) + ":" + setHouseNumZero(dt.getUTCMinutes()) + ":" + setHouseNumZero(dt.getUTCSeconds())
  }
  return dtobj.timev;
}

function getDateNow() {
  const dt = new Date();
  return dt.getFullYear() + "-" + setHouseNumZero(dt.getUTCMonth()+1) + "-" + setHouseNumZero(dt.getUTCDate());
}

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getDateByTimezone(timeZone) {
    try {
      const dt = new Date();
      const options = { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
      const formatter = new Intl.DateTimeFormat('en-CA', options);
      return formatter.format(dt);
    } catch (error) {
      return "Invalid timezone";
    }
}

function getTimeByTimezone(timeZone) {
    try {
      const dt = new Date();
      const options = { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      return formatter.format(dt);
    } catch (error) {
      return "Invalid timezone";
    }
}

function getDateTimeByTimezone(timeZone) {
    try {
      const dt = new Date();
      const dateOptions = { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
      const timeOptions = { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const dateFormatter = new Intl.DateTimeFormat('en-CA', dateOptions);
      const timeFormatter = new Intl.DateTimeFormat('en-GB', timeOptions);
      return dateFormatter.format(dt) + " " + timeFormatter.format(dt);
    } catch (error) {
      return "Invalid timezone";
    }
}

function generateJoke() {
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "Why did the math book look sad? Because it had too many problems!"
  ];
  return jokes[Math.floor(Math.random() * jokes.length)];
}

function generateQuote() {
  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson"
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function getListModels() {
  // This is a static list of models for demonstration purposes. In a real application, you might want to fetch this from an API or database.
  // Src: https://developers.openai.com/api/docs/models
  const models = [
    { name: "gpt-5-nano", description: "A compact and efficient model for basic tasks." },
    { name: "gpt-5-mini", description: "A small model for quick responses and simple interactions." },
    { name: "gpt-5-medium", description: "A balanced model for general use with improved performance." },
    { name: "gpt-5-large", description: "A powerful model for complex tasks and detailed responses." },
    { name: "gpt-5-xlarge", description: "An advanced model for high-quality outputs and nuanced understanding." }
  ];
  return models.map(m => `${m.name} - ${m.description}`).join('\n');
}

function getListAllTimeZones(method = "native") {
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

function roundNum(num, dec = 2) {
  return parseFloat(num.toFixed(dec));
}

const genRandomNumbersSimple = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleNums(numShuffle = 10) {
  if(typeof numShuffle !== "number") {
    return "Invalid number";
  }

  // Generate an array from 1 to numShuffle
  let numbers = Array.from({ length: numShuffle }, (_, i) => i + 1);

  // Fisher–Yates shuffle algorithm
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Shuffle and output
  let shuffledNumbers = shuffleArray(numbers);
  return shuffledNumbers[0] ?? 0;
}

function getCountdownResult(targetDate) {
  try {
    const target = new Date(targetDate);
    if (isNaN(target.getTime())) {
      throw new Error("Invalid date format");
    }
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      return "The target date has already passed.";
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining.`;
  }
  catch (error) {
    return "Error calculating countdown: " + error.message;
  }
}

function getCountupResult(startDate) {
  try {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      throw new Error("Invalid date format");
    }
    const now = new Date();
    const diff = now - start;
    if (diff < 0) {
      return "The start date is in the future.";
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds since the start date.`;
  }
  catch (error) {
    return "Error calculating countup: " + error.message;
  }
}

function getDataSizeConversion(size, fromUnit, toUnit) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const fromIndex = units.indexOf(fromUnit.toString().toUpperCase());
  const toIndex = units.indexOf(toUnit.toString().toUpperCase());
  if (fromIndex === -1 || toIndex === -1) {
    return "Invalid units. Please use B, KB, MB, GB, or TB.";
  }
  const convertedSize = size * Math.pow(1024, fromIndex - toIndex);
  return `${size} ${fromUnit.toString().toUpperCase()} is equal to ${convertedSize} (approx: ${roundNum(convertedSize, 2)}) ${toUnit.toString().toUpperCase()}.`;
}

function getTimeConversion(value, fromUnit, toUnit) {
  const units = ['milisec', 'sec', 'min', 'hour', 'day', 'week', 'month', 'year'];
  const fromIndex = units.indexOf(fromUnit.toString().toLowerCase());
  const toIndex = units.indexOf(toUnit.toString().toLowerCase());
  if (fromIndex === -1 || toIndex === -1) {
    return "Invalid units. Please use milisec, sec, min, hour, day, week, month, or year.";
  }
  const conversionFactors = {
    'milisec': [1, 0.001, 0.0000166667, 0.000000277778, 0.0000000115741, 0.00000000165344, 0.000000000380517, 0.0000000000317098],
    'sec': [1000, 1, 0.0166667, 0.000277778, 0.0000115741, 0.00000165344, 0.000000380517, 0.0000000317098],
    'min': [60000, 60, 1, 0.0166667, 0.000694444, 0.000115741, 0.0000267379, 0.00000222817],
    'hour': [3600000, 3600, 60, 1, 0.0416667, 0.00694444, 0.00173611, 0.00014493],
    'day': [86400000, 86400, 1440, 24, 1, 0.166667, 0.0416667, 0.00396825],
    'week': [604800000, 604800, 10080, 168, 7, 1, 0.25, 0.0191781],
    'month': [2628000000, 2628000, 43800, 730, 30.4167, 4, 1, 0.0808081],
    'year': [31536000000, 31536000, 525600, 8760, 365.25, 52, 12, 1]
  };
  const convertedValue = value * conversionFactors[fromUnit.toString().toLowerCase()][toIndex];
  return `${value} ${fromUnit.toString().toLowerCase()} is equal to ${convertedValue} (approx: ${roundNum(convertedValue, 2)}) ${toUnit.toString().toLowerCase()}.`;
}

function getTemperatureConversion(value, fromUnit, toUnit) {
  const from = fromUnit.toString().toUpperCase();
  const to = toUnit.toString().toUpperCase();
  let convertedValue;
  if (from === 'C' && to === 'F') {
    convertedValue = (value * 9/5) + 32;
  } else if (from === 'F' && to === 'C') {
    convertedValue = (value - 32) * 5/9;
  } else if (from === 'C' && to === 'K') {
    convertedValue = value + 273.15;
  } else if (from === 'K' && to === 'C') {
    convertedValue = value - 273.15;
  } else if (from === 'F' && to === 'K') {
    convertedValue = (value - 32) * 5/9 + 273.15;
  } else if (from === 'K' && to === 'F') {
    convertedValue = (value - 273.15) * 9/5 + 32;
  } else {
    return "Invalid units. Please use C, F, or K.";
  }
  return `${value}°${from} is equal to ${convertedValue}°${to} (approx: ${roundNum(convertedValue, 2)}).`;
}

function getLengthConversion(value, fromUnit, toUnit) {
  const units = ['m', 'km', 'mi', 'ft'];
  const fromIndex = units.indexOf(fromUnit.toString().toLowerCase());
  const toIndex = units.indexOf(toUnit.toString().toLowerCase());
  if (fromIndex === -1 || toIndex === -1) {
    return "Invalid units. Please use m, km, mi, or ft.";
  }
  const conversionFactors = {
    'm': [1, 0.001, 0.000621371, 3.28084],
    'km': [1000, 1, 0.621371, 3280.84],
    'mi': [1609.34, 1.60934, 1, 5280],
    'ft': [0.3048, 0.0003048, 0.000189394, 1]
  };
  const convertedValue = value * conversionFactors[fromUnit.toString().toLowerCase()][toIndex];
  return `${value} ${fromUnit} is equal to ${convertedValue} (approx: ${roundNum(convertedValue, 2)}) ${toUnit}.`;
}

function getWeightConversion(value, fromUnit, toUnit) {
  const units = ['g', 'kg', 'lb', 'oz'];
  const fromIndex = units.indexOf(fromUnit.toString().toLowerCase());
  const toIndex = units.indexOf(toUnit.toString().toLowerCase());
  if (fromIndex === -1 || toIndex === -1) {
    return "Invalid units. Please use g, kg, lb, or oz.";
  }
  const conversionFactors = {
    'g': [1, 0.001, 0.00220462, 0.035274],
    'kg': [1000, 1, 2.20462, 35.274],
    'lb': [453.592, 0.453592, 1, 16],
    'oz': [28.3495, 0.0283495, 0.0625, 1]
  };
  const convertedValue = value * conversionFactors[fromUnit.toString().toLowerCase()][toIndex];
  return `${value} ${fromUnit} is equal to ${convertedValue} (approx: ${roundNum(convertedValue, 2)}) ${toUnit}.`;
}

function getSpeedConversion(value, fromUnit, toUnit) {
  const units = ['m/s', 'km/h', 'mph'];
  const fromIndex = units.indexOf(fromUnit.toString().toLowerCase());
  const toIndex = units.indexOf(toUnit.toString().toLowerCase());
  if (fromIndex === -1 || toIndex === -1) {
    return "Invalid units. Please use m/s, km/h, or mph.";
  }
  const conversionFactors = {
    'm/s': [1, 3.6, 2.23694],
    'km/h': [0.277778, 1, 0.621371],
    'mph': [0.44704, 1.60934, 1]
  };
  const convertedValue = value * conversionFactors[fromUnit.toString().toLowerCase()][toIndex];
  return `${value} ${fromUnit} is equal to ${convertedValue} (approx: ${roundNum(convertedValue, 2)}) ${toUnit}.`;
}

function getPressureConversion(value, fromUnit, toUnit) {
  const units = ['pa', 'kpa', 'bar', 'psi'];
  const fromIndex = units.indexOf(fromUnit.toString().toLowerCase());
  const toIndex = units.indexOf(toUnit.toString().toLowerCase());
  if (fromIndex === -1 || toIndex === -1) {
    return "Invalid units. Please use pa, kpa, bar, or psi.";
  }
  const conversionFactors = {
    'pa': [1, 0.001, 0.00001, 0.000145038],
    'kpa': [1000, 1, 0.01, 0.145038],
    'bar': [100000, 100, 1, 14.5038],
    'psi': [6894.76, 6.89476, 0.0689476, 1]
  };
  const convertedValue = value * conversionFactors[fromUnit.toString().toLowerCase()][toIndex];
  return `${value} ${fromUnit} is equal to ${convertedValue} (approx: ${roundNum(convertedValue, 2)}) ${toUnit}.`;
}

function getVolumeConversion(value, fromUnit, toUnit) {
  const units = ['l', 'ml', 'gal', 'cup'];
  const fromIndex = units.indexOf(fromUnit.toString().toLowerCase());
  const toIndex = units.indexOf(toUnit.toString().toLowerCase());
  if (fromIndex === -1 || toIndex === -1) {
    return "Invalid units. Please use l, ml, gal, or cup.";
  }
  const conversionFactors = {
    'l': [1, 1000, 0.264172, 4.22675],
    'ml': [0.001, 1, 0.000264172, 0.00422675],
    'gal': [3.78541, 3785.41, 1, 16],
    'cup': [0.236588, 236.588, 0.0625, 1]
  };
  const convertedValue = value * conversionFactors[fromUnit.toString().toLowerCase()][toIndex];
  return `${value} ${fromUnit} is equal to ${convertedValue} (approx: ${roundNum(convertedValue, 2)}) ${toUnit}.`;
}

function getEnergyConversion(value, fromUnit, toUnit) {
  const units = ['j', 'kj', 'cal', 'kcal'];
  const fromIndex = units.indexOf(fromUnit.toString().toLowerCase());
  const toIndex = units.indexOf(toUnit.toString().toLowerCase());
  if (fromIndex === -1 || toIndex === -1) {
    return "Invalid units. Please use j, kj, cal, or kcal.";
  }
  const conversionFactors = {
    'j': [1, 0.001, 0.239006, 0.000239006],
    'kj': [1000, 1, 239.006, 0.239006],
    'cal': [4.184, 0.004184, 1, 0.001],
    'kcal': [4184, 4.184, 1000, 1]
  };
  const convertedValue = value * conversionFactors[fromUnit.toString().toLowerCase()][toIndex];
  return `${value} ${fromUnit} is equal to ${convertedValue} (approx: ${roundNum(convertedValue, 2)}) ${toUnit}.`;
}

function getInspiredBy() {
  const inspirations = [
    "Inspired by the relentless pursuit of knowledge and the joy of discovery.",
    "Drawing from the wisdom of ages and the innovations of tomorrow.",
    "Fueled by curiosity, creativity, and the human spirit.",
    "Built on the foundations of collaboration and open-source excellence.",
    "Empowered by technology to make the world a better place."
  ];
  return inspirations[Math.floor(Math.random() * inspirations.length)];
}

function getMotivation() {
  const motivations = [
    "Keep pushing forward; every step counts.",
    "Embrace challenges as opportunities to grow.",
    "Your potential is limitless; believe in yourself.",
    "Success comes to those who persevere.",
    "Dream big, work hard, and never give up."
  ];
  return motivations[Math.floor(Math.random() * motivations.length)];
}

function getColorListHex() {
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
    { name: "Orange", hex: "#FFA500" }
  ];
  return colors.map(c => `${c.name}: ${c.hex}`).join('\n');
}

async function getCurrencyConversion(value = 1, fromCurrency = "EUR", toCurrency = "USD") {
  const apiKey = process.env['API_EXCHANGE_RATE_KEY'];
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.toString().toUpperCase()}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.result !== "success") {
        throw new Error("Error fetching exchange rates: " + data['error-type']);
      } else {
        const rate = data.conversion_rates[toCurrency.toString().toUpperCase()];
        if (!rate) {
          throw new Error("Invalid target currency.");
        }
        const convertedValue = value * rate;
        return `${value} ${fromCurrency.toString().toUpperCase()} is equal to ${convertedValue} (approx: ${roundNum(convertedValue, 2)}) ${toCurrency.toString().toUpperCase()}.`;
      }
    })
    .catch(error => {
      return "Error converting currency: " + error.message;
    });
}

async function getRadioStationsByCountry(country = "Portugal") {
  try {
    const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(country)}`);
    const data = await response.json();
    if (!data || data.length === 0) {
      return `No radio stations found for ${country}.`;
    }
    const stationsList = data.slice(0, 10).map((station) => station.name).join('\n');
    return `Here are some radio stations in ${country}:\n${stationsList}`;
  } catch (error) {
    return "Error fetching radio stations: " + error.message;
  }
}

async function getYoutubeSearch(query = "angular") {
  try {
    const apiKey = process.env['API_YOUTUBE_KEY'];
    const response = await fetch(
      'https://www.googleapis.com/youtube/v3/search', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000',
          'access-control-allow-origin': '*'
        },
        body: JSON.stringify({
          part: 'id,snippet',
          q: query,
          maxResults: 10,
          type: 'video',
          key: apiKey
        })
      }
    );

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return `No videos found for the search query "${query}".`;
    }
    const videosList = data.items.map((item) => `<a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">${item.snippet.title}</a>`).join('\n');
    return `Here are some videos from the search results:\n${videosList}`;
  } catch (error) {
    return "Error fetching YouTube videos: " + error.message;
  }
}

async function sendFeedback(sgMail, from, subject, content, contenthtml) {
 try {
  //src: https://developers.google.com/workspace/gmail/imap/imap-smtp?hl=pt-br and https://chatgpt.com/c/69b98b98-dd00-8333-b1bf-14570cfe9eff

  const to = process.env.CONTACT_EMAIL || process.env.EMAILSENDER;

    const objdata = {
      to: ""+to,
      from: ""+from,
      subject: ""+subject,
      text: ""+content,
      html: `<b>${contenthtml ?? content}</b>`
    };

    return await sgMail.send(objdata).then((res) => {
      console.log(res);
      return "The feedback has been sent to " + objdata.to;
    }).catch((err) => {
      return "Error when trying to send feedback to someone: " + err;
    });
 } catch(err) {
  return "Error when trying to send feedback to someone: " + err;
 }
}

async function sendFeedback2(nodemailer, from, name, subject, content, contenthtml) {
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

export {
  getWelcomeMessage,
  getByeMessage,
  sendFeedback,
  sendFeedback2,
  getWarnTimeExpireCalc,
  setHouseNumZero,
  getTimeNow,
  getDateNow,
  getTimezone,
  getDateByTimezone,
  getTimeByTimezone,
  getDateTimeByTimezone,
  getListAllTimeZones,
  generateJoke,
  generateQuote,
  getListModels,
  roundNum,
  genRandomNumbersSimple,
  shuffleNums,
  getCountdownResult,
  getCountupResult,
  getDataSizeConversion,
  getTimeConversion,
  getTemperatureConversion,
  getLengthConversion,
  getWeightConversion,
  getSpeedConversion,
  getPressureConversion,
  getVolumeConversion,
  getEnergyConversion,
  getInspiredBy,
  getMotivation,
  getColorListHex,
  getCurrencyConversion,
  getRadioStationsByCountry,
  getYoutubeSearch
};