const inquirer = require('inquirer')
const server = require('../server')
const config = require('../config/connection')
const mysql = require('mysql2');
const cTable = require('console.table');
const db = mysql.createConnection(config)


const question =[
    {
        type: 'input',
        name: 'name',
        message: 'Enter the department name: '
    }
]

const addDepartment = () => {
    return inquirer.prompt(question)
        .then((answer) => {
            const name = answer.name
            let stmt = "INSERT INTO department(dep_name) VALUES(?)"
            db.query(stmt, [name], function (err, result) {
                if(err) {
                    console.error(err.message)
                } else {
                    console.log(`Added ${answer.name} to the database`)
                }
            })
            server.menu()
            
        })
        .catch((error) => {
            console.log(error)
        })
}

const viewDepartments = () => {
    db.query('SELECT * FROM department', function(err, results, fields) {
        console.table(results)
        server.menu()
    })
    
}

module.exports = {addDepartment, viewDepartments}

