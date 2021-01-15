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
var numBodies = 3;
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
var skip;
var skip2;
var skipR;

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
var passCount = 0;

function setup() {
    
  //createCanvas(1980, 1020);
  createCanvas(displayWidth, displayHeight);
  print('Width = ' + displayWidth);//testing
  print('Height = ' + displayHeight);//testing
  dWidth = displayWidth;
  dHeight = displayHeight;
  // noStroke();
  background(0);
  let fs = fullscreen();
  fullscreen(!fs);
 //userInput();
}



function draw() {

//Logic below is setup for current congressional configuration
//May want to wrap this in a case state or the like so users can define different logic
   
    //if the user has imput variables use those instead of the Global declaration
    if (passCount > 0){
    //userDefVars();
    }
    
// Logic for House    
  if (bodyCount == 0){
      
    // Setup variables first time we pass through the first body
    if (count < 1 && count1 < 1 && count2 < 1) {
    test = 0;
    print('bodyCount = ' + bodyCount);
    background(0);
      
    //maps stress index onto percentage effecting yay/nay vote.
    stressMap = map(stress, stressLow, stressHigh, 0, 2);
    print ('Voter Stress = ' + stressMap);

    stressPlanetMap = map(stressPlanet, stressPlanetLow, stressPlanetHigh, 0, 2);
    print ('Planet Stress = ' + stressPlanetMap)

    //create a stress offset that will effect congress' likelyhood of passing legislation to create change    
    stressOffset = (stressPlanetMap + stressMap)/2;
      
    // Set number of voting memebers
    numCon = numHouse;
    bodyLabel = 'HOUSE';
  
    //Set Demographics for each body
    numDem = round(numCon * perDemHouse);
    numRep = round(numCon * perRepHouse);
    numWild = round(numCon * perIndHouse);
    
    offSet = width/numBodies;
      
      //Figure out how big to draw the circles and how far to space them out
      skip = floor(.97*(sqrt(offSet*height/numCon)));
      print('Skip = ' + skip);//testing
      x = skip/2;
      y = skip/2;
    }
  }
  
    //Logic for Senate
    if (bodyCount == 1){     

    push(); // Start a new drawing state
    strokeWeight(10);
    fill(0);
    translate(offSet* bodyCount, 0);
      
    if (endBody == 1 ){
      resetCount();
      endBody = 0;
    }
      
    // Setup variables first time we pass through a new body
    if (count < 1 && count1 < 1 && count2 < 1) {
    test = 0;
    print('bodyCount = '+ bodyCount);
    
    ///Set number of voting memebers
    numCon = numSenate;
    bodyLabel = 'SENATE';
  
    //Set Demographics for each body
    numDem = round(numCon * perDemSenate);
    numRep = round(numCon * perRepSenate);
    numWild = round(numCon * perIndSenate);
    
      
    //Figure out how big to draw the circles and how far to space them out
    skip = floor(.97*(sqrt(offSet*height/numCon)));
    print('Skip = ' + skip);//testing
    x = skip/2;
    y = skip/2;
    
    print ('Count = ' + count); //fortesting
    print ('Count1 = ' + count1); //fortesting
    print ('Count2 = ' + count2); //fortesting
      
    }
  }
  
    //Logic for President
  if (bodyCount == 2){   
      
    push(); // Start a new drawing state
    strokeWeight(10);
    fill(0);
    translate(offSet* bodyCount, 0);
      
    if (endBody == 1 ){
      resetCount();
      endBody = 0;
    }
      
    // Setup variables first time we pass through a new body
    if (count < 1 && count1 < 1 && count2 < 1) {
      test = 0;
      print(bodyCount);

      // Set number of voting memebers
      numCon = numPres;
      bodyLabel = 'PRESIDENT';

      //Set Demographics for each body
      numDem = round(numCon * perDemPres);
      numRep = round(numCon * perRepPres);
      numWild = round(numCon * perIndPres);


      //Figure out how big to draw the circles and how far to space them out
      skip = floor(.97*(sqrt(offSet*height/numCon)));
      print('Skip = ' + skip);//testing
      x = skip/2;
      y = skip/2;
    }
  }
  
  // Need to make sure we are not over our number of congressional body numCon and readjusts skip if too big 

  if ( count < numCon - 1  && count1 < 1) {
    fill (255-(count*0.5));
    textSize(32);
    text('Gathering Voting Bodies', 50, 50, offSet, height);
    testSize();
    count++;
    // print ('Count = ' + count); //fortesting
   }
     else if (count >= numCon-1){
     bodyVote();
     count1++;
     //print ('Count1 = ' + count1); //fortesting
     //print ('skip * Y = ' + (yCountT * skip));
      }
} 

