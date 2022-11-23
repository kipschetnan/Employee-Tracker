const inquirer = require('inquirer')
const server = require('../server')
const config = require('../config/connection')
const mysql = require('mysql2')
const cTable = require('console.table')
const db = mysql.createConnection(config)

let roleChoices = []
let manageChoices = ['None']

db.query('SELECT title FROM role', function(err, results, fields) {
    for(let i = 0; i < results.length; i++) {
        roleChoices.push(results[i].title)
    }
})

db.query('SELECT first_name, last_name FROM employee', function(err, results, fields) {
    
    for(let i = 0; i < results.length; i++) {
        manageChoices.push(results[i].first_name + ' ' + results[i].last_name)
    }
})

const questions = [
    {
        type: 'input',
        name: 'fname',
        message: 'What is the first name? '
    },
    {
        type: 'input',
        name: 'lname',
        message: 'What is the last name? '
    },
    {
        type: 'list',
        name: 'role',
        message: 'Which is the role of the employee? ',
        choices: roleChoices
    },
    {
        type: 'list',
        name: 'manager',
        message: 'Who is the manager of the employee? ',
        choices: manageChoices
    }
]

const addEmployee = () => {
    console.log(roleChoices)
    console.log(manageChoices)
    return inquirer.prompt(questions)
        .then((answer) => {
            const first = answer.fname
            const last = answer.lname
            const rl = answer.role
            const manage = answer.manager
            let manageId
            let rlId

            for(let i = 0; i < roleChoices.length; i++) {
                if(roleChoices[i] === rl) {
                    rlId = i+1
                }
            }
            
            for(let i = 0; i < manageChoices.length; i++){
                if(manageChoices[i] === manage) {
                    manageId = i+1
                } else {
                    manageId = null
                }
            }
            let stmt = "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)"
            db.query(stmt, [first, last, rlId, manageId], function (err, result) {
                if(err) {
                    console.error(err.message)
                } else {
                    console.log(`Added ${first} ${last} to the database`)
                }
            })
            server.menu()
        })
        .catch((error) => {
            console.log(error)
        })
}

const viewEmployees = () => {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dep_name, role.salary, employee.manager_id FROM employee JOIN role ON role.id = employee.role_id JOIN department ON role.department_id = department.id', function(err, results, fields) {
        console.table(results)
        server.menu()
    })
    
}

module.exports = {addEmployee, viewEmployees}