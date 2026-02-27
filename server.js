import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

app.post('/chat', async (req, res) => {
  try {
    const prefix = "!", prefixalt = "$";
    const { model, messages } = req.body;
    const objresp = {
      model: model ?? 'gpt-5-nano',
      messages: [{
        role: "user",
        content: ""
      }],
      stream: true
    };

    const umsgs = messages.filter(x => x.role == "user").map(x => x.content);
    const msg = umsgs[umsgs.length-1 ?? 0].toString().toLowerCase().trim();

    if (!msg || typeof msg !== 'string') {
      objresp.messages = [{role: "assistant", content: "I didn't understand that. Please send a valid message."}];
    }

    if (msg == "" || msg == " " || msg == null || msg == undefined) {
      objresp.messages = [{role: "assistant", content: "Please start your message with a command prefix (e.g., '!' or '$')."}];
    }

    if (msg == prefix+"ai" || msg == prefixalt+"ai") {
      const completion = await openai.chat.completions.create({
        model: objresp.model ?? 'gpt-5-nano',
        messages: messages,
        stream: true,
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || '';
        res.write(content);
      }
    } else {
      if (msg == prefix+"hello" || msg == prefixalt+"hello") {
        objresp.messages = [{role: "assistant", content: "Hello world!"}];
      } else if (msg == prefix+"welcome" || msg == prefixalt+"welcome") {
        objresp.messages = [{role: "assistant", content: "Welcome to our chatbot! How can I assist you today?"}];
      } else if (msg == prefix+"time" || msg == prefixalt+"time") {
        objresp.messages = [{role: "assistant", content: "The time is: " + getTimeNow()}];
      } else if (msg == prefix+"date" || msg == prefixalt+"date") {
        objresp.messages = [{role: "assistant", content: "Today's date is: " + getDateNow()}];
      } else if (msg == prefix+"timezone" || msg == prefixalt+"timezone") {
        objresp.messages = [{role: "assistant", content: "The current timezone is: " + Intl.DateTimeFormat().resolvedOptions().timeZone}];
      } else if (msg == prefix+"help" || msg == prefixalt+"help") {
        objresp.messages = [{role: "assistant", content: "HELP: With prefix (! or $), use this avaliable list of commands: \r\n" + getHelpCmds().map(x => `${x.cmd} - ${x.description}`).join("\r\n")}];
      } else if (msg == prefix+"listaimodels" || msg == prefixalt+"listaimodels") {
        objresp.messages = [{role: "assistant", content: "Here are the available models:\n" + getListModels()}];
      } else if (msg == prefix+"joke" || msg == prefixalt+"joke") {
        objresp.messages = [{role: "assistant", content: generateJoke()}];
      } else if (msg == prefix+"quote" || msg == prefixalt+"quote") {
        objresp.messages = [{role: "assistant", content: generateQuote()}];
      } else if (msg == prefix+"mail" || msg == prefixalt+"mail") {
        objresp.messages = [{role: "assistant", content: "You can contact us at: " + process.env.CONTACT_EMAIL}];
      } else if (msg == prefix+"weather" || msg == prefixalt+"weather" || msg.startsWith(prefix+"weather city:") || msg.startsWith(prefixalt+"weather city:")) {
        const msgv = msg.indexOf("weather city:") > -1 ? msg.split("weather city:")[1].trim() : null;
        console.log(msgv)
        objresp.messages = [{role: "assistant", content: await getWeather("city", msgv || process.env.DEFAULT_CITY || "New York")}];
      } else if (msg == prefix+"listgames" || msg == prefixalt+"listgames") {
        objresp.messages = [{role: "assistant", content: await getListGames()}];
      } else if (msg == prefix+"listmovies" || msg == prefixalt+"listmovies") {
        objresp.messages = [{role: "assistant", content: await getListMovies()}];
      } else if (msg == prefix+"listanimes" || msg == prefixalt+"listanimes") {
        objresp.messages = [{role: "assistant", content: await getListAnimes()}];
      } else if (msg == prefix+"bye" || msg == prefixalt+"bye") {
        objresp.messages = [{role: "assistant", content: "Goodbye! Have a great day!"}];
      } else {
        if(!msg.startsWith(prefix) && !msg.startsWith(prefixalt)) {
          objresp.messages = [{role: "assistant", content: "Please start your message with a command prefix (e.g., '!' or '$')."}];
        } else {
          objresp.messages = [{role: "assistant", content: "I'm not sure how to respond to that. Can you rephrase?"}];
        }
      }

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Accept', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const msgo of objresp.messages) {
        res.write(msgo.content || "");
      }
    }

    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar resposta ' + error });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
