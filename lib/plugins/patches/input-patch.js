/**
 * Input patch to correctly calculate mouse position
 * Attempt to unlock WebAudio
 */
ig.module(
    "plugins.patches.input-patch"
).requires(
    'impact.input'
).defines(function() {
    //inject
    ig.Input.inject({
        mousemove: function(event) {
            // var internalWidth = parseInt(ig.system.canvas.offsetWidth) || ig.system.realWidth;
            var internalWidth = ig.system.realWidth;

            var scale = ig.system.scale * (internalWidth / ig.system.realWidth);

            var pos = {
                left: 0,
                top: 0
            };
            if (ig.system.canvas.getBoundingClientRect) {
                pos = ig.system.canvas.getBoundingClientRect();
            }

            var ev = event.touches ? event.touches[0] : event;
            this.mouse.x = (ev.clientX - pos.left) / scale;
            this.mouse.y = (ev.clientY - pos.top) / scale;

            /* attempt to unlock WebAudio */
            try {
                ig.soundHandler.unlockWebAudio();
            } catch (error) {}
        },

        keyup: function(event) {
            var tag = event.target.tagName;
            if (tag == 'INPUT' || tag == 'TEXTAREA') {
                return;
            }

            var code = event.type == 'keyup' ?
                event.keyCode :
                (event.button == 2 ? ig.KEY.MOUSE2 : ig.KEY.MOUSE1);

            var action = this.bindings[code];
            if (action) {
                this.delayedKeyup[action] = true;
                event.stopPropagation();
                event.preventDefault();

                /* attempt to unlock WebAudio */
                try {
                    ig.soundHandler.unlockWebAudio();
                } catch (error) {}
            }
        }
    })
});