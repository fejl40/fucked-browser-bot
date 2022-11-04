# Fucked bot

## Usage 
First clone the repo

``` git clone https://github.com/fejl40/fucked-browser-bot.git ```

#### Install **[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** through vscode

##### Enable "Format On Save"
1. Click the bottom left gear in the vscode editor
2. Select *Settings*
3. Search for *"Editor: Format On Save"*
4. Enable *Format On Save*
5. ***PROFIT!***

#### Getting a Discord token
Visit:
[discordapp.com/developers/applications](https://discordapp.com/developers/applications/)

#### More help
Library used [discord.js - github](https://github.com/discordjs/discord.js)
[see discords own api documentation](https://discord.com/developers/docs/getting-started)

Get your **FREE_IMAGE_HOST_TOKEN** from here:
Image hosting service [freeimage.host API](https://freeimage.host/page/api)

#### Docker
With a terminal navigate into the newly cloned repo. Then run: 

``` docker build --tag browserbot:latest . ```

This will create a docker image of browser bot.

Make a .env file using the .env-example file as a guide.
To start the docker container with the image you've built alter *".env"* to the filepath of your own .env file and run it:
``` docker run -d --name browserbot --env-file .env browserbot:latest ```

⚠️⚠️You must have built the image before running it⚠️⚠️