//resets counts when passing to new body
function resetCount(){
    count = 0;
    count1 = 0;
    count2 = 0;
    countR = 0;
    xCount = 1;
    yCount = 1;
    yCountT = 1; 
}

//This function tests to see if the circles are being drawn off screen based on first pass of calculations
function testSize() {
  for (i =0; i<1; i++){
      if ( (y += skip) >= height-(skip/2)) {
        y = skip/2; yCountT ++;
        if ( (x += skip) >= offSet-(skip/2))   x = skip/2; xCount++; 
        //print('Y count = ' + yCount); // prints to consolde for testing
      }
  }
}


//Shows result of the vote
function bodyVote() {
  fill(map(count1, 0, numCon, 0, 255));
  // reset variables if first pass thorugh function
  if (count1 < 1){
    resetDraw();
    test = 1;
  }
  if ( count1 < numCon ) { 

    drawCircle ();

    // Once all of votes have been cast display the total for each body
    if (count1 == numCon-1){
    resultDisplay();   
    }
  } 
} 



function resetDraw(){
  if (yCountT * skip >= offSet) {skip = offSet / (1.025*xCount);}
  noStroke();
  rect(0, 0, offSet, height);
  x = skip/2;
  y = skip/2;
  yay = 0;
  nay =0;
  xCount = 1;
  yCount = 1;
  endBody = 0;
}


function drawCircle (){
  if (test == 1){
    countR = count1;
  } else if (test  == 2){
    countR = count2;
  } 
    
  diam = skip * .7;
  strokeWeight (diam*0.25);
  
    //Democrat is Voting
  if (countR < numDem){
      fill('#001BFC');
    let vote = random(0,1);
    
//    //print vote info to console for testing
//    print('Vote =' + vote);//for testing
//    print ('stress offset ' + stressOffset);//for testing
//    var voteDemTest = demYaythresh*stressOffset; //for testing
//    print('vote dem offset' + voteDemTest);//for testing
    
    if(vote <= demYaythresh * stressOffset){
    stroke(0, 255, 0);
      yay++;
   }else {
     stroke(100);
     nay++;
   }
  }
  
  //Rebublican is Voting  
  else if (countR >= numDem && countR < numDem+numRep){
      fill('#FF0303');
       let vote = random(0,1);
    
//    //print vote info to console for testing
//    print('Vote =' + vote);//for testing
//    print ('stress offset ' + stressOffset);//for testing
//    var voteRepTest = repYaythresh*stressOffset; //for testing
//    print('vote Rep offset' + voteRepTest);//for testing
    
      //is random number greater than threshold for yes?
      if(vote <= repYaythresh * stressOffset){
      stroke(0, 255, 0);
        yay ++;
     }else {
       stroke(100);
       nay ++;
     }
    }
    
  //Independent is Voting
    else {
      fill('#FFEB03');
      let vote = random(0,1);
      //print('Vote =' + vote); //testing
      if(vote <= indYaythresh * stressOffset){
        stroke(0, 255, 0);
        yay ++;  
      }else {
        stroke(100);
        nay ++;
   }
      
    }
  
  // Circle is Drawn for Each Vote
  ellipse(x, y, diam, diam);
  if ( (y += skip) >= height-(skip/2)) {
    y = skip/2; 
    yCount ++; 
    //print('Y count = ' + yCount);
    if ( (x += skip) >= offSet-(skip/2))   x = skip/2; xCount++; 
    //print('Y count = ' + yCount); // prints to consolde for testing
  } 
}

