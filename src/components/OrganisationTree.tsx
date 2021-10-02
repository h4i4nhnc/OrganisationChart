import { Employee } from "../types/interface";
import { Tree, TreeNode } from "react-organizational-chart";
import { css } from "@emotion/css";
import { useState } from "react";

type OrganisationTreeProps = {
    ceo: Employee;
    undo: () => void;
    redo: () => void;
    onMove: (employeeId: number, supervisorId: number) => void;
};

export const OrganisationTree = ({
    ceo,
    onMove,
    undo,
    redo,
}: OrganisationTreeProps) => {
    const [employeeId, setEmployeeId] = useState(-1);
    const [supervisorId, setSupervisorId] = useState(-1);
    const [counter, setCounter] = useState(0);

    const handleMove = (employeeId: number, supervisorId: number) => {
        setCounter(counter + 1);
        onMove(employeeId, supervisorId);
    };

    const handleUndo = () => {
        undo();
        setCounter(counter + 1);
    };

    const handleRedo = () => {
        redo();
        setCounter(counter + 1);
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

    console.log("LAST ACTION", lastAction);

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
                <button onClick={handleUndo}>Undo</button>
                <button onClick={handleRedo}>Redo</button>
            </div>
        </div>
    );
};
