import React, { useState } from 'react'
import { Handle } from 'reactflow';

const ActionNode = ({ id,data }) => {

    const [showIcons, setShowIcons] = useState(false);

    const handleMouseEnter = () => {
        setShowIcons(true);
    };

    const handleMouseLeave = () => {
        setShowIcons(false);
    };

    return (
        <>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow"
            >
                <Handle type='target' position='top' />
                <div className="content flex flex-col justify-center items-center gap-3">
                    <p className="text-[1rem] tracking-tight text-gray-900">{data.label}</p>
                    {showIcons && (
                        <div className="flex">
                            <a onClick={() => data.onPlay(id)} className="inline-flex items-center px-4 py-1 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
                                Play
                            </a>
                            <a onClick={() => data.onDelete(id)} className="py-1 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                Delete
                            </a>
                        </div>
                    )}
                </div>
                <Handle type='source' position='bottom' />
            </div>
        </>
    )
}

export default ActionNode;