const inquirer = require('inquirer')
const server = require('../server')
const config = require('../config/connection')
const mysql = require('mysql2')
const cTable = require('console.table')
const db = mysql.createConnection(config)

let choices = []
db.query('SELECT dep_name FROM department', function(err, results, fields) {
    for(let i = 0; i < results.length; i++) {
        choices.push(results[i].dep_name)
    }
})
const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the name of the role? '
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role? '
    },
    {
        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to? ',
        choices: choices
    }
]

const addRole = () => {
    console.log(choices)
    return inquirer.prompt(questions)
        .then((answer) => {
            const title = answer.title
            const salary = answer.salary
            const dep = answer.department
            let depId
            for(let i = 0; i < choices.length; i++) {
                if(choices[i] === dep) {
                    depId = i+1
                }
            }
            let stmt = "INSERT INTO role(title, salary, department_id) VALUES(?,?,?)"
            db.query(stmt, [title, salary, depId], function (err, result) {
                if(err) {
                    console.error(err.message)
                } else {
                    console.log(`Added ${title} to the database`)
                }
            })
            server.menu()
        })
        .catch((error) => {
            console.log(error)
        })
}

const viewRoles = () => {
    db.query('SELECT role.id, role.title, role.salary, department.dep_name FROM role JOIN department ON department.id = role.department_id', function(err, results, fields) {
        console.table(results)
        server.menu()
    })
}

module.exports = {addRole, viewRoles}