import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";

const ResizableNodeSelected = ({ id, data, selected }) => {
  const removeNode = (e) => {
    console.log("deleteNode");
    e.stopPropagation(); // To prevent the event from bubbling up to the parent element
    console.log(id);
    deleteNode({ id: id });
  };

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10, background: data.background }}>{data.label}</div>
      <button onClick={removeNode}>
        <img src="vite.svg" alt="delete" title={"Delete "} />
      </button>

      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(ResizableNodeSelected);
