const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const inquirer = require('inquirer')
const {addDepartment, viewDepartments} = require('./js/department')
const {addRole, viewRoles} = require('./js/role')
const {addEmployee, viewEmployees} = require('./js/employee')




const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const question = [
    {
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    }
]

function menu() {
    return inquirer.prompt(question)
        .then((answer) => {
            if(answer.menu === 'View All Employees') {
                viewEmployees()
            } else if (answer.menu === 'Add Employee') {
                addEmployee()
            } else if (answer.menu === 'Update Employee Role') {
                
            } else if (answer.menu === 'View All Roles') {
                viewRoles()
            } else if (answer.menu === 'Add Role') {
                addRole()
            } else if (answer.menu === 'View All Departments') {
                viewDepartments()
            } else if (answer.menu === 'Add Department') {
                addDepartment()
            } else {
                return
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

const init = () => {
    menu()
}

init()

exports.menu = menu