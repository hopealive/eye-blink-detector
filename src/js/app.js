let faceapi;
let video;
let detections;
let distances = {
    prev: null,
    current: null
}
stopped = false


// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

setTimeout(() => {
    stopped = true
}, 3000)


function setup() {
    createCanvas(100, 100);

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Hide the video element, and just show the canvas

    faceapi = ml5.faceApi(video, detection_options, modelReady)
}

function modelReady() {
    console.log('ready!')
    faceapi.detect(gotResults)
}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    detections = result;
    printDistance()
    faceapi.detect(gotResults);
}

function printDistance() {
    if (!detections) {
        return
    }
    detections.forEach(detection => {
        let leftEyeCoords = detection.parts.leftEye
        let current = distance(leftEyeCoords)
        distances = {
            prev: distances.current > 0 ? distances.current : current,
            current: current
        }
        let diff = distances.current - distances.prev
        if (!stopped) {
            console.error(diff * 1000)//TODO
        }

    });
}

function distance(coords) {
    let extrems = coords.reduce((carry, coord) => {
        return {
            min: carry.min < coord.y ? carry.min : coord.y,
            max: carry.max > coord.y ? carry.max : coord.y
        }
    });
    return extrems.max - extrems.min
}