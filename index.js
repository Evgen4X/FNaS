class Element {
	constructor(tagName, properties, parent = null, innerHTML = "") {
		this.el = document.createElement(tagName);
		for (let property in properties) {
			this.el.style[property] = properties[property];
		}
		this.el.innerHTML = innerHTML;
		this.cache = {};

		if (parent != null) {
			parent.appendChild(this.el);
		}
	}

	show(style) {
		if (style == null || style == undefined || style.length == 0) {
			style = this.cache.lastDisplay;
		}
		this.el.style.display = style;
	}

	hide() {
		this.cache.lastDisplay = this.el.style.display;
		this.el.style.display = "none";
	}
}

class Screen {
	constructor(bg, fg = null) {
		this.bg = bg;
		this.fg = fg; //FrontGround
		this.hide();
	}

	showBg() {
		this.bg.show();
	}

	hideBg() {
		this.bg.hide();
	}

	showFg() {
		this.fg.show();
	}

	hideFg() {
		this.fg.hide();
	}

	show() {
		this.bg.show();
		if (this.fg != null) {
			this.fg.show();
		}
	}

	hide() {
		this.bg.hide();
		if (this.fg != null) {
			this.fg.hide();
		}
	}
}

function play() {
	switchScreens(HomeScreen, GameLoadingScreen);
	setTimeout(() => {
		switchScreens(GameLoadingScreen, GameScreen);
		GameLoop();
	}, 2000);
}

function switchScreens(toClose, toOpen) {
	toClose.hide();
	toOpen.show();
}

function doorToggle() {
	let button = document.getElementById("doorOpenButton");
	button.onclick = "";
	setTimeout(() => {
		button.onclick = doorToggle;
	}, 333);
	if (button.getAttribute("state") == "on") {
		button.setAttribute("state", "off");
		--Data.usage;
		OfficeDoor.el.animate([{top: "30vh"}, {top: "-20vh"}], {duration: 333, fill: "forwards"});
	} else {
		button.setAttribute("state", "on");
		++Data.usage;
		OfficeDoor.el.animate([{top: "-20vh"}, {top: "30vh"}], {duration: 333, fill: "forwards"});
	}
}
function windowToggle() {
	let button = document.getElementById("windowOpenButton");
	button.onclick = "";
	setTimeout(() => {
		button.onclick = windowToggle;
	}, 333);
	if (button.getAttribute("state") == "on") {
		button.setAttribute("state", "off");
		--Data.usage;
		OfficeWindow.el.animate([{top: "23vh"}, {top: "-7vh"}], {duration: 333, fill: "forwards"});
	} else {
		button.setAttribute("state", "on");
		++Data.usage;
		OfficeWindow.el.animate([{top: "-7vh"}, {top: "23vh"}], {duration: 333, fill: "forwards"});
	}
}

function doorLight() {
	let rect = document.getElementById("doorDarkRect");
	if (rect.style.opacity == 0) {
		rect.style.opacity = 1;
		--Data.usage;
	} else {
		rect.style.opacity = 0;
		++Data.usage;
	}
}

function windowLight() {
	let rect = document.getElementById("windowDarkRect");
	if (rect.style.opacity == 0) {
		rect.style.opacity = 1;
		--Data.usage;
	} else {
		rect.style.opacity = 0;
		++Data.usage;
	}
}

function Victory() {
	switchScreens(GameScreen, VictoryScreen);
	Cache.night++;
	Data.time = 0;
	Data.energy = 5000;
	Data.usage = 1;
}

orderedNumberOf = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

const GlobalCache = {night: 1, stars: 0};

const Data = {time: 0, usage: 1, energy: 5000};

const ScreenParent = document.getElementById("ScreenParent");

//HOME SCREEN

const HomeScreenBG = new Element(
	"div",
	{display: "flex", "justify-content": "center", "aligh-items": "center", width: "99vw", height: "99vh", "background-image": "url('files/images/cameraGlitch.jpg')"},
	ScreenParent,
	`
<div class='transparent flexColumnContainer'>
	<p class='homeScreenText'>Fife<br>Nights<br>at<br>Szuj</p>
	<button class='homeScreenButton' onclick='play()'>Play</button>
	<button class='homeScreenButton' onclick='window.close();'>Exit</button>
</div>
<img src="" width="50vw" height: "99vh" />
`
);

const HomeScreen = new Screen(HomeScreenBG);

HomeScreen.show();

//GAME LOADING SCREEN

