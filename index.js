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

class Frame {
	constructor(id, n, img, posX, posY, width, height) {
		this.id = id;
		this.n = n;
		this.image = img;
		this.x = posX;
		this.y = posY;
		this.w = width;
		this.h = height;
	}

	getElement(parent, innerHTML = "") {
		return new Element("div", {position: "absolute", top: this.y + "vh", left: this.x + "vw", width: this.w + "vw", height: this.h + "vh", "background-image": `url(${this.img})`, "background-size": `${this.w}vw ${this.j}vh`}, parent, innerHTML);
	}
}

class Animatronic {
	constructor(id, frames, end, alternativeFrames = null, divergenceAt = 0, convergenceAt = 0) {
		this.id = id;
		this.frames = frames;
		this.speed = 0;
		this.pos = 0;
		this.end = end;
		if (alternativeFrames != null) {
			this.alternativeFrames = alternativeFrames;
			this.divergenceAt = divergenceAt;
			this.convergenceAt = convergenceAt;
		}
	}

	setSpeed(speed) {
		this.speed = speed;
	}

	update() {
		if (Math.random() < this.speed) {
			//TODO: add super-mega-complex formula on speed calculations
			this.pos++;
			if (this.pos == end) {
				this.jumpscare();
			}
		}
	}

	jumpscare() {} //TODO: do.
}

