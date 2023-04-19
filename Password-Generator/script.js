// Assignment Code
var generateBtn = document.querySelector("#generate");

// Arrays of ASCII Codes Valid to Be Part of the Password
const LOWERCASE_CHARS = getChartSetCodes(97, 122);
const UPPERCASE_CHARS = getChartSetCodes(65, 90);
const NUMBER_CHARS = getChartSetCodes(48, 57);
const SYMBOL_CHARS = getChartSetCodes(33, 47)
                    .concat(getChartSetCodes(58, 64))
                    .concat(getChartSetCodes(91, 96))
                    .concat(getChartSetCodes(123, 126));

// Write Password To The #password Input
function writePassword() {
  const password = generatePassword();
  var passwordText = document.querySelector("#password");
  passwordText.value = password;
}

// Generate a Password Utilizing the Characters from the Defined Codes
function generatePassword() {

  const passLength = askUserForPassLength();

  // User Cancelled Operation
  if (passLength == -1)
    return;
  
  const inputUpper = askUserYesOrNo("Would You Like to Include Upper Case Letters?");
  const inputLower = askUserYesOrNo("Would You Like to Include Lower Case Letters?");
  const inputNumbs = askUserYesOrNo("Would You Like to Include Numbers?");
  const inputSymbs = askUserYesOrNo("Would You Like to Include Symbols?");

  var allRejected = false;

  if (!inputUpper && !inputLower && !inputNumbs && !inputSymbs) { 
    alert("All Options Were Rejected, Including Default Set");
    allRejected = true;
  }

  var currWorkingSet = [];

  if (inputNumbs || allRejected)
    currWorkingSet = currWorkingSet.concat(NUMBER_CHARS);
  
  if (inputUpper || allRejected)
    currWorkingSet = currWorkingSet.concat(UPPERCASE_CHARS);
  
  if (inputSymbs || allRejected)
    currWorkingSet = currWorkingSet.concat(SYMBOL_CHARS);

  if (inputLower || allRejected)
    currWorkingSet = currWorkingSet.concat(LOWERCASE_CHARS);

  var currentPass = [];
  
  for (var i = 0; i < passLength; i++) {
    
    var charCode = currWorkingSet[getRandomInt(0, currWorkingSet.length)];

    currentPass.push(String.fromCharCode(charCode));
  }

  return currentPass.join("");
}

// Generate a Randon Number Between the Defined Set
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Returs an Array From the Specified Limits
function getChartSetCodes(min, max) { 
  var retArray = [];

  for (var i = min; i <= max; i++) { 
    retArray.push(i);
  }

  return retArray;
}

// Prompts User for Password Length And Validates Input
function askUserForPassLength() { 
  var ret = -1;

  while (ret < 0) {
    var lengthInput = prompt("Provide a Length for Your Password (Between 8 and 128)");

    // Stop Cicle if User Cancelled;
    if (lengthInput === undefined)
      break;

    if (isNaN(lengthInput)) {
      alert("Provided Password Length is Not a Valid Number");
      continue;
    }
    
    if (lengthInput < 8) {
      alert("Provided Password Length is Less Than 8 Characters");
      continue;
    }
    else if (lengthInput > 128) {
      alert("Provided Password Length is Greater Than 128 Characters");
      continue;
    }

    ret = lengthInput;
  }

  return ret;
}

// Prompts user for Yes/No Question and Validates Input
function askUserYesOrNo(prompText) { 

  var retResponse;

  while (retResponse === undefined) {

    var userResponse = prompt(`${prompText} (yes / no)`);

    // If User Presses Cancel, Assume Option Was Denied
    if (userResponse == undefined)
      break;

    userResponse = userResponse.toLowerCase();

    if (userResponse.charAt(0) === "y")
      retResponse = true;
    else if (userResponse.charAt(0) === "n")
      retResponse = false;
    else
      alert("Invalid Input for Selection, Try Again! :(");
  }

  return retResponse;
}


// Add Event Listener to Generate Button
generateBtn.addEventListener("click", writePassword);
