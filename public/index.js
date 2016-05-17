'use strict';

let state = {
    energy: localStorage.energy || 100,
    mood: localStorage.mood || 100,
    satiety: localStorage.satiety || 100
};
let hidden, visibilityChange;
let isDay = true;
let battery = navigator.getBattery();
let conversation = document.getElementsByClassName('conversation')[0];

setStates();
getVisibility();
getSpeech();
getCharging();
checkLight();

function setStates() {
    let energy = document.getElementsByClassName('energy_percent')[0];
    let mood = document.getElementsByClassName('mood_percent')[0];
    let satiety = document.getElementsByClassName('satiety_percent')[0];
    energy.innerHTML = state.energy;
    mood.innerHTML = state.mood;
    satiety.innerHTML = state.satiety;
}

function getVisibility() {
    if ('hidden' in document) {
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
    } else if ('mozHidden' in document) {
        hidden = 'mozHidden';
        visibilityChange = 'mozvisibilitychange';
    } else if ('webkitHidden' in document) {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
    }
}

document.addEventListener(visibilityChange, function () {
    if (document[hidden]) {
        setInterval(function () {
            if (document[hidden] && state.energy < 100) {
                addFeatures('energy');
            }
        }, 2000);
    }
});

setInterval(function () {
    for (let condition in state) {
        state[condition] = state[condition] > 0 ? state[condition] - 1 : 0;
        setStates();
    }
    if ((state.energy == 0 && state.mood == 0) || (state.energy == 0 && state.satiety == 0) ||
            (state.mood == 0 && state.satiety == 0)) {
                document.getElementsByClassName('gameOver')[0].classList.remove('invisible');
                document.getElementsByClassName('gameOver')[1].classList.remove('invisible');
                conversation.innerHTML = '';
    }
}, 2000);

let newGameInput = document.getElementsByClassName('newGame')[0];
newGameInput.addEventListener('click', function () {
    state.energy = 100;
    state.mood = 100;
    state.satiety = 100;
    document.getElementsByClassName('gameOver')[0].classList.add('invisible');
    document.getElementsByClassName('gameOver')[1].classList.add('invisible');
    conversation.innerHTML = '';
    setStates();
});

function getSpeech() {
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        let recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.onresult = function (event) {
            let index = event.resultIndex;
            let result = event.results[index][0].transcript.trim();
            conversation.innerHTML = result;
            if (state.mood < 100 && !battery.charging && isDay && !document[hidden]) {
                addFeatures('mood');
            } else {
                recognition.stop();
            }
        }
    }

    let speech = document.getElementsByClassName('speech')[0];
    speech.addEventListener('click', function () {
        if (SpeechRecognition) {
            recognition.start();
        } else {
            addFeatures('mood');
        }
    });
}

function addFeatures(feature) {
    state[feature] += 4;
    state[feature] = Math.min(100, state[feature]);
    setStates();
}

window.onunload = function () {
    localStorage.satiety = state.satiety;
    localStorage.energy = state.energy;
    localStorage.mood = state.mood;
    conversation.innerHTML = '';
};

function getCharging() {
    battery = navigator.getBattery();
    if (!battery) {
        console.log('No battery');
        let feed = document.getElementsByClassName('feed')[0];
        feed.classList.remove('invisible');
        feed.addEventListener('click', function (event) {
            addFeatures('satiety');
        });
        return;
    }
    battery.then(function (initBattery) {
        initBattery.addEventListener('chargingchange', function () {
            if (initBattery.charging && state.satiety < 100 && !document[hidden]) {
                setInterval(function () {
                    addFeatures('satiety');
                }, 1000);
            }
        });
    });
}

function checkLight() {
    window.addEventListener('devicelight', function (event) {
        isDay = event.value > 20;
        if (!isDay) {
            setInterval(function () {
                if (!isDay && state.energy < 100) {
                    addFeatures('energy');
                }
            }, 1000);
        }
    });
}