//Diplays Voting Results
function resultDisplay (){
  
//padding & offsets for text display
votePadX = 10;
votePadY = 50;
voteOutcomePosY = dHeight * .75;

//text settings
textAlign(LEFT);
//textSize(32);
fill(255);
noStroke();

//Diplays the Tally of Votes for Each Voting Body
if (yay >= numCon*superThresh){
    text('BILL PASSES ' + bodyLabel + ' WITH SUPER MAJORITY', votePadX, votePadY, offSet - votePadX, dHeight - votePadY);
    bodyPass[bodyCount]=true;
    superThreshIndex[bodyCount]=true;
}else if (yay > numCon/2){
    text('BILL PASSES ' + bodyLabel, votePadX, votePadY, offSet, dHeight);
    bodyPass[bodyCount]=true;
    superThreshIndex[bodyCount]=false;
}else { 
    text('BILL DOES NOT PASS ' + bodyLabel, votePadX, votePadY, offSet, dHeight);
    bodyPass[bodyCount]=false;
    superThreshIndex[bodyCount]=false;
    }
text(bodyLabel + ' Yay Vote = ' + yay, votePadX, 3 * votePadY, offSet, dHeight);
text(bodyLabel + ' Nay Vote = ' + nay, votePadX, 4 * votePadY, offSet, dHeight);
//text( 'bodyPass = ' + bodyPass[bodyCount], 50, 200, width, height);

//Logic for bill passing based on current model
if (bodyPass[0] === false || bodyPass[1] === false){
    pop();
    translate((offSet * (numBodies-1)), 0);
    textAlign(LEFT);
    fill(255);
    noStroke();
    text('BILL DID NOT PASS ALL HOUSES: NO PRESIDENTAIL VOTE  ', votePadX, voteOutcomePosY, offSet, dHeight);
    bodyCount = numBodies;
} 

if (bodyPass[0] === true && bodyPass[1] === true && bodyPass[2] === true){
    text('BILL PASSES ', votePadX, voteOutcomePosY, dWidth, dHeight);
}

else if (bodyPass[0] === true && bodyPass[1] === true && bodyPass[2] === false){
if (superThreshIndex[0] === true && superThreshIndex[1] === true){
  text('VETO OVERRIDEN BY SUPER MAJORITY IN ALL HOUSES: BILL PASSES ', votePadX, voteOutcomePosY, offSet, dHeight);
}else {text('PRESIDENT VETOS: BILL DOES NOT PASS ', votePadX, voteOutcomePosY, offSet, dHeight);
}
}

//Adds one to the count of how many bodies have voted and enters into user input state (buttons) if the vote is done.
if (bodyCount <= numBodies-2){
nextBody();
}else if (bodyPass[0] === true && bodyPass[1] === true){
nextBody();
} 
if (bodyCount > numBodies-1){
userInput();
print ('bodyCount = ' + bodyCount);
}
endBody = 1;
}


function nextBody(){
 bodyCount ++;
}

//Once Bill Pass result has been calculated users can enter in their own variables to reconfigure congress or recalculate the vote with the same parameters
function userInput(){

bodyCount = numBodies;
buttonReC = createButton('Reset');
buttonReC.position((offSet*numBodies) - buttonReC.width -20, displayHeight-40);
buttonReC.mousePressed(userRecount);

buttonRC = createButton('Reconfigure Congress');
buttonRC.position((offSet*numBodies) - buttonRC.width-buttonReC.width -20, displayHeight-40);
buttonRC.mousePressed(userVars);

}
 
