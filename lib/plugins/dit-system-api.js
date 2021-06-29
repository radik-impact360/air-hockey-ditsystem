ig.module("plugins.dit-system-api").requires("impact.impact", "impact.entity", "impact.game").defines(function() {
    
    //console.log(ig.Game);

    ig.Game.inject({
        api:null,
        gameStart:false,
        startTime:null,
        endTime:null,
        gameStartInit:function() {
            console.log('Game Start Init');
            this.startTime = ig.system.clock.delta();
        },
    	update:function() {
    		this.parent();
    	    
    	    if(this.api == null) {
    	    	console.log('test');
    	    	this.api = new DitSystemApi();
    	    }
    	}
    }) // create API for integration
    
    DitSystemApi = ig.Class.extend({
        token: null,
        url: "",
        
        init: function() {
        	this.initGA();
            this.token = this.getParameterByName("token");
            this.url = this.getParameterByName("scoreEndpoint");
            this.locale = this.getParameterByName("locale");
            this.t = this.getParameterByName("t");
            //console.log(this.token);
            console.log(this.url);
            //this.l = "b38cc25dec9dfe0e7b9ee67556d79614" //blowfish encryption
        },
        getParameterByName: function(b, c) {
            c ||
                (c = window.location.href);
            b = b.replace(/[\[\]]/g, "\\$&");
            var d = RegExp("[?&]" + b + "(=([^&#]*)|&|#|$)").exec(c);
            return !d ? null : !d[2] ? "" : decodeURIComponent(d[2].replace(/\+/g, " "))
        },

        initGA: function () {
                /* <!-- Global site tag (gtag.js) - Google Analytics --> */
                (function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {
                        return;
                    }
                    var gID = 'UA-155551211-3';
                    var gURL = "https://www.googletagmanager.com/gtag/js?id=" + gID;
                    js = d.createElement(s);
                    js.id = id;
                    js.src = gURL;
                    js.async = true;
                    js.onload = function () {
                        js.onload = null;
                        window.dataLayer = window.dataLayer || [];
                        function gtag() {
                            dataLayer.push(arguments);
                        }
                        gtag('js', new Date());
                        gtag('config', gID);
                    }.bind(this)
                    fjs.parentNode.insertBefore(js, fjs);
                }.bind(this)(document, 'script', 'gtag'));
         },

        newTime: 0,
        score: 0,
        resubmitData:function() {
            console.log('resubmit', this.url);

            this.popupOverlay();

            $.ajax({
                type: "GET",
                url: this.url, //taken from URL parameter
                data: {
                    token: this.token,
                    score: this.score,
                    locale: this.locale,
                    gameTime: this.newTime
                },
                success: function(result,status,xhr) {
                    //console.log(xhr);
                    var json = xhr.responseJSON;
					if(json === undefined){
                        json = JSON.parse(xhr.responseText);
                    }
                    console.log(json);

                    if(!json) return;
                    

                    if(json.code == 0) {
                        if(json.token) {
                            this.token = json.token; //update user's token/session after score submission
                            this.hideDivs();     
                        } else {
                            console.log('missing token response');
                        }
                        
                    } else {
                        if(json.description) {
                                console.log(json.description);
                                   //errors regarding cheating/used token, etc. (disable okay button)
                                   this.popupOverlayInnerHTML(json.description);
                        }
                    }
                    //console.log(this.token);

                }.bind(this),
                error: function(result,status,xhr) {
                    //network connection issues, enable "Okay" button
                    this.popupOverlayInnerHTML("The server is unavailable to load, please try again later.");
                    this.okayButtton();
                    
                }.bind(this)
            });
        },
        submitData: function(b) {
            this.score = b;
            ig.game.endTime = ig.system.clock.delta();
        	//b = score
            this.newTime = ig.game.endTime - ig.game.startTime;
            this.newTime = Math.round(this.newTime);

            if(this.t) {
                    console.log("gameTime: ",this.newTime);
            }
            
            this.popupOverlay();
        	
        	
            $.ajax({
                type: "GET",
                url: this.url, //taken from URL parameter
                data: {
                    token: this.token,
                    score: this.score,
                    locale: this.locale,
                    gameTime: this.newTime
                },
                success: function(result,status,xhr) {
                    //console.log(xhr);
                    var json = xhr.responseJSON;
                    if(json === undefined){
                        json = JSON.parse(xhr.responseText);
                    }

                    if(!json) return;                    

                    if(json.code == 0) {
                        if(json.token) {
                            this.token = json.token; //update user's token/session after score submission   
                            this.hideDivs();  
                        } else {
                            console.log('missing token response');
                        }

                        
                    } else {
                        if(json.description) {
                                console.log(json.description);
                                //errors regarding cheating/used token, etc. (disable okay button)
                                this.popupOverlayInnerHTML(json.description);       
                        }
                    }
                    //console.log(this.token);

                }.bind(this),
                error: function(result,status,xhr) {
                    //network connection issues, enable "Okay" button
                    this.popupOverlayInnerHTML("The server is unavailable to load, please try again later.");
                    this.okayButtton();
                    
                }.bind(this)
            });
        },

        popupOverlayDIVid:"popup-overlay",
        okayButtonDIVid:"okay-button",
        responsivePlugin:false,

        okayButtton: function() {
                this.okayButtonDIV = document.getElementById(this.okayButtonDIVid);

                if(this.okayButtonDIV) {
                        this.okayButtonDIV.setAttribute("style", "color:black; background-color: #fff; z-index: 999999; border: 2px solid #fff; font-size:20px; border-radius: 5px; position: absolute; float: left; top: 70%; left: 50%; transform: translate(-50%, -65%);"); 
                        
                        return;
                }

                this.okayButtonDIV = document.createElement("div");
                this.okayButtonDIV.id = this.okayButtonDIVid;
                this.okayButtonDIV.setAttribute("style", "color:black; background-color: #fff; z-index: 999999; border: 2px solid #fff; font-size:20px; border-radius: 5px; position: absolute; float: left; top: 70%; left: 50%; transform: translate(-50%, -65%);");
                this.okayButtonDIV.innerHTML = "<div style='padding:10px 10px; font-family: arial;'>" + "OKAY" + "</div></div>"; 


                var parentDIV = document.getElementById(this.popupOverlayDIVid);
                parentDIV.appendChild(this.okayButtonDIV);

                /* click DIV */
             this.okayButtonDIV.addEventListener("click", function() {
                /* hide DIV */
                this.hideDivs();

                /* end function */
                if (typeof(this.resubmitData) === "function") {
                    this.resubmitData();
                }
            }.bind(this));
                
        },
        hideDivs:function() {
               /* hide DIV */
                if(this.popupOverlayDIV) {
                      this.popupOverlayDIV.setAttribute("style", "visibility: hidden;");  
                }
                if(this.okayButtonDIV) {
                      this.okayButtonDIV.setAttribute("style", "visibility: hidden;");   
                }
                
        },
        popupOverlayInnerHTML: function(description) {
                
                if(!this.popupOverlayDIV) {
                      this.popupOverlayDIV = document.getElementById(this.popupOverlayDIVid);  
                }
                
                this.popupOverlayDIV.innerHTML = "<div style='width:85%; max-width:600px; color:black; background-color: #fff; border: 2px solid #fff; font-size:20px; border-radius: 5px; position: relative; float: left; top: 50%; left: 50%; transform: translate(-50%, -50%);'><div style='padding:20px 50px; font-family: arial;'>" + description + "</div></div>";

        },
        popupOverlay: function() {
                this.popupOverlayDIV = document.getElementById(this.popupOverlayDIVid);


                // singleton pattern
                if (this.popupOverlayDIV) {
                    this.popupOverlayDIV.setAttribute("style", "position: absolute; display: block; z-index: 999999; background-color: rgba(23, 32, 53, 0.7); visibility: visible; font-size: 10vmin; text-align: center; vertical-align: middle; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;");
                    //this.popupOverlayDIV.innerHTML = "<div style='width:85%; max-width:600px; color:black; background-color: #fff; border: 2px solid #fff; font-size:20px; border-radius: 5px; position: relative; float: left; top: 50%; left: 50%; transform: translate(-50%, -50%);'><div style='padding:20px 50px; font-family: arial;'>" + description + "</div></div>";   

                     /* resize DIV */
                        try {
                            if (typeof(ig.sizeHandler) !== "undefined") {
                                if (typeof(ig.sizeHandler.coreDivsToResize) !== "undefined") {
                                    ig.sizeHandler.coreDivsToResize.push(("#" + this.popupOverlayDIVid));
                                    if (typeof(ig.sizeHandler.reorient) === "function") {

                                        //Bug with responsive plugin
                                        if(!this.responsivePlugin) {
                                            ig.sizeHandler.reorient();    
                                        }

                                    }
                                }
                            } else if (typeof(coreDivsToResize) !== "undefined") {
                                coreDivsToResize.push(this.popupOverlayDIVid);
                                if (typeof(sizeHandler) === "function") {
                                    console.log("sizeHandler");
                                    if(!this.responsivePlugin) {
                                        sizeHandler();    
                                    }

                                }
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    
                    return;
                }
                /* create DIV */
                this.popupOverlayDIV = document.createElement("div");
                this.popupOverlayDIV.id = this.popupOverlayDIVid;
                this.popupOverlayDIV.setAttribute("class", "play");
                this.popupOverlayDIV.setAttribute("style", "position: absolute; display: block; z-index: 999999; background-color: rgba(23, 32, 53, 0.7); visibility: visible; font-size: 10vmin; text-align: center; vertical-align: middle; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;");
                //this.popupOverlayDIV.innerHTML = "<div style='width:85%; max-width:600px; color:black; background-color: #fff; border: 2px solid #fff; font-size:20px; border-radius: 5px; position: relative; float: left; top: 50%; left: 50%; transform: translate(-50%, -50%);'><div style='padding:20px 50px; font-family: arial;'>" + description + "</div></div>";

                /* inject DIV */
                var parentDIV = document.getElementById("ajaxbar");
                parentDIV.appendChild(this.popupOverlayDIV);

                /* resize DIV */
                try {
                    if (typeof(ig.sizeHandler) !== "undefined") {
                        if (typeof(ig.sizeHandler.coreDivsToResize) !== "undefined") {
                            ig.sizeHandler.coreDivsToResize.push(("#" + this.popupOverlayDIVid));
                            if (typeof(ig.sizeHandler.reorient) === "function") {

                                //Bug with responsive plugin
                                if(!this.responsivePlugin) {
                                    ig.sizeHandler.reorient();    
                                }
                                
                            }
                        }
                    } else if (typeof(coreDivsToResize) !== "undefined") {
                        coreDivsToResize.push(this.popupOverlayDIVid);
                        if (typeof(sizeHandler) === "function") {
                            console.log("sizeHandler");
                            if(!this.responsivePlugin) {
                                sizeHandler();    
                            }
                            
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
                
        }
    });
});