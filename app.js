const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Employee = require("./lib/Employee");
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
var employees = [];

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
    message: "Please enter your unique ID: ",
    name: "ID",
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
        return "Please enter a valid number. Leave out the () or -.";
      }
      return true;
    },
  },
  {
    type: "list",
    name: "totalTeam",
    message: "Do you have team members to add?",
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
        return "Please enter a real name.";
      }
      return true;
    },
  },
  {
    type: "input",
    message: "Please enter your unique ID: ",
    name: "ID",
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
    message: "Please enter your GitHub username: ",
    validate: function (input) {
      if (input.trim() == "") {
        return "Please enter a valid GitHub username.";
      }
      return true;
    },
  },
  {
    when: (input) => {
      return input.role == "intern";
    },
    type: "input",
    name: "school",
    message: "Please enter your school: ",
    validate: function (input) {
      if (input.trim() == "") {
        return "Please enter a valid school.";
      }
      return true;
    },
  },
  {
    type: "list",
    name: "totalTeam",
    message: "Do you have team members to add?",
    choices: ["Yes", "No"],
  },
];

function createTeamList() {
  inquirer.prompt(employeeQuestions).then((employeeInfo) => {
    // buildHtmlPage(outputPath, render(employees));
    if (employeeInfo.role == "intern") {
      let newIntern = new Intern(
        employeeInfo.name,
        employeeInfo.ID,
        employeeInfo.email,
        employeeInfo.school
      );
      teamMembers.push(newIntern);
    } else if (employeeInfo.role == "engineer") {
      let newEngineer = new Engineer(
        employeeInfo.name,
        employeeInfo.ID,
        employeeInfo.email,
        employeeInfo.github
      );
      teamMembers.push(newEngineer);
    } else {
      buildHtmlPage(outputPath, render(teamMembers));
    }
    if (employeeInfo.totalTeam === "Yes") {
      createTeamList();
    }
  });
}

// use the fs write to file and call in the

function buildHtmlPage(fileName, data) {
  fs.writeFileSync(fileName, data, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Success. Your team log was created.");
    }
  });
  console.log(teamMembers);
}

function init() {
  inquirer.prompt(managerQuestions).then((managerInfo) => {
    // const manager = new Manager
    const manager = new Manager(
      managerInfo.name,
      managerInfo.ID,
      managerInfo.email,
      managerInfo.officeNumber
    );
    // pass in the parameters created in the manager.js
    // add the info to the team array
    teamMembers.push(manager);
    //  == means loosely equals
    if (managerInfo.totalTeam == "Yes") {
      createTeamList();
    } else {
      buildHtmlPage(outputPath, render(teamMembers));
    }
  });
}

init();
