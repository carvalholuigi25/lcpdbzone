# List of commands for chatbot

## Usage: ==!== or ==$== with command name without spaces and theres list of commands below

| Title | Description | Status |
| :----: | :----: | :----: |
| hello | Returns a friendly greeting message. | :white_check_mark: |
| welcome | Provides a welcome message to the user. | :white_check_mark: |
| help | Provides a list of available commands and their descriptions. | :white_check_mark: |
| bye | Returns a goodbye message to the user. | :white_check_mark: |
| ai | Engages the AI chatbot for a conversation. ("example: !ai gpt-5-nano or $ai gpt-5-nano 'text'") | :white_check_mark: |
| timezone | Returns the current timezone of the server. | :white_check_mark: |
| date | Returns the current date. (You can also specify a timezone, example: !date zone:America/New_York or $date zone:America/New_York) | :white_check_mark: |
| datetime | Returns the current date and time. (You can also specify a timezone, example: "!datetime zone:America/New_York or $datetime zone:America/New_York)" | :white_check_mark: |
| time | Returns the current time. (You can also specify a timezone, example: !time zone:America/New_York or $time zone:America/New_York) | :white_check_mark: |
| joke | Tells a random joke | :white_check_mark: |
| quote | Provides an inspirational quote. | :white_check_mark: |
| mail | Provides contact information for support. | :white_check_mark: |
| weather | Provides a weather update. (You can specify a location, example:!weather zone:New York or $weather zone:New York) | :white_check_mark: |
| listgames | Provides a list of popular games | :white_check_mark: |
| listmovies | Provides a list of popular movies | :white_check_mark: |
| listanimes | Provides a list of popular animes | :white_check_mark: |
| listpodcasts | Provides a list of popular podcasts | :white_check_mark: |
| listaimodels | Provides a list of available AI models for the !ai command. | :white_check_mark: |
| calc | Evaluates a mathematical expression. (example: !calc 2+2 or $calc 2+2) | :white_check_mark: |
| calcage | Calculates age based on birth year. (example: !calcage 1990 or $calcage 1990) | :white_check_mark: |
| countdown | Counts down to a specific date. (example: !countdown 2024-12-31 or $countdown 2024-12-31) | :white_check_mark: |
| countup | Counts up from a specific date. (example: !countup 2020-01-01 or $countup 2020-01-01) | :white_check_mark: |
| convert | Converts units of measurement. (example: !convert value:100 unit:meters to:feet or $convert value:100 unit:meters to:feet) | :construction: |
| inspiredby | Provides a random source of inspiration. | :white_check_mark: |
| motivation | Provides a random motivational message. | :white_check_mark: |
| radiostations | Provides a list of radio stations by country. (example: !radiostations zone:USA or $radiostations zone:USA) | :white_check_mark: |
| youtubeplaylist | Provides a YouTube playlist based on a topic. (example: !youtubeplaylist topic:lofi or $youtubeplaylist topic:lofi) | :white_check_mark: |
| convertpressure | Converts pressure units. (example: !convertpressure value:1000 unit:hPa to:psi or $convertpressure value:1000 unit:hPa to:psi) | :construction: |
| convertspeed | Converts speed units. (example: !convertspeed value:1 unit:km/h to:mph or $convertspeed value:1 unit:km/h to:mph) | :construction: |
| convertenergy | Converts energy units. (example: !convertenergy value:1000 unit:J to:kcal or $convertenergy value:1000 unit:J to:kcal) | :construction: |
| convertvolume | Converts volume units. (example: !convertvolume value:1 unit:liter to:gallons or $convertvolume value:1 unit:liter to:gallons) | :construction: |
| convertlength | Converts length units. (example: !convertlength value:1 unit:meters to:feet or $convertlength value:1 unit:meters to:feet) | :construction: |
| convertweight | Converts weight units. (example: !convertweight value:70 unit:kg to:pounds or $convertweight value:70 unit:kg to:pounds) | :construction: |
| convertdatasize | Converts data size units. (example: !convertdatasize value:1024 unit:MB to:GB or $convertdatasize value:1024 unit:MB to:GB) | :construction: |
| converttemperature | Converts temperature units. (example: !converttemperature value:1 unit:C to:F or $converttemperature value:1 unit:C to:F) | :construction: |
| converttime | Converts time units. (example: !converttime value:3600 unit:seconds to:hours or $converttime value:3600 unit:seconds to:hours) | :construction: |
| convertcurrency | Converts currency units. (example: !convertcurrency value:1 unit:USD to:EUR or $convertcurrency value:1 unit:USD to:EUR) | :construction: |
| colorlist | Provides a list of colors with their hexadecimal values. | :white_check_mark: |
| resetwarnings | This command results a reset of warnings for chat to original state due to user prompted by one (or more) bad words in chat. (its for admins only) | :white_check_mark: |
| rng | Generates random number (usage: $rng number:10 or !rng number:10) | :white_check_mark: |
| listtimezones | Returns the list of all avaliable timezones (usage: $listtimezones target:native) (options: native, thirdpartylib) | :white_check_mark: |
| rules | It displays the list of rules for usage of this chatbot | :white_check_mark: |
| feedback | Send a feedback message (by library nodemailer) to the creator of this webapp (usage: $feedback from:[from] name:[name] subject:[subject] content:[content] contenthtml:[contenthtml?], note: the symbol ? is optional) | :white_check_mark: |
| theme | Set the theme for chatbot (usage: $theme name:[name]) (options: default, matrix, liquidglass, glassmorphism, visionglass, red, green, blue, yellow, etc...) | :white_check_mark: |
| translate | It will translate your message. Usage: $translate text:\"your text here\" to:english (or lang:en) | :white_check_mark: |
| news | It displays the current (or newest) news of world. | :white_check_mark: |
| spotify | It uses the official spotify public web api to search the audio info or play your audio or podcasts (Usage: $spotify search:'top hits') | :construction: |
| video | It plays your video by youtube (or your local video file) through iframe (Usage: $video id:VIDEO_ID [path?]:YOUR_VIDEO_FILE_HERE.mp4 local:(true or false)) | :construction: |
| audio | It plays your audio by spotify (or your local audio file) through iframe (Usage: $audio id:TRACK_ID [path?]:YOUR_AUDIO_FILE_HERE.mp4 local:(true or false)) | :construction: |

>
> &nbsp;
>
> ### Note
>
> The *chatbot* is currently in **beta** stage. Please be aware that anything can be added, changed or removed commands in any time for *chatbot*.
>
> &nbsp;
>

&nbsp;

>
> &nbsp;
>
> ## Created by
>
> Author: [Luis Carvalho](mailto:luiscarvalho239@gmail.com)
> Date: 2026-03-27 15:30:00
>
> &nbsp;
>
