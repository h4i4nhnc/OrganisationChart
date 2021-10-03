import { Action, Employee } from "../utils/employeeOrgApp";
import { Tree, TreeNode } from "react-organizational-chart";
import { css } from "@emotion/css";
import { useState } from "react";

type OrganisationTreeProps = {
    ceo: Employee;
    getLastAction: () => Action | undefined;
    undo: () => void;
    redo: () => void;
    onMove: (employeeId: number, supervisorId: number) => string;
};

export const OrganisationTree = ({
    ceo,
    getLastAction,
    onMove,
    undo,
    redo,
}: OrganisationTreeProps) => {
    const [employeeId, setEmployeeId] = useState(-1);
    const [supervisorId, setSupervisorId] = useState(-1);
    const [counter, setCounter] = useState(0);
    const [err, setErr] = useState("");

    const handleMove = (employeeId: number, supervisorId: number) => {
        setErr("");
        const moved = onMove(employeeId, supervisorId);
        if (moved === "success") {
            setCounter(counter + 1);
        } else {
            setErr(moved);
        }
    };

    const handleUndo = () => {
        undo();
        setCounter(counter - 1);
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

    const lastAction = getLastAction();
    const undoAble = lastAction && !lastAction.isUndone;

    return (
        <div className={css({ display: "flex" })}>
            <div className={css({ width: 350 })}>
                <div className={css({ marginTop: 20 })}>
                    Organisation Version: {counter}
                </div>
                <div className={css({ marginTop: 20 })}>
                    <div>
                        <div>EmployeeId:</div>
                        <div>
                            <input
                                type="number"
                                value={employeeId}
                                onChange={(e) =>
                                    setEmployeeId(parseInt(e.target.value))
                                }
                            />
                        </div>
                    </div>
                    <div>
                        <div>SupervisorId:</div>
                        <div>
                            <input
                                type="number"
                                value={supervisorId}
                                onChange={(e) =>
                                    setSupervisorId(parseInt(e.target.value))
                                }
                            />
                        </div>
                    </div>
                </div>
                {err && <div className={css({ color: "red" })}>{err}</div>}
                <div
                    className={css({
                        marginTop: 20,
                        display: "flex",
                        justifyContent: "space-evenly",
                    })}
                >
                    <button
                        onClick={() => handleMove(employeeId, supervisorId)}
                    >
                        Move
                    </button>
                    {lastAction && (
                        <button onClick={undoAble ? handleUndo : handleRedo}>
                            {`${undoAble ? "Undo" : "Redo"}`}
                        </button>
                    )}
                </div>
            </div>
            <div key={counter}>
                <Tree
                    lineWidth={"2px"}
                    lineColor={"green"}
                    lineBorderRadius={"10px"}
                    label="BOD"
                >
                    {renderNode(ceo)}
                </Tree>
            </div>
        </div>
    );
};
