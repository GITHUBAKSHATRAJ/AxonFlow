# AxonFlow Backend Schema Documentation

AxonFlow uses a **Structural Flat-Tree Architecture** powered by MongoDB and Mongoose. Unlike traditional mind maps that store everything in one giant JSON object, AxonFlow separates the "File Metadata" from the "Canvas Content" for maximum performance and scalability.

---

## 1. The `maps` Collection (Model: `Map`)
This collection acts as the **Container** or "File Entry." it stores metadata about the project itself.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | The name of the Mind Map. |
| `userId` | String | Ownership ID (from Clerk). |
| `rootNodeId` | ObjectId | Reference to the **starting node** of the map. |
| `workspace` | String | Top-level category (e.g., "Research"). |
| `folderId` | ObjectId | Reference to the **Folder** this map belongs to. |
| `isFavorite` | Boolean | Visibility in the "Favorites" sidebar. |
| `isTrashed` | Boolean | Soft-delete status. |
| `tags` | [String] | Custom labels for filtering. |
| `lastAccessedAt`| Date | Used for "Recently Viewed" sorting. |

---

## 2. The `nodes` Collection (Model: `Node`)
This is the **Content** layer. Every idea, bubble, or branch on the canvas is a separate document.

| Field | Type | Description |
| :--- | :--- | :--- |
| `mapId` | ObjectId | **Strong Link** to the parent Map. |
| `userId` | String | Security identifier for ownership verification. |
| `parentId` | ObjectId | Reference to the parent node (null if it's the Root). |
| `name` | String | The text/idea content of the node. |
| `isExpanded` | Boolean | UI state for child visibility. |
| `notes` | [String] | Deep-dive text notes. |
| `links` | [LinkSchema] | Array of `{ title, url }`. |
| `files` | [FileSchema] | Array of `{ fileName, fileUrl }` for attachments. |
| `status` | String | Customizable status string (e.g., "Urgent"). |
| `x`, `y` | Number | Coordinates on the React Flow canvas. |

---

## 3. The `folders` Collection (Model: `Folder`)
Manages the organizational hierarchy.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Folder name. |
| `workspace` | String | Top-level category. |
| `parentId` | ObjectId | Reference to a parent folder (allows for **Infinite Nesting**). |
| `userId` | String | Ownership identifier. |

---

## 💡 Relationships & Examples

### The Hierarchy
`Workspace` $\rightarrow$ `Folder` (Optional) $\rightarrow$ `Map` $\rightarrow$ `Nodes`

### Real-World Example:
Imagine you create a Map called **"AI Research"** inside a folder called **"Thesis"**.

1.  **Map Document:**
    ```json
    {
      "_id": "MAP_001",
      "name": "AI Research",
      "folderId": "FOLDER_002",
      "rootNodeId": "NODE_101"
    }
    ```
2.  **Root Node Document:**
    ```json
    {
      "_id": "NODE_101",
      "mapId": "MAP_001",
      "parentId": null,
      "name": "Central Idea"
    }
    ```
3.  **Child Node Document:**
    ```json
    {
      "_id": "NODE_102",
      "mapId": "MAP_001",
      "parentId": "NODE_101",
      "name": "Sub-topic 1"
    }
    ```

---

## 🚀 Why this is the "Professional" Way:
1.  **Lightning Fast Dashboards:** Your dashboard only fetches the `maps` collection. It doesn't need to touch the millions of `nodes` stored in your DB.
2.  **Referential Integrity:** By using `ObjectId` and `ref`, Mongoose can automatically "populate" folders and nodes, reducing the amount of code you have to write.
3.  **Clean Separation:** Your "File" logic (rename map, favorite map) is completely separated from your "Canvas" logic (move node, add child). This makes your code modular and easy to debug.

---

## 🛠️ How to Extend for Templates (e.g., Project Deadlines)

One of the best parts of this structural schema is its **flexibility**. If you want to add a "Project Deadline" template, you don't need to rewrite everything. You only add fields to the specific part that needs them.

### Example: Adding Deadlines to Nodes
If you want individual nodes to have a deadline, simply add a `deadline` field to **`Node.js`**:

```javascript
// Inside Node.js
deadline: { type: Date, default: null }
```

**How it looks in the Database:**
```json
{
  "_id": "NODE_201",
  "name": "Design Phase",
  "status": "in-progress",
  "deadline": "2024-12-31T23:59:59Z"
}
```

### Example: Adding a Project-wide Deadline
If the entire map represents one project with one deadline, add it to **`Map.js`**:

```javascript
// Inside Map.js
projectDeadline: { type: Date, default: null }
```

**How it looks in the Database:**
```json
{
  "_id": "MAP_005",
  "name": "New Website Launch",
  "projectDeadline": "2025-06-01T00:00:00Z"
}
```

This modular approach ensures that your basic Mind Maps stay "lightweight" while your complex templates can be as "data-rich" as you need!
