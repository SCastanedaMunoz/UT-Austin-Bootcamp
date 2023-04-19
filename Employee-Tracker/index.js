const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");

const connnection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_tracker"
});

connnection.connect(err => {
    if (err) {
        throw err;
    }
    init();
});

function init() {
    console.log(chalk.blueBright("\nWelcome to Employee Tracker CLI!\n"));
    mainPrompt();
}

function mainPrompt() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What Would You Like to Do?",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "View All Employees by Department",
            "View All Employees by Manager",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "Delete Employee",
            "Exit"
        ]
    }).then(onMainPromptAnswer);
}

function onMainPromptAnswer({action}) {
    switch(action) {
        case "View All Departments":
            allDepartmentSearch();
            break;
        case "View All Roles":
            allRoleSearch();
            break;
        case "View All Employees":
            allEmployeeSearch();
            break;
        case "View All Employees by Department":
            allEmployeeByDepartmentSearch();
            break;
        case "View All Employees by Manager":
            allEmployeeByManagerSearch();
            break;
        case "Add Department":
            addDeparment();
            break;
        case "Add Role":
            addRole();
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "Update Employee Role":
            updateEmployeeRole();
            break;
        case "Update Employee Manager":
            updateEmployeeManager();
            break;
        case "Delete Employee":
            deleteEmployee();
            break;
        default:
            connnection.end();
    }
}

const allDepartmentQuery = "SELECT * FROM department";
function allDepartmentSearch() {
    consoleOutQuery(allDepartmentQuery, chalk.greenBright(`\nSeeing All Departments!\n`));
}

const allRoleQuery = "SELECT * FROM role";
function allRoleSearch() {
    consoleOutQuery(allRoleQuery, chalk.greenBright(`\nSeeing All Roles!\n`));
}

const allEmployeeByNameQuery = "SELECT id, CONCAT(e.first_name, ' ', e.last_name) as name FROM employee_tracker.employee e"; 
function allEmployeeSearch() {
    const allEmployeeQuery = 
    `SELECT 
	    e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(e1.first_name, " ", e1.last_name) as manager 
    FROM 
	    employee e
    INNER JOIN role r ON e.role_id = r.id 
    INNER JOIN department d ON r.department_id = d.id
    LEFT JOIN employee e1 ON e.manager_id = e1.id;`;
    consoleOutQuery(allEmployeeQuery, chalk.greenBright(`\nSeeing All Employees!\n`));
}

function allEmployeeByDepartmentSearch() {
    const allEmployeeQueryByDeparment = 
    `SELECT 
	    e.first_name, e.last_name, r.title, r.salary, CONCAT(e1.first_name, " ", e1.last_name) as manager 
    FROM 
	    employee e
    INNER JOIN role r ON e.role_id = r.id 
    LEFT JOIN employee e1 ON e.manager_id = e1.id
    WHERE r.department_id = ?`;
    connnection.query(allDepartmentQuery, (err, allDepRes) => {
        if(err)
            throw err;

        inquirer.prompt({
            name: "department",
            type: "list",
            message: "What Department Would You Like To See?",
            choices: allDepRes
        }).then(({department}) => {
            let {id} = allDepRes.find(item => item.name === department);
            connnection.query(allEmployeeQueryByDeparment, id, (err, res) => {
                if(err)
                    throw err;
                console.log(chalk.greenBright(`\nSeeing All Employees From ${department} Department!\n`))
                console.table(res);
                mainPrompt();
            })
        });
    });
}

const allManagersQuery = 
`SELECT 
    m.id, CONCAT(m.first_name, " ", m.last_name) AS name
FROM   employee e
JOIN   employee m on e.manager_id = m.id
GROUP BY (e.manager_id)`;
function allEmployeeByManagerSearch() {
   
    const allEmployeeByManagerQuery = 
    `SELECT 
	    e.first_name, e.last_name, r.title, r.salary, d.name AS department
    FROM 
	    employee e
    INNER JOIN role r ON e.role_id = r.id 
    INNER JOIN department d ON r.department_id = d.id
    WHERE e.manager_id = ?`;

    connnection.query(allManagersQuery, (err, allManagersRes) => {
        if(err)
            throw err;
        inquirer.prompt({
            name: "manager",
            type: "list",
            message: "What Manager's Employees Would You Like To See?",
            choices: allManagersRes
        }).then(({manager}) => {
            let {id} = allManagersRes.find(item => item.name === manager);
            connnection.query(allEmployeeByManagerQuery, id, (err, res) => {
                if(err)
                    throw err;
                console.log(chalk.greenBright(`\nSeeing All Employees Managed by ${manager}!\n`))
                console.table(res);
                mainPrompt();
            });
        });
    });
}

