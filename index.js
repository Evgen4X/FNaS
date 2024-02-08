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
	constructor(id, n, img, posX, posY, width, height, func = null) {
		this.id = id;
		this.n = n;
		this.image = img;
		this.x = posX;
		this.y = posY;
		this.w = width;
		this.h = height;
		this.func = func;
	}

	getElement(parent, innerHTML = "") {
		return new Element("div", {position: "absolute", top: this.y, left: this.x, width: this.w, height: this.h, "background-image": this.image, "background-size": `${this.w} ${this.h}`}, parent, innerHTML);
	}
}

class Animatronic {
	constructor(id, frames, end, jumpscareImg) {
		this.id = id;
		this.frames = frames;
		this.speed = 0;
		this.pos = 0;
		this.end = end;
		this.moved = 0;
		this.speedBuff = 0;
		this.cache = {};
		this.jumpscareImg = jumpscareImg;
	}

	setUpdateFunction(func) {
		this.updateFunc = func;
	}

	setMoveFunction(func) {
		this.moveFunc = func;
	}

	setBlockFunction(func) {
		this.isBlocked = func;
	}

	setUpdateBlockFunction(func) {
		this.canUpdate = func;
	}

	setSpeed(speed) {
		this.speed = speed;
	}

	update() {
		if (this.updateFunc) {
			this.updateFunc();
		}
		if (Math.random() < (this.speed + this.speedBuff) / 15000 && this.canUpdate()) {
			if (this.moveFunc) {
				this.moveFunc();
			}
			this.pos++;
			this.moved++;
			if (this.pos == this.end) {
				// if(this.isBlocked()){
				// this.pos = 0;
				// console.log("ARGH")
				// } else {
				// this.jumpscare();
				// this.pos = 0;
				// return;
				// }
			}
			if (this.frames[this.pos] && this.frames[this.pos].func) {
				console.log(this.pos, "!!!");
				this.frames[this.pos].func();
			}
		}
		return this.frames[this.pos];
	}

	jumpscare() {
		console.log("BOO");
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
		JumpscareScreenBG.el.style["background-image"] = this.jumpscareImg;
		JumpscareScreenBG.el.animate([{transform: "translate(6vw, 6vw)"}, {transform: "translate(-6vw, -6vw)"}, {transform: "translate(3vw, -3vw)"}, {transform: "translate(-6vw, 6vw)"}, {transform: "translate(6vw, -6vw)"}, {transform: "translate(6vw, 6vw)"}, {transform: "translate(-6vw, 6vw)"}, {transform: "translate(6vw, -6vw)"}, {transform: "translate(-6vw, -6vw)"}, {transform: "translate(-6vw, 6vw)"}, {transform: "translate(6vw, -6vw)"}, {transform: "translate(-3vw, 3vw)"}], {duration: 1000});
		JumpscareScreen.show();
		console.log(this.jumpscareImg);
		setTimeout(Lose, 1000);
	}
}

function newGame() {
	GlobalCache.night = 1;
	GlobalCache.stars = 0;
	document.getElementById("nightNumber").innerHTML = "1ST NIGHT";
	localStorage.removeItem("FNaS_night");
	localStorage.removeItem("FNaS_stars");
	play();
}

function customNightPlay() {
	switchScreens(CustomNightScreen, HomeScreen);
	console.log(Marionette.speed);
	play(true);
}

function incSpeed(how, whom, where) {
	let newSpeed = whom.speed + how;
	if (newSpeed < 0) {
		newSpeed = 21 + newSpeed;
	}
	if (newSpeed > 20) {
		newSpeed -= 21;
	}
	whom.setSpeed(newSpeed);
	where.innerHTML = newSpeed;
}

