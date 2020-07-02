const inquirer = require("inquirer");
const connection = require("./connection/connection.js");
const figlet = require("figlet");

// Intro using figlet
console.log(figlet.textSync('Employee Tracker', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

function questions() {

    inquirer.prompt({
        message: "Hello I'm HAL, What do you want to do?",
        type: "list",
        name: "choice",
        choices: [
            "Add Employee",
            "Add Department",
            "Add Role",
            "View Employees",
            "View Departments",
            "View Roles",
            "Update Employee Manager",
            "Delete Employee",
            "Delete Department",
            "Delete Role"
        ]
    }).then(answers => {
        switch (answers.choice) {
            case "Add Employee":
                addEmployee()
                break;

            case "View Employees":
                viewEmployees()
                break;
            case "Add Department":
                addDepartment()
                break;
            case "View Departments":
                viewDepartment()
                break;
            case "Add Role":
                addRole()
                break;
            case "View Roles":
                viewRoles()
                break;
            case "Update Employee Manager":
                updateEmployee()
                break;
            case "Delete Employee":
                deleteEmployee()
                break;
            case "Delete Department":
                deleteDepartment()
                break;
            case "Delete Role":
                deleteRole()
                break;

        }

        function addEmployee() {
            inquirer.prompt([

                {
                    type: "input",
                    name: "firstName",
                    message: "What is the peep's first name?"
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the peep's last name?"
                },
                {
                    type: "list",
                    name: "roleId",
                    message: "What is the peep's role?",
                    choices: [
                        "1 Salesman",
                        "2 Developer",
                        "3 Accountant",
                        "4 Analyst",
                        "5 Manager"
                    ]
                },
                {
                    type: "number",
                    name: "managerId",
                    message: "What is the peep's manager's ID?"
                }
            ]).then(function (res) {
                var roleID = res.roleId.split(" ");
                connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [res.firstName, res.lastName, roleID[0], res.managerId], function (err, data) {
                    if (err) throw err;
                    console.table("Awesome! You have successfully added an employee!");
                    questions();

                })
            })
        }
    })
}

questions();

function viewDepartment() {
    connection.query("SELECT * FROM department", function (err, data) {
        if (err) throw err;
        console.table(data);
        questions();

    })
}
function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, data) {
        if (err) throw err;
        console.table(data);
        questions();
    })
}
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "So you want a new department, please insert name."
        }
    ]).then(function (res) {
        connection.query("INSERT INTO department (name) VALUES (?)", [res.department], function (err, data) {
            if (err) throw err;
            console.table("Awesome! You have successfully added a department!");
            questions();
        })
    })
}
function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter employee's title"
        },
        {
            type: "number",
            name: "salary",
            message: "Enter employee's salary"

        },
        {
            type: "input",
            name: "departmentId",
            message: "Enter department ID"
        }
    ]).then(function (res) {
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [res.title, res.salary, res.departmentId], function (err, data) {
            if (err) throw err;
            console.table("Awesome! You have successfully added a role!");
            questions();
        })
    })
}
function viewRoles() {
    connection.query("SELECT * FROM role", function (err, data) {
        if (err) throw err;
        console.table(data);
        questions();
    })
}


// updating employees

async function updateEmployee() {
    const employees = await connection.query("SELECT id, first_name, last_name FROM employee")
    const employeeChoices = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
    }))

    const employeeId = await
        inquirer.prompt(
            {
                type: "list",
                name: "eName",
                message: "Select employee you want to update:",
                choices: employeeChoices
            }
        )

    const managers = await connection.query("SELECT id, first_name, last_name FROM employee WHERE role_id=5")
    const managerChoices = managers.map(manager => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.id
    }))

    const managerId = await
        inquirer.prompt(
            {
                type: "list",
                name: "eName",
                message: "Select manager:",
                choices: managerChoices
            }
        )
    console.log('managerId', managerId)
    await connection.query("UPDATE employee SET manager_id=? WHERE id=?", [managerId.eName, employeeId.eName])
    console.log("Awesome! You have successfully updated employee!")
    questions();

}

// deleting employess

async function deleteEmployee() {
    const delEmp = await connection.query("SELECT id, first_name, last_name FROM employee")
    const employeeChoices = delEmp.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
    }))

    const employeeId = await
        inquirer.prompt(
            {
                type: "list",
                name: "eName",
                message: "Select the employee you want to delete:",
                choices: employeeChoices
            })

    await connection.query("DELETE from employee where id=?", [employeeId.eName]);
    console.log("Awesome! You have successfully deleted an employee!")
    viewEmployees();
}

// deleting departments

async function deleteDepartment() {
    const delDept = await connection.query("SELECT * FROM department")
    const departmentChoices = delDept.map(dept => ({
        name: `${dept.name}`,
        value: dept.id
    }))

    const departmentId = await
        inquirer.prompt(
            {
                type: "list",
                name: "eName",
                message: "Select the department you want to delete:",
                choices: departmentChoices
            })

    await connection.query("DELETE from department where id=?", [departmentId.eName]);
    console.log("Awesome! You have successfully deleted a department!")
    viewDepartment();
}

//  deleting roles

async function deleteRole() {
    const delRole = await connection.query("SELECT * FROM role")
    const roleChoices = delRole.map(roles => ({
        name: `${roles.title}`,
        value: roles.id
    }))

    const roleId = await
        inquirer.prompt(
            {
                type: "list",
                name: "eName",
                message: "Select the role you want to delete:",
                choices: roleChoices
            })

    await connection.query("DELETE from role where id=?", [roleId.eName]);
    console.log("Awesome! You have successfully deleted a role!")
    viewRoles();
}