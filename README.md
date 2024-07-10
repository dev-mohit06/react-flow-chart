# React FlowChart

A dynamic and interactive flowchart application built with React and React Flow, designed for creating, editing, and visualizing complex node-based diagrams.

## Features

- Interactive canvas with draggable nodes
- Node connection capabilities
- Dedicated form for each node with fields for:
  - Name
  - Category
  - Description
- JSON import and export functionality for node data
- Responsive design for various screen sizes

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Usage](#usage)
6. [Dependencies](#dependencies)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v21.7.0 or later)
- npm (v10.5.0 or later)

## Installation

1. Clone the repository:
2. Navigate to the project directory:
3. Install the dependencies:
```
npm install
```

## Running the Application

To start the development server:
```
npm start
```

The application will be available at `http://localhost:5173`.

## Usage

1. **Adding Nodes**: 
   - Click the "Add Node" button in the toolbar to create a new node on the canvas.

2. **Moving Nodes**: 
   - Click and drag nodes to reposition them on the canvas.

3. **Connecting Nodes**: 
   - Click and drag from one node's handle to another to create a connection.

4. **Editing Node Data**: 
   - Click on a node to open its form in the sidebar.
   - Edit the name, category, and description as needed.
   - Click "Save" to update the node data.

5. **Importing Data**: 
   - Click the "Import" button in the toolbar.
   - Select a JSON file containing node data to load into the flowchart.

6. **Exporting Data**: 
   - Click the "Export" button in the toolbar to save the current flowchart data as a JSON file.

## Dependencies

- React
- React Flow
- react-hot-toast
- tailwindcss
- postcss
- Other dependencies (listed in package.json)