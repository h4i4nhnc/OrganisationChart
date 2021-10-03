import { ceoMark } from "../const/dummy";
import { EmployeeOrgApp } from "../utils/employeeOrgApp";
import { OrganisationTree } from "../components/OrganisationTree";

export const Home = () => {
    const org = new EmployeeOrgApp(ceoMark);

    return (
        <OrganisationTree
            ceo={org.ceo}
            getLastAction={org.getLastAction.bind(org)}
            onMove={org.move.bind(org)}
            undo={org.undo.bind(org)}
            redo={org.redo.bind(org)}
        />
    );
};
