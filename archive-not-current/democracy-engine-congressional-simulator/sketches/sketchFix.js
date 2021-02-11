//V1 TO DO
//Work on Diplay Text Design (transparen overlay)
//Resize User input boxes
//GUI for User input?

//TO DO - These require a configuration of the Logic. A potential future project. The code will be made available via Github
// Allow users to change the number of decision-making units:
// Allow users to change the configuration and logical interdependencies of decision-making units:
// see: https://docs.google.com/document/d/118letZLbFm9D3QhtOtrdhQvJU4OJxYWr6OiAuUlJTjA/edit?usp=sharing

// Defaults based on 116th Congress (2019 - 2021) as of 8/7/2020

// Senate (2019-2021)
// Majority Party: Republican (53 seats)
// Minority Party: Democrat (45 seats)
// Other Parties: 2 Independents (both caucus with the Democrats)
// Total Seats: 100
// https://pressgallery.house.gov/member-data/party-breakdown

// House
// 198 Republicans
// 232 Democrats
// 1 Libertarian
// 4 * Vacancies
// https://pressgallery.house.gov/member-data/party-breakdown


//Global Variables

//******These Can be Changed by User*********

//Voter Stress Variables
//assumes a stress level 0-10, stress level 5 is neither stressed nor not stressed and does not change likelihood of yay/nay vote.  Change stressLow & stressHigh to reflect sensor values.  
var stressSensorval = 5; //connect this to sensor reading
var stressLow = 0; //change this to the low stress minimum
var stressHigh = 10; //change this to the low stress masimum

//Planet Stress Variables
//assumes a stress level 0-10, stress level 5 is neither stressed nor not stressed and does not change likelihood of yay/nay vote.  Change stressLow & stressHigh to reflect sensor values.  
var stressPlanet = 5; //connect this to sensor reading
var stressPlanetLow = 0; //change this to the low stress minimum
var stressPlanetHigh = 10; //change this to the low stress masimum

//Offset of combined stress levels that will increase likelyhood of yes vote on any given bill (state change)
var stressOffset;

//Number voting members
var numHouse = 435;
var numSenate = 100;
var numPres = 1;
var numVP = 1;

//Demographics of House as decimal percentages 1 = 100%
var perDemHouse = 0.5333;
var perRepHouse = 0.4551;
var perIndHouse = 0.0115;

//Demographics of Senate as decimal percentages 1 = 100%
var perDemSenate = 0.45;
var perRepSenate = 0.53;
var perIndSenate = 0.02;

//Demographics of President as decimal percentages 1 = 100%
var perDemPres = 0.0;
var perRepPres = 1.0;
var perIndPres = 0.0;

//Super Majority Cutoff for override of presidential veto
var superThresh = 0.67;

//Historical Likelihood of party affiliation & likelihood of 'yay' vote
var repYaythresh = 0.3;
var demYaythresh = 0.7;
var indYaythresh = 0.5;

//How Many Voting Bodies (house, senate, president = 3) *see to DO at top of code
var numBodies = 4;
//var defNumBody;//delete?

//******These are NOT user determined*********

//We will use these in the setup function to map the sensor value to stress index
var stress = stressSensorval;
var stressMap;
var stressPlanetMap;

//which body is voting
var bodyCount = 0;
let bodyPass = [];

//The number of voting memebers for each body
var numCon;

//initialize tally of votes
var yay = 0;
var nay = 0;
var demNayCount, demYayCount, repNayCount, repYayCount;
var votingBodyCounts = [];
let superThreshIndex = [];

//The count variables are updated every time a circle is drawn
var count = 0;
var count1 = 0;
var count2 = 0;
var countR = 0;

//The yCount variables
var xCount = 1;
var yCount = 1;
var yCountT = 1;

//Determines size of circle & spacing
var skip; //taking the square root of the area of the drawing
var skip2;
// var skipR; strange artifact from Rhonda

//Location Circle is Drawn
var x;
var y;
var x2;
var y2;

//Diameter or circle
var diam;

//Splits the Screen into 'sections' based on number of voting bodies
var offSet;

//test state variable - 0 if untested 1 if tested
var test;

//test state variable - 0 if moving through voting body 1 if all body members have votes
var endBody;

//how many times has the user run the vote in a signle session
var passCount = 0; //artifact from Rhonda

//fortesting
let senateResult;
let houseResult;
let presidentResult;

var bodyLabel;

// colors
var bColor = "#012244";
var pColor = "#3c1b36";

let tranVal = 255;
// let fadeOpac = 255;
var partyNum = 0;
var moveArrow = 0;

var rot = 0;

let mainText;
let headerText;
let subHeaderText;

//checks for voting bodies and sees if they will actually vote or not
let stopVoteBool = false;
let stopVoteCount = 0;
let stopVoteArr = [];
let vpVote = false;

//loaded assets
let helvFont;
let loadingImage;

//user inputs are enabled
let userEdits = false;


//user input variables, should convert into arrays
var userNumHouseSlider, userNumSenateSlider, userNumPresSlider, userPerDemHouseSlider, userPerRepHouse, userPerIndHouseSlider, userPerDemSenateSlider, userPerRepSenateSlider, userPerIndSenateSlider, userPerDemPresSlider, userPerRepPresSlider, userPerIndPresSlider, userRepYaythreshSlider, userDemYaythreshSlider, userIndYaythreshSlider, userSuperThreshSlider, userNumBodiesSlider, userStressSensorvalSlider, userStressPlanetSlider;

