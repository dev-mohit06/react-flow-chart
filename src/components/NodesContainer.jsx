import React from 'react'

const NodesContainer = () => {

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="absolute top-5 left-5 max-w-sm p-6 bg-blue-300 border border-gray-200 rounded-lg shadow hover:bg-blue-100 flex justify-center flex-col items-start gap-3">
            <p className='text-xl font-medium text-black'>Nodes</p>
            <div className="block max-w-xs p-6 bg-white border border-gray-200 rounded-lg shadow" draggable onDragStart={(event) => onDragStart(event, 'actionNode')}>
                <p className="text-[1rem] tracking-tight text-gray-900 pointer-events-none">{'Custom Node'}</p>
            </div>
        </div>
    )
}

export default NodesContainer