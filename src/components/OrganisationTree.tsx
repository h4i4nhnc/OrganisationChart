import { Employee } from "../types/interface";
import { Tree, TreeNode } from "react-organizational-chart";
import { css } from "@emotion/css";
import { useState } from "react";

type OrganisationTreeProps = {
    ceo: Employee;
    onMove: (employeeId: number, supervisorId: number) => void;
};

export const OrganisationTree = ({ ceo, onMove }: OrganisationTreeProps) => {
    const [employeeId, setEmployeeId] = useState(-1);
    const [supervisorId, setSupervisorId] = useState(-1);
    const [counter, setCounter] = useState(0);

    const handleMove = (employeeId: number, supervisorId: number) => {
        setCounter(counter + 1);
        onMove(employeeId, supervisorId);
    };

    const undo = () => {
        console.log("undo");
    };

    const redo = () => {
        console.log("redo");
    };

    const renderNode = (node: Employee) => {
        let childs: JSX.Element[] = [];
        if (node.subordinates.length > 0) {
            node.subordinates.map((sub) => {
                const subTree = renderNode(sub);
                childs.push(subTree);
                return true;
            });
        }
        return (
            <TreeNode
                label={
                    <div
                        className={css({
                            padding: 5,
                            borderRadius: 8,
                            display: "inline-block",
                            border: "1px solid red",
                        })}
                    >
                        {node.uniqueId}: {node.name}
                    </div>
                }
                key={node.uniqueId}
            >
                {childs.length > 0 && childs}
            </TreeNode>
        );
    };

    return (
        <div key={counter}>
            <Tree
                lineWidth={"2px"}
                lineColor={"green"}
                lineBorderRadius={"10px"}
                label="BOD"
            >
                {renderNode(ceo)}
            </Tree>
            <div>
                EmployeeId:
                <input
                    type="number"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(parseInt(e.target.value))}
                />
                SupervisorId:
                <input
                    type="number"
                    value={supervisorId}
                    onChange={(e) => setSupervisorId(parseInt(e.target.value))}
                />
                <button onClick={() => handleMove(employeeId, supervisorId)}>
                    Move
                </button>
                <button onClick={undo}>Undo</button>
                <button onClick={redo}>Redo</button>
            </div>
        </div>
    );
};