var userNumHouse, userNumPres, userNumSenate, userPerDemHouse, userPerRepHouse, userPerIndHouse, userPerDemSenate, userPerRepSenate, userPerIndSenate, userPerDemPres, userPerRepPres, userPerIndPres, userRepYaythresh, userDemYaythresh, userIndYaythresh, userSuperThresh, userNumBodies, userStressSensorval, userStressPlanet;

var userNumHouseText, userNumSenateText, userNumPresText, userPerDemHouseText, userPerRepHouseText, userPerIndHouseText, userPerDemSenateText, userPerRepSenateText, userPerIndSenateText, userPerDemPresText, userPerRepPresText, userPerIndPresText, userRepYaythreshText, userDemYaythreshText, userIndYaythreshText, userSuperThreshText, userNumBodiesText, userStressSensorvalText, userStressPlanetText = "0";

var houseCurrentValue, senateCurrentValue, presCurrentValue, demHouseCurrentValue, repHouseCurrentValue, indHouseCurrentValue, demSenateCurrentValue, repSenateCurrentValue, indSenateCurrentValue, demPresCurrentValue, repPresCurrentValue, indPresCurrentValue, repYaythreshCurrentValue, demYaythreshCurrentValue, indYaythreshCurrentValue, superThreshCurrentValue, numBodiesCurrentValue, stressSensorvalCurrentValue, stressPlanetCurrentValue = 0;

var userPaddingX = 20;
var userInputY = 20;
var userInputX = 20;

function preload() {
  helvFont = loadFont('/democracy-engine-congressional-simulator/assets/font/HelveticaNeue-Regular.otf');
  loadingImage = loadImage('/democracy-engine-congressional-simulator/assets/gears-icon.png')
}

function setup() {

  textFont(helvFont);
  let canvas = createCanvas(windowWidth * .8, windowHeight * .8);
  canvas.parent('vote');
  dWidth = width;
  dHeight = height;
  background(bColor);

  // let fs = fullscreen();
  // fullscreen(!fs);
}

function draw() {

  rot += 0.5;

  currentCongLogic();

  if (userEdits == true) {

    background(bColor);
    userNumHouseText = userNumHouseSlider.value();
    userNumSenateText = userNumSenateSlider.value();
    userNumPresText = userNumPresSlider.value();

    houseCurrentValue = checkValue(userNumHouseText, userNumHouse, houseCurrentValue);
    senateCurrentValue = checkValue(userNumSenateText, userNumSenate, senateCurrentValue);
    presCurrentValue = checkValue(userNumPresText, userNumPres, presCurrentValue);

    // demHouseCurrentValue = checkValue(userPerDemHouseText, userPerDemHouse, demHouseCurrentValue);
    // repHouseCurrentValue = checkValue(userPerRepHouseText, userPerRepHouse, repHouseCurrentValue);
    // indHouseCurrentValue = checkValue(userPerIndHouseText, userPerIndHouse, indHouseCurrentValue);
    // demSenateCurrentValue = checkValue(userPerDemSenateText, userPerDemSenate, demSenateCurrentValue);
    // repSenateCurrentValue = checkValue(userPerRepSenateText, userPerRepSenate, repSenateCurrentValue);
    // indSenateCurrentValue = checkValue(userPerIndSenateText, userPerIndSenate, indSenateCurrentValue);
    // demPresCurrentValue = checkValue(userPerDemPresText, userPerDemPres, demPresCurrentValue);
    // repPresCurrentValue = checkValue(userPerRepPresText, userPerRepPres, repPresCurrentValue);
    // indPresCurrentValue = checkValue(userPerIndPresText, userPerIndPres, indPresCurrentValue);
    // repYaythreshCurrentValue = checkValue(userRepYaythreshText, userRepYaythresh, repYaythreshCurrentValue);
    // demYaythreshCurrentValue = checkValue(userDemYaythreshText, userDemYaythresh, demYaythreshCurrentValue);
    // indYaythreshCurrentValue = checkValue(userIndYaythreshText, userIndYaythresh, indYaythreshCurrentValue);
    // superThreshCurrentValue = checkValue(userSuperThreshText, userSuperThresh, superThreshCurrentValue);
    // numBodiesCurrentValue = checkValue(userNumBodiesText, userNumBodies, numBodiesCurrentValue);
    // stressSensorvalCurrentValue = checkValue(userStressSensorvalText, userStressSensorval, stressSensorvalCurrentValue);
    // stressPlanetCurrentValue = checkValue(userStressPlanetText, userStressPlanet, stressPlanetCurrentValue);



  }
}

