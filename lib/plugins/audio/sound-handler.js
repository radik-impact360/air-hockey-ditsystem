ig.module(
    'plugins.audio.sound-handler'
)
.requires(
    'plugins.audio.impact-music-player',
    'plugins.audio.impact-sound-player',
    'plugins.audio.howler-player',
    'plugins.audio.howler-music-player',
    'plugins.audio.jukebox-player',
    'plugins.audio.webaudio-music-player',
    'plugins.audio.sound-info'
)
.defines(function(){
    ig.SoundHandler = ig.Class.extend({
        bgmPlayer:null,
        sfxPlayer:null,
        focusBlurMute:false,
        soundInfo:new SoundInfo(),
        init: function() {
            
            console.log("Initiating sound handler");
            
            if(ig.ua.mobile) // Mobile
            {
                this.bgmPlayer = new WebaudioMusicPlayer(this.soundInfo.bgm,{loop:true});
                if(!this.bgmPlayer.isSupported){
                    this.bgmPlayer = new JukeboxPlayer(this.soundInfo.bgm,{loop:true});
                }

                this.sfxPlayer = new HowlerPlayer(this.soundInfo.sfx);
            }
            else // Desktop
            {
                this.bgmPlayer = new WebaudioMusicPlayer(this.soundInfo.bgm,{loop:true});
                if(!this.bgmPlayer.isSupported){
                    this.bgmPlayer = new ImpactMusicPlayer(this.soundInfo.bgm,{loop:true});
                }

                this.sfxPlayer = new HowlerPlayer(this.soundInfo.sfx);
            }
        },
        
        unlockWebAudio: function() {
            if (!Howler._audioUnlocked)  {
                Howler._unlockAudio();
            }
            
            if (ig) {
                if (ig.webaudio_ctx) {
                    if (ig.webaudio_ctx.state && ig.webaudio_ctx.state !== "running") {
                        ig.webaudio_ctx.resume();
                    }
                }
            }
            
            if (this.bgmPlayer.webaudio && this.bgmPlayer.webaudio.context) {
                if (this.bgmPlayer.webaudio.context.state && this.bgmPlayer.webaudio.context.state !== "running") {
                    this.bgmPlayer.webaudio.context.resume();
                }
            }
        },

        checkBGM:function()
        {
            return this.bgmPlayer.stayMuteFlag;
        },

        checkSFX:function()
        {
            return this.sfxPlayer.stayMuteFlag;
        },

        muteSFX:function(bool)
        {
            if(this.sfxPlayer)
            {
                this.sfxPlayer.mute(bool);
            }
        },
        
        muteBGM:function(bool)
        {
            if(this.bgmPlayer)
            {
                this.bgmPlayer.mute(bool);
            }
        },
        
        unmuteSFX:function(bool)
        {
            if(this.sfxPlayer)
            {
                this.sfxPlayer.unmute(bool);
            }
        },
        
        unmuteBGM:function(bool)
        {
            if(this.bgmPlayer)
            {
                this.bgmPlayer.unmute(bool);
            }
        },

        muteAll:function(bool)
        {
            this.muteSFX(bool);
            this.muteBGM(bool);
        },

        unmuteAll:function(bool)
        {
            this.unlockWebAudio();
            this.unmuteSFX(bool);
            this.unmuteBGM(bool);
        },

        forceMuteAll:function()
        {
            if(!this.focusBlurMute)
            {
                this.muteAll(false);
            }
            this.focusBlurMute=true;
        },

        forceUnMuteAll:function()
        {
            if(this.focusBlurMute)
            {
                this.unmuteAll(false);
                this.focusBlurMute=false;
            }
        },

        saveVolume:function()
        {
            if(this.sfxPlayer)
            {
                ig.game.io.storageSet("soundVolume",this.sfxPlayer.getVolume());
            }
            if(this.bgmPlayer)
            {
                ig.game.io.storageSet("musicVolume",this.bgmPlayer.getVolume());
            }
        },

        forceLoopBGM:function()
        {
            if(!this.focusBlurMute && this.bgmPlayer.bgmPlaying)
            {
                if(this.bgmPlayer)
                {
                    var jukebox = this.bgmPlayer.jukeboxPlayer;
                    if(jukebox)
                    {
                        var ua = {
                            ff: Boolean(!(window.mozInnerScreenX == null) && /firefox/.test( navigator.userAgent.toLowerCase() )),
                            ie: Boolean(document.all && !window.opera),
                            opera: Boolean(window.opera),
                            chrome: Boolean(window.chrome),
                            safari: Boolean(!window.chrome && /safari/.test( navigator.userAgent.toLowerCase() ) && window.getComputedStyle && !window.globalStorage && !window.opera)
                        }

                        var delay = 0.1;
                        if(ig.ua.mobile){
                            delay = 0.115;
                            if(ig.ua.android){
                                delay = 0.45;
                                if(ua.chrome){
                                    // minumum amount of time to avoid stuttering
                                    delay = 0.3;
                                }
                            }
                        }

                        if(jukebox.settings.spritemap.music)
                        {
                            var threshold = jukebox.settings.spritemap.music.end - delay;
                            if( jukebox.getCurrentTime() >= threshold ){
                                var t = jukebox.settings.spritemap.music.start;
                                if(ig.ua.android){
                                    if(!this.forcelooped){
                                        jukebox.play(t,true);
                                        this.forcelooped = true;
                                        setTimeout(function(){ig.soundHandler.forcelooped = false;}, delay);
                                    }
                                }else{
                                    jukebox.setCurrentTime(t);
                                }
                            }
                        }

                    }else if(this.bgmPlayer.tagName == "ImpactMusicPlayer"){
                        var ua = {
                            ff: Boolean(!(window.mozInnerScreenX == null) && /firefox/.test( navigator.userAgent.toLowerCase() )),
                            ie: Boolean(document.all && !window.opera),
                            opera: Boolean(window.opera),
                            chrome: Boolean(window.chrome),
                            safari: Boolean(!window.chrome && /safari/.test( navigator.userAgent.toLowerCase() ) && window.getComputedStyle && !window.globalStorage && !window.opera)
                        }

                        var delay = 0.1;
                        if(ig.ua.mobile){
                            delay = 0.115;
                            if(ig.ua.android){
                                delay = 0.45;
                                if(ua.chrome){
                                    // minumum amount of time to avoid stuttering
                                    delay = 0.3;
                                }
                            }
                        }

                        var fastforward = 0;
                        if(ig.soundManager.format.ext == "mp3"){
                            fastforward = 0.05;
                        }
                        if(ig.music.currentTrack){
                            var threshold = ig.music.currentTrack.duration - delay;
                            if( ig.music.currentTrack.currentTime >= threshold ){
                                if(ig.ua.android){
                                    if(!this.forcelooped){
                                        ig.music.currentTrack.pause();
                                        ig.music.currentTrack.currentTime = fastforward;
                                        ig.music.currentTrack.play();
                                        this.forcelooped = true;
                                        setTimeout(function(){ig.soundHandler.forcelooped = false;}, delay);
                                    }
                                }else{
                                    ig.music.currentTrack.currentTime = fastforward;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
});
