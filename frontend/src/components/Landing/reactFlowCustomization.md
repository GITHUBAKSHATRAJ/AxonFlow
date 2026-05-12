React Flow (now officially part of the xyflow family) has a vast set of props beyond the basic node and edge setup. These props allow you to control everything from user interaction to viewport behavior and custom styling. [1, 2, 3, 4, 5]  
Here is a categorized breakdown of the most common and useful attributes available in the latest versions (v12+): 
Core Data & Customization 
These are the props you already mentioned, which form the foundation of your flow. 

• : An array of Node objects defining the entities in your graph. 
• : An array of Edge objects defining the connections between nodes. 
• : A map for Custom Nodes (e.g., ). 
• : A map for Custom Edges. [7, 8, 9, 10, 11]  

Essential Change Handlers 
To make your flow interactive (draggable, selectable), you must implement these handlers to update your state. 

• : Triggered when nodes are moved, selected, or deleted. 
• : Triggered when edges are selected or deleted. 
• : Called when a user successfully connects two handles to create a new edge. [13, 14, 15, 16, 17]  

Interaction & Behavior 
Control how users interact with the canvas. 

• : Boolean to enable/disable dragging all nodes. 
• : Boolean to toggle if users can create new connections. 
• : Boolean to toggle if nodes and edges can be clicked/selected. 
• : Control if the user can move the entire background canvas. 
• : Enable/disable zooming into the flow using the mouse wheel. [13, 18, 19, 20, 21]  

Viewport & Zoom 

• : If , the flow automatically zooms to fit all nodes on the initial render. 
•  / : Set the limits for how far a user can zoom in or out. 
• : Sets the initial position (, ) and  level. [22, 23]  

Styling & Visuals 

• : Pass a standard CSS object to style the container (e.g., ). 
• : Switch between , , or  themes. 
• : If , nodes will "snap" to a grid while being dragged. 
• : Defines the grid size (e.g., ). [24, 25, 26, 27, 28]  

Default Edge Settings 

• : A global object to apply settings to all edges (like  or a specific ) so you don't have to define them on every individual edge. [24, 29, 30]  

For a complete, technical list of every event and property, check the React Flow API Reference. [31]  

AI responses may include mistakes.

[1] https://reactflow.dev/api-reference/react-flow
[2] https://liambx.com/glossary/react-flow
[3] https://reactflow.dev/api-reference/react-flow
[4] https://reactflow.dev/learn/troubleshooting/migrate-to-v12
[5] https://medium.com/@ignatovich.dm/building-custom-react-components-with-headless-ui-patterns-a6f046f62763
[6] https://namastedev.com/blog/understanding-react-component-data-flow-props-and-state-in-depth/
[7] https://reactflow.dev/learn/customization/custom-edges
[8] https://reactflow.dev/learn/customization/custom-nodes
[9] https://reactflow.dev/api-reference/react-flow
[10] https://reactflow.dev/api-reference/hooks/use-nodes-state
[11] https://blog.logrocket.com/build-gorgeous-flow-diagrams-svelvet/
[12] https://docs.hanko.io/using-the-api/understanding-the-flow-api
[13] https://stackoverflow.com/questions/78554186/issue-with-the-edge-creation-while-creating-a-react-flow-structure
[14] https://reactflow.dev/api-reference/react-flow
[15] https://reactflow.dev/api-reference/react-flow
[16] https://dev.to/anadee11/getting-started-with-react-flow-3727
[17] https://reactflow.dev/api-reference/react-flow
[18] https://reactflow.dev/api-reference/react-flow
[19] https://reactflow.dev/api-reference/types/node
[20] https://github.com/Sebb77/react-flow
[21] https://reactflow.dev/api-reference/react-flow
[22] https://reactflow.dev/api-reference/react-flow
[23] https://reactflow.dev/api-reference/react-flow
[24] https://reactflow.dev/api-reference/types
[25] https://reactflow.dev/api-reference/components/controls
[26] https://svelteflow.dev/whats-new
[27] https://reactflow.dev/api-reference/react-flow
[28] https://reactflow.dev/api-reference/types
[29] https://javascript.plainenglish.io/react-flow-builds-interactive-node-based-graphs-8d02abf7512a
[30] https://reactflow.dev/api-reference/react-flow
[31] https://reactflow.dev/api-reference/react-flow

