const inquirer = require("inquirer");
const fs = require("fs");
const generateMarkdown = require("./utils/generateMarkdown.js");

// Array of questions for user
const questions = [
    {
        type: "input",
        message: "Enter the Project's Title",
        name: "title"
    },
    {
        type: "input",
        message: "Describe the Project",
        name: "description"
    },
    {
        type: "input",
        message: "Describe the Installation Process",
        name: "installation"
    },
    {
        type: "input",
        message: "Describe the Usage Information",
        name: "usage"
    },
    {
        type: "input",
        message: "Describe the Contribution Guidelines",
        name: "contribution"
    },
    {
        type: "input",
        message: "Describe the Test Instructions",
        name: "tests"
    },
    {
        type: "list",
        message: "Choose Your Project's License",
        name: "license",
        choices: [
            { name: "Apache", value: { name: "Apache", badge: "https://img.shields.io/badge/License-Apache%202.0-blue.svg" } },
            { name: "Creative Commons", value: { name: "Creative Commons", badge: "https://img.shields.io/badge/License-CC0%201.0-lightgrey.svg" } },
            { name: "GNU GPLv3", value: { name: "GNU GPLv3", badge: "https://img.shields.io/badge/License-GPLv3-blue.svg" } },
            { name: "ISC", value: { name: "ISC", badge: "https://img.shields.io/badge/License-ISC-blue.svg" } },
            { name: "MIT", value: { name: "MIT", badge: "https://img.shields.io/badge/License-MIT-yellow.svg" } },
            { name: "Unlicense", value: { name: "Unlicense", badge: "https://img.shields.io/badge/License-Unlicense-blue.svg" } },
            { name: "Zlib", value: { name: "Zlib", badge: "https://img.shields.io/badge/License-Zlib-lightgrey.svg" } }
        ]
    },
    {
        type: "input",
        message: "Enter Your GitHub Username",
        name: "username"
    },
    {
        type: "input",
        message: "Enter Your Name",
        name: "devname"
    },
    {
        type: "input",
        message: "Enter Your Email Address",
        name: "email"
    },
    {
        type: "input",
        message: "How Should People Contact You in Case of Questions?",
        name: "questioning"
    },
    {
        type: "input",
        message: "How Would You Like to Name Your README File?",
        name: "filename"
    }
];

// Function to write README file
function writeToFile(fileName, data) {

    const outputsDir = "./outputs";

    if (!fs.existsSync(outputsDir)) {
        fs.mkdir(outputsDir, err => {
            if (err) {
                throw Error(err);
            }
        });
    }

    fs.writeFile(`${outputsDir}/${fileName}.md`, data, "utf-8", err => {
        if (err) {
            throw Error(err);
        }
        console.log(`${fileName}.md saved to outputs folder!`);
    });
}

// Function to initialize program
function init() {
    console.log("\x1b[36m","Starting README Questionaire (MarkDown Supported), Answer the Following Questions to Obtain a README File:");
    inquirer
        .prompt(questions)
        .then(response => generateMarkdown(response))
        .then(data => writeToFile(data.filename, data.markdown));
}

// function call to initialize program
init();