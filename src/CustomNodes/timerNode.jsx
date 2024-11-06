import { Handle, Position } from "reactflow";
import { useState,useEffect } from "react";
import "./node-styles/timerNode.css";

const TimerNode = ({ data, isConnectable }) => {
  
  useEffect(()=>{
    console.log("data:",data)
  },[data])

  return (
    <div className="text-updater-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <div className="time-node" style={{ background: data.background }}>
        <div className="icon">
         
        </div>

        <div>
          <div className="heading">
            <p>{data.label}</p>
          </div>
          <p>{data.description}</p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        data={data}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default TimerNode;
