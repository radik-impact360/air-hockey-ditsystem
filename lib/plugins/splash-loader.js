ig.module('plugins.splash-loader').requires('impact.loader', 'impact.animation').defines(function() {
	ig.SplashLoader = ig.Loader.extend({
		splashDesktop: new ig.Image('media/graphics/splash/desktop/cover.jpg'),
		splashMobile: new ig.Image('media/graphics/splash/desktop/cover.jpg'),
		loading: new ig.Image('media/graphics/splash/loading.png'),
		loadingBg: new ig.Image('media/graphics/splash/loading-bg.png'),
		desktopCoverDIVID: "play-desktop",
		init: function(gameClass, resources) {
			this.parent(gameClass, resources);
			// ADS
			ig.apiHandler.run("MJSPreroll");
		},
		end: function() {
			this.parent();
			this._drawStatus = 1;

			if (_SETTINGS['TapToStartAudioUnlock']['Enabled']) {
				this.tapToStartDiv(function() {
					/* play game */
					ig.system.setGame(MyGame);
				}.bind(this));
			} else {
				/* play game */
				ig.system.setGame(MyGame);
			}

			this.draw();			
		},
		tapToStartDiv: function(onClickCallbackFunction) {
			/* create DIV */
			this.desktopCoverDIV = document.createElement("div");
			this.desktopCoverDIV.id = this.desktopCoverDIVID;
			this.desktopCoverDIV.setAttribute("class", "play");
			this.desktopCoverDIV.setAttribute("style", "position: absolute; display: block; z-index: 999999; background-color: rgba(23, 32, 53, 0.7); visibility: visible; font-size: 10vmin; text-align: center; vertical-align: middle; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;");
			this.desktopCoverDIV.innerHTML = "<div style='color:white;background-color: rgba(255, 255, 255, 0.3); border: 2px solid #fff; font-size:20px; border-radius: 5px; position: relative; float: left; top: 50%; left: 50%; transform: translate(-50%, -50%);'><div style='padding:20px 50px; font-family: Arial;'>" + _STRINGS["Splash"]["TapToStart"] + "</div></div>";
			/* inject DIV */
			var parentDIV = document.getElementById("play").parentNode || document.getElementById("ajaxbar");
			parentDIV.appendChild(this.desktopCoverDIV);
			/* reize DIV */
			try {
				if(typeof(ig.sizeHandler) !== "undefined") {
					if(typeof(ig.sizeHandler.coreDivsToResize) !== "undefined") {
						ig.sizeHandler.coreDivsToResize.push(("#" + this.desktopCoverDIVID));
						if(typeof(ig.sizeHandler.reorient) === "function") {
							ig.sizeHandler.reorient();
						}
					}
				} else if(typeof(coreDivsToResize) !== "undefined") {
					coreDivsToResize.push(this.desktopCoverDIVID);
					if(typeof(sizeHandler) === "function") {
						sizeHandler();
					}
				}
			} catch(error) {
				console.log(error);
			}
			
			/* click DIV */
			this.desktopCoverDIV.addEventListener("click", function() {
				ig.soundHandler.unlockWebAudio();

				/* hide DIV */
				this.desktopCoverDIV.setAttribute("style", "visibility: hidden;");

				/* end function */
				if (typeof(onClickCallbackFunction) === "function") {
					onClickCallbackFunction();
				}
			}.bind(this));

		},
		draw: function() {
			this._drawStatus += (this.status - this._drawStatus) / 5;
			// DELAY WHEN DRAWING ON splash-loader.js
			if(this._drawStatus < 0.2) return;
			// CLEAR RECTANGLE
			ig.system.context.fillStyle = '#000';
			ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
			var s = ig.system.scale;
			// DIMENSIONS OF LOADING BAR
			var w, h, x, y;
			if(ig.ua.mobile) {
				// CUSTOM POSITIONS (TRIAL & ERROR)
				w = this.loading.width;
				h = this.loading.height;
				x = ig.system.width * 0.5 - w / 2;
				y = ig.system.height * 7 / 10 - h / 2;
				this.splashMobile.draw(0, 0);
			} else {
				// CUSTOM POSITIONS (TRIAL & ERROR)
				w = this.loading.width;
				h = this.loading.height;
				x = ig.system.width * 0.5 - w / 2;
				y = ig.system.height * 7 / 10 - h / 2;
				this.splashDesktop.draw(0, 0);
			}
			this.loadingBg.draw(x, y);
			this.loading.draw(x, y, 0, 0, w * this._drawStatus, h);
			// POSITION LOADING TEXT
			var xpos, ypos;
			if(ig.ua.mobile) { // MOBILE
				xpos = ig.system.width / 2;
				ypos = ig.system.height * 13 / 20;
			} else { // DESKTOP
				xpos = ig.system.width / 2;
				ypos = ig.system.height * 13 / 20;
			}
			ig.system.context.font = "40px sf-collegiate-solid";
			ig.system.context.fillStyle = '#CC3366';
			ig.system.context.textAlign = "center";
			ig.system.context.textBaseline = "middle";
			ig.system.context.fillText(_STRINGS.Splash.Loading, xpos, ypos);
		}
	});
});
