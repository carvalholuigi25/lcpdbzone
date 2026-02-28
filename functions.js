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

export { getTimezone, getTimeNow, getTimeByTimezone, getDateNow, getDateByTimezone, getDateTimeByTimezone, getHelpCmds, generateJoke, generateQuote, detectLocation, getWeather, getListGames, getListMovies, getListAnimes, getListPodcasts, getListModels, getCalculatorResult, getCalcAgeResult };