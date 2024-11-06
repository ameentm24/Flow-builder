import React, { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  useReactFlow,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  updateEdge,
  useOnSelectionChange,
} from "reactflow";
import "reactflow/dist/style.css";

import Sidebar from "./Sidebar";
import { v4 as uuidv4 } from "uuid";
import resizableNode from "../CustomNodes/resizableNode";
import dragHandle from "../CustomNodes/dragHandle";
import TimerNode from "../CustomNodes/timerNode";
import style from "../Styles/Editsidebar.module.css";

const nodeTypes = {
  resizableNode: resizableNode,
  dragHandle: dragHandle,
  timerNode: TimerNode,
};

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [flowName, setFlowName] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const edgeUpdateSuccessful = useRef(true);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const [nodeId, setNodeId] = useState("");
  const { setViewport } = useReactFlow();
  const [isSelected, setIsSelected] = useState(false);
  const [nodeBg, setNodeBg] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const params = useParams();
  const flowId = params.flowid;
  const userId = localStorage.getItem("userId");

  useOnSelectionChange(
    {
      onChange: ({ nodes, edges }) => {
        setIsSelected((prev) => !prev);
        setSelectedNodes(
          nodes?.map((node) => {
            setNodeId(node.id);
            setNodeName(node?.data.label || "");
            setNodeBg(node?.data.background || "");
            setNodeDescription(node?.data.description || "");
            setIsSelected(true);
          })
        );
        setSelectedEdges(edges.map((edge) => edge.id));
      },
    },
    [reactFlowInstance]
  );

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            label: nodeName,
            background: nodeBg,
            description: nodeDescription,
          };
        }
        return node;
      })
    );
  }, [nodeName, nodeBg, nodeDescription, setNodes]);

  useEffect(() => {
    onRestore();
  }, []);

  const onRestore = () => {
    const savedFlow = JSON.parse(localStorage.getItem(`flow-${flowId}`));
    if (savedFlow) {
      const { nodes, edges, viewport, flowName } = savedFlow;
      setNodes(nodes || []);
      setEdges(edges || []);
      setViewport(viewport);
      setFlowName(flowName || "");
    }
  };

  const postFlow = () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(`flow-${flowId}`, JSON.stringify({
        flowName,
        userId,
        edges: flow.edges,
        nodes: flow.nodes,
        viewport: flow.viewport,
      }));
    }
  };

  const onSave = useCallback(() => {
    postFlow();
  }, [reactFlowInstance]);

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge)
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeUpdateSuccessful.current = true;
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onNodesDelete={onNodesDelete}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar onSave={onSave} onRestore={onRestore} />

      <div className={`${isSelected ? style.open : style.close}`}>
        <label>Label:</label>
        <input
          value={nodeName}
          onChange={(evt) => setNodeName(evt.target.value)}
        />

        <label>Background:</label>
        <input
          type="color"
          value={nodeBg}
          onChange={(evt) => setNodeBg(evt.target.value)}
        />

        <label>Description:</label>
        <input
          type="text"
          value={nodeDescription}
          onChange={(evt) => setNodeDescription(evt.target.value)}
        />
      </div>
    </div>
  );
};

export default DnDFlow;