//Logic below is setup for current congressional configuration
//May want to wrap this in a case state or the like so users can define different logic
//if the user has input variables use those instead of the Global declaration
function currentCongLogic() {

  // Logic for House
  if (bodyCount == 0) {

    // Setup variables first time we pass through the first body
    if (count < 1 && count1 < 1 && count2 < 1) {
      test = 0;
      print('bodyCount = ')
      print(bodyCount);
      background(color(bColor));

      //maps stress index onto percentage effecting yay/nay vote.
      stressMap = map(stress, stressLow, stressHigh, 0, 2);
      print('Voter Stress = ' + stressMap);

      stressPlanetMap = map(stressPlanet, stressPlanetLow, stressPlanetHigh, 0, 2);
      print('Planet Stress = ' + stressPlanetMap)

      //create a stress offset that will effect congress' likelyhood of passing legislation to create change
      stressOffset = (stressPlanetMap + stressMap) / 2;

      // Set number of voting memebers
      numCon = numHouse;
      bodyLabel = 'HOUSE OF REPRESENTATIVES';

      //Set Demographics for each body
      numDem = round(numCon * perDemHouse);
      numRep = round(numCon * perRepHouse);
      numWild = round(numCon * perIndHouse);


      offSet = dWidth / (numBodies - 1);

      //Figure out how big to draw the circles and how far to space them out
      skip = floor(.97 * (sqrt((offSet) * dHeight / numCon)));
      print('Skip = ' + skip); //testing
      x = skip / 2;
      y = skip / 2;
    }
  }

  //Logic for Senate
  if (bodyCount == 1) {
    strokeWeight(10);
    translate(offSet * bodyCount, 0);

    if (endBody == 1) {
      resetCount();
      endBody = 0;
    }

    // Setup variables first time we pass through a new body
    if (count < 1 && count1 < 1 && count2 < 1) {
      test = 0;
      print('bodyCount = ')
      print(bodyCount);

      ///Set number of voting memebers
      numCon = numSenate;
      bodyLabel = 'SENATE';

      //Set Demographics for each body
      numDem = round(numCon * perDemSenate);
      numRep = round(numCon * perRepSenate);
      numWild = round(numCon * perIndSenate);


      //Figure out how big to draw the circles and how far to space them out
      skip = floor(.97 * (sqrt(offSet * dHeight / numCon)));
      print('Skip = ' + skip); //testing
      x = skip / 2;
      y = skip / 2;

      print('Count = ' + count); //fortesting
      print('Count1 = ' + count1); //fortesting
      print('Count2 = ' + count2); //fortesting
    }

  }

  //AB logic for VP if Senate needs a tiebreaker
  if (bodyCount == 2) {
    print("votingBodyCounts[1][0]= " + votingBodyCounts[1][0] + "votingBodyCounts[1][1] = " + votingBodyCounts[1][1]);

    //simulate tie breaker
    //votingBodyCounts[1][1] = votingBodyCounts[1][0];

    if (votingBodyCounts[1][0] == votingBodyCounts[1][1] && vpVote == false) {
      vpVote = true;
    } else {
      vpVote = false;
    }

    strokeWeight(10);
    translate(offSet * bodyCount, 0);

    if (endBody == 1) {
      resetCount();
      endBody = 0;
    }
    // Setup variables first time we pass through a new body
    if (count < 1 && count1 < 1 && count2 < 1) {
      test = 0;
      print('bodyCount = ')
      print(bodyCount);

      ///Set number of voting memebers
      numCon = numVP;
      bodyLabel = 'VICE PRESIDENT';

      //Set Demographics for each body
      numDem = round(numCon * perDemPres);
      numRep = round(numCon * perRepPres);
      numWild = round(numCon * perIndPres);

      //Figure out how big to draw the circles and how far to space them out
      skip = floor(.65 * (sqrt(offSet * dHeight / numCon)));
      print('Skip = ' + skip); //testing
      x = skip / 2;
      y = skip / 2;
    }
  }

  //Logic for President
  if (bodyCount == 3) {
    strokeWeight(10);
    translate(offSet * (bodyCount - 1), 0);

    if (endBody == 1) {
      resetCount();
      endBody = 0;
    }

    // Setup variables first time we pass through a new body
    if (count < 1 && count1 < 1 && count2 < 1) {
      test = 0;
      print('bodyCount = ')
      print(bodyCount);

      // Set number of voting memebers
      numCon = numPres;
      bodyLabel = 'PRESIDENT';

      //Set Demographics for each body
      numDem = round(numCon * perDemPres);
      numRep = round(numCon * perRepPres);
      numWild = round(numCon * perIndPres);


      //Figure out how big to draw the circles and how far to space them out
      skip = floor(.65 * (sqrt(offSet * dHeight / numCon)));
      print('Skip = ' + skip); //testing
      x = skip / 2;
      y = skip / 2;
    }
  }

  // Need to make sure we are not over our number of congressional body numCon and readjusts skip if too big

  if (count < numCon - 1 && count1 < 1) {

    rotLoadImage();
    testSize();
    count++;
    // print('Count = ' + count); //fortesting
  } else if (count >= numCon - 1) {

    bodyVote();
    count1++;
    //print ('Count1 = ' + count1); //fortesting
    //print ('skip * Y = ' + (yCountT * skip));
  }
}

//resets counts when passing to new body
function resetCount() {

  print('Resetting count');
  count = 0;
  count1 = 0;
  count2 = 0;
  countR = 0;
  xCount = 1;
  yCount = 1;
  yCountT = 1;
  moveArrow = 0;
}
//This function tests to see if the circles are being drawn off screen based on first pass of calculations
function testSize() {
  for (i = 0; i < 1; i++) {
    if ((y += skip) >= dHeight - (skip / 2)) {
      y = skip / 2;
      yCountT++;
      if ((x += skip) >= offSet - (skip / 2)) x = skip / 2;
      xCount++;
      //print('Y count = ' + yCount); // prints to consolde for testing
    }
  }
}

