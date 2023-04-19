![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

# **Employee Tracker**

## **Description**
**Employee Tracker** is a CLI app utilizing **Node**, **MySQL**, **Inquirer** application intented to architect and build a solution for managing a company's employees. Since this is my first application utilizing MySQL and Node, I did not intent to utilize an ORM to organize my Queries from my App. Instead, I try to simply organize my queries in my main app and keep it as consise as possible. If needed, I would have broken down the queries by specific tables and departments but I did not deem it necessary.

## **Table of Contents**
* [Description](##Description)
* [Installation](##Installation)
* [Usage](##Usage)
* [License](##License)
* [Contributing](##Contributing)
* [Tests](##Tests)
* [Questions](##Questions)

## **Installation**
In order to install **Employee Tracker**, there is a multitude of steps to follow. Here is quick guide on how to install the project and get it up and running. 

1. Clone the Project Repository: [Here!](https://github.com/SCastanedaMunoz/Employee-Tracker)
2. Run **npm install** in order to get all of the project dependencies.
3. Make sure your MySQL environment setup, then run **schema.sql** in order to create the database, and **seeds.sql** to populate such database with some entries.
4. Modify the Database Connection in **Index.js** in order to utilize your root user's password. **IMPORTANT!!** If this step is not completed, you will fail to connect to your local database.
5. In order to run the app, use **node index.js**
6. If everything goes well, you should be able to start using the **Employee Tracker** CLI app.

## **Usage**
As mentioned before, The main purpose of this application is intented to architect and build a solution for managing a company's employees. There is a multitude of options for to choose in order to interact with the database. From visualizing data, to updating, adding, and deleting data.

Here is a Video Walkthrough on how to use the app: [Video Walkthrough.](https://drive.google.com/file/d/1SPcJk9EZVkmtZlBdaOW40c1kR8XU7WVB/view)

## **License**

This project is under the MIT License:

    Copyright (c) 2020 Santiago Castaneda Munoz

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

## **Contributing**
If you wish to contribute to the project, make sure to read the following guidelines:

* Any found bugs should be reported to the repository Issues Tab.
* If you wish your changes to be merged into the app, make sure to create well written, documented and testable code. ***Include Unit Tests***
* If you wish to add a new feature, make sure to include *user stories* as how your feature will help the app. 
* Create a pull request, after proper review it will be merged into the Git Repository

## **Tests**
As of right now, the only way to test the application is by running the node index.js file which triggers the app main functionality. Proper Unit Testing has been integrateg to enrue proper maintainability.

## **Questions**
If you have any questions regarding this app, feel free to contact me through my email, the [README Generator Repo](https://github.com/SCastanedaMunoz/README-Generator). All questions will be answered in a reasonable amount of time.

### ***GitHub Profile***
https://github.com/SCastanedaMunoz

### ***Email Contact***
[santiagocm98@hotmail.com](mailto:santiagocm98@hotmail.com)