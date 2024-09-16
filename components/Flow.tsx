import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

const initialEdges = [{ id: 'e1-3', source: '1', target: '2' }];

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeCount, setNodeCount] = useState(2);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const newNodeId = String(nodeCount + 1);
    const newNode: Node = {
      id: newNodeId,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: { label: `Node ${newNodeId}` },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeCount((count) => count + 1);
  }, [nodeCount, setNodes]);

  return (
    <div style={{ width: '100%', height: '100%', overflow:"auto" }}>
      <div style={{ backgroundColor:"#F9B1D8", padding:"1rem", width:"120px", height:"60px", color:"white", borderRadius:"5px", marginBottom:"10px" }}>
        <button onClick={addNode}>Add Node</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}