//loading image function
function rotLoadImage() {

  push();
  rectMode(CORNER);
  noStroke();
  fill(bColor);

  translate(offSet / 2, dHeight / 2);
  rectMode(CENTER);
  rect(0, 0, 160, 160);
  rotate(PI / 180 * rot);
  imageMode(CENTER);
  image(loadingImage, 0, 0, 150, 150);
  //AB: small square to cover rotating image after
  if (count == numCon - 2) {
    rect(0, 0, 160, 160);
  }
  pop();



}

//Shows result of the vote
function bodyVote() {
  fill(map(count1, 0, numCon, 0, 255));
  // reset variables if first pass thorugh function
  if (count1 < 1) {
    resetDraw();
    test = 1;
  }
  if (count1 < numCon) {

    //AB for gradient from white to blue
    // if (tranVal > 0) {
    //     tranVal -= .3;
    // }

    stopVoteLogic();

    drawRect();
    // Once all of votes have been cast display the total for each body
    if (count1 == numCon - 1) {
      resultLogic();
    }
  }
}

function resetDraw() {
  if (yCountT * skip >= offSet) {
    skip = offSet / (1.025 * xCount);
  }
  noStroke();
  fill(bColor);
  tranVal = 255;
  rectMode(CORNER);

  //AB: removed this rect b/c it covers vp or president during logic
  // rect(0, 0, offSet, dHeight);

  x = skip / 2;
  y = skip / 2;
  yay = 0;
  nay = 0;
  xCount = 1;
  yCount = 1;
  endBody = 0;
}

//AB function to store yay and nay votes into array
function storeBodyVotes() {
  votingBodyCounts[bodyCount] = [yay, nay];
  let currentBodyYay = votingBodyCounts[bodyCount][0];
  let currentBodyNay = votingBodyCounts[bodyCount][1];

  //AB for error checking
  // print(bodyLabel + " yay votes: " + currentBodyYay + " nay votes: " + currentBodyNay);

}

function drawRect() {
  let noVoteBool = false;
  var valAdjust = 75;
  var currentTransVal = 0;
  var currentPartyNum = 0;

  if (test == 1) {
    countR = count1;
  } else if (test == 2) {
    countR = count2;
  }

  diam = skip * .8;
  stopVoteChange();
  //Democrat is Voting
  if (countR < numDem) {
    currentTransVal = tranVal - currentPartyNum * valAdjust;


    let vote = random(0, 1);
    //    //print vote info to console for testing
    //    print('Vote =' + vote);//for testing
    //    print ('stress offset ' + stressOffset);//for testing
    //    var voteDemTest = demYaythresh*stressOffset; //for testing
    //    print('vote dem offset' + voteDemTest);//for testing

    if (vote <= demYaythresh * stressOffset) {
      noVoteBool = false;
      yay++;
    } else {
      noVoteBool = true;
      nay++;
    }

  }
  //Independent is Voting
  else if (countR >= numDem && countR < numDem + numWild) {
    currentPartyNum = partyNum + 1;
    currentTransVal = tranVal - currentPartyNum * valAdjust;


    let vote = random(0, 1);

    //    //print vote info to console for testing
    //    print('Vote =' + vote);//for testing
    //    print ('stress offset ' + stressOffset);//for testing
    //    var voteRepTest = repYaythresh*stressOffset; //for testing
    //    print('vote Rep offset' + voteRepTest);//for testing

    //is random number greater than threshold for yes?
    if (vote <= repYaythresh * stressOffset) {
      noVoteBool = false;
      yay++;
    } else {
      noVoteBool = true;
      nay++;
    }

  }
  //Republican is Voting
  else {
    currentPartyNum = partyNum + 2;
    currentTransVal = tranVal - currentPartyNum * valAdjust;
    let vote = random(0, 1);
    //print('Vote =' + vote); //testing
    if (vote <= indYaythresh * stressOffset) {
      noVoteBool = false;
      yay++;
    } else {
      noVoteBool = true;
      nay++;
    }
    //made for just two bodies
    // if (stopVoteCount == 2) {
    //     resultLogic();
    // }
  }
  //AB: finding problem with x's
  print("body #: " + bodyCount + " No Vote Bool: " + noVoteBool);
  // Square is Drawn for Each Vote
  rectMode(CENTER);

  if (bodyLabel == 'VICE PRESIDENT') {
    y = y + skip;
    if (vpVote == false) {
      stroke(255, 100);
      noFill();
      strokeWeight(3);
    }
    print('drawing VP square at' + x + " " + y);
  }

  if (bodyCount == 3) {
    print('drawing PRESIDENT square at' + x + " " + y);

  }

  //creates a different shade for each voting party
  if (stopVoteBool == false) {
    noStroke();
    fill(255, currentTransVal);
  }
  rect(x, y, diam, diam, diam / 8);
  //creates the x on squares that are "no votes"
  if (noVoteBool == true && stopVoteBool == false) {
    fill(bColor);
    textSize(diam + 3);
    textAlign(CENTER, CENTER);
    textFont('Arial');
    text("x", x, y);
  }


  if ((y += skip) >= dHeight - (skip / 2)) {
    y = skip / 2;
    yCount++;
    //print('Y count = ' + yCount);
    if ((x += skip) >= offSet - (skip / 2)) x = skip / 2;
    xCount++;
    //print('Y count = ' + yCount); // prints to consolde for testing
  }
  storeBodyVotes();
}

//Diplays Voting Results
// Jonathan wants this next to president?
// OR windowWidth/bodies + 1 seperate column

