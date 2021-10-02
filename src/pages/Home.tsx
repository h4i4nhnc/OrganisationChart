import { ceoMark } from "../const/dummy";
import { EmployeeOrgApp } from "../types/interface";
import { OrganisationTree } from "../components/OrganisationTree";

export const Home = () => {
    const org = new EmployeeOrgApp(ceoMark);

    return <OrganisationTree ceo={org.ceo} onMove={org.move.bind(org)} />;
};
