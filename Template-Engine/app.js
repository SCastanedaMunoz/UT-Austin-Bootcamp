const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { constants } = require("buffer");

let hasManager = false;

const teamMembers = [];
const ids = [];

init();

function init() {
    console.log("\x1b[37m\x1b[1m","***Starting Template Engine, Answer the Following Questions***");
    getTeamInfo()
    .then(value =>  render(value))
    .then(htmlValue => writeToFile(htmlValue));
}

function getTeamInfo() {
    return new Promise(function (resolve, reject) {
        let role = "";

        const roleQuestion = {
            type: "list",
            message: "Choose the Team Member Role:",
            name: "role",
            choices: [
                { name: "Intern", value: "Intern"},
                { name: "Engineer", value: "Engineer"},
                { name: "Manager", value: "Manager"},
            ]
        };

        let questionsResponse;
        
        if(hasManager) {
            questionsResponse = inquirer
            .prompt(roleQuestion)
            .then(response => {
                role = response.role;
                return inquirer.prompt(getRoleBasedQuestions(role));
            });
        }
        else {
            console.log("\x1b[33m\x1b[1m", "**It Seems Your Team is Missing a Manager, Let's Start Adding One!**")
            role = "Manager";
            questionsResponse = inquirer.prompt(getRoleBasedQuestions(role));
            hasManager = true;
        }

        questionsResponse
        .then(roleBasedResponse => {
            teamMembers.push(getTeamMember(role, roleBasedResponse));

            const addAnotherQuestion = {
                type: "list",
                message: "Would You Like to Add Another Team Member?",
                name: "addMore",
                choices: [
                    { name: "Yes", value: "Yes"},
                    { name: "No", value: "No"},
                ]
            }

            return inquirer.prompt(addAnotherQuestion);      
        })
        .then(response => {
            switch(response.addMore) {
                case "Yes":
                    return getTeamInfo().then(value => resolve(value));
                case "No":
                    return resolve(teamMembers);
            }
        });

        function getRoleBasedQuestions(role) {
            const idMessage = `Enter the ${role}'s ID`;
            const nameMessage = `Enter the ${role}'s Name`;
            const emailMessage = `Enter the ${role}'s Email Address`;

            const baseQuestions = [
                {
                    type: "input",
                    message: idMessage,
                    name: "id",
                    validate: async input => {

                        if(!input || input.trim().length == 0)
                            return 'ID for Team Member Must be Provided'

                        if(isNaN(input))
                            return 'ID Must be a Numeric Value';
        
                        if(input < 0)
                            return 'ID Must be Greater or Equal 0'

                        if(ids.indexOf(input) >= 0)
                            return 'ID has Already been Given to Another Team Member'

                        ids.push(input);
                        return true;
                    }
                },
                {
                    type: "input",
                    message: nameMessage,
                    name: "name",
                    validate: async input => {

                        if(!input || input.trim().length == 0)
                            return 'Name for Team Member Must be Provided'
        
                        return true;
                    }
                },
                {
                    type: "input",
                    message: emailMessage,
                    name: "email",
                    validate: async input => {
                        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if(!re.test(input.toLowerCase()))
                            return 'Email Should be a Valid Email Address'
        
                        return true;
                    }
                },
            ];

            switch(role) {
                case "Intern":
                    return [
                        ...baseQuestions,
                        {
                            type: "input",
                            message: "Enter the Intern's School",
                            name: "school",
                            validate: async input => {

                                if(!input || input.trim().length == 0)
                                    return 'School for Intern Must be Provided'
                
                                return true;
                            }
                        }
                    ];
                case "Engineer":
                    return [
                        ...baseQuestions, 
                        {
                            type: "input",
                            message: "Enter the Engineer's GitHub",
                            name: "github",
                            validate: async input => {

                                if(!input || input.trim().length == 0)
                                    return 'GitHub Username for Engineer Must be Provided'
                
                                return true;
                            }
                        }
                    ];
                case "Manager":
                    return [
                        ...baseQuestions,
                        {
                            type: "input",
                            message: "Enter the Manager's Office Number",
                            name: "officeNumber",
                            validate: async input => {

                                if(!input || input.trim().length == 0)
                                    return 'Office Number for Team Member Must be Provided'
        
                                if(isNaN(input))
                                    return 'Office Number Must be a Numeric Value';
                
                                if(input < 0)
                                    return 'Office Number Must be Greater or Equal 0'
                
                                return true;
                            }
                        }
                    ];
                default:
                    reject(Error(`Undefined Role: ${role} Selected, Please Send Stack Trace and Create Issue at: https://github.com/SCastanedaMunoz/Template-Engine/issues`));
            }
        }

        function getTeamMember(role, values) {
            switch(role) {
                case "Intern":
                    return new Intern(values.name, values.id, values.email, values.school);
                case "Engineer":
                    return new Engineer(values.name, values.id, values.email, values.github);
                case "Manager":
                    return new Manager(values.name, values.id, values.email, values.officeNumber);
                default:
                    reject(Error(`Undefined Role: ${role} Selected, With Response: ${JSON.stringify(values)} Please Send Stack Trace and Create Issue at: https://github.com/SCastanedaMunoz/Template-Engine/issues`));
            }
        }
    });
}

function writeToFile(data) {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdir(OUTPUT_DIR, err => {
            if (err) {
                throw Error(err);
            }
        });
    }

    fs.copyFile("./templates/style.css", path.join(OUTPUT_DIR, "style.css"), err => {
        if (err) {
            throw Error(err);
        }
    });

    fs.writeFile(outputPath, data, "utf-8", err => {
        if (err) {
            throw Error(err);
        }
        console.log("\x1b[32m\x1b[1m", `***Team Templated saved at ${outputPath}***`);
    });
}