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

function newGame() {
	GlobalCache.night = 1;
	GlobalCache.stars = 0;
	document.getElementById("nightNumber").innerHTML = "1ST NIGHT";
	localStorage.removeItem("FNaS_night");
	localStorage.removeItem("FNaS_stars");
	play();
}

function play() {
	switchScreens(HomeScreen, GameLoadingScreen);
	setTimeout(() => {
		switchScreens(GameLoadingScreen, GameScreen);
		GameLoop();
		CameraToggleButton.show();
		FlowersToggleButton.show();
		EnergyBar.show();
		EnergyLevel.show();
		Night.el.innerHTML = `Night: ${GlobalCache.night}`;
		Time.show();
		Night.show();
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

function toggleFlowers() {
	let button = FlowersToggleButton.el;
	button.onmouseenter = "";
	if (button.getAttribute("state") == "off") {
		button.setAttribute("state", "on");
		Flowers.show();
		Flowers.el.animate([{top: "100vh"}, {top: "9vh"}], {duration: 333, fill: "forwards", easing: "ease-out"});
	} else {
		button.setAttribute("state", "off");
		Flowers.el.animate([{top: "9vh"}, {top: "100vh"}], {duration: 333, fill: "forwards", easing: "ease-in"});
		setTimeout(() => {
			Flowers.hide();
		}, 334);
	}
	setTimeout(() => {
		button.onmouseenter = toggleFlowers;
	}, 336);
}

function getCameraScreen(id) {
	switch (id) {
		case 0:
			return CameraScreen01;
		case 1:
			return CameraScreen02;
		case 2:
			return CameraScreen03;
		case 3:
			return CameraScreen04;
		case 4:
			return CameraScreen05;
		default:
			return null;
	}
}

function toggleCamera() {
	let button = document.getElementById("cameraToggleButton");
	button.onmouseenter = "";
	setTimeout(() => {
		button.onmouseenter = toggleCamera;
	}, 334);
	if (button.getAttribute("state") == "off") {
		button.setAttribute("state", "on");
		Data.usage++;
		FlowersToggleButton.hide();
		CameraScreen.show();
		CameraScreen.el.animate([{transform: "rotateX(90deg)"}, {transform: "rotateX(0deg)"}], {duration: 333, easing: "ease-out"});
		setTimeout(() => {
			switchScreens(GameScreen, getCameraScreen(Data.cameraId));
			CameraMap.show();
			CameraScreen.hide();
		}, 333);
	} else {
		Data.usage--;
		button.setAttribute("state", "off");
		CameraScreen.show();
		CameraScreen.el.animate([{transform: "rotateX(0deg)"}, {transform: "rotateX(90deg)"}], {duration: 333, easing: "ease-in"});
		switchScreens(getCameraScreen(Data.cameraId), GameScreen);
		CameraMap.hide();
		setTimeout(() => {
			CameraScreen.hide();
			FlowersToggleButton.show();
		}, 333);
	}
}

function switchCameras(idToClose, idToOpen) {
	if (idToClose == idToOpen) {
		return;
	}
	if (idToClose == null) {
		idToClose = Data.cameraId;
	}
	Data.cameraId = idToOpen;
	switchScreens(getCameraScreen(idToClose), getCameraScreen(idToOpen));
}

function Victory() {
	GlobalCache.night++;
	localStorage.setItem("FNaS_night", GlobalCache.night);
	localStorage.setItem("FNaS_stars", GlobalCache.stars);
	let button = document.getElementById("doorOpenButton");
	if (button.getAttribute("state") == "on") {
		doorToggle();
	}
	button = document.getElementById("windowOpenButton");
	if (button.getAttribute("state") == "on") {
		windowToggle();
	}
	button = document.getElementById("doorDarkRect");
	if (button.style.opacity == 0) {
		doorLight();
	}
	button = document.getElementById("windowDarkRect");
	if (button.style.opacity == 0) {
		windowLight();
	}
	button = document.getElementById("cameraToggleButton");
	if (button.getAttribute("state") == "on") {
		toggleCamera();
	}
	button = document.getElementById("flowersToggleButton");
	if (button.getAttribute("state") == "on") {
		toggleFlowers();
	}
	setTimeout(() => {
		Data.time = 0;
		Data.cameraId = 0;
		Data.energy = 5000;
		CameraToggleButton.hide();
		FlowersToggleButton.hide();
		EnergyBar.hide();
		EnergyLevel.hide();
		Time.hide();
		Night.hide();
		document.getElementById("nightNumber").innerHTML = `${orderedNumberOf[GlobalCache.night - 1]} Night`;
		switchScreens(GameScreen, VictoryScreen);
		setTimeout(() => {
			switchScreens(VictoryScreen, HomeScreen);
		}, 2000);
	}, 337);
}

orderedNumberOf = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

const GlobalCache = {night: 1, stars: 0};

const Data = {time: 0, usage: 1, energy: 5000, cameraId: 0};

const ScreenParent = document.getElementById("ScreenParent");

//HOME SCREEN

const HomeScreenBG = new Element(
	"div",
	{display: "flex", "justify-content": "center", "aligh-items": "center", width: "100vw", height: "100vh", "background-image": "url('files/images/cameraGlitch.jpg')"},
	ScreenParent,
	`
<div class='transparent flexColumnContainer'>
	<p class='homeScreenText'>Fife<br>Nights<br>at<br>Szuj</p>
	<button class='homeScreenButton' onclick='play()'>Play</button>
	<button class='homeScreenButton' onclick='newGame()'>New game</button>
	<button class='homeScreenButton' onclick='switchScreens(HomeScreen, CreditsScreen)'>Credits</button>
	<button class='homeScreenButton' onclick='window.close();'>Exit</button>
</div>
<img src="" width="50vw" height: "100vh" />
`
);

const HomeScreen = new Screen(HomeScreenBG);

HomeScreen.show();

//CREDITS SCREEN

const CreditsScreenBG = new Element(
	"div",
	{display: "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column", width: "100vw", height: "100vh", "background-image": "url(files/images/cameraGlitch.jpg)"},
	ScreenParent,
	`
	<p class='homeScreenText'>Credits</p>
	<table style='min-width: 50vw;'>
		<tr><td class='homeScreenText' style='text-align: center;'>Autor</td>
		<td class='homeScreenText'><button class='homeScreenButton' onclick='window.open("https://github.com/Evgen4X", "blank_")'>Evgen4X</button></td></tr>
		<tr><td class='homeScreenText' style='text-align: center;'>Designer</td>
		<td class='homeScreenText'><button class='homeScreenButton' onclick='window.open("https://github.com/Evgen4X", "blank_")'>Evgen4X</button></td></tr>
        <tr><td class='homeScreenText' style='text-align: center;'>Photos</td>
		<td class='homeScreenText'><button class='homeScreenButton' onclick='window.open("https://www.facebook.com/zsmetarnow", "blank_")'>ZSME</button></td></tr>
		<tr><td class='homeScreenText' style='text-align: center;'>Everything else</td>
		<td class='homeScreenText'><button class='homeScreenButton' onclick='window.open("https://github.com/Evgen4X", "blank_")'>Evgen4X</button></td></tr>
	</table>
	<button class='homeScreenButton' onclick='switchScreens(CreditsScreen, HomeScreen)'>Back</button>
`
);

const CreditsScreen = new Screen(CreditsScreenBG);

//GAME LOADING SCREEN

const GameLoadingScreenBG = new Element(
	"div",
	{display: "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column", width: "100vw", height: "100vh", "background-color": "black"},
	ScreenParent,
	`
<p class="gameLoadingScreenText">12:00 AM</p>
<p class="gameLoadingScreenText" id='nightNumber'>${orderedNumberOf[GlobalCache.night - 1]} Night</p>
`
);

const GameLoadingScreen = new Screen(GameLoadingScreenBG);

//VICTORY SCREEN

const VictoryScreenBG = new Element(
	"div",
	{display: "flex", "justify-content": "center", "align-items": "center", "flex-direction": "column", width: "100vw", height: "100vh", "background-color": "black"},
	ScreenParent,
	`<p class="gameLoadingScreenText">6:00 AM</p>
	`
);

const VictoryScreen = new Screen(VictoryScreenBG);

//CAMERA SCREENS

const CameraScreen = new Element("div", {position: "absolute", top: "0vh", transform: "rotateX(90deg)", width: "100vw", height: "200vh", "z-index": 999, border: "2vw solid #333333", "background-color": "black"}, ScreenParent);
CameraScreen.hide();

const CameraScreen01BG = new Element("div", {width: "100vw", height: "100vh", "z-index": 0, "background-image": "url(files/images/cameraScreen01.jpg)", "background-size": "100vw 100vh"}, ScreenParent, `
<div class="cameraRecordingCircle" style="z-index: 4; background-color: #f00; border-radius: 50%; width: 5vw; height: 5vw; position: absolute; top: 3vw; left: 3vw;"></div>
`);
const CameraScreen01 = new Screen(CameraScreen01BG);

const CameraScreen02BG = new Element("div", {width: "100vw", height: "100vh", "z-index": 0, "background-image": "url(files/images/cameraScreen02.jpg)", "background-size": "100vw 100vh"}, ScreenParent, `
<div class="cameraRecordingCircle" style="z-index: 4; background-color: #f00; border-radius: 50%; width: 5vw; height: 5vw; position: absolute; top: 3vw; left: 3vw;"></div>
`);
const CameraScreen02 = new Screen(CameraScreen02BG);

const CameraScreen03BG = new Element("div", {width: "100vw", height: "100vh", "z-index": 0, "background-image": "url(files/images/cameraScreen03.jpg)", "background-size": "100vw 100vh"}, ScreenParent, `
<div class="cameraRecordingCircle" style="z-index: 4; background-color: #f00; border-radius: 50%; width: 5vw; height: 5vw; position: absolute; top: 3vw; left: 3vw;"></div>
`);
const CameraScreen03 = new Screen(CameraScreen03BG);

const CameraScreen04BG = new Element("div", {width: "100vw", height: "100vh", "z-index": 0, "background-image": "url(files/images/cameraScreen04.jpg)", "background-size": "100vw 100vh"}, ScreenParent, `
<div class="cameraRecordingCircle" style="z-index: 4; background-color: #f00; border-radius: 50%; width: 5vw; height: 5vw; position: absolute; top: 3vw; left: 3vw;"></div>
`);
const CameraScreen04 = new Screen(CameraScreen04BG);

const CameraScreen05BG = new Element("div", {width: "100vw", height: "100vh", "z-index": 0, "background-image": "url(files/images/cameraScreen05.jpg)", "background-size": "100vw 100vh"}, ScreenParent, `
<div class="cameraRecordingCircle" style="z-index: 4; background-color: #f00; border-radius: 50%; width: 5vw; height: 5vw; position: absolute; top: 3vw; left: 3vw;"></div>
`);
const CameraScreen05 = new Screen(CameraScreen05BG);

//CAMERA MANAGEMENT

const CameraMap = new Element(
	"div",
	{"z-index": 2, position: "absolute", width: "30vw", height: "35vh", top: "60vh", left: "70vw", "background-image": "url('files/images/cameraMap.png')", "background-size": "30vw 35vh"},
	ScreenParent,
	`
<button class='cameraControlButton' style='top: 20vh; left: 21vw;' onclick='switchCameras(null, 0);'></button>
<button class='cameraControlButton' style='top: 20vh; left: 5vw;' onclick='switchCameras(null, 1);'></button>
<button class='cameraControlButton' style='top: 5vh; left: 21vw;' onclick='switchCameras(null, 2);'></button>
<button class='cameraControlButton' style='top: 5vh; left: 5vw;' onclick='switchCameras(null, 3);'></button>
<button class='cameraControlButton' style='top: 29vh; left: 1vw;' onclick='switchCameras(null, 4);'></button>
`
);

CameraMap.hide();

/*    GAME SCREEN     */

const Time = new Element("div", {"z-index": 5, position: "absolute", top: 0, left: "93vw"}, ScreenParent);
Time.el.classList.add("gameText");
const Night = new Element("div", {"z-index": 5, position: "absolute", top: "1.2em", left: "89vw"}, ScreenParent);
Night.el.classList.add("gameText");

const OfficeBG = new Element(
	"div",
	{"z-index": 0, width: "100vw", height: "100vh", "background-image": "url('files/images/OfficeBG.jpg')", "background-size": "100vw 100vh"},
	ScreenParent,
	`
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

//FLOWERS

const Flowers = new Element("div", {"z-index": 10, position: "absolute", top: "100vh", left: "10vw", height: "90vh", width: "80vw", "background-image": "url(files/images/Flowers.png)", "background-size": "80vw 90vh"}, OfficeBG.el);
Flowers.hide();

const FlowersToggleButton = new Element("div", {"z-index": 11, width: "25vw", height: "10vh", position: "absolute", top: "85vh", left: "71vw", "background-image": "url(files/images/cameraToggleButton.png)", "background-size": "25vw 10vh", filter: "invert(100%) sepia(10000%)"}, ScreenParent);
FlowersToggleButton.el.id = "flowersToggleButton";
FlowersToggleButton.el.setAttribute("state", "off");
FlowersToggleButton.el.onmouseenter = toggleFlowers;
FlowersToggleButton.hide();

//

const OfficeFG = new Element("div", {"z-index": 2, position: "absolute", top: 0, left: "17vw", height: "29vh", width: "48vw", "background-image": "url('files/images/OfficeFG.png')", "background-size": "48vw 29vh"}, ScreenParent);

const GameScreen = new Screen(OfficeBG, OfficeFG);

function GameLoop() {
	//Time control
	Data.time += 1;
	let time = Data.time / 3600;
	time = time < 1 ? 12 : Math.floor(time);
	Time.el.innerHTML = time + "AM";
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

// GETTING PREVIOUS DATA (if exists)

let previousNight = localStorage.getItem("FNaS_night");
if (previousNight) {
	GlobalCache.night = previousNight;
	document.getElementById("nightNumber").innerHTML = orderedNumberOf[previousNight - 1] + " NIGHT";
}
