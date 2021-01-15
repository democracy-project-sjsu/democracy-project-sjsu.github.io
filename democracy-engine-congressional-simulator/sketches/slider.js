var numHouse = 256;
var bColor = "#012244";

var userNumHouseSlider,userNumSenateSlider,userNumPresSlider;
var userNumHouse,userNumPres,userNumSenate;
var userNumHouseText, userNumSenateText, userNumPresText = "0";

var houseCurrentValue = 0;
var senateCurrentValue = 0;
var presCurrentValue = 0;

var userPaddingX = 20;
var userInputY = 20;
var userInputX = 20;


function setup() {
    textSize(15);
    noStroke();
    let canvas = createCanvas(windowWidth * .8, windowHeight * .8);
    canvas.parent('vote');
    dWidth = width;
    dHeight = height;


    sliders();
    textBox();
    textLabel();
}

function draw() {
    background(bColor);
    userNumHouseText = userNumHouseSlider.value();
    userNumSenateText = userNumSenateSlider.value();
    userNumPresText = userNumPresSlider.value();


    houseCurrentValue = checkValue(userNumHouseText, userNumHouse, houseCurrentValue);
    senateCurrentValue = checkValue(userNumSenateText, userNumSenate, senateCurrentValue);
    presCurrentValue = checkValue(userNumPresText, userNumPres, presCurrentValue);

    // if (userNumHouseText != currentValue) {
    //     updateValue(userNumHouse, userNumHouseText);
    //     // userNumHouse = createInput(textP);
    //     // userNumHouse.position(userNumHouseSlider.x + userNumHouseSlider.width, 200);
    // }
    // currentValue = userNumHouseText;

    // var textInputValue = userNumHouse.value();
    // if (textInputValue != currentValue) {
    //     userNumHouseSlider.value() = textInputValue;
    // }
}

function checkValue(inputText, bodyTextBox, bodyCurrentValue) {
    this.inputText = inputText;
    this.bodyTextBox = bodyTextBox;
    this.bodyCurrentValue = bodyCurrentValue;

    if (this.inputText != this.bodyCurrentValue) {
        updateValue(this.bodyTextBox, this.inputText);
        // userNumHouse = createInput(textP);
        // userNumHouse.position(userNumHouseSlider.x + userNumHouseSlider.width, 200);
        // console.log("current value: " + this.bodyCurrentValue + "inputValue: " + this.inputText )
    }
    this.bodyCurrentValue = this.inputText;
    return this.bodyCurrentValue;
}

function updateValue(textbox, value) {
    this.x = textbox.x;
    this.y = textbox.y;
    this.width = textbox.width;
    this.textbox = textbox;
    this.value = '"' + value + '"';

    this.textbox = createInput(this.value);
    this.textbox.position(this.x, this.y);
    this.textbox.id('input-copies');
}

function textBox() {

    userNumHouse = createInput(userNumHouseText);
    userNumHouse.position(userPaddingX + userNumHouseSlider.x + userNumHouseSlider.width, userNumHouseSlider.y);

    userNumSenate = createInput(userNumSenateText);
    userNumSenate.position(userPaddingX + userNumSenateSlider.x + userNumSenateSlider.width, userNumSenateSlider.y);

    userNumPres = createInput(userNumPresText);
    userNumPres.position(userPaddingX + userNumPresSlider.x + userNumPresSlider.width, userNumPresSlider.y);

}

function textLabel() {
    textSize(15);
    textAlign(LEFT);
    fill(255);
    // text("Number total voting members in the House", userNumHouse.x + userNumHouse.width, userNumHouseSlider.y - 50);
    houseLabel = createElement('p', 'Number total voting members in the House');
    houseLabel.id('party-labels');
    houseLabel.position(userNumHouse.x + userNumHouse.width + userPaddingX, userNumHouseSlider.y - 15);


    // text("Number total voting members in the Senate", userNumSenate.x + userNumSenate.width, userNumSenateSlider.y - 50);
    senateLabel = createElement('p', 'Number total voting members in the Senate');
    senateLabel.id('party-labels');
    senateLabel.position(userNumSenate.x + userNumSenate.width + userPaddingX, userNumSenateSlider.y - 15);


    // text("Number total voting members in the Pres", userNumPres.x + userNumPres.width, userNumPresSlider.y - 50);

    presLabel = createElement('p', 'Number total Presidents');
    presLabel.id('party-labels');
    presLabel.position(userNumPres.x + userNumPres.width + userPaddingX, userNumPresSlider.y - 15);
}


function sliders() {
    var i = 0;
    var initialY = 100;


    userNumHouseSlider = createSlider(0, 500, numHouse);

    userNumHouseSlider.position(userInputX, initialY + (userInputY * i));
    console.log("house y: " + userNumHouseSlider.y);
    i++;

    userNumSenateSlider = createSlider(0, 500, 100);
    userNumSenateSlider.position(userInputX, initialY + (userInputY * i));
    console.log("Senate y: " + userNumSenateSlider.y);
    i++;

    userNumPresSlider = createSlider(1, 1, 1);
    userNumPresSlider.position(userInputX, initialY + (userInputY * i));
    console.log("Pres y: " + userNumPresSlider.y);
    i++;





    // NOui slider slides
    // var range = document.getElementById('slider');
    //
    // noUiSlider.create(slider, {
    //     start: [4000, 8000],
    //     range: {
    //         'min': [2000],
    //         'max': [10000]
    //     }
    // });
    //
    // var rangeSliderValueElement = document.getElementById('slider-value');
    //
    // slider.noUiSlider.on('update', function(values, handle) {
    //     rangeSliderValueElement.innerHTML = values[0] + " " + values[1];
    // });


}