const GameLoadingScreenBG = new Element(
	"div",
	{display: "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column", width: "99vw", height: "99vh", "background-color": "black"},
	ScreenParent,
	`
<p class="gameLoadingScreenText">12:00 AM</p>
<p class="gameLoadingScreenText">${orderedNumberOf[GlobalCache.night - 1]} Night</p>
`
);

const GameLoadingScreen = new Screen(GameLoadingScreenBG);

//VICTORY SCREEN

const VictoryScreenBG = new Element(
	"div",
	{display: "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column", width: "99vw", height: "99vh", "background-color": "black"},
	ScreenParent,
	`<p class="gameLoadingScreenText">6:00 AM</p>
	`
);

const VictoryScreen = new Screen(VictoryScreenBG);

//GAME SCREEN

const OfficeBG = new Element(
	"div",
	{"z-index": 0, width: "99vw", height: "99vh", "background-image": "url('files/images/OfficeBG.jpg')", "background-size": "99vw 99vh"},
	ScreenParent,
	`
<div class="gameText" id="gameTime">12AM</div>
<div class="gameText" id="gameNightNumberDiv">Night: <span id="gameNightNumber">1</span></div>

<div class="gameControlButton" id="doorOpenButton" style="top: 40vh; left: 70vw;" state="off" onclick="doorToggle();"></div>
<div class="gameControlButton" id="windowOpenButton" style="top: 40vh; left: 33vw;" state="off" onclick="windowToggle();"></div>

<div class="gameDarkRect" id="doorDarkRect" style="opacity: 1; top: 30vh; left: 42vw; width: 23vw; height: 47vh;" onclick="doorLight()";></div>
<div class="gameDarkRect" id="windowDarkRect" style="opacity: 1; top: 23vh; left: 17vw; width: 11vw; height: 30vh;" onclick="windowLight()";></div>
`
);

const OfficeDoor = new Element("div", {"z-index": 1, width: "23vw", height: "47vh", position: "absolute", top: "-20vh", left: "42vw", "background-image": "url(files/images/OfficeDoor.jpg)", "background-size": "23vw 45vh"}, OfficeBG.el, ``);
OfficeDoor.id = "officeDoor";

const OfficeWindow = new Element("div", {"z-index": 1, width: "11vw", height: "30vh", position: "absolute", top: "-7vh", left: "17vw", "background-image": "url(files/images/OfficeDoor.jpg)", "background-size": "11vw 30vh"}, OfficeBG.el, ``);
OfficeWindow.id = "officeWindow";

const EnergyLevel = new Element("div", {"z-index": 4, width: "auto", height: "5vh", position: "absolute", top: "79vh", left: "5vw"}, OfficeBG.el, `Power left: 100%`);
EnergyLevel.el.classList.add("gameText");
const EnergyBar = new Element("div", {"z-index": 4, width: "21vw", height: "10vh", position: "absolute", top: "85vh", left: "5vw", border: "0.2vw solid grey"}, OfficeBG.el);
EnergyBar.id = "energyBar";
const usageColors = [
	[0, 255, 0],
	[128, 255, 0],
	[255, 255, 0],
	[255, 128, 0],
	[255, 0, 0],
	[128, 0, 0],
];

const OfficeFG = new Element("div", {"z-index": 2, position: "absolute", top: 0, left: "17vw", height: "29vh", width: "48vw", "background-image": "url('files/images/OfficeFG.png')", "background-size": "48vw 29vh"}, ScreenParent);

const GameScreen = new Screen(OfficeBG, OfficeFG);

function GameLoop() {
	//Time control
	Data.time += 1;
	let time = Data.time / 3600;
	time = time < 1 ? 12 : Math.floor(time);
	document.getElementById("gameTime").innerHTML = time + "AM";
	if (time >= 6 && time != 12) {
		Victory();
		return;
	}

	//Usage control
	let usage = document.getElementsByClassName("usageBar").length;
	if (Data.usage > 0) {
		--Data.usage;
		let usageBar = new Element("div", {"z-index": 5, width: "3vw", height: "8vh", position: "absolute", top: "1vh", left: `${0.5 + 3.5 * usage}vw`, "background-color": `rgb(${usageColors[usage].join(", ")})`}, EnergyBar.el);
		usageBar.el.classList.add("usageBar");
	}
	if (Data.usage < 0) {
		++Data.usage;
		let usageBars = document.getElementsByClassName("usageBar");
		usageBars[usageBars.length - 1].remove();
	}

	Data.energy -= (usage == 1 ? 0.5 : usage) * 0.2;
	EnergyLevel.el.innerHTML = "Power left: " + Math.floor(Data.energy / 50) + "%";

	setTimeout(GameLoop, 25); //40 fps
}
