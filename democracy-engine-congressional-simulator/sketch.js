//TO DO - 
// 5) Change the number of decision-making units: 
// 7) Change the configuration and logical interdependencies of decision-making units: 
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

//Stress Variables
//assumes a stress level 0-10, stress level 5 is neither stressed nor not stressed and does not change likelihood of yay/nay vote.  Change stressLow & stressHigh to reflect sensor values.  
var stressSensorval = 6.5; //connect this to sensor reading
var stressLow = 0;
var stressHigh = 10;


//Historical Likelihood of party affiliation & likelihood of 'yay' vote
var repYaythresh = 0.7;
var demYaythresh = 0.3;

//Number voting members
var numHouse = 435;
var numSenate = 100;
var numPres = 1;

//How Many Voting Bodies (house, senate, president = 3)
var numBodies = 3;

//Demographics of House as decimal percentages 1 = 100%
var perDemHouse = 0.5333;
var perRepHouse = 0.4551;
var perWildHouse = 0.0115;

//Demographics of Senate as decimal percentages 1 = 100%
var perDemSenate = 0.45;
var perRepSenate = 0.53;
var perWildSenate = 0.02;

//Demographics of President as decimal percentages 1 = 100%
var perDemPres = 0.0;
var perRepPres = 1.0;
var perWildPres = 0.0;

//Super Majority Cutoff
var superThresh = 0.67;

//******These are NOT user determined*********

//We will use these in the setup function to map the sensor value to stress index
var stress = stressSensorval;
var stressMap;

//which body is voting
var bodyCount = 0;
let bodyPass = [];

//The number of voting memebers fot each body
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
var endBody = 0;

function setup() {
  
  //maps stress index onto percentage effecting yay/nay vote.
  stressMap = map(stress, stressLow, stressHigh, 2, 0);
  print (stressMap);
  
    //createCanvas(1980, 1020);
  createCanvas(displayWidth, displayHeight);
  offSet = width/numBodies;
  print('Width = ' + displayWidth);//testing
  print('Height = ' + displayHeight);//testing
    
  // noStroke();
  background(0);
  let fs = fullscreen();
  fullscreen(!fs);

}



function draw() {
  var passCount;
  
  if (bodyCount == 0){
    
    
    // Setup variables first time we pass through a new body
    if (count < 1 && count1 < 1 && count2 < 1) {
    test = 0;
    print('bodyCount = ' + bodyCount);
      
    // Set number of voting memebers
    numCon = numHouse;
    bodyLabel = 'HOUSE';
  
    //Set Demographics for each body
    numDem = round(numCon * perDemHouse);
    numRep = round(numCon * perRepHouse);
    numWild = round(numCon * perWildHouse);
    
      
      //Figure out how big to draw the circles and how far to space them out
      skip = floor(.97*(sqrt(offSet*height/numCon)));
      print('Skip = ' + skip);//testing
      x = skip/2;
      y = skip/2;
    }
  }
  
    if (bodyCount == 1){
      
    push(); // Start a new drawing state
    strokeWeight(10);
    fill(0);
    translate(offSet*bodyCount, 0);
      
    //  ****need to fix this, will get stuck in loop if or, maybe ok if we always run update first
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
    numWild = round(numCon * perWildSenate);
    
      
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
      numWild = round(numCon * perWildPres);


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
  
  if ( (y += skip) >= height-(skip/2)) {
    y = skip/2; yCountT ++;
    if ( (x += skip) >= offSet-(skip/2))   x = skip/2; xCount++; 
    //print('Y count = ' + yCount); // prints to consolde for testing
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
    let vote = random(0,2);
    //print('Vote =' + vote);
    if(vote >= (demYaythresh*2*stressMap)){
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
       let vote = random(0,2);
      //print('Vote =' + vote); //print to console for testing
      //is random number greater than threshold for yes?
      if(vote >= (repYaythresh*2*stressMap)){
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
      let vote = random(0,2);
      //print('Vote =' + vote); //testing
      if(vote >= 1*stressMap){
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

//Diplays the Tally of Votes for Each Voting Body
function resultDisplay (){
  endBody = 1;
  print ('yay = ' + yay);
  print ('nay = ' + nay);
  textSize(32);
  fill(255);
  noStroke();
  if (yay >= numCon*superThresh){
  text('BILL PASSES ' + bodyLabel + ' WITH SUPER MAJORITY', 50, 50, offSet, height);
  bodyPass[bodyCount]=true;
  superThreshIndex[bodyCount]=true;
  }else if (yay > numCon/2){
  text('BILL PASSES ' + bodyLabel, 50, 50, width, height);
  bodyPass[bodyCount]=true;
  superThreshIndex[bodyCount]=false;
  }else { 
    text('BILL DOES NOT PASS ' + bodyLabel, 50, 50, width, height);
    bodyPass[bodyCount]=false;
    superThreshIndex[bodyCount]=false;
        }
  text(bodyLabel + ' Yay Vote = ' + yay, 50, 150, width, height);
  text(bodyLabel + ' Nay Vote = ' + nay, 50, 200, width, height);
  //text( 'bodyPass = ' + bodyPass[bodyCount], 50, 200, width, height);
 
//Logic for bill passign based on current model
  if (bodyPass[0] === false || bodyPass[1] === false){
  text('BILL DID NOT PASS ALL HOUSES: NO PRESIDENTAIL VOTE  ', offSet, height *0.75, width, height);
  } 

  if (bodyPass[0] === true && bodyPass[1] === true && bodyPass[2] === true){
  text('BILL PASSES ', 50, height *0.75, width, height);
  }

  else if (bodyPass[0] === true && bodyPass[1] === true && bodyPass[2] === false){
    if (superThreshIndex[0] === true && superThreshIndex[1] === true){
      text('VETO OVERRIDEN BY SUPER MAJORITY IN ALL HOUSES: BILL PASSES ', 50, height *0.75, offSet, height);
    }else {text('PRESIDENT VETOS: BILL DOES NOT PASS ', 50, height *0.75, offSet, height *0.75);
    }
  }
  
 if (bodyCount < numBodies-2){
  bodyCount ++;
  }else if (bodyPass[0] === true && bodyPass[1] === true){
  bodyCount ++; 
  } 
 if (bodyCount == numBodies-1){
  userInput();
 }
}


function userInput(){
  fill(255);
  input = createInput();
  input.position((offSet*(numBodies-1)), (height - 65));

  button = createButton('Recount');
  button.position((offSet*(numBodies-1))+ input.width, height - 65);
  button.mousePressed(varInput);

  greeting = createElement('h2', 'Would you like to recount?');
  greeting.position((offSet*(numBodies-1)), (height - 130));

  // textAlign(CENTER);
  // textSize(50);
  }
  
function varInput() {
    
  // let fs = fullscreen();
  // fullscreen(!fs);

  bodyCount = 0;
  resetCount();
  superThreshIndex = [];
  bodyPass = [];
  background(0);
    
  const defNumBody = input.value();
  greeting.html('hello ' + defNumBody + '!');
  //input.value('');

  for (let i = 0; i < 200; i++) {
    push();
    fill(random(255), 255, 255);
    translate(random(width), random(height));
    rotate(random(2 * PI));
    text(defNumBody, 0, 0);
    pop();
  }
}

  