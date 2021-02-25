const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
// path can join paths together, similar to fs
// use the output path.. maybe. play around with this
// write data using render to teamMembers array, call

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

var teamMembers = [];

const managerQuestions = [
  {
    type: "input",
    name: "name",
    message: "Enter manager name:",
    validate: function (input) {
      if (input.trim() == "") {
        return "Please enter first or last name.";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "email",
    message: "Please enter the manager's email: ",
    validate: function (input) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
        return true;
      }
      return "Please enter a valid email address.";
    },
  },
  {
    type: "input",
    name: "officeNumber",
    message: "Please enter the office number: ",
    validate: function (input) {
      if (isNaN(input)) {
        return "Please enter a number";
      }
      return true;
    },
  },
  {
    type: "list",
    name: "totalTeam",
    message: "Do you have any team members?",
    choices: ["Yes", "No"],
  },
];

const employeeQuestions = [
  {
    type: "input",
    name: "name",
    message: "Please enter the employee name: ",
    validate: function (input) {
      if (input == "") {
        return "Please enter a name.";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "email",
    message: "Please enter their email: ",
    validate: function (input) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
        return true;
      }
      return "Please enter a valid email address.";
    },
  },
  {
    type: "list",
    name: "role",
    message: "What is their role?",
    choices: ["engineer", "intern", "no other employees"],
  },
  {
    when: (input) => {
      return input.role == "engineer";
    },
    type: "input",
    name: "github",
    message: "Engineer, enter your github username:",
    validate: function (input) {
      if (input.trim() == "") {
        return "Please enter a valid GitHub username";
      }
      return true;
    },
  },
  // add a question to add more people and createTeamList must update, call function again
];

function createTeamList() {
  inquirer.prompt(employeeQuestions).then((employeeInfo) => {
    console.log(employeeInfo);
  });
}

// use the fs write to file and call in the

function buildHtmlPage() {
  fs.writeFileSync(outputPath, render(teamMembers), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("success");
    }
  });
}

function init() {
  inquirer.prompt(managerQuestions).then((managerInfo) => {
    // const manager = new Manager
    const manager = managerInfo.name;
    // pass in the parameters created in the manager.js
    // add the info to the team array
    teamMembers.push(manager);
    //  == means loosely equals
    if (managerInfo.totalTeam == "yes") {
      createTeamList();
    } else {
      buildHtmlPage();
    }
  });
}

init();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