function stopVoteChange() {
  if (stopVoteBool == true) {
    stopVoteArr[bodyCount] = true;
    stroke(255, 100);
    noFill();
    strokeWeight(3);
    stopVoteBool == false;
  } else {
    fill(bColor);
    noStroke();
    stopVoteArr[bodyCount] = false;

  }
}

function stopVoteLogic() {
  //AB logic for no voting bodies
  if (bodyPass[0] === false && stopVoteCount < 1) {
    stopVoteBool = true;
    stopVoteCount++;
  } else if (bodyPass[1] === false && stopVoteCount < 2) {
    stopVoteBool = true;
    stopVoteCount++;
  } else if (bodyPass[1] === false || bodyPass[0] === false && stopVoteCount >= 2) {
    stopVoteBool = true;
    stopVoteCount++;
  } else if (bodyCount == 2 && vpVote == false) {
    stopVoteBool = true;
  } else {
    stopVoteBool = false;
  }
}

function resultLogic() {

  //padding & offsets for text display
  votePadX = dWidth / 4;
  votePadY = dHeight / 4;
  voteOutcomePosY = votePadY * 3;

  // If voting body == 1 and yay == 50%
  // then vice president votes

  if (yay >= numCon * superThresh) {
    // text('BILL PASSES ' + bodyLabel + ' WITH SUPER MAJORITY', votePadX, votePadY, offSet - votePadX, dHeight - votePadY);
    bodyPass[bodyCount] = true;
    superThreshIndex[bodyCount] = true;
  } else if (yay > numCon / 2) {
    // text('BILL PASSES ' + bodyLabel, votePadX, votePadY, offSet, dHeight);
    bodyPass[bodyCount] = true;
    superThreshIndex[bodyCount] = false;
  } else {
    // text('BILL DOES NOT PASS ' + bodyLabel, votePadX, votePadY, offSet, dHeight);
    bodyPass[bodyCount] = false;
    superThreshIndex[bodyCount] = false;
  }


  //ab removed for VP Logics and blank square
  // } else if (bodyPass[0] === false || bodyPass[1] === false && bodyCount >= 2) {
  //     bodyCount = numBodies-1;
  // }

  //Adds one to the count of how many bodies have voted and enters into user input state (buttons) if the vote is done.

  if (bodyCount < numBodies) {
    nextBody();
    print("new body count: " + bodyCount);
  }

  //AB removed for VP logic and blank square
  // } else if (bodyPass[0] === true && bodyPass[1] === true) {
  //     nextBody();
  // }

  if (bodyCount >= numBodies) {
    finalDisplay();
    userInput();
    print('Final Stage');
  }
  endBody = 1;
}

