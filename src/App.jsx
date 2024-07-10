// Packages
import React, { useRef, useState, useCallback, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  useReactFlow,
  getIncomers,
  getOutgoers,
  getConnectedEdges
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

// Components
import ActionNode from './action-node/ActionNode.jsx';
import Sidebar from './components/Sidebar.jsx';
import NodesContainer from './components/NodesContainer.jsx';

// Styles
import 'reactflow/dist/style.css';

// Node Types
const nodeTypes = {
  actionNode: ActionNode,
};

const App = () => {
  // Initial Values
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const initialNodes = [];
  const initialEdges = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const exportBtnRef = useRef(null);

  const onInit = useCallback((_reactFlowInstance) => {
    setReactFlowInstance(_reactFlowInstance);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge),
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            })),
          );

          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    [nodes, edges],
  );

  const openSidebar = useCallback((nodeId) => {
    setSelectedNode(nodeId);
    setIsPanelOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedNode(null);
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setIsPanelOpen(false);
    setSelectedNode(null);
    toast.success("Node delete successfully");
  }, []);

  const updateNode = useCallback((nodeId, formData) => {
    if (formData.name == "") {
      toast.error("Please provide a valid name for the node.");
      return;
    }
    if (formData.category_id == null) {
      toast.error("Please select a category for the node.");
      return;
    }
    if (formData.desc == "") {
      toast.error("Please provide a description for the node.");
      return;
    }
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              label: formData.name,
              formData: formData
            }
          }
          : node
      )
    );
    toast.success("Node data saved successfully.");
    closeSidebar();
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: {
          label: `Custom Node`,
          onPlay: (nodeId) => openSidebar(nodeId),
          onDelete: (nodeId) => deleteNode(nodeId),
          formData: {
            name: "",
            category_id: null,
            desc: ""
          }
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, openSidebar, deleteNode]
  );

  const serializeNodeData = (data) => ({
    ...data,
    onPlay: data.onPlay.toString(),
    onDelete: data.onDelete.toString(),
  });

  const deserializeNodeData = (data) => ({
    ...data,
    onPlay: eval(data.onPlay),
    onDelete: eval(data.onDelete),
  });


  const exportToJson = useCallback(() => {
    const flow = {
      nodes: nodes.map(node => ({
        ...node,
        data: serializeNodeData(node.data),
      })),
      edges,
    };
    const flowJSON = JSON.stringify(flow, null, 2);
    console.log(flowJSON);

    const blob = new Blob([flowJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flow.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('JSON exported successfully');
  }, [nodes, edges]);

  const importFromJson = useCallback((jsonString) => {
    try {
      const importedFlow = JSON.parse(jsonString);
      if (importedFlow.nodes && importedFlow.edges) {
        const newNodes = importedFlow.nodes.map(node => ({
          ...node,
          id: `${node.id}-${uuidv4()}`,
          data: deserializeNodeData(node.data),
        }));
        const newEdges = importedFlow.edges.map(edge => ({
          ...edge,
          id: `${edge.id}-${uuidv4()}`,
        }));
        setNodes((nds) => [...nds, ...newNodes]);
        setEdges((eds) => [...eds, ...newEdges]);
        toast.success('JSON Imported successfully');
      } else {
        toast.error('Invalid JSON structure');
      }
    } catch (error) {
      console.error('Failed to parse JSON', error);
    }
  }, [setNodes, setEdges]);

  // For fetching update nodes
  useEffect(() => {
    if (selectedNode) {
      const currentNodeData = nodes.find(node => node.id === selectedNode);
      if (currentNodeData) {
        setSelectedNode(currentNodeData.id);
      }
    }
  }, [nodes, selectedNode]);

  // Effect for logging updates
  // useEffect(() => {
  //   console.log('Nodes updated:', nodes);
  //   console.log('Selected node ID:', selectedNode);
  //   console.log('Selected node data:', nodes.find(node => node.id === selectedNode));
  // }, [nodes, selectedNode]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Toaster />
      <div style={{ width: isPanelOpen ? '80%' : '100%' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onInit={onInit}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {isPanelOpen && (
        <Sidebar
          onPanel={closeSidebar}
          node={nodes.find(node => node.id === selectedNode)}
          onNodeUpdate={updateNode}
        />
      )}
      <NodesContainer />
      <div className='flex justify-center items-center absolute right-5 top-5 gap-3'>
        <button onClick={() => {
          exportBtnRef.current.click();
        }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Import
          <input
            type="file"
            accept='application/json'
            onChange={(event) => {
              const file = event.target.files[0];
              const reader = new FileReader();
              reader.onload = (e) => importFromJson(e.target.result);
              reader.readAsText(file);
            }} className='hidden' ref={exportBtnRef} />
        </button>
        <button onClick={exportToJson} type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Export</button>

      </div>
    </div>
  );
};

export default App;