function addDeparment() {
    const addDepartmentQuery = 
    `INSERT INTO department (name)
    SELECT * FROM (SELECT ?) AS tmp
    WHERE NOT EXISTS (
        SELECT name FROM department WHERE name = ?
    )
    LIMIT 1`;
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What's the Department Name?",
        validate: async input => {
            if(!input || input.trim().length == 0)
                return 'Department Name Must be Provided';
            return true;
        }
    }).then(({department}) => {
        connnection.query(addDepartmentQuery, [department, department], (err, res) => {
            if(err)
                throw err;
            
            if(res.affectedRows === 0) {
                console.log(chalk.redBright(`\n${chalk.yellowBright(department)} Department Already Exists on Database Ignoring Query!\n`));
                return mainPrompt();
            }

            console.log(chalk.greenBright(`\nSuccessfully Added ${chalk.yellowBright(department)} Department`));
            allDepartmentSearch();
        });
    });
}

function addRole() {
    const addRoleQuery = 
    `INSERT INTO 
        role(title, salary, department_id)
    SELECT * FROM (SELECT ?, ?, ?) AS tmp
    WHERE NOT EXISTS (
        SELECT title FROM role WHERE title = ?
    )
    LIMIT 1`;

    connnection.query(allDepartmentQuery, (err, allDepRes) => {
        if (err)
            throw err;
        let selectedDepartment;
        
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "What Department Does The New Role Belong To?",
            choices: allDepRes
        }).then(({department}) => {
            selectedDepartment = allDepRes.find(item => item.name === department);
            return inquirer.prompt([{
                name: "title",
                type: "input",
                message: "What Is the Role Title?",
                validate: async input => {
                    if(!input || input.trim().length == 0)
                        return 'Role Title Must be Provided';
                    return true;
                }
            }, {
                name: "salary",
                type: "input",
                message: "What Is the Role Salary?",
                validate: async input => {
                    if(!input || input.trim().length == 0)
                    return 'Salary Must be Provided'

                    if(isNaN(input))
                        return 'Salary Must be a Numeric Value';

                    if(input < 0)
                        return 'Salary Must be Greater or Equal 0'
                    return true;
                }
            }]);
        }).then(({title, salary}) =>  {
            connnection.query(addRoleQuery, [title, salary, selectedDepartment.id, title], (err, res) => {
                if (err)
                    throw err;

                if(res.affectedRows === 0) {
                    console.log(chalk.redBright(`\n${chalk.yellowBright(title)} Role Already Exists on Database Ignoring Query!\n`));
                    return mainPrompt();
                }

                console.log(chalk.greenBright(`\nSuccessfully Added ${chalk.yellowBright(title)} Role Into ${chalk.yellowBright(selectedDepartment.name)} Department`));
                allRoleSearch();
            });
        });
    });
}

