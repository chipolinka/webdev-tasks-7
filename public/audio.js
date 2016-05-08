'use strict';

createjs.Sound.registerSound('sounds/pig.mp3', 'pig');
setInterval(() => {
    let volume = document.getElementsByClassName('volume')[0];
    createjs.Sound.play('pig').setVolume(volume.value / 50);
}, 50000);
