import fs from 'fs';

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
        console.error(`Error: ${error.message}`);
        return null;
    }
}

function getTimeByTimezone(timeZone) {
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
        console.error(`Error: ${error.message}`);
        return null;
    }
}

function getDateTimeByTimezone(timeZone) {
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
        console.error(`Error: ${error.message}`);
        return null;
    }
}

function getHelpCmds() {
  const {cmds} = JSON.parse(fs.readFileSync('./list_help_cmds.json', 'utf-8'));
  return cmds || [];
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

// Function to get user's location
function detectLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                return {latitude: position.coords.latitude, longitude: position.coords.longitude, error: null};
            },
            (error) => {
                return {latitude: null, longitude: null, error: error.message};
            }
        );
    } else {
      return {latitude: null, longitude: null, error: "Geolocation not supported by your browser."};
    }
}

async function getWeather(method = "city", city = "") {
  try {
    const location = method == "geolocation" ? detectLocation() : null;
    const qparams = `${location ? `?lat=${location.latitude}&lon=${location.longitude}` : `?q=${encodeURIComponent(city)}`}`;
    const appidparams = `&appid=${process.env.API_OPENWEATHER_KEY}&units=metric`;
    // const qparams = `?q=${encodeURIComponent(city)}&appid=${process.env.API_OPENWEATHER_KEY}&units=metric`;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather${qparams}${appidparams}`);
    const data = await response.json();

    if (data.cod !== 200) {
      return `Could not retrieve weather data for ${data.name || "unknown location"}.`;
    }

    const { name, main, weather, wind } = data;

    return `The current weather in ${name} is:\n
            Temperature: ${main.temp}°C\n
            Condition: ${weather[0].description}\n
            Humidity: ${main.humidity}%\n
            Wind Speed: ${wind.speed} m/s`;
  } catch (error) {
    return "Error fetching weather data: " + error.message;
  }
}

async function getListGames() {
  try {
    const response = await fetch('https://api.rawg.io/api/games?key=' + process.env.API_RAWG_KEY);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return "No games found.";
    }
    const gamesList = data.results.slice(0, 10).map(game => game.name).join('\n');
    return `Here are some popular games:\n${gamesList}`;
  } catch (error) {
    return "Error fetching games data: " + error.message;
  }
}

async function getListMovies() {
  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=' + process.env.API_TMDB_KEY);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return "No movies found.";
    }
    const moviesList = data.results.slice(0, 10).map(movie => movie.title).join('\n');
    return `Here are some popular movies:\n${moviesList}`;
  } catch (error) {
    return "Error fetching movies data: " + error.message;
  }
}

async function getListAnimes() {
  try {
    const response = await fetch('https://api.jikan.moe/v4/top/anime');
    const data = await response.json();
    if (!data.data || data.data.length === 0) {
      return "No animes found.";
    }
    const animesList = data.data.slice(0, 10).map(anime => anime.title).join('\n');
    return `Here are some popular animes:\n${animesList}`;
  } catch (error) {
    return "Error fetching animes data: " + error.message;
  }
}

async function getListPodcasts() {
    try {        
        const response = await fetch('https://itunes.apple.com/search?term=podcast&media=podcast&limit=10');
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
          return "No podcasts found.";
        }
        const podcastsList = data.results.map(podcast => podcast.collectionName).join('\n');
        return `Here are some popular podcasts:\n${podcastsList}`;
    } catch (error) {
        return "Error fetching podcasts data: " + error.message;
    }    
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

function getCalculatorResult(expression) {
  try {
    // Validate the expression to allow only numbers and basic operators
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      throw new Error("Invalid characters in expression.");
    }

    // Evaluate the expression safely   
    const result = Function('"use strict"; return (' + expression + ')')();
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

function roundNum(num, dec = 2) {
  let formatted = new Intl.NumberFormat('pt-PT', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
  }).format(num);
  return parseFloat(formatted);
  // return +(Math.round(num + ('e+' + dec)) + ('e-' + dec));
}

function getCountdownResult(targetDate) {
  try {
    const now = new Date();
    const target = new Date(targetDate);
    if (isNaN(target.getTime())) {
      throw new Error("Invalid target date.");
    }
    const diff = target - now;
    if (diff < 0) {
      return "The target date has already passed.";
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `Time until ${targetDate}: ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`;
  }
  catch (error) {
    return "Error calculating countdown: " + error.message;
  }
}

function getCountupResult(startDate) {
  try {
    const now = new Date();
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      throw new Error("Invalid start date.");
    }
    const diff = now - start;
    if (diff < 0) {
      return "The start date is in the future.";
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `Time since ${startDate}: ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`;
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
    return "Invalid units. Please use Pa, kPa, bar, or psi.";
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
    return "Invalid units. Please use L, mL, gal, or cup.";
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
    return "Invalid units. Please use J, kJ, cal, or kcal.";
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

async function getCurrencyConversion(value = 1, fromCurrency = "EUR", toCurrency = "USD") {
  const apiKey = process.env.API_EXCHANGE_RATE_KEY;
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
    const stationsList = data.slice(0, 10).map(station => station.name).join('\n');
    return `Here are some radio stations in ${country}:\n${stationsList}`;
  } catch (error) {
    return "Error fetching radio stations: " + error.message;
  }
}

async function getYouTubePlaylist(channelId) {
  try {
    const apiKey = process.env.API_YOUTUBE_KEY;
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      return `No playlists found for channel ID ${channelId}.`;
    }
    const playlistsList = data.items.map(playlist => playlist.snippet.title).join('\n');
    return `Here are some playlists from the channel:\n${playlistsList}`;
  } catch (error) {
    return "Error fetching YouTube playlists: " + error.message;
  }
}

function getInspiredBy() {
  const inspirations = [
    "The chatbot is inspired by the idea of creating a versatile and interactive assistant that can provide information, answer questions, and engage in conversations on a wide range of topics.",
    "It draws inspiration from the concept of a digital companion that can assist users in their daily lives, offering support, entertainment, and knowledge at their fingertips.",
    "The chatbot is also influenced by the advancements in natural language processing and artificial intelligence, aiming to leverage these technologies to create a more human-like and responsive experience for users."
  ];
  return inspirations[Math.floor(Math.random() * inspirations.length)];
}

function getMotivation() {
  const motivations = [
    "The motivation behind this chatbot is to provide users with a convenient and accessible way to obtain information, seek assistance, and engage in meaningful conversations without the need for human intervention.",
    "The chatbot aims to enhance user experience by offering quick and accurate responses, making it easier for individuals to find answers to their questions and access resources on various topics.",
    "The development of this chatbot is driven by the desire to create a tool that can help users save time, increase productivity, and provide a source of entertainment and companionship in the digital age."
  ];
  return motivations[Math.floor(Math.random() * motivations.length)];
}

export { getTimezone, getTimeNow, getTimeByTimezone, getDateNow, getDateByTimezone, getDateTimeByTimezone, getHelpCmds, generateJoke, generateQuote, detectLocation, getWeather, getListGames, getListMovies, getListAnimes, getListPodcasts, getListModels, getCalculatorResult, getCalcAgeResult, getCountdownResult, getCountupResult, getDataSizeConversion, getTemperatureConversion, getTimeConversion, getCurrencyConversion, getLengthConversion, getWeightConversion, getVolumeConversion, getPressureConversion, getSpeedConversion, getEnergyConversion, getInspiredBy, getMotivation, getRadioStationsByCountry, getYouTubePlaylist };