//angelabelle test function
function finalDisplay() {



  let currentBodyLabel;

  let columnAmount = numBodies - 1;
  let rowAmount = 4;

  let padY = 20;
  let padX = 10;
  let dispW = (dWidth / columnAmount);
  let dispH = (dHeight / rowAmount);

  let dispX = 0 + padX;
  let dispY = 0 + padY;

  var resBColor = color(0, 0, 0);
  let decisionText = "";
  //column 1 to be yay/nay votes
  //column 2 to be body votes
  textFont(helvFont);

  if (bodyCount == numBodies) {
    setTimeout(function() {
      document.body.style.backgroundColor = "black";


      textAlign(LEFT, TOP);
      fill(color("#faf4d3"));
      noStroke();
      rectMode(CORNER);
      resBColor.setAlpha(200);
      fill(resBColor);
      rect(0, 0, dWidth, dHeight);
      textStyle(NORMAL);


      //NEED TO CHANGE LATER FOR MORE THAN 3 BODIES
      for (let i = 0; i < numBodies; i++) {
        fill(255);
        if (i == 0) {
          currentBodyLabel = 'HOUSE';
        } else if (i == 1) {
          currentBodyLabel = 'SENATE';
        } else if (i == 2) {
          currentBodyLabel = 'VICE PRESIDENT';
        } else if (i == 3) {
          // print("I AM IN PRESIDENT b4 LOGIC");
          currentBodyLabel = 'PRESIDENT';
        }

        //yay and nay votes for each voting body
        //y = the i*dispW

        if (i < votingBodyCounts.length) {

          print("i = " + i + " and current body label = " + currentBodyLabel);

          if (currentBodyLabel == 'PRESIDENT') {
            textSize(23);
            text(currentBodyLabel, (i - 1) * dispW + padX, padY, dispW, dispH);
            textAlign(LEFT);

            if (stopVoteArr[i] == false) {
              textSize(20);
              text("\n\nVOTES \n", (i - 1) * dispW + padX, padY, dispW, dispH);
              textSize(16);
              text("\n\n\n\nYES: " + votingBodyCounts[i][0] + "\nNO: " + votingBodyCounts[i][1] + "\n ", (i - 1) * dispW + padX, padY, dispW, dispH);


              // print("President: \n\n\n\nYES: " + votingBodyCounts[3][0] + "\nNO: " + votingBodyCounts[3][1]);
              //president veto/super

              if (bodyPass[0] === true && bodyPass[1] === true && bodyPass[3] === false) {
                if (superThreshIndex[0] === true && superThreshIndex[1] === true) {
                  text('VETO OVERRIDEN BY SUPER MAJORITY IN ALL HOUSES: NO PRESIDENTIAL VOTE', (i - 1) * dispW + padX, dHeight / 4, dispW, dispH);
                } else {
                  text('PRESIDENT VETOS: BILL IS NOT APPROVED ', (i - 1) * dispW + padX, (i - 1) * dispW + padX, dHeight / 4, dispW, dispH);
                }
              } else if (bodyPass[i] == true &&
                superThreshIndex[0] == false ||
                superThreshIndex[1] == false) {
                text('\nBILL IS APPROVED', (i - 1) * dispW + padX, dHeight / 4, dispW, dispH);
              } else if (bodyPass[i] == false) {
                text('\nBILL IS NOT APPROVED ', (i - 1) * dispW + padX, dHeight / 4, dispW, dispH);
              }
            } else {
              textSize(16);
              if (bodyPass[0] == false || bodyPass[1] == false) {
                // dispY = dispY + (dHeight / 5);
                text('BILL IS NOT APPROVED BY ALL HOUSES: NO PRESIDENTIAL VOTE', (i - 1) * dispW + padX, padY, dispW, dispH);
              } else {
                text('\n\nDOES NOT VOTE', (i - 1) * dispW + padX, padY, dispW, dispH);
              }
            }

          } else if (currentBodyLabel == 'VICE PRESIDENT') {
            textSize(23);
            text(currentBodyLabel, i * dispW + padX, dHeight / 2, dispW, dispH);
            if (stopVoteArr[i] == false && vpVote == true) {
              textSize(20);
              text("\n\nVOTES \n", i * dispW + padX, dHeight / 2, dispW, dispH);
              textSize(16);
              text("\n\n\n\nYES: " + votingBodyCounts[i][0] + "\nNO: " + votingBodyCounts[i][1] + "\n ", i * dispW + padX, dHeight / 2, dispW, dispH);

              if (bodyPass[0] == false || bodyPass[1] == false) {
                text('\n\n\nBILL IS NOT APPROVED BY ALL HOUSES: NO VP VOTE', i * dispW + padX, dHeight * (3 / 4), dispW, dispH);
              } else if (bodyPass[0] == true && bodyPass[1] == true && vpVote == true) {
                text('\n\n\nTIE BREAKER VOTE INITIATED', i * dispW + padX, dHeight * (3 / 4), dispW, dispH);
                if (bodyPass[i] == false) {
                  text('\nBILL IS NOT APPROVED', (i) * dispW + padX, dHeight * (3 / 4), dispW, dispH);
                } else if (bodyPass[i] == true) {
                  text('\nBILL IS APPROVED', (i) * dispW + padX, dHeight * (3 / 4), dispW, dispH);
                }
              }

            } else {
              textSize(16);
              text('\n\nDOES NOT VOTE', i * dispW + padX, dHeight / 2, dispW, dispH);
            }

          } else {
            textSize(23);
            text(currentBodyLabel, i * dispW + padX, padY, dispW, dispH);
            if (stopVoteArr[i] == false) {
              textSize(20);
              text("\n\nVOTES \n", i * dispW + padX, padY, dispW, dispH);
              textSize(16);
              text("\n\n\n\nYES: " + votingBodyCounts[i][0] + "\nNO: " + votingBodyCounts[i][1] + "\n ", i * dispW + padX, padY, dispW, dispH);
              // superthresh
              if (bodyPass[i] == true && superThreshIndex[i] == true) {
                text('\nBILL IS APPROVED WITH SUPER MAJORITY', i * dispW + padX, dHeight / 4, dispW, dispH);
              } else if (bodyPass[i] == false) {
                text('\nBILL IS NOT APPROVED', i * dispW + padX, dHeight / 4, dispW, dispH);
              } else if (bodyPass[i] == true && superThreshIndex[i] == false) {
                text('\nBILL IS APPROVED', i * dispW + padX, dHeight / 4, dispW, dispH);
              }
            } else {
              textSize(16);
              text('\n\nDOES NOT VOTE', i * dispW + padX, padY, dispW, dispH);
            }
          }


        }

        //regular pass
        if (bodyPass[0] === true && bodyPass[1] === true && bodyPass[3] === true) {
          decisionText = "DECISION: BILL BECOMES A LAW";

        } else if (bodyPass[0] === true && bodyPass[1] === true && bodyPass[3] === false) {
          if (superThreshIndex[0] === true && superThreshIndex[1] === true) {
            decisionText = "DECISION: BILL BILL BECOMES A LAW BY SUPERMAJORITY";

          } else {
            decisionText = "DECISION: BILL DOES NOT BECOME A LAW DUE TO PRESIDENTIAL VETO";

            print(superThreshIndex[0] + ' ' + superThreshIndex[1]);
          }
        } else if (bodyPass[0] == false || bodyPass[1] == false) {
          dispY = dispY + (dHeight / 5);

          decisionText = "DECISION: BILL DOES NOT BECOME A LAW";

        }
        changeText(decisionText);
      };

    }, 2000);

  }

}

function changeText(text) {
  document.getElementById("result").innerHTML = text;
}


function nextBody() {
  bodyCount++;
}

//Once Bill Pass result has been calculated users can enter in their own variables to reconfigure congress or recalculate the vote with the same parameters
function userInput() {

  bodyCount = numBodies;
  buttonReC = createButton('RESET');

  buttonReC.id('button-re');

  buttonReC.position(windowWidth - buttonReC.width - 20, windowHeight - 45);
  buttonReC.mousePressed(userRecount);

  buttonRC = createButton('RECONFIGURE CONGRESS');

  buttonRC.id('button-re');

  buttonRC.position(windowWidth - buttonRC.width - buttonReC.width - 20, windowHeight - 45);
  buttonRC.mousePressed(userVars);

}

