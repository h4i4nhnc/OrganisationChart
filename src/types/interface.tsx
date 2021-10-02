export interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
}

export interface IEmployeeOrgApp {
    ceo: Employee;
    // **
    // * Moves the employee with employeeID (uniqueId) under a supervisor (another
    // employee) that has supervisorID (uniqueId).
    // * E.g. move Bob (employeeID) to be subordinate of Georgina (supervisorID).
    // * @param employeeID
    // * @param supervisorID
    move(employeeID: number, supervisorID: number): void;
    /**
     * Undo last move action
     */
    undo(): void;
    /**
     * Redo last undone action
     */
    redo(): void;
}

// depth first search: O(nLogn)
const getEmployeeById = (id: number, root: Employee): Employee | null => {
    if (root.uniqueId === id) return root;
    for (let i = 0; i < root.subordinates.length; i++) {
        if (root.subordinates[i].uniqueId === id) {
            return root.subordinates[i];
        } else {
            const foundInBordinate = getEmployeeById(id, root.subordinates[i]);
            if (foundInBordinate) {
                return foundInBordinate;
            }
        }
    }
    return null;
};

// when add employee to supervisor return a new supervisor
const addEmployee = (
    employee: Employee,
    supervisor: Employee,
    root: Employee
): Employee => {
    if (root === supervisor) {
        root.subordinates.push({ ...employee, subordinates: [] });
        return root;
    } else {
        root.subordinates.forEach((subordinate) => {
            if (getEmployeeById(supervisor.uniqueId, subordinate)) {
                const newSubordinate = addEmployee(
                    employee,
                    supervisor,
                    subordinate
                );
                subordinate = newSubordinate;
                return root;
            }
        });
    }
    return root;
};

const removeEmployee = (employee: Employee, root: Employee): Employee => {
    if (root === employee) {
        console.log("you can not remove ceo");
    }

    if (root.subordinates.includes(employee)) {
        root.subordinates = root.subordinates.filter(
            (subordidate) => subordidate !== employee
        );
        root.subordinates = [...root.subordinates, ...employee.subordinates];
        return root;
    } else {
        root.subordinates.forEach((subordinate) => {
            if (getEmployeeById(employee.uniqueId, subordinate)) {
                subordinate = removeEmployee(employee, subordinate);
            }
        });
    }
    return root;
};

export class EmployeeOrgApp implements IEmployeeOrgApp {
    ceo: Employee;

    constructor(initCeo: Employee) {
        this.ceo = initCeo;
    }

    move(employeeId: number, supervisorId: number) {
        const movingBordinate = getEmployeeById(employeeId, this.ceo);
        const appendSupervisor = getEmployeeById(supervisorId, this.ceo);
        if (!movingBordinate) {
            console.log("employeeId is not exist in organisation");
        } else if (!appendSupervisor) {
            console.log("supervisorId is not exist in organisation");
        } else {
            this.ceo = removeEmployee(movingBordinate, this.ceo);
            addEmployee(movingBordinate, appendSupervisor, this.ceo);
        }
    }
    undo() {}
    redo() {}
}