//Reloads the page if user would like to reset values
function userRecount() {
  location.reload();
  //reset();
}
  

function userVars(){
background(0);
    
//Slider Example - update with GUI    
//https://p5js.org/examples/dom-slider.html
  // create sliders
//  rSlider = createSlider(0, 255, 100);
//  rSlider.position(inputPaddingX , 20);
//  gSlider = createSlider(0, 255, 0);
//  gSlider.position(inputPaddingX , 50);
//  bSlider = createSlider(0, 255, 255);
//  bSlider.position(inputPaddingX , 80);
//}
//
//function draw() {
//  const r = rSlider.value();
//  const g = gSlider.value();
//  const b = bSlider.value();
//  background(r, g, b);
//  text('red', rSlider.x * 2 + rSlider.width, 35);
//  text('green', gSlider.x * 2 + gSlider.width, 65);
//  text('blue', bSlider.x * 2 + bSlider.width, 95);
//}
    
var inputPaddingY = 50;
var inputPaddingX = 20;
var i = 1;
var textSizeV = 24;

textSize(textSizeV);
textAlign(LEFT, TOP);

//Number voting members in each voting body
userNumHouse = createInput(numHouse);
userNumHouse.position(inputPaddingX , inputPaddingY * i);
//userNumHouse.size(60);
text('Number total voting members in the House', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

userNumSenate = createInput(numSenate);
userNumSenate.position(inputPaddingX , inputPaddingY * i);
text('Number total voting members in the Senate', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

userNumPres = createInput(numPres);
userNumPres.position(inputPaddingX , inputPaddingY * i);
text('Number of Presidents', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

//Demographics of House as decimal percentages 1 = 100%
userPerDemHouse = createInput(perDemHouse);
userPerDemHouse.position(inputPaddingX , inputPaddingY * i);
text('Percentage of Democrats in the House', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

userPerRepHouse = createInput(perRepHouse);
userPerRepHouse.position(inputPaddingX , inputPaddingY * i);
text('Percentage of Republicans in the House', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

userPerIndHouse = createInput(perIndHouse);
userPerIndHouse.position(inputPaddingX , inputPaddingY * i);
text('Percentage of Third Parties in the House', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

//Demographics of Senate as decimal percentages 1 = 100%
userPerDemSenate = createInput(perDemSenate);
userPerDemSenate.position(inputPaddingX , inputPaddingY *i);
text('Percentage of Democrats in the Senate', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

userPerRepSenate = createInput(perRepSenate);
userPerRepSenate.position(inputPaddingX , inputPaddingY *i);
text('Percentage of Republicans in the Senate', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

userPerIndSenate = createInput(perIndSenate);
userPerIndSenate.position(inputPaddingX , inputPaddingY * i);
text('Percentage of Independents in the Senate', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

//Demographics of President as decimal percentages 1 = 100%
userPerDemPres = createInput(perDemPres);
userPerDemPres.position(inputPaddingX , inputPaddingY * i);
text('Precentage of Democratic Presidents', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

userPerRepPres = createInput(perRepPres);
userPerRepPres.position(inputPaddingX , inputPaddingY * i);
text('Precentage of Republican Presidents', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

userPerIndPres = createInput(perIndPres);
userPerIndPres.position(inputPaddingX , inputPaddingY * i);
text('Precentage of Independent Presidents', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

//Historical Likelihood of party affiliation & likelihood of 'yay' vote for Democratic representative
userDemYaythresh = createInput(demYaythresh);
userDemYaythresh.position(inputPaddingX , inputPaddingY * i);
text('Historical likelyhood of a Democratic Yay vote on any given bill', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

//Historical Likelihood of party affiliation & likelihood of 'yay' vote for Republican representative
userRepYaythresh = createInput(repYaythresh);
userRepYaythresh.position(inputPaddingX , inputPaddingY * i);
text('Historical likelyhood of a Republican Yay vote on any given bill', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

//Historical Likelihood of party affiliation & likelihood of 'yay' vote for Independent representative
userIndYaythresh = createInput(indYaythresh);
userIndYaythresh.position(inputPaddingX , inputPaddingY * i);
text('Historical likelyhood of an Independent Yay vote on any given bill', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;
    
//Super Majority Cutoff for override of presidential veto
userSuperThresh = createInput(superThresh);
userSuperThresh.position(inputPaddingX , inputPaddingY * i);
text('Precentage of yay votes to be considered a Supermajority', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

////How Many Voting Bodies (house, senate, president = 3) *for V2 - see TODO at top
//userNumBodies =  createInput(numBodies);
//userNumBodies.position(inputPaddingX , inputPaddingY * i);
//text('How many voting bodies - including President', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
//i++;
    
//Your Stress Value
userStressSensorval = createInput(stressSensorval);  
userStressSensorval.position(inputPaddingX , inputPaddingY * i);
text('How stressed are you on a scale of 1-10?  1 = bliss state. 5 = healthy amount of stress. 10 = very stressed ', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;
    
//Planet's Stress Value
userStressPlanet = createInput(stressPlanet);
userStressPlanet.position(inputPaddingX , inputPaddingY * i);
text('How stressed is the planet on a scale of 1-10?  1 = perfect harmony. 5 = healthy amount of dynamic stress. 10 = very stressed ', inputPaddingX + userNumHouse.width + 10, inputPaddingY * i - (textSizeV/4));
i++;

buttonIV = createButton('Recalculate');
buttonIV.position((offSet*numBodies)- buttonIV.width - buttonReC.width - buttonRC.width -20, displayHeight-40);
buttonIV.mousePressed(inputVar);
    
}

//User Input Values for Congressional Reconfiguration
function inputVar (){


//Number voting members
numHouse = userNumHouse.value();
numSenate = userNumSenate.value();
numPres = userNumPres.value();

//Demographics of House as decimal percentages 1 = 100%
perDemHouse = userPerDemHouse.value();
perRepHouse = userPerRepHouse.value();
perIndHouse = userPerIndHouse.value();

//Demographics of Senate as decimal percentages 1 = 100%
perDemSenate = userPerDemSenate.value();
perRepSenate = userPerRepSenate.value();
perIndSenate = userPerIndSenate.value();

//Demographics of President as decimal percentages 1 = 100%
perDemPres = userPerDemPres.value();
perRepPres = userPerRepPres.value();
perIndPres = userPerIndPres.value();

//Historical Likelihood of party affiliation & likelihood of 'yay' vote
repYaythresh = userRepYaythresh.value();
demYaythresh = userDemYaythresh.value();
indYaythresh = userIndYaythresh.value();

//Super Majority Cutoff for override of presidential veto
superThresh = userSuperThresh.value();

//How Many Voting Bodies (house, senate, president = 3) *for V2 - see TODO at top
//numBodies = userNumBodies.value(); 
    
//Your Stress Value
stressSensorval = userStressSensorval.value();

//Planets Stress Value
stressPlanet = userStressPlanet.value();
    
bodyCount = 0;
resetCount();
resetDraw();
superThreshIndex = [];
bodyPass = [];

removeField();

}


function removeField(){
buttonReC.remove();
buttonRC.remove();
buttonIV.remove();
    
userNumHouse.remove();
userNumSenate.remove();
userNumPres.remove();
userPerDemHouse.remove();
userPerRepHouse.remove();
userPerIndHouse.remove();
userPerDemSenate.remove();
userPerRepSenate.remove();
userPerIndSenate.remove();
userPerDemPres.remove();
userPerRepPres.remove();
userPerIndPres.remove();
userDemYaythresh.remove();
userRepYaythresh.remove();
userIndYaythresh.remove();
userSuperThresh.remove();
userStressSensorval.remove();
userStressPlanet.remove();
//userNumBodies.remove();   

}


