class Element {
	constructor(tagName, properties, parent = null, innerHTML = "") {
		this.el = document.createElement(tagName);
		for (let property in properties) {
			this.el.style[property] = properties[property];
		}
		this.el.innerHTML = innerHTML;
		this.cache = {};

		console.log(this.el);

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
	}, 2000);
}

function switchScreens(toClose, toOpen) {
	toClose.hide();
	toOpen.show();
}

orderedNumberOf = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

const GlobalCache = {night: 1, stars: 0};

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
	{display: "flex", "justify-content": "center", "aligh-items": "center", "flex-direction": "column", width: "99vw", height: "99vh", "background-color": "black"},
	ScreenParent,
	`
<p class="gameLoadingScreenText">12:00 AM</p>
<p class="gameLoadingScreenText">${orderedNumberOf[GlobalCache.night - 1]} Night</p>
`
);

const GameLoadingScreen = new Screen(GameLoadingScreenBG);

//GAME SCREEN

const OfficeBG = new Element("div", {"z-index": 0, width: "99vw", height: "99vh", "background-image": "url('files/images/mainRoomBG.jpg')", "background-size": "99vw 99vh"}, ScreenParent);

const OfficeRightDoor = new Element("div", {"z-index": 99, width: "10vw", height: "90vh", position: "absolute", top: "-85vh", left: "85vw", "background-image": "files/images/OfficeDoorRight.png", "background-size": "10vw 90vh"}, OfficeBG.el, ``);

const OfficeFG = new Element("div", {opacity: 0, "z-index": 2, position: "absolute", top: 0, left: 0, height: "99vh", width: "99vw", "background-image": "url('files/images/OfficeBG.png')", "background-size": "99vw 99vh"}, ScreenParent);

const GameScreen = new Screen(OfficeBG, OfficeFG);

function GameLoop() {}
