import React, { useEffect, useRef, useState } from 'react';

const Sidebar = ({ onPanel, node = null, onNodeUpdate }) => {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const initialCategories = [
            {
                id: `1`,
                category_name: "Category 1"
            },
            {
                id: `2`,
                category_name: "Category 2"
            },
            {
                id: `3`,
                category_name: "Category 3"
            },
        ];
        setCategories(initialCategories);
    },[]);

    const [name, setName] = useState("");
    const [categoryId,setCategoryId] = useState(null);
    const [desc, setDesc] = useState("");
    const categroyRef = useRef(null);

    useEffect(() => {
        if (node && node.data && node.data.formData) {
            const { data: { formData: node_data } } = node;
            setName(node_data.name || "");
            setCategoryId(node_data.category_id || null);
            setDesc(node_data.desc || "");
        }
    }, [node]);


    const handleSave = (e) => {
        e.preventDefault();
        const currentSelectedCategory = categroyRef.current.value;
        onNodeUpdate(node.id,{
            name,
            category_id: currentSelectedCategory,
            desc
        });
    }

    return (
        <div className="shadow-md fixed top-0 right-0 z-40 w-[20%] h-screen p-4 overflow-y-auto transition-transform bg-white" tabIndex="-1" >
            <h5 id="drawer-navigation-label" className="text-base font-semibold text-gray-500 uppercase">Flow menu</h5>
            <button type="button" onClick={onPanel} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center" >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close menu</span>
            </button>
            <div className="py-4 overflow-y-auto">
                <form className="max-w-sm mx-auto">
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                        <input value={name} onChange={(e) => {
                            setName(e.target.value)
                            }} type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder='Enter your name' required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="categories" className="block mb-2 text-sm font-medium text-gray-900">Select your category</label>
                        <select id="categories" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" ref={categroyRef}>
                            {
                                categories.map((category) => (
                                    <option key={category.id} value={category.id} selected={category.id == categoryId}>{category.category_name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                        <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your description..." value={desc} onChange={(e) => setDesc(e.target.value)}/>
                    </div>
                    <div className='flex justify-start items-center gap-2'>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" onClick={handleSave}>Save</button>
                        <button type="submit" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" onClick={onPanel}>Cancel</button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default Sidebar