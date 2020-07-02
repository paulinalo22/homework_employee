INSERT INTO department (name, id)
VALUES ("Sales", 1), ("Develop", 2), ("Accounting", 3), ("Marketing", 4), ("Manager", 5);

INSERT INTO role (title, salary, department_id)
VALUES ("Salesman", 65000, 1), ("Developer", 90000, 2), ("Accountant", 70000, 3), ("Analyst", 80000, 4), ("Manager", 60000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leslie", "Knope", 5, 1), ("Ben", "Wyatt", 5, 2), ("Jim", "Halpert", 4, NULL), ("Pam", "Beesly", 3, NULL), ("Toby", "Flenderson", 2, NULL);
