// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
const btnGroup = document.getElementById('button-group');
const btnList = btnGroup.children;
const gen = document.querySelector("button[type='submit']");
const imgin = document.getElementById("image-input");
const voicebox = document.getElementById("voice-selection");

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  //Part 1
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear content
  voicebox.disabled = false; //enable voice button
  ctx.fillStyle = "black"; //Set fill color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height); //Fill the canvas with black before drawing image
  let dim = getDimmensions(ctx.canvas.width, ctx.canvas.height, img.naturalWidth, img.naturalHeight); //get image parameters
  ctx.drawImage(img, dim.startX, dim.startY, dim.width, dim.height); //draw image to canvas
  //Part 1 complete
  
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});
imgin.addEventListener('change', (event) => { //Listen for file selection
  var myurl = URL.createObjectURL(imgin.files[0]); //Pick first file
  img.src = myurl; //Store file as image source
  img.alt = imgin.files[0].name; //Store file name as alt text
});

gen.addEventListener('click', function(event) {
  event.preventDefault();
  voicebox.disabled = false; //enable voice button
  btnList[0].disabled = false; //Enable Clear button
  btnList[1].disabled = false; //enable read text button
  gen.disabled = true; //disable generate button
  ctx.font = "30px Impact"; //Set 30px impact font
  ctx.fillStyle = "white"; //set font to white
  ctx.fillText(document.getElementById("text-top").value, ctx.canvas.width/2, 30); //Print top text to canvas
  ctx.fillText(document.getElementById("text-bottom").value, ctx.canvas.width/2, 380); //Print bottom text to canvas
});

btnList[0].addEventListener('click', function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear content
  btnList[0].disabled = true; //disable Clear button
  btnList[1].disabled = true; //disable read text button
  gen.disabled = false; //enable generate button
});

//Adapted from https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
var synth = window.speechSynthesis;

var inputForm = btnList[1];
var inputTxt = document.getElementById("text-top") + document.getElementById("text-bottom");
var voiceSelect = document.getElementById("voice-selection")

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var voices = [];

function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

btnList[1].addEventListener('click', function(event) {
  event.preventDefault();

  var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.volume = document.querySelector("input[type=range]").value;
  synth.speak(utterThis);

});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
