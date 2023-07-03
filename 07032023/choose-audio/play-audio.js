
let audioElement = new Audio();

function loadAudio(ev) {
    var reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = function (event) {
        audioElement.setAttribute('src', event.target.result);
        audioElement.play();
    };
}

function stop() {
    audioElement.pause();
}


function play() {
    audioElement.play();
}