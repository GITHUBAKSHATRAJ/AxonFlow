In AxonFlow, the **D3 engine** is specifically used for **Hierarchical Layout Calculations**.

### Where it is used:
It is used in [flowUtils.js](file:///c:/Users/Akshat%20Raj/OneDrive/Desktop/important/Project/AxonFlow/frontend/src/utils/flowUtils.js) (lines 1, 96-156). We specifically use the `d3-hierarchy` module.

### Why we use it:
1.  **Automatic Positioning**: When you have dozens or hundreds of nodes, you can't manually set every (x, y) coordinate. D3's `tree()` and `stratify()` functions automatically calculate the exact pixel positions so that nodes don't overlap.
2.  **Complex Hierarchies**: It transforms your flat database data (where each node just has a `parentId`) into a visual tree. It calculates the spacing needed based on the "depth" and "breadth" of your thoughts.
3.  **Multiple Layout Modes**: 
    -   **Horizontal**: For classic mind maps.
    -   **Vertical**: For organizational charts.
    -   **Radial (360°)**: For "brain-like" maps where ideas radiate from the center.
4.  **Performance**: D3 is extremely fast at math. It can recalculate the entire map's layout in milliseconds whenever you add a new node or paste a branch, ensuring a smooth "at the speed of thought" experience.

Essentially, **React Flow** handles the "rendering" (drawing the boxes and lines), but **D3** is the "brain" that decides exactly where everything should go.