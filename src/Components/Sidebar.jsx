import React from "react";
import TimerNode from "../CustomNodes/timerNode";

const Sidebar = (props) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <button onClick={props.onSave}>Save</button>
      {/* <button onClick={props.onRestore}>restore</button> */}

      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, "input")}
        draggable
      >
        Input Node
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
      >
        Default Node
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "output")}
        draggable
      >
        Output Node
      </div>

      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "resizableNode")}
        draggable
      >
        Resizable
      </div>

      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "dragHandle")}
        draggable
      >
        Drag handle
      </div>

      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "timerNode")}
        draggable
      >Timer</div>
    </aside>
  );
};

export default Sidebar;
