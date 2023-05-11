const data = {
  employees: require("../model/employees.json"),
  setNewEmployees: function (newData) {
    this.employees = newData;
  },
};

const fetchAllEmployees = (req, res) => {
  res.json(data.employees);
};

const addNewEmployees = (req, res) => {
  const newEmployeeData = {
    id: data.employees.at(-1).id + 1 || 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: req.body.role || "employee",
  };

  // check if firstName and lastName are sent
  if (!newEmployeeData.firstName || !newEmployeeData.lastName) {
    console.log(req.body);
    return res.status(400).json({
      // 400 means Bad request error that is required parameters are not sent
      error: true,
      errMessage: "first name and last name both are required",
    });
  }

  // check if the employee already present
  const isAlreadyExists = data.employees.some(
    (emp) =>
      emp.firstName === newEmployeeData.firstName &&
      emp.lastName === newEmployeeData.lastName &&
      emp.role === newEmployeeData.role
  );

  // Return 409 Conflict status code
  if (isAlreadyExists) {
    return res.status(409).json({
      error: true,
      errorMessage: "The resource already exists or Duplicate resource",
    });
  }

  data.setNewEmployees([...data.employees, newEmployeeData]);
  res.status(201).json(data.employees); // 201 means new record created
};

const updateEmployee = (req, res) => {
  // checks if id is present
  if (!req.body.id)
    return res.status(400).json({
      error: true,
      errMessage: "400 - bad request. id not served, absence of id",
    });

  const employee = data.employees.find((emp) => emp.id === req.body.id);

  if (!employee) {
    return res.status(400).json({
      error: true,
      errMessage: `can't update employee, employee with id ${req.body.id} not found`,
    });
  }

  // no error if the paramaters are not sent of update
  if (req.body.firstName) employee.firstName = req.body.firstName;
  if (req.body.lastName) employee.lastName = req.body.lastName;
  if (req.body.role) employee.role = req.body.role;

  const updatedEmployees = data.employees.map((emp) => {
    if (emp.id === req.body.id) return employee;
    return emp;
  });

  data.setNewEmployees([...updatedEmployees]);
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  // checks if id is present
  if (!req.body.id)
    return res.status(400).json({
      error: true,
      errMessage: "400 - bad request. id not served, absence of id",
    });

  const employeeId = req.body.id;
  const employeeData = data.employees.find(
    (emp) => emp.id === employeeId
  );

  if (employeeData) {
    const newEmployeeData = data.employees.filter(emp => emp.id !== employeeId)
    data.employees = [...newEmployeeData]
    res.send(data.employees);
  } else {
    res.status(400).json({
      error: true,
      errorMessage: `404 - bad request - can't perform delete operation - invalid id or employee with id ${employeeId} not found`,
    });
  }
};

const getEmployee = (req, res) => {
  const employeeId = req.params.id;

  const employeeData = data.employees.find(
    (emp) => emp.id === Number(employeeId)
  );
  if (employeeData) {
    res.json(employeeData);
  } else {
    res.status(400).json({
      error: true,
      errorMessage: `400 - bad request, invalid id or employee with id ${employeeId} not found`,
    });
  }
};

module.exports = {
  fetchAllEmployees,
  addNewEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