//Reloads the page if user would like to reset values
function userRecount() {
  location.reload();
  //reset();
}


function userVars() {
  //AB added this here for less confusion for the user
  buttonRC.remove();
  userEdits = true;
  background(0);
  changeText(" ");

  //AB's custom fucntions to create user configuration sliders.
  sliders();
  textBox();
  textLabel();

  // var inputPaddingY = 50;
  // var inputPaddingX = 20;
  // var i = 1;
  // var textSizeV = 20;
  //
  // textSize(textSizeV);
  // textAlign(LEFT, TOP);
  //
  // //Number voting members in each voting body
  // userNumHouse = createInput(numHouse);
  // userNumHouse.position(inputPaddingX, inputPaddingY * i);
  // userNumHouse.size(60);
  //
  // text('Number total voting members in the House', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4) + ((windowHeight - dHeight) / 2));
  // i++;
  //
  // userNumSenate = createInput(numSenate);
  // userNumSenate.position(inputPaddingX, inputPaddingY * i);
  // text('Number total voting members in the Senate', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // userNumPres = createInput(numPres);
  // userNumPres.position(inputPaddingX, inputPaddingY * i);
  // text('Number of Presidents', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // //Demographics of House as decimal percentages 1 = 100%
  // userPerDemHouse = createInput(perDemHouse);
  // userPerDemHouse.position(inputPaddingX, inputPaddingY * i);
  // text('Percentage of Democrats in the House', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // userPerRepHouse = createInput(perRepHouse);
  // userPerRepHouse.position(inputPaddingX, inputPaddingY * i);
  // text('Percentage of Republicans in the House', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // userPerIndHouse = createInput(perIndHouse);
  // userPerIndHouse.position(inputPaddingX, inputPaddingY * i);
  // text('Percentage of Third Parties in the House', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // //Demographics of Senate as decimal percentages 1 = 100%
  // userPerDemSenate = createInput(perDemSenate);
  // userPerDemSenate.position(inputPaddingX, inputPaddingY * i);
  // text('Percentage of Democrats in the Senate', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // userPerRepSenate = createInput(perRepSenate);
  // userPerRepSenate.position(inputPaddingX, inputPaddingY * i);
  // text('Percentage of Republicans in the Senate', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // userPerIndSenate = createInput(perIndSenate);
  // userPerIndSenate.position(inputPaddingX, inputPaddingY * i);
  // text('Percentage of Independents in the Senate', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // //Demographics of President as decimal percentages 1 = 100%
  // userPerDemPres = createInput(perDemPres);
  // userPerDemPres.position(inputPaddingX, inputPaddingY * i);
  // text('Precentage of Democratic Presidents', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // userPerRepPres = createInput(perRepPres);
  // userPerRepPres.position(inputPaddingX, inputPaddingY * i);
  // text('Precentage of Republican Presidents', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // userPerIndPres = createInput(perIndPres);
  // userPerIndPres.position(inputPaddingX, inputPaddingY * i);
  // text('Precentage of Independent Presidents', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // //Historical Likelihood of party affiliation & likelihood of 'yay' vote for Democratic representative
  // userDemYaythresh = createInput(demYaythresh);
  // userDemYaythresh.position(inputPaddingX, inputPaddingY * i);
  // text('Historical likelyhood of a Democratic Yay vote on any given bill', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // //Historical Likelihood of party affiliation & likelihood of 'yay' vote for Republican representative
  // userRepYaythresh = createInput(repYaythresh);
  // userRepYaythresh.position(inputPaddingX, inputPaddingY * i);
  // text('Historical likelyhood of a Republican Yay vote on any given bill', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // //Historical Likelihood of party affiliation & likelihood of 'yay' vote for Independent representative
  // userIndYaythresh = createInput(indYaythresh);
  // userIndYaythresh.position(inputPaddingX, inputPaddingY * i);
  // text('Historical likelyhood of an Independent Yay vote on any given bill', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // //Super Majority Cutoff for override of presidential veto
  // userSuperThresh = createInput(superThresh);
  // userSuperThresh.position(inputPaddingX, inputPaddingY * i);
  // text('Precentage of yay votes to be considered a Supermajority', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // ////How Many Voting Bodies (house, senate, president = 3) *for V2 - see TODO at top
  // //userNumBodies =  createInput(numBodies);
  // //userNumBodies.position(inputPaddingX , inputPaddingY * i);
  // //text('How many voting bodies - including President', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
  // //i++;
  //
  // //Your Stress Value
  // userStressSensorval = createInput(stressSensorval);
  // userStressSensorval.position(inputPaddingX, inputPaddingY * i);
  // text('How stressed are you on a scale of 1-10?  1 = bliss state. 5 = healthy amount of stress. 10 = very stressed ', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;
  //
  // //Planet's Stress Value
  // userStressPlanet = createInput(stressPlanet);
  // userStressPlanet.position(inputPaddingX, inputPaddingY * i);
  // text('How stressed is the planet on a scale of 1-10?  1 = perfect harmony. 5 = healthy amount of dynamic stress. 10 = very stressed ', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV / 4));
  // i++;

  buttonIV = createButton('Recalculate');
  buttonIV.id('button-re');

  buttonIV.position(windowWidth - buttonIV.width - buttonReC.width - buttonRC.width - 20, windowHeight - 45);
  buttonIV.mousePressed(inputVar);
}

