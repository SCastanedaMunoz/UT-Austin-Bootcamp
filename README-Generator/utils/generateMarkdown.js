const fs = require("fs");

// function to generate markdown for README
function generateMarkdown(data) {

  return new Promise(function (resolve, reject) {
    let licenseContents = "";

    fs.readFile(`./utils/licenses/${data.license.name}.txt`, "utf-8", (err, licenseData) => {
      if (err) {
        return reject(err);
      }
      licenseContents = licenseData;
      let currentDate = new Date();
      licenseContents = licenseContents.replace("[yyyy]", currentDate.getFullYear());
      licenseContents = licenseContents.replace("[Copyright_Owner]", data.devname);

      let markdownContent =
`![License: ${data.license.name}](${data.license.badge})

# **${data.title}**

## **Description**
${data.description}

## **Table of Contents**
* [Description](##Description)
* [Installation](##Installation)
* [Usage](##Usage)
* [License](##License)
* [Contributing](##Contributing)
* [Tests](##Tests)
* [Questions](##Questions)

## **Installation**
${data.installation}

## **Usage**
${data.usage}

## **License**

This project is under the ${data.license.name} License:

${licenseContents}

## **Contributing**
${data.contribution}

## **Tests**
${data.tests}

## **Questions**
${data.questioning}

### ***GitHub Profile***
https://github.com/${data.username}

### ***Email Contact***
[${data.email}](mailto:${data.email})`;
      let ret = {
        filename: data.filename,
        markdown: markdownContent
      }
      resolve(ret);
    });
  });
}

module.exports = generateMarkdown;