const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

function isValidEdge(edge) {
  edge = edge.trim();

  const regex = /^[A-Z]->[A-Z]$/;

  if (!regex.test(edge)) {
    return false;
  }

  const [parent, child] = edge.split("->");

  if (parent === child) {
    return false;
  }

  return true;
}

function buildTree(node, graph) {
  const children = graph[node] || [];

  const result = {};

  for (const child of children) {
    result[child] = buildTree(child, graph);
  }

  return result;
}

function calculateDepth(node, graph) {
  const children = graph[node] || [];

  if (children.length === 0) {
    return 1;
  }

  let maxDepth = 0;

  for (const child of children) {
    maxDepth = Math.max(maxDepth, calculateDepth(child, graph));
  }

  return maxDepth + 1;
}

function hasCycle(node, graph, visited, path) {
  if (path.has(node)) {
    return true;
  }

  if (visited.has(node)) {
    return false;
  }

  visited.add(node);
  path.add(node);

  const children = graph[node] || [];

  for (const child of children) {
    if (hasCycle(child, graph, visited, path)) {
      return true;
    }
  }

  path.delete(node);

  return false;
}

app.post("/bfhl", (req, res) => {
  const { data } = req.body;

  const validEdges = [];
  const invalidEntries = [];
  const duplicateEdges = [];

  const seenEdges = new Set();

  for (let edge of data) {
    edge = edge.trim();

    if (!isValidEdge(edge)) {
      invalidEntries.push(edge);
      continue;
    }

    if (seenEdges.has(edge)) {
      if (!duplicateEdges.includes(edge)) {
        duplicateEdges.push(edge);
      }
      continue;
    }

    seenEdges.add(edge);
    validEdges.push(edge);
  }

  const graph = {};
  const childParent = {};
  const allNodes = new Set();

  for (const edge of validEdges) {
    const [parent, child] = edge.split("->");

    allNodes.add(parent);
    allNodes.add(child);

    if (childParent[child]) {
      continue;
    }

    childParent[child] = parent;

    if (!graph[parent]) {
      graph[parent] = [];
    }

    graph[parent].push(child);
  }

  const roots = [];

  for (const node of allNodes) {
    if (!childParent[node]) {
      roots.push(node);
    }
  }

  if (roots.length === 0 && allNodes.size > 0) {
      roots.push([...allNodes].sort()[0]);
  }

  const hierarchies = [];

  let totalTrees = 0;
  let totalCycles = 0;

  let largestTreeRoot = "";
  let largestDepth = 0;

  for (const root of roots) {
    const hasCycleInTree = hasCycle(root, graph, new Set(), new Set());

    if (hasCycleInTree) {
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true,
      });

      totalCycles++;
    } else {
      const depth = calculateDepth(root, graph);

      hierarchies.push({
        root,
        tree: {
          [root]: buildTree(root, graph),
        },
        depth,
      });

      totalTrees++;

      if (
        depth > largestDepth ||
        (depth === largestDepth &&
          (largestTreeRoot === "" || root < largestTreeRoot))
      ) {
        largestDepth = depth;
        largestTreeRoot = root;
      }
    }
  }

  res.json({
    user_id: "avishkamra_28092005",
    email_id: "avish0308.be23@chitkara.edu.in",
    college_roll_number: "2310990308",

    hierarchies,

    invalid_entries: invalidEntries,

    duplicate_edges: duplicateEdges,

    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestTreeRoot,
    },
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