function play(customNight = false) {
	console.log(Freddy.speed);
	if (customNight) {
		document.getElementById("nightNumber").innerHTML = "Custom night";
	} else {
		document.getElementById("nightNumber").innerHTML = `${orderedNumberOf[GlobalCache.night - 1]} Night`;
	}
	switchScreens(HomeScreen, GameLoadingScreen);
	setTimeout(() => {
		switchScreens(GameLoadingScreen, GameScreen);
		GameLoop();
		CameraToggleButton.show();
		FlowersToggleButton.show();
		EnergyBar.show();
		if (customNight) {
			Night.el.innerHTML = "Custom night";
		} else {
			Night.el.innerHTML = `Night: ${GlobalCache.night}`;
		}
		EnergyLevel.show();
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
		if (Chica.cache.jumpscare == false) {
			Chica.cache.jumpscare = true;
		}
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
		if (Freddy.cache.jumpscare == false) {
			Freddy.cache.jumpscare = true;
		}
		if (Bonny.cache.jumpscare == false) {
			Bonny.cache.jumpscare = true;
		}
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
		if (Chica.cache.jumpscare == -1) {
			Chica.cache.jumpscare = false;
			setTimeout(() => {
				if (document.getElementById("doorOpenButton").getAttribute("state") == "off") {
					Chica.jumpscare();
				} else {
					showOverlay("#000");
					Chica.cache.jumpscare = null;
					Chica.pos = 0;
					ChicaImage3.hide();
				}
			}, 2000 + Math.random() * 2000);
		}
		++Data.usage;
	}
}

function windowLight() {
	let rect = document.getElementById("windowDarkRect");
	if (rect.style.opacity == 0) {
		if (Freddy.cache.jumpscare == -1) {
			Freddy.cache.jumpscare = false;
		}
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

function GFspawn(pos, img) {
	img.show();
	if (GF.cache.lastPos == pos) {
		return;
	}
	GF.cache.lastPos = pos;
	GF.cache.pos = pos;
	GF.cache.jumpscare = false;
	GF.cache.canBeShown = false;
	console.log("Ufff");
	let interval = setInterval(() => {
		if (GF.cache.jumpscare == null) {
			console.log("CLEARED");
			window.clearInterval(interval);
			img.hide();
			GF.cache.canBeShown = true;
			setTimeout(() => {
				showOverlay("#000");
			}, 100);
		}
	}, 200); //TODO: test
	setTimeout(() => {
		window.clearInterval(interval);
		if (GF.cache.jumpscare != null) {
			GF.jumpscare();
		}
	}, 2000 - 25 * GF.speed);
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

		if (Freddy.cache.jumpscare == -1) {
			Freddy.cache.jumpscare = false;
		}
		if (GF.cache.jumpscare != null && Data.cameraId != GF.cache.pos) {
			GF.cache.jumpscare = null;
		} else if (Math.random() < GF.speed / 200 && GF.cache.canBeShown) {
			GFspawn(Data.cameraId, [GFImage01, GFImage02, GFImage03, GFImage04, GFImage05][Data.cameraId]);
		}

		if (Bonny.cache.jumpscare == false && document.getElementById("windowOpenButton").getAttribute("state") == "off") {
			Bonny.cache.jumpscare = true;
		}
		if (Chica.cache.jumpscare == false && document.getElementById("doorOpenButton").getAttribute("state") == "off") {
			Chica.cache.jumpscare = true;
		}
		FlowersToggleButton.hide();
		CameraScreen.show();
		CameraScreen.el.animate([{transform: "rotateX(90deg)"}, {transform: "rotateX(0deg)"}], {duration: 333, easing: "ease-out"});
		setTimeout(() => {
			switchScreens(GameScreen, getCameraScreen(Data.cameraId));
			CameraMap.show();
			CameraRecordingCircle.show();
			if (Data.cameraId == 3) {
				if (Foxy.pos > 2) {
					let interval;
					setTimeout(() => {
						interval = setInterval(() => {
							if (!Foxy.isBlocked()) {
								Foxy.jumpscare();
							}
						}, 40);
					}, 1500);
					setTimeout(() => {
						window.clearInterval(interval);
						showOverlay("#000");
					}, 3500 + Math.random() * 1000);
				}
				adjSpeedBuff(Foxy, -Math.sqrt(Foxy.cache.lastTimeSeen) / 40);
				console.log("Cache", -Math.sqrt(Foxy.cache.lastTimeSeen) / 40, " -> ", Foxy.speedBuff);
			}
			CameraScreen.hide();
		}, 333);
	} else {
		console.log(Foxy.speedBuff);
		Data.usage--;

		if (GF.cache.jumpscare != null && GF.cache.pos != 6) {
			GF.cache.jumpscare = null;
		} else if (Math.random() < GF.speed / 200 && GF.cache.canBeShown) {
			GFspawn(-1, GFOfficeImage);
		}

		if (MarionetteReadyToGetIn == false) {
			MarionetteReadyToGetIn = true;
		}

		button.setAttribute("state", "off");
		CameraScreen.show();
		CameraScreen.el.animate([{transform: "rotateX(0deg)"}, {transform: "rotateX(90deg)"}], {duration: 333, easing: "ease-in"});
		switchScreens(getCameraScreen(Data.cameraId), GameScreen);
		CameraMap.hide();
		CameraRecordingCircle.hide();
		if (Data.cameraId == 3) {
			Foxy.cache.lastTimeSeen = 0;
		}
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
	if (Freddy.cache.jumpscare == -1) {
		Freddy.cache.jumpscare = false;
	}
	if (GF.cache.jumpscare != null && idToOpen != GF.cache.pos) {
		GF.cache.jumpscare = null;
		console.log("NULLED");
	} else if (Math.random() < GF.speed / 500 && GF.cache.canBeShown) {
		GFspawn(Data.cameraId, [GFImage01, GFImage02, GFImage03, GFImage04, GFImage05][idToOpen]);
	}
	switchScreens(getCameraScreen(idToClose), getCameraScreen(idToOpen));
}

function turnOffAll() {
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
	showOverlay("rgba(0, 0, 0, 0.5)", timeBeforeNoEnergyJumpscare + 980);
	Data.usage--;
	setTimeout(() => {
		BonnyEnergyJumpscare.show();
		BonnyEnergyJumpscare.el.animate(
			[
				{opacity: 1},
				{opacity: 1},
				{opacity: 0},
				{opacity: 0},
				{opacity: 0},
				{opacity: 1},
				{opacity: 1},
				{opacity: 1},
				{opacity: 0},
				{opacity: 0},
				{opacity: 1},
				{opacity: 1},
				{opacity: 0},
				{opacity: 0},
				{opacity: 0},
				{
					opacity: 0,
				},
			],
			{duration: timeBeforeNoEnergyJumpscare / 5, iterations: 5}
		);
	});
}

function showOverlay(color, time = 200) {
	let bgColor = Overlay.el.style["background-color"];
	Overlay.el.style["background-color"] = color;
	Overlay.show();
	Overlay.el.animate([{opacity: 1}, {opacity: 0}], {duration: 200});
	setTimeout(() => {
		Overlay.el.style["background-color"] = bgColor;
		Overlay.hide();
	}, time);
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
		switchScreens(GameScreen, VictoryScreen);
		setTimeout(() => {
			switchScreens(VictoryScreen, HomeScreen);
		}, 2000);
	}, 337);
}

function Lose() {
	localStorage.setItem("FNaS_night", GlobalCache.night);
	localStorage.setItem("FNaS_stars", GlobalCache.stars);
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
		JumpscareScreen.hide();
		switchScreens(GameScreen, HomeScreen);
		window.location.reload();
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
    <button class='homeScreenButton' onclick='switchScreens(HomeScreen, CustomNightScreen);'>Custom night</button>
	<button class='homeScreenButton' onclick='switchScreens(HomeScreen, CreditsScreen);'>Credits</button>
	<button class='homeScreenButton' onclick='window.close();'>Exit</button>
</div>
<img src="" width="50vw" height: "100vh" />
<div class='imagePreload' style='background-image: url(files/images/cameraScreen01.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/cameraScreen02.jpg);'></div>
<div class='imagePreload' style='background-image: url(files/images/cameraScreen03.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/cameraScreen04.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/cameraScreen05.jpg);'></div>
<div class='imagePreload' style='background-image: url(files/images/BonnyJumpscare.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/cameraMap.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/ChicaJumpscare.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/FoxyJumpscare.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/FreddyJumpscare.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/GFJumpscare.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/MarionetteJumpscare.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/OfficeBG.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/MarionettePhase.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/GFStill.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/GFRight.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/GFLeft.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/FreddyPos3.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/FreddyPos2.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/FreddyPos1.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/FoxyPhase2.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/ChicaPhase3.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/ChicaPhase2.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/ChicaPhase1.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/Flowers.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/cameraToggleButton.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/BonnyPhase3.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/BonnyPhase2.png);'></div>
<div class='imagePreload' style='background-image: url(files/images/BonnyPhase1.png);'></div>
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
		<tr><td class='homeScreenText' style='text-align: center;'>Adviser</td>
		<td class='homeScreenText'><button id='adviserButton' class='homeScreenButton' onclick='document.getElementById("adviserButton").animate([{"color": "red"}, {"color": "white"}], {duration: 1000});'>Zofia Sadowska</button></td></tr>
		<tr><td class='homeScreenText' style='text-align: center;'>Tester</td>
		<td class='homeScreenText'><button id='adviserButton' class='homeScreenButton' onclick='document.getElementById("adviserButton").animate([{"color": "red"}, {"color": "white"}], {duration: 1000});'>Zofia Sadowska</button></td></tr>
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

const CameraScreen01BG = new Element("div", {width: "100vw", height: "100vh", "z-index": 0, "background-image": "url(files/images/cameraScreen01.png)", "background-size": "100vw 100vh"}, ScreenParent);
const CameraScreen01 = new Screen(CameraScreen01BG);

const CameraScreen02BG = new Element("div", {width: "100vw", height: "100vh", "z-index": 0, "background-image": "url(files/images/cameraScreen02.jpg)", "background-size": "100vw 100vh"}, ScreenParent);
const CameraScreen02 = new Screen(CameraScreen02BG);

const CameraScreen03BG = new Element("div", {width: "100vw", height: "100vh", "z-index": 0, "background-image": "url(files/images/cameraScreen03.png)", "background-size": "100vw 100vh"}, ScreenParent);
const CameraScreen03 = new Screen(CameraScreen03BG);

const CameraScreen04BG = new Element("div", {width: "100vw", height: "100vh", "z-index": 0, "background-image": "url(files/images/cameraScreen04.png)", "background-size": "100vw 100vh"}, ScreenParent);

const CameraDoor04 = new Element("div", {width: "4.1vw", height: "11.5vh", "z-index": 1, "background-image": "url(files/images/cameraDoor03.png)", "background-size": "4.1vw 11.5vh", position: "absolute", top: "29.9vh", left: "35.5vw"}, CameraScreen04BG.el);

const CameraScreen04 = new Screen(CameraScreen04BG);

const CameraScreen05BG = new Element("div", {width: "100vw", height: "100vh", "z-index": 0, "background-image": "url(files/images/cameraScreen05.jpg)", "background-size": "100vw 100vh"}, ScreenParent);
const CameraScreen05 = new Screen(CameraScreen05BG);

const CameraRecordingCircle = new Element("div", {"z-index": 4, "background-color": "#f00", "border-radius": "50%", width: "4vw", height: "4vw", position: "absolute", top: "3vw", left: "3vw"}, ScreenParent);
CameraRecordingCircle.hide();
CameraRecordingCircle.el.animate([{opacity: 1}, {opacity: 1}, {opacity: 1}, {opacity: 1}, {opacity: 1}, {opacity: 0}, {opacity: 0}, {opacity: 0}, {opacity: 0}, {opacity: 0}], {duration: 1000, direction: "alternate", iterations: Infinity});

//ANIMATRONICS

function CameraDoor04Phase(width) {
	CameraDoor04.el.style.width = width;
	console.log(width);
}

function isDoorLocked() {
	return document.getElementById("doorOpenButton").getAttribute("state") == "on";
}

function adjSpeedBuff(who, how) {
	who.speedBuff += how;
}

/* FOXY */

const FoxyFrames = [
	new Frame(6660, 0, null, "0vw", "0vh", "0vw", "0vh", () => {
		CameraDoor04Phase("4.1vw");
		if (FoxyImage.el.style["background-image"]) {
			FoxyImage.el.style["background-image"] = null;
			FoxyImage.el.style.width = "0vw";
		}
		Foxy.setSpeed(Foxy.cache.speed);
		console.log(Foxy.speed);
	}),
	new Frame(6661, 1, null, "0vw", "0vh", "0vw", "0vh", () => {
		CameraDoor04Phase("3.4vw");
	}),
	new Frame(6662, 2, "url(files/images/FoxyPhase2.png)", "38vw", "30vh", "2.5vw", "2.5vh", () => {
		CameraDoor04Phase("2.8vw");
	}),
	new Frame(6663, 3, null, "0vw", "0vh", "0vw", "0vh", () => {
		CameraDoor04Phase("1.5vw");
		if (FoxyImage.el.style["background-image"]) {
			FoxyImage.el.style["background-image"] = null;
			FoxyImage.el.style.width = "0vw";
		}
	}),
];
const Foxy = new Animatronic(666, FoxyFrames, 4, "url(files/images/FoxyJumpscare.png)");
const FoxyImage = new Element("div", {}, CameraScreen04BG.el);
Foxy.cache.lastTimeSeen = 0;
Foxy.setSpeed(0);
Foxy.setBlockFunction(isDoorLocked);
Foxy.setUpdateFunction(() => {
	adjSpeedBuff(Foxy, Foxy.speedBuff < 0 ? 0.12 : 0.001);
	Foxy.cache.lastTimeSeen += 25;
});
Foxy.setMoveFunction(() => {
	adjSpeedBuff(Foxy, -1);
});
Foxy.setUpdateBlockFunction(() => {
	return document.getElementById("cameraToggleButton").getAttribute("state") == "off" || Data.cameraId != 3;
});

/* MARIONETTE */

const MarionetteFrames = [
	new Frame(11, 0, null, "0vw", "0vh", "0vw", "0vh", () => {
		if (MarionetteImage.el.style["background-image"]) {
			MarionetteImage.el.style["background-image"] = null;
			MarionetteImage.el.style.width = "0vw";
		}
	}),
	new Frame(12, 1, null, "0vw", "0vh", "0vw", "0vh", null),
	new Frame(13, 2, null, "0vw", "0vh", "0vw", "0vh", null),
	new Frame(14, 3, null, "0vw", "0vh", "0vw", "0vh", () => {
		if (MarionetteImage.el.style["background-image"]) {
			MarionetteImage.el.style["background-image"] = null;
			MarionetteImage.el.style.width = "0vw";
		}
		MarionetteReadyToGetIn = false;
		console.log("Waiting...");
		let interval = setInterval(() => {
			if (MarionetteReadyToGetIn) {
				MarionetteOfficeImage.show();
				Marionette.pos = -1;
				setTimeout(() => {
					let newInterval = setInterval(() => {
						if (FlowersToggleButton.el.getAttribute("state") == "off") {
							Marionette.jumpscare();
							window.clearInterval(newInterval);
						}
					}, 300);
					setTimeout(() => {
						window.clearInterval(newInterval);
						showOverlay("#000");
						Marionette.pos = 0;
						MarionetteOfficeImage.hide();
						document.getElementById("holdToChargeButton").style["font-size"] = "xx-large";
						document.getElementById("holdToChargeButton").innerHTML = "HOLD TO CHARGE";
						let button = MarionetteChargeButton.el;
						button.style.width = "15vw";
						button.onmousedown = () => {
							Marionette.cache.held = true;
						};
						button.onmouseup = () => {
							Marionette.cache.held = false;
						};
						button.style["background-color"] = "#555";
						Marionette.cache.charge = 1000;
						MarionetteReadyToGetIn = null;
					}, Math.random() * 5000 + 3000);
				}, 1000 - Marionette.speed * 10);
				window.clearInterval(interval);
			}
		}, 25);
	}),
];

const Marionette = new Animatronic(1, MarionetteFrames, 4, "url(files/images/MarionetteJumpscare.png)");
var MarionetteReadyToGetIn = null;
const MarionetteImage = new Element("div", {}, CameraScreen05BG.el);
Marionette.cache.charge = 1000;
Marionette.setSpeed(0);
Marionette.setUpdateBlockFunction(() => {
	return Marionette.cache.charge / 1000 > Math.random();
});

function MarionetteChargeButtonSetSize(level) {
	if (level <= 5) {
		document.getElementById("holdToChargeButton").style["font-size"] = "xx-large";
		document.getElementById("holdToChargeButton").innerHTML = "FAREWELL";
		let button = MarionetteChargeButton.el;
		button.style.width = "15vw";
		button.onmousedown = null;
		button.onmouseup = null;
		button.style["background-color"] = "#333";
		if (MarionetteReadyToGetIn == null) {
			MarionetteReadyToGetIn = false;
			setTimeout(() => {
				Marionette.pos = 3;
				Marionette.frames[3].func();
			}, Math.random() * 10000 + 5000);
		}
	} else if (level < 300) {
		document.getElementById("holdToChargeButton").style["font-size"] = "x-small";
	} else if (level < 400) {
		document.getElementById("holdToChargeButton").style["font-size"] = "small";
	} else if (level < 600) {
		document.getElementById("holdToChargeButton").style["font-size"] = "medium";
	} else if (level < 800) {
		document.getElementById("holdToChargeButton").style["font-size"] = "large";
	} else if (level < 990) {
		document.getElementById("holdToChargeButton").style["font-size"] = "x-large";
	} else {
		document.getElementById("holdToChargeButton").style["font-size"] = "xx-large";
	}
}

const MarionetteChargeButton = new Element(
	"div",
	{position: "absolute", width: "15vw", height: "5vh", "z-index": 2, top: "70vh", left: "40vw", "background-color": "#666", border: "0.5vw solid white"},
	CameraScreen05BG.el,
	`
<div class='gameText' id='holdToChargeButton'>HOLD TO CHARGE</div>
`
);
MarionetteChargeButton.el.onmousedown = () => {
	Marionette.cache.held = true;
};
MarionetteChargeButton.el.onmouseup = () => {
	Marionette.cache.held = false;
};

/* BONNY */

const BonnyFrames = [
	new Frame(91, 0, null, "0vw", "0vh", "0vw", "0vh", () => {
		if (BonnyImage.el.style["background-image"]) {
			BonnyImage.el.style["background-image"] = null;
			BonnyImage.el.style.width = "0vw";
		}
	}),
	new Frame(91, 1, "url(files/images/BonnyPhase1.png)", "17.5vw", "25vh", "10vw", "10vh", null),
	new Frame(91, 2, "url(files/images/BonnyPhase2.png)", "75vw", "6vh", "10vw", "10vh", () => {
		if (BonnyImage03.el.style["background-image"]) {
			BonnyImage03.el.style["background-image"] = null;
			BonnyImage03.el.style.width = "0vw";
		}
	}),
	new Frame(91, 3, "url(files/images/BonnyPhase3.png)", "16vw", "27vh", "10vw", "10vh", () => {
		if (BonnyImage01.el.style["background-image"]) {
			BonnyImage01.el.style["background-image"] = null;
			BonnyImage01.el.style.width = "0vw";
		}
		BonnyImage.show();
		Bonny.cache.jumpscare = -1;
		let interval = setInterval(() => {
			if (Bonny.cache.jumpscare == true) {
				Bonny.jumpscare();
				window.clearInterval(interval);
			}
		}, 300);
		setTimeout(() => {
			if (document.getElementById("windowOpenButton").getAttribute("state") == "off") {
				Bonny.jumpscare();
			} else {
				showOverlay("#000");
				Bonny.cache.jumpscare = null;
				window.clearInterval(interval);
				Bonny.pos = 0;
				BonnyImage.hide();
			}
		}, 2000 + Math.random() * 2000);
	}),
	new Frame(91, 4, null, "0vw", "0vh", "0vw", "0vh", () => {
		if (BonnyImage.el.style["background-image"]) {
			BonnyImage.el.style["background-image"] = null;
			BonnyImage.el.style.width = "0vw";
		}
	}),
];

const Bonny = new Animatronic(9, BonnyFrames, 4, "url(files/images/BonnyJumpscare.png)");
Bonny.setSpeed(0);
Bonny.setUpdateBlockFunction(() => {
	switch (Bonny.pos) {
		case 1:
			return document.getElementById("cameraToggleButton").getAttribute("state") == "off" || (Data.cameraId != 2 && Data.cameraId != 0);
		case 2:
			return document.getElementById("cameraToggleButton").getAttribute("state") == "off" || Data.cameraId != 0;
		case 3:
			return document.getElementById("cameraToggleButton").getAttribute("state") == "on";
		default:
			return true;
	}
});

/* CHICA */

const ChicaFrames = [
	new Frame(91, 0, null, "0vw", "0vh", "0vw", "0vh", () => {
		if (ChicaImage3.el.style.display != "none") {
			ChicaImage3.hide();
		}
	}),
	new Frame(91, 1, "url(files/images/ChicaPhase1.png)", "50vw", "40vh", "5vw", "5vh", null),
	new Frame(91, 2, "url(files/images/ChicaPhase2.png)", "75vw", "6vh", "10vw", "10vh", () => {
		if (ChicaImage1.el.style.display != "none") {
			ChicaImage1.hide();
		}
		ChicaImage2.show();
	}),
	new Frame(91, 3, "url(files/images/ChicaPhase3.png)", "55vw", "40vh", "10vw", "10vh", () => {
		if (ChicaImage2.el.style.display != "none") {
			ChicaImage2.hide();
		}
		ChicaImage3.show();
		Chica.cache.jumpscare = -1;
		let interval = setInterval(() => {
			if (Chica.cache.jumpscare == true) {
				Chica.jumpscare();
				window.clearInterval(interval);
			}
		}, 300);
	}),
	new Frame(91, 4, null, "0vw", "0vh", "0vw", "0vh", () => {
		if (ChicaImage3.el.style.display != "none") {
			ChicaImage3.hide();
		}
	}),
];

const Chica = new Animatronic(5, ChicaFrames, 4, "url(files/images/ChicaJumpscare.png)");
Chica.cache.jumpscare = null;
Chica.setSpeed(0);
Chica.setUpdateBlockFunction(() => {
	return document.getElementById("doorDarkRect").style.opacity != "0" || CameraToggleButton.el.getAttribute("state") == "on";
});

/* FREDDY */

const FreddyFrames = [
	new Frame(70, 0, null, "0vw", "0vh", "0vw", "0vh", () => {
		FreddyImage.hide();
		console.log("A!");
	}),

	new Frame(71, 1, "url(files/images/FreddyPos1.png)", "60vw", "20vh", "10vw", "20vh", () => {
		FreddyImage01.show();
		console.log("A#");
	}),
	new Frame(72, 2, "url(files/images/FreddyPos2.png)", "20vw", "10vh", "10vw", "30vh", () => {
		FreddyImage01.hide();
		FreddyImage02.show();
		console.log("A'");
	}),
	new Frame(73, 3, "url(files/images/FreddyPos2.png)", "85vw", "20vh", "10vw", "30vh", () => {
		console.log("A*");
		FreddyImage02.hide();
		FreddyImage03.show();
	}),
	new Frame(74, 4, null, "0vw", "0vh", "0vw", "0vh", () => {
		FreddyImage03.hide();
		FreddyImage.show();
		Freddy.cache.jumpscare = -1;
		let done = false;
		let interval = setInterval(() => {
			if (!done && Freddy.cache.jumpscare == false) {
				setTimeout(() => {
					FreddyImage.hide();
					Freddy.pos = 0;
					if (document.getElementById("windowOpenButton").getAttribute("state") == "off") {
						Freddy.jumpscare();
					}
					window.clearInterval(interval);
					showOverlay("#000");
				}, Math.random() * 1000 + 2000 - 5 * Freddy.speed);
				done = true;
			}
			if (Freddy.cache.jumpscare == true) {
				Freddy.jumpscare();
				window.clearInterval(interval);
			}
		}, 300);
	}),
];

const Freddy = new Animatronic(7, FreddyFrames, 4, "url(files/images/FreddyJumpscare.png)", null, null, null);
Freddy.setSpeed(0);
Freddy.setUpdateBlockFunction(() => {
	switch (Freddy.pos) {
		case 0:
			return document.getElementById("cameraToggleButton").getAttribute("state") == "off" || Data.cameraId != 3;
		case 1:
			return document.getElementById("cameraToggleButton").getAttribute("state") == "off" || (Data.cameraId != 3 && Data.cameraId != 1);
		case 2:
			return document.getElementById("cameraToggleButton").getAttribute("state") == "off" || (Data.cameraId != 1 && Data.cameraId != 0);
		case 3:
			return (document.getElementById("cameraToggleButton").getAttribute("state") == "off" && document.getElementById("doorDarkRect").style.opacity == 1) || Data.cameraId != 0;
		default:
			return true;
	}
});

/* GOLDEN FREDDY */

const GF = new Animatronic(5, null, null, "url(files/images/GFJumpscare.png)");
GF.setSpeed(0);
GF.cache.canBeShown = true;

//JUMPSCARE SCREEN

const JumpscareScreenBG = new Element("div", {position: "absolute", width: "100vw", height: "100vh", "z-index": 999, "background-repeat": "no-repeat", "background-position": "center", "background-size": "100vh 100vh"}, ScreenParent);

const JumpscareScreen = new Screen(JumpscareScreenBG);

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
	
	<div id="doorBGRect" style="position: absolute; z-index: 1; background-image: url('files/images/OfficeDoorBG.jpg'); background-size: 23vw 47vh; opacity: 1; top: 30vh; left: 42vw; width: 23vw; height: 47vh;" onclick="doorLight()";></div>
	<div class="gameDarkRect" id="doorDarkRect" style="z-index: 3; opacity: 1; top: 30vh; left: 42vw; width: 23vw; height: 47vh;" onclick="doorLight()";></div>
	<div class="gameDarkRect" id="windowDarkRect" style="z-index: 3; opacity: 1; top: 23vh; left: 17vw; width: 11vw; height: 30vh;" onclick="windowLight()";></div>
	`
);

/*ADDING BONNY IMAGE*/
const BonnyImage03 = new Element("div", {position: "absolute", top: "10vh", left: "10vw", width: "10vw", height: "10vh", "z-index": 2}, CameraScreen03BG.el);
const BonnyImage01 = new Element("div", {position: "absolute", top: "10vh", left: "10vw", width: "10vw", height: "10vh", "z-index": 2}, CameraScreen01BG.el);
const BonnyImage = new Element("div", {position: "absolute", top: "34vh", left: "17vw", width: "11vw", height: "30vh", "z-index": 2}, OfficeBG.el);
BonnyImage03.hide();
BonnyImage01.hide();
BonnyImage.hide();

/*ADDING CHICA IMAGE*/
const ChicaImage1 = new Element("div", {display: "block", position: "absolute", top: "10vh", left: "10vw", width: "10vw", height: "10vh", "z-index": 2, "background-image": "url(files/images/ChicaPhase1.png)", "background-size": "10vw 10vh"}, OfficeBG.el);
const ChicaImage2 = new Element("div", {display: "block", position: "absolute", top: "50vh", left: "50vw", width: "10vw", height: "10vh", "z-index": 2, "background-image": "url(files/images/ChicaPhase2.png)", "background-size": "10vw 10vh"}, OfficeBG.el);
const ChicaImage3 = new Element("div", {display: "block", position: "absolute", top: "30vh", left: "42vw", width: "10vw", height: "30vh", "z-index": 2, "background-image": "url(files/images/ChicaPhase3.png)", "background-size": "10vw 30vh"}, OfficeBG.el);
ChicaImage1.hide();
ChicaImage2.hide();
ChicaImage3.hide();

/*ADDING MARIONETTE IMAGE*/
const MarionetteOfficeImage = new Element("div", {position: "absolute", top: "10vh", left: "40vw", width: "30vw", height: "70vh", "background-image": "url(files/images/MarionettePhase.png)", "background-size": "30vw 70vh", "z-index": 5}, OfficeBG.el);
MarionetteOfficeImage.hide();

/*ADDING FREDDY IMAGE*/
const FreddyImage01 = new Element("div", {position: "absolute", top: "20vh", left: "60vw", height: "20vh", width: "10vw", "background-image": "url(files/images/FreddyPos1.png)", "background-size": "10vw 20vh"}, CameraScreen04BG.el);
const FreddyImage02 = new Element("div", {position: "absolute", top: "20vh", left: "40vw", height: "30vh", width: "10vw", "background-image": "url(files/images/FreddyPos2.png)", "background-size": "10vw 30vh"}, CameraScreen02BG.el);
const FreddyImage03 = new Element("div", {position: "absolute", top: "20vh", left: "85vw", height: "30vh", width: "10vw", "background-image": "url(files/images/FreddyPos1.png)", "background-size": "10vw 30vh"}, CameraScreen01BG.el);
const FreddyImage = new Element("div", {position: "absolute", top: "34vh", left: "17vw", width: "11vw", height: "10vh", "z-index": 2, "background-image": "url(files/images/FreddyPos3.png)", "background-size": "11vw 10vh"}, OfficeBG.el);
FreddyImage01.hide();
FreddyImage02.hide();
FreddyImage03.hide();
FreddyImage.hide();

/*ADDING GOLDEN FREDDY IMAGE*/
const GFOfficeImage = new Element("div", {position: "absolute", top: "20vh", left: "70vw", width: "30vw", height: "50vh", "background-image": "url(files/images/GFStill.png)", "background-size": "30vw 50vh"}, OfficeBG.el);
const GFImage01 = new Element("div", {position: "absolute", top: "30vh", left: "5vw", width: "20vw", height: "30vh", "background-image": "url(files/images/GFLeft.png)", "background-size": "20vw 30vh"}, CameraScreen01BG.el);
const GFImage02 = new Element("div", {position: "absolute", top: "30vh", left: "70vw", width: "20vw", height: "40vh", "background-image": "url(files/images/GFRight.png)", "background-size": "20vw 40vh"}, CameraScreen02BG.el);
const GFImage03 = new Element("div", {position: "absolute", top: "20vh", left: "0vw", width: "20vw", height: "40vh", "background-image": "url(files/images/GFStill.png)", "background-size": "20vw 40vh"}, CameraScreen03BG.el);
const GFImage04 = new Element("div", {position: "absolute", top: "25vh", left: "40vw", width: "7vw", height: "20vh", "background-image": "url(files/images/GFStill.png)", "background-size": "7vw 20vh"}, CameraScreen04BG.el);
const GFImage05 = new Element("div", {position: "absolute", top: "17vh", left: "50vw", width: "10vw", height: "30vh", "background-image": "url(files/images/GFStill.png)", "background-size": "10vw 30vh"}, CameraScreen05BG.el);
GFOfficeImage.hide();
GFImage01.hide();
GFImage02.hide();
GFImage03.hide();
GFImage04.hide();
GFImage05.hide();

const OfficeWindowView = new Element("div", {"z-index": 0, position: "absolute", top: "23vh", left: "17vw", width: "11vw", height: "30vh", "background-image": "url(files/images/OfficeWindowView.jpg)", "background-size": "11vw 30vh"}, OfficeBG.el);
OfficeWindowView.el.id = "officeWindowVeiw";

const OfficeDoor = new Element("div", {"z-index": 4, width: "23vw", height: "47vh", position: "absolute", top: "-20vh", left: "42vw", "background-image": "url(files/images/OfficeDoor.jpg)", "background-size": "23vw 45vh"}, OfficeBG.el, ``);
OfficeDoor.el.id = "officeDoor";

const OfficeWindow = new Element("div", {"z-index": 4, width: "11vw", height: "30vh", position: "absolute", top: "-7vh", left: "17vw", "background-image": "url(files/images/OfficeDoor.jpg)", "background-size": "11vw 30vh"}, OfficeBG.el, ``);
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

/*FLOWERS*/

const Flowers = new Element("div", {"z-index": 10, position: "absolute", top: "100vh", left: "10vw", height: "90vh", width: "80vw", "background-image": "url(files/images/Flowers.png)", "background-size": "80vw 90vh"}, OfficeBG.el);
Flowers.hide();

const FlowersToggleButton = new Element("div", {"z-index": 11, width: "25vw", height: "10vh", position: "absolute", top: "85vh", left: "71vw", "background-image": "url(files/images/cameraToggleButton.png)", "background-size": "25vw 10vh", filter: "invert(100%) sepia(10000%)"}, ScreenParent);
FlowersToggleButton.el.id = "flowersToggleButton";
FlowersToggleButton.el.setAttribute("state", "off");
FlowersToggleButton.el.onmouseenter = toggleFlowers;
FlowersToggleButton.hide();

const OfficeFG = new Element("div", {"z-index": 4, position: "absolute", top: 0, left: "17vw", height: "29vh", width: "48vw", "background-image": "url('files/images/OfficeFG.png')", "background-size": "48vw 29vh"}, ScreenParent);

const GameScreen = new Screen(OfficeBG, OfficeFG);

// CUSTOM NIGHT SCREEN
const CustomNightBG = new Element(
	"div",
	{position: "absolute", top: 0, left: 0, height: "100vh", width: "100vw", "background-image": "url(files/images/cameraGlitch.jpg)"},
	ScreenParent,
	`
<div id='customNightContainer'>
	<div class='customNightHolder'>
		<div class='animatronicImage' style='background-image: url(files/images/BonnyJumpscare.png);'></div>
		<div class='triangleUp' onclick='incSpeed(1, Bonny, document.getElementById("CNSpeedBonny"));'></div>
		<div id='CNSpeedBonny' style='color: white; font-size: min(4vh, 2vw);'>0</div>
		<div class='triangleDown' onclick='incSpeed(-1, Bonny, document.getElementById("CNSpeedBonny"));'></div>
		<input value='0' type='number' id='bonnySpeed' min='0' max='20' onchange='Bonny.setSpeed(parseInt(document.getElementById("bonnySpeed").value))'>
	</div>
	<div class='customNightHolder'>
		<div class='animatronicImage' style='background-image: url(files/images/FoxyJumpscare.png);'></div>
		<div class='triangleUp' onclick='incSpeed(1, Foxy, document.getElementById("CNSpeedFoxy"));'></div>
		<div id='CNSpeedFoxy' style='color: white; font-size: min(4vh, 2vw);'>0</div>
		<div class='triangleDown' onclick='incSpeed(-1, Foxy, document.getElementById("CNSpeedFoxy"));'></div>
		<input value='0' type='number' id='foxySpeed' min='0' max='20' onchange='Foxy.setSpeed(parseInt(document.getElementById("foxySpeed").value))'>
	</div>
	<div class='customNightHolder'>
		<div class='animatronicImage' style='background-image: url(files/images/MarionetteJumpscare.png);'></div>
		<div class='triangleUp' onclick='incSpeed(1, Marionette, document.getElementById("CNSpeedMarionette"));'></div>
		<div id='CNSpeedMarionette' style='color: white; font-size: min(4vh, 2vw);'>0</div>
		<div class='triangleDown' onclick='incSpeed(-1, Marionette, document.getElementById("CNSpeedMarionette"));'></div>
		<input value='0' type='number' id='marionetteSpeed' min='0' max='20' onchange='Marionette.setSpeed(parseInt(document.getElementById("marionetteSpeed").value))'>
	</div>
	<div class='customNightHolder'>
		<div class='animatronicImage' style='background-image: url(files/images/ChicaJumpscare.png);'></div>
		<div class='triangleUp' onclick='incSpeed(1, Chica, document.getElementById("CNSpeedChica"));'></div>
		<div id='CNSpeedChica' style='color: white; font-size: min(4vh, 2vw);'>0</div>
		<div class='triangleDown' onclick='incSpeed(-1, Chica, document.getElementById("CNSpeedChica"));'></div>
		<input value='0' type='number' id='chicaSpeed' min='0' max='20' onchange='Chica.setSpeed(parseInt(document.getElementById("chicaSpeed").value))'>
	</div>
	<div class='customNightHolder'>
		<div class='animatronicImage' style='background-image: url(files/images/FreddyJumpscare.png);'></div>
		<div class='triangleUp' onclick='incSpeed(1, Freddy, document.getElementById("CNSpeedFreddy"));'></div>
		<div id='CNSpeedFreddy' style='color: white; font-size: min(4vh, 2vw);'>0</div>
		<div class='triangleDown' onclick='incSpeed(-1, Freddy, document.getElementById("CNSpeedFreddy"));'></div>
		<input value='0' type='number' id='freddySpeed' min='0' max='20' onchange='Freddy.setSpeed(parseInt(document.getElementById("freddySpeed").value))'>
	</div>
	<div class='customNightHolder'>
		<div class='animatronicImage' style='background-image: url(files/images/GFJumpscare.png);'></div>
		<div class='triangleUp' onclick='incSpeed(1, GF, document.getElementById("CNSpeedGF"));'></div>
		<div id='CNSpeedGF' style='color: white; font-size: min(4vh, 2vw);'>0</div>
		<div class='triangleDown' onclick='incSpeed(-1, GF, document.getElementById("CNSpeedGF"));'></div>
		<input value='0' type='number' id='gfSpeed' min='0' max='20' onchange='GF.setSpeed(parseInt(document.getElementById("gfSpeed").value))'>
	</div>
</div>
<div style='display: flex; justify-content: space-around; align-items: space-around'>
	<button style='display: block; text-align: center;' class='homeScreenButton' onclick='customNightPlay()'>Play</button>
	<button style='display: block; text-align: center;' class='homeScreenButton' onclick='switchScreens(CustomNightScreen, HomeScreen);'>Back</button>
</div>
`
);

const CustomNightScreen = new Screen(CustomNightBG);

//GLOBAL OVERLAY

const Overlay = new Element("div", {position: "absolute", top: 0, left: 0, width: "100vw", height: "99vh", "z-index": 999}, ScreenParent);
Overlay.hide();

const BonnyEnergyJumpscare = new Element("div", {position: "absolute", top: "30vh", left: "18vw", width: "8vw", height: "8vw", "z-index": 5, "background-image": "url(files/images/BonnyEnergyJumpscare.png", "background-size": "8vw 8vw"}, OfficeBG.el);
BonnyEnergyJumpscare.hide();

let turnedOffAll = false;
let timeBeforeNoEnergyJumpscare = Math.random() * 15000 + 5000;
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
	if (Data.energy <= 0) {
		EnergyLevel.el.innerHTML = "No power left";
		if (!turnedOffAll) {
			turnOffAll();
			turnedOffAll = true;
			setTimeout(() => {
				BonnyEnergyJumpscare.hide();
				Bonny.jumpscare();
			}, timeBeforeNoEnergyJumpscare);
		}
	}

	MarionetteChargeButton.el.style.width = Math.round(Marionette.cache.charge) / 50 + "vw";

	//Animatronics cotrol

	if (Bonny.speed != 0) {
		let frame = Bonny.update();
		if (Bonny.moved > 0) {
			console.log("M");
			Bonny.moved--;
			if (frame && frame.image) {
				let parent = null;
				if (Bonny.pos == 1) {
					parent = BonnyImage03;
				} else if (Bonny.pos == 2) {
					parent = BonnyImage01;
				} else if (Bonny.pos == 3) {
					parent = BonnyImage;
				}
				if (parent) {
					for (let property in frame.getElement().el.style) {
						parent.el.style[property] = frame.getElement().el.style[property];
					}
					parent.el.style["z-index"] = 1;
				}
			}
		}
	}

	if (Chica.speed != 0) {
		let frame = Chica.update();
		if (Chica.moved > 0) {
			console.log("C");
			Chica.moved--;
			if (frame && frame.image) {
				let parent = null;
				if (Chica.pos == 1) {
					parent = ChicaImage1;
				} else if (Bonny.pos == 2) {
					parent = ChicaImage2;
				} else if (Bonny.pos == 3) {
					parent = ChicaImage3;
				} else {
					parent = null;
				}
				if (parent) {
					for (let property in frame.getElement().el.style) {
						parent.el.style[property] = frame.getElement().el.style[property];
					}
					parent.show();
					parent.el.style["z-index"] = 1;
				}
			}
		}
	}

	if (Marionette.speed != 0) {
		Marionette.update();
		if (Marionette.cache.held) {
			Marionette.cache.charge += 8;
			Marionette.cache.charge = Math.min(Marionette.cache.charge, 1000);
		} else {
			Marionette.cache.charge -= (Marionette.speed + 10) / 15;
			Marionette.cache.charge = Math.max(Marionette.cache.charge, 0);
		}
		MarionetteChargeButtonSetSize(Marionette.cache.charge);
	}

	if (Foxy.speed != 0) {
		let frame = Foxy.update();
		if (Foxy.moved > 0) {
			Foxy.moved--;
			if (frame && frame.image) {
				for (let property in frame.getElement().el.style) {
					FoxyImage.el.style[property] = frame.getElement().el.style[property];
				}
			}
		}
	}

	if (Freddy.speed != 0) {
		let frame = Freddy.update();
		if (Freddy.moved > 0) {
			console.log("C");
			Freddy.moved--;
			if (frame && frame.image) {
				let parent = null;
				if (Freddy.pos == 1) {
					parent = FreddyImage01;
				} else if (Freddy.pos == 2) {
					parent = FreddyImage02;
				} else if (Bonny.pos == 3) {
					parent = FreddyImage;
				} else {
					parent = null;
				}
				if (parent) {
					for (let property in frame.getElement().el.style) {
						parent.el.style[property] = frame.getElement().el.style[property];
					}
					parent.show();
					parent.el.style["z-index"] = 1;
				}
			}
		}
	}

	setTimeout(GameLoop, 25); //40 fps
}

// GETTING PREVIOUS DATA (if exists)

let previousNight = localStorage.getItem("FNaS_night");
if (previousNight) {
	GlobalCache.night = previousNight;
	document.getElementById("nightNumber").innerHTML = orderedNumberOf[previousNight - 1] + " NIGHT";
}
