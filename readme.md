# Browser bot

## Usage 
First clone the repo

 ``` git clone https://github.com/fejl40/fucked-browser-bot.git ```

With a terminal navigate into the newly cloned repo. And run: 

``` docker build --tag browserbot:latest . ```

This will create a docker image of browser bot. To run the browserbot use the following:

``` docker run -d --name browserbot -e CLIENT_ID=CLIENT_ID -e DISCORD_TOKEN=YOUR_TOKEN browserbot:latest ```

⚠️ you must have build the image before running it

### getting a Discord token
visit:
[discordapp.com/developers/applications](https://discordapp.com/developers/applications/)


### more help
Library used [discord.js - github](https://github.com/discordjs/discord.js)

[see discords own api documentation](https://discord.com/developers/docs/getting-started) 