const allRoleByTitleQuery = "SELECT id, title as name, salary, department_id FROM role";
function addEmployee() {
    const noManagerKey = "=====No Manager=====";
    let role_id;
    let manager_id;
    getRole();

    function getRole() {
        connnection.query(allRoleByTitleQuery, (err, allRoleRes) => {
            if (err)
                throw err;
            
            inquirer.prompt({
                name: "role",
                type: "list",
                message: "What Is The New Employee Role?",
                choices: allRoleRes
            }).then(({role}) => {
                role_id = allRoleRes.find(item => item.name === role).id;
                getManager();
            });
        });
    }

    function getManager() {
        connnection.query(allEmployeeByNameQuery, (err, res) => {
            if (err)
                throw err;

            res.push({name: noManagerKey});
            
            inquirer.prompt({
                name: "manager",
                type: "list",
                message: "Who Will Be This Employee's Manager?",
                choices: res
            },).then(({manager}) => {
                if(manager === noManagerKey)
                    manager_id = null;
                else
                    manager_id = res.find(item => item.name === manager).id;
                insertEmployee();
            });
        });
    }

    const insertEmployeeQuery = 
    `INSERT INTO 
        employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
    function insertEmployee() {
        inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "What Is The Employee First Name?",
                validate: async input => {
                    if(!input || input.trim().length == 0)
                        return 'First Name Must be Provided';
                    return true;
                }
            },
            {
                name: "last_name",
                type: "input",
                message: "What Is The Employee Last Name?",
                validate: async input => {
                    if(!input || input.trim().length == 0)
                        return 'Last Name Must be Provided';
                    return true;
                }
            }
        ]).then(({first_name, last_name}) => {
            connnection.query(insertEmployeeQuery, [first_name, last_name, role_id, manager_id], (err, res) => {
                if (err)
                    throw err;
                console.log(chalk.greenBright(`\nSuccessfully Added: ${chalk.yellowBright(`${first_name} ${last_name}`)} As Employee`));
                allEmployeeSearch();
            });
        });
    }
}

function updateEmployeeRole() {
    const updateEmployeeRoleQuery = `UPDATE employee_tracker.employee SET role_id = ? WHERE id = ?;`
    connnection.query(allEmployeeByNameQuery, (errE, allEmployee) => {
        if (errE)
            throw errE;
        connnection.query(allRoleByTitleQuery, (errR, allRole) => {
            if (errR)
                throw errR;

            inquirer.prompt([{
                name: "employee_name",
                type: "list",
                message: "What Employee Would You Like To Update?",
                choices: allEmployee
            },{
                name: "role_title",
                type: "list",
                message: "What Role Would You Like To Give To This Employee?",
                choices: allRole
            }]).then(({employee_name, role_title}) => {
                let employee = allEmployee.find(item => item.name === employee_name);
                let role = allRole.find(item => item.name === role_title);
                connnection.query(updateEmployeeRoleQuery, [role.id, employee.id], (err, res) =>{
                    if (err)
                        throw err;
                    console.log(chalk.greenBright(`\nSuccessfully Updated ${chalk.yellowBright(employee_name)} Role To ${chalk.yellowBright(role_title)}\n`));
                    mainPrompt();
                });
            });
        });
    });
}

function updateEmployeeManager() {
    const noManagerKey = "=====No Manager=====";
    const updateEmployeeManagerQuery = `UPDATE employee_tracker.employee SET manager_id = ? WHERE id = ?;`
    connnection.query(allEmployeeByNameQuery, (errE, allEmployee) => {
        if (errE)
            throw errE;

        let employee;
        
        inquirer.prompt({
            name: "employee_name",
            type: "list",
            message: "What Employee Would You Like To Update?",
            choices: allEmployee
        }).then(({employee_name}) => {
            employee = allEmployee.find(item => item.name === employee_name);
            const possibleManagers = allEmployee.filter(item => item.name !== employee_name);
            possibleManagers.push({name: noManagerKey});

            return inquirer.prompt({
                name: "manager",
                type: "list",
                message: "Who Would You Like The New Manager to Be?",
                choices: possibleManagers
            });
        }).then(({manager}) => {
            let manager_id;
            let manager_name;
            if(manager === noManagerKey)
            {
                manager_id = null;
                manager_name = "No Manager";
            }
            else
            {
                let m = allEmployee.find(item => item.name === manager);
                manager_id = m.id;
                manager_name = m.name;
            }

            connnection.query(updateEmployeeManagerQuery, [manager_id, employee.id], (err, res) => {
                if(err)
                    throw err;
                console.log(chalk.greenBright(`\nSuccessfully Updated ${chalk.yellowBright(employee.name)} Manager To ${chalk.yellowBright(manager_name)}\n`));
                mainPrompt();
            });
        });
    });
}

function deleteEmployee() {
    const deleteEmployeeQuery = `DELETE FROM employee WHERE id = ?`
    connnection.query(allEmployeeByNameQuery, (err, res) => {
        if (err)
            throw err;
        
        inquirer.prompt({
            name: "name",
            type:"list",
            message: "What Employee Would You Like To Delete?",
            choices: res
        }).then(({name}) => {
            let employee = res.find(item => item.name === name);
            connnection.query(deleteEmployeeQuery, employee.id, (err, res) => {
                if(err)
                    throw err;
                console.log(chalk.greenBright(`\nSuccessfully Deleted ${chalk.yellowBright(employee.name)} From Employees\n`));
                mainPrompt();
            });
        });
    });
}

function consoleOutQuery(query, message) {
    connnection.query(query, (err, res) => {
        if(err)
            throw err;
        console.log(message);
        console.table(res);
        mainPrompt();
    });
}
