SELECT *
FROM department
JOIN role ON role.department_id = department.id
JOIN employee ON role.id = employee.role_id;