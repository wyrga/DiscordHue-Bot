	
//A Discord bot made for controlling Philips hue lights
//But why you may ask.
//I don't know...

//Invite your bot over -> 


//Keep your setup data in config.json, tokens, hue bridge username and so on..
const config = require('./config.json');

//Discord setup
var Discord = require("discord.js");
var bot = new Discord.Client();

//Hue setup
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;


//for console debugging
var displayResult = function(result) {console.log(JSON.stringify(result,null,2));};


var hostname = config.hostname,
    username = config.username,
    api = new HueApi(hostname, username),
    state = lightState.create().on();

var colors = config.colors;
//

//prefix
var p = config.prefix;
//list of commands from json
var cmd = config.commands;

//Don't ask..
var microhour = 3600000000;
//owner's discord name
var od = config.username;

//When ready to work 
bot.on('ready', () => {
    console.log('Ready to work');


});



bot

    .on('message', message => {

	//blinks your light(s) once after a message has been received in discord
	if(message.author.username != od){
	    api.setLightState(1, lightState.create().shortAlert())
		.then(displayResult)
		.done();
	}
	//section for commands with arguments

	//function for setting an RGB colour
	if(message.content.startsWith(p+"RGB")){
	    let args = message.content.split(" ").slice(1);
	    api.setLightState(1, lightState.create().rgb(parseInt(args[0]),parseInt(args[1]), parseInt(args[2])));
	    message.channel.send("RGB " + args);
	}

	if(message.content.startsWith(p+"colorsAvailable")){
	    var s = "";
	    for (var i = 0; i < colors.length; i++){
		s = s+ " " +JSON.stringify(colors[i].name);
	    }
	    message.channel.send(s);
	}
	  
	if(message.content.startsWith(p+"setColor")){
	    let args = message.content.split(" ").slice(1);
	    for (var i = 0; i < colors.length; i++){
		if (colors[i].name == args[0]){
		    api.setLightState(1, lightState.create().rgb(colors[i].rgb));
		    message.channel.send("Light color changed to " + args[0]);
		}

	    }
	    
	}
	if(message.content.startsWith(p+"setAlarm")){
	    var date = new Date();
	    var hour = date.getHours();
	    
	    let args = message.content.split(" ").slice(1);
	    let time = args[0].split(":");
	    message.channel.send("Setting alarm for " + args[0]);
	    
	    
	}
	//function 
	

	//switch cases for commands without arguments
	switch (message.content){
	    //basic hello for testing
	case p + "hello":
	    message.channel.send("hi");
	    break;
	    //bot tells you what you're playing
	case p+"game":
	    if(message.author.presence.game != null){
		message.channel.send(message.author.user + " is playing " + message.author.presence.game.name);
	    }
	    else
		message.channel.send(message.author.username + " is not playing anything.");
		
	    break;
	    //Destroying the bot	
	case p+"disconnect":
	    message.channel.send(";__;");
	    bot.setTimeout(bot.destroy(),1000);
	    break;
	    //turns your lights on
	case p+"lightsOn":
	    message.channel.send("Turning lights on");
	    api.setLightState(1, state)
		.then(displayResult)
		.done();
	    break;
	    //turns your lights off
	case p+"lightsOff":
	    message.channel.send("Turning lights off");
	    api.setLightState(1, lightState.create().off());
	    break;
	case p+"help":
	    message.channel.send("List of commands: " + JSON.stringify(cmd));
	break;
				}
    });
    

bot.login(config.token);
