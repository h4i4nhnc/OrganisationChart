export interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
}

export interface Action {
    employee: Employee;
    supervisor: Employee;
    appendSupervisor: Employee;
    isUndone: boolean;
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

// * get the Employee have uniqueId = id from the root of org
// * @param id
// * @param root
// * @retrun Employee or null
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

// * get the Direct supervisor of Employee have uniqueId = id from the root of org
// * @param id
// * @param root
// * @return Employee or null
const getParentByChildId = (id: number, root: Employee): Employee | null => {
    if (root.subordinates.find((item) => item.uniqueId === id)) return root;
    for (let i = 0; i < root.subordinates.length; i++) {
        const foundInBordinate = getParentByChildId(id, root.subordinates[i]);
        if (foundInBordinate) {
            return foundInBordinate;
        }
    }
    return null;
};

// * @param employee
// * @param supervisor
// * @param root
// * @isRemoveSubordinates: remove all employee's subordinates or keep it as employee's subordinates
// * @retrun org's root
const addEmployee = (
    employee: Employee,
    supervisor: Employee,
    root: Employee,
    isRemoveSubordinates: boolean
): Employee => {
    if (root === supervisor) {
        if (isRemoveSubordinates) {
            root.subordinates.push({ ...employee, subordinates: [] });
        } else {
            root.subordinates.push(employee);
        }
        return root;
    } else {
        root.subordinates.forEach((subordinate) => {
            if (getEmployeeById(supervisor.uniqueId, subordinate)) {
                const newSubordinate = addEmployee(
                    employee,
                    supervisor,
                    subordinate,
                    isRemoveSubordinates
                );
                subordinate = newSubordinate;
                return root;
            }
        });
    }
    return root;
};

// * @param employee
// * @param root
// * @isRemoveSubordinates: remove employee's subordinates from org or attach it to employee's current supervisor
// * @retrun org's root
const removeEmployee = (
    employee: Employee,
    root: Employee,
    isRemoveSubordinates: boolean
): Employee => {
    if (root === employee) {
        console.log("you can not remove ceo");
    }

    if (root.subordinates.some((sub) => sub.uniqueId === employee.uniqueId)) {
        root.subordinates = root.subordinates.filter(
            (subordidate) => subordidate.uniqueId !== employee.uniqueId
        );
        if (!isRemoveSubordinates) {
            root.subordinates = [
                ...root.subordinates,
                ...employee.subordinates,
            ];
        }
        return root;
    } else {
        root.subordinates.forEach((subordinate) => {
            if (getEmployeeById(employee.uniqueId, subordinate)) {
                subordinate = removeEmployee(
                    employee,
                    subordinate,
                    isRemoveSubordinates
                );
            }
        });
    }
    return root;
};

export class EmployeeOrgApp implements IEmployeeOrgApp {
    ceo: Employee;
    lastAction?: Action;

    constructor(ceo: Employee) {
        this.ceo = ceo;
    }

    // getters
    getLastAction() {
        return this.lastAction;
    }

    // methods
    move(employeeId: number, supervisorId: number): string {
        const movingBordinate = getEmployeeById(employeeId, this.ceo);
        const appendSupervisor = getEmployeeById(supervisorId, this.ceo);
        const oldSupervisor = getParentByChildId(employeeId, this.ceo);
        if (!movingBordinate || !appendSupervisor) {
            return "employeeId or supervisorId is not exist in organisation";
        } else if (!oldSupervisor) {
            return "can not move the ceo";
        } else if (appendSupervisor.uniqueId === oldSupervisor.uniqueId) {
            return `employeeId: ${employeeId} is already bordinate of supervisorId: ${supervisorId} `;
        } else {
            this.lastAction = {
                employee: { ...movingBordinate },
                supervisor: oldSupervisor,
                appendSupervisor: appendSupervisor,
                isUndone: false,
            };
            removeEmployee(movingBordinate, this.ceo, false);
            addEmployee(movingBordinate, appendSupervisor, this.ceo, true);
            return "success";
        }
    }
    undo() {
        if (this.lastAction && !this.lastAction.isUndone) {
            const backupEmployee = { ...this.lastAction.employee };
            removeEmployee(this.lastAction.employee, this.ceo, true);
            this.lastAction.employee.subordinates.forEach((item) => {
                removeEmployee(item, this.ceo, true);
            });

            addEmployee(
                backupEmployee,
                this.lastAction.supervisor,
                this.ceo,
                false
            );

            this.lastAction.isUndone = true;
        }
    }
    redo() {
        if (this.lastAction && this.lastAction.isUndone) {
            this.move(
                this.lastAction.employee.uniqueId,
                this.lastAction.appendSupervisor.uniqueId
            );
        }
    }
}