function play() {
	switchScreens(HomeScreen, GameLoadingScreen);
	setTimeout(() => {
		switchScreens(GameLoadingScreen, GameScreen);
		GameLoop();
		CameraToggleButton.show();
		EnergyBar.show();
		EnergyLevel.show();
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

function getCameraScreen(id) {
	switch (id) {
		case 0:
			return CameraScreen01;
		case 1:
			return CameraScreen02;
		default:
			return null;
	}
}

function toggleCamera() {
	let button = document.getElementById("cameraToggleButton");
	button.onmouseenter = "";
	setTimeout(() => {
		button.onmouseenter = toggleCamera;
	}, 300);
	if (button.getAttribute("state") == "off") {
		button.setAttribute("state", "on");
		Data.usage++;
		switchScreens(GameScreen, getCameraScreen(Data.cameraId));
	} else {
		Data.usage--;
		button.setAttribute("state", "off");
		switchScreens(getCameraScreen(Data.cameraId), GameScreen);
	}
}

function Victory() {
	switchScreens(GameScreen, VictoryScreen);
	Cache.night++;
	Data.time = 0;
	Data.energy = 5000;
	Data.usage = 1;
	CameraToggleButton.hide();
	EnergyBar.hide();
	EnergyLevel.hide();
}

orderedNumberOf = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

const GlobalCache = {night: 1, stars: 0};

const Data = {time: 0, usage: 1, energy: 5000, cameraId: 0};

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
	<button class='homeScreenButton' onclick='switchScreens(HomeScreen, CreditsScreen)'>Credits</button>
	<button class='homeScreenButton' onclick='window.close();'>Exit</button>
</div>
<img src="" width="50vw" height: "99vh" />
`
);

const HomeScreen = new Screen(HomeScreenBG);

HomeScreen.show();

//CREDITS SCREEN

const CreditsScreenBG = new Element(
	"div",
	{display: "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column", width: "99vw", height: "99vh", "background-image": "url(files/images/cameraGlitch.jpg)"},
	ScreenParent,
	`
	<p class='homeScreenText'>Credits</p>
	<table style='min-width: 50vw;'>
		<tr><td class='homeScreenText' style='text-align: center;'>Autor</td><td class='homeScreenText'>
		<button class='homeScreenButton' onclick='window.open("https://github.com/Evgen4X", "blank_")'>Evgen4X</button></td></tr>
		<tr><td class='homeScreenText' style='text-align: center;'>Designer</td><td class='homeScreenText'>
		<button class='homeScreenButton' onclick='window.open("https://github.com/Evgen4X", "blank_")'>Evgen4X</button></td></tr>
		<tr><td class='homeScreenText' style='text-align: center;'>Everything else</td><td class='homeScreenText'>
		<button class='homeScreenButton' onclick='window.open("https://github.com/Evgen4X", "blank_")'>Evgen4X</button></td></tr>
	</table>
	<button class='homeScreenButton' onclick='switchScreens(CreditsScreen, HomeScreen)'>Back</button>
`
);

const CreditsScreen = new Screen(CreditsScreenBG);

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

//CAMERA SCREENS

const CameraScreen01BG = new Element("div", {width: "99vw", height: "99vh", "z-index": 0, "background-image": "url(files/images/cameraScreen01.jpg)", "background-size": "99vw 99vh"}, ScreenParent);
const CameraScreen01 = new Screen(CameraScreen01BG);

const CameraScreen02BG = new Element("div", {width: "99vw", height: "99vh", "z-index": 0, "background-image": "url(files/images/cameraScreen02.png)", "background-size": "99vw 99vh"}, ScreenParent);
const CameraScreen02 = new Screen(CameraScreen02BG);

const CameraScreen03BG = new Element("div", {width: "99vw", height: "99vh", "z-index": 0, "background-image": "url(files/images/cameraScreen03.png)", "background-size": "99vw 99vh"}, ScreenParent);
const CameraScreen03 = new Screen(CameraScreen03BG);

const CameraScreen04BG = new Element("div", {width: "99vw", height: "99vh", "z-index": 0, "background-image": "url(files/images/cameraScreen04.png)", "background-size": "99vw 99vh"}, ScreenParent);
const CameraScreen04 = new Screen(CameraScreen04BG);

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

const OfficeWindowView = new Element("div", {"z-index": 0, position: "absolute", top: "23vh", left: "17vw", width: "11vw", height: "30vh", "background-image": "url(files/images/OfficeWindowView.jpg)", "background-size": "11vw 30vh"}, OfficeBG.el);
OfficeWindowView.el.id = "officeWindowVeiw";

const OfficeDoor = new Element("div", {"z-index": 1, width: "23vw", height: "47vh", position: "absolute", top: "-20vh", left: "42vw", "background-image": "url(files/images/OfficeDoor.jpg)", "background-size": "23vw 45vh"}, OfficeBG.el, ``);
OfficeDoor.el.id = "officeDoor";

const OfficeWindow = new Element("div", {"z-index": 1, width: "11vw", height: "30vh", position: "absolute", top: "-7vh", left: "17vw", "background-image": "url(files/images/OfficeDoor.jpg)", "background-size": "11vw 30vh"}, OfficeBG.el, ``);
OfficeWindow.el.id = "officeWindow";

const EnergyLevel = new Element("div", {"z-index": 4, width: "auto", height: "5vh", position: "absolute", top: "79vh", left: "5vw"}, ScreenParent, `Power left: 100%`);
EnergyLevel.el.classList.add("gameText");
EnergyLevel.hide();
const EnergyBar = new Element("div", {"z-index": 4, width: "21.5vw", height: "10vh", position: "absolute", top: "85vh", left: "5vw", border: "0.2vw solid grey"}, ScreenParent);
EnergyBar.id = "energyBar";
EnergyBar.hide();
const usageColors = [
	[0, 255, 0],
	[128, 255, 0],
	[255, 255, 0],
	[255, 128, 0],
	[255, 0, 0],
	[128, 0, 0],
];

const CameraToggleButton = new Element("div", {"z-index": 4, width: "40vw", height: "10vh", position: "absolute", top: "85vh", left: "30vw", "background-image": "url(files/images/cameraToggleButton.png)", "background-size": "40vw 10vh", filter: "invert(100%)"}, ScreenParent);
CameraToggleButton.el.id = "cameraToggleButton";
CameraToggleButton.el.setAttribute("state", "off");
CameraToggleButton.el.onmouseenter = toggleCamera;
CameraToggleButton.hide();

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