function checkValue(inputText, bodyTextBox, bodyCurrentValue) {
  this.inputText = inputText;
  this.bodyTextBox = bodyTextBox;
  this.bodyCurrentValue = bodyCurrentValue;

  if (this.inputText != this.bodyCurrentValue) {
    updateValue(this.bodyTextBox, this.inputText);
  }
  this.bodyCurrentValue = this.inputText;
  return this.bodyCurrentValue;
}

function updateValue(textbox, value) {
  this.x = textbox.x;
  this.y = textbox.y;
  this.width = textbox.width;
  this.textbox = textbox;
  this.value = value;

  this.textbox = createInput(this.value);
  this.textbox.position(this.x, this.y);
  this.textbox.class('input-copies');
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

  houseLabel = createElement('p', 'Number total voting members in the House');
  houseLabel.class('group-labels');
  houseLabel.position(userNumHouse.x + userNumHouse.width + userPaddingX, userNumHouseSlider.y - 15);

  senateLabel = createElement('p', 'Number total voting members in the Senate');
  senateLabel.class('group-labels');
  senateLabel.position(userNumSenate.x + userNumSenate.width + userPaddingX, userNumSenateSlider.y - 15);

  presLabel = createElement('p', 'Number total Presidents');
  presLabel.class('group-labels');
  presLabel.position(userNumPres.x + userNumPres.width + userPaddingX, userNumPresSlider.y - 15);
}


function sliders() {
  var i = 0;
  var initialY = 100;

  userNumHouseSlider = createSlider(0, 500, numHouse);

  userNumHouseSlider.position(userInputX, initialY + (userInputY * i));
  console.log("house y: " + userNumHouseSlider.y);
  i++;

  userNumSenateSlider = createSlider(0, 500, numSenate);
  userNumSenateSlider.position(userInputX, initialY + (userInputY * i));
  console.log("Senate y: " + userNumSenateSlider.y);
  i++;

  userNumPresSlider = createSlider(1, 1, numPres);
  userNumPresSlider.position(userInputX, initialY + (userInputY * i));
  console.log("Pres y: " + userNumPresSlider.y);
  i++;

}


//User Input Values for Congressional Reconfiguration
function inputVar() {

  //Number voting members
  numHouse = userNumHouseSlider.value();
  numSenate = userNumSenateSlider.value();
  numPres = userNumPresSlider.value();

  // //Demographics of House as decimal percentages 1 = 100%
  // perDemHouse = userPerDemHouse.value();
  // perRepHouse = userPerRepHouse.value();
  // perIndHouse = userPerIndHouse.value();
  //
  // //Demographics of Senate as decimal percentages 1 = 100%
  // perDemSenate = userPerDemSenate.value();
  // perRepSenate = userPerRepSenate.value();
  // perIndSenate = userPerIndSenate.value();
  //
  // //Demographics of President as decimal percentages 1 = 100%
  // perDemPres = userPerDemPres.value();
  // perRepPres = userPerRepPres.value();
  // perIndPres = userPerIndPres.value();
  //
  // //Historical Likelihood of party affiliation & likelihood of 'yay' vote
  // repYaythresh = userRepYaythresh.value();
  // demYaythresh = userDemYaythresh.value();
  // indYaythresh = userIndYaythresh.value();
  //
  // //Super Majority Cutoff for override of presidential veto
  // superThresh = userSuperThresh.value();
  //
  // //How Many Voting Bodies (house, senate, president = 3) *for V2 - see TODO at top
  // //numBodies = userNumBodies.value();
  //
  // //Your Stress Value
  // stressSensorval = userStressSensorval.value();
  //
  // //Planets Stress Value
  // stressPlanet = userStressPlanet.value();

  bodyCount = 0;
  resetCount();
  resetDraw();
  superThreshIndex = [];
  bodyPass = [];

  removeField();
}


function removeField() {
  buttonReC.remove();
  // buttonRC.remove();
  buttonIV.remove();


  var inputCopies = document.getElementsByClassName('input-copies');
  inpLength = inputCopies.length;
  while (inpLength--) {
    inputCopies[inpLength].remove();
  };

  var textBodyLabel = document.getElementsByClassName('group-labels');
  tLength = textBodyLabel.length;
  while (tLength--) {
    textBodyLabel[tLength].remove();
  };


  userNumHouse.remove();
  userNumSenate.remove();
  userNumPres.remove();

  userNumHouseSlider.remove();
  userNumPresSlider.remove();
  userNumSenateSlider.remove();




  // userPerDemHouse.remove();
  // userPerRepHouse.remove();
  // userPerIndHouse.remove();
  // userPerDemSenate.remove();
  // userPerRepSenate.remove();
  // userPerIndSenate.remove();
  // userPerDemPres.remove();
  // userPerRepPres.remove();
  // userPerIndPres.remove();
  // userDemYaythresh.remove();
  // userRepYaythresh.remove();
  // userIndYaythresh.remove();
  // userSuperThresh.remove();
  // userStressSensorval.remove();
  // userStressPlanet.remove();
  //userNumBodies.remove();
  userEdits = false;

}
