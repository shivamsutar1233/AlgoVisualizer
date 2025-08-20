import React, { useState } from "react";
import { Box } from "@mui/material";
import { TreeView } from "./TreeView";
import { TreeControls } from "./TreeControls";
import type { TreeNode, TreeOperation, TraversalType } from "./types";

export const TreeVisualizer: React.FC = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [operation, setOperation] = useState<TreeOperation>("insert");
  const [traversalType, setTraversalType] = useState<TraversalType>("inorder");
  const [value, setValue] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [highlightedNode, setHighlightedNode] = useState<TreeNode | null>(null);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const insertNode = (
    currentNode: TreeNode | null,
    value: number
  ): TreeNode => {
    if (!currentNode) {
      return { value, left: null, right: null };
    }

    if (value < currentNode.value) {
      currentNode.left = insertNode(currentNode.left, value);
    } else if (value > currentNode.value) {
      currentNode.right = insertNode(currentNode.right, value);
    }

    return currentNode;
  };

  const searchNode = async (
    currentNode: TreeNode | null,
    value: number
  ): Promise<boolean> => {
    if (!currentNode) {
      setHighlightedNode(null);
      return false;
    }

    setHighlightedNode(currentNode);
    await sleep(500 / speed);

    if (currentNode.value === value) {
      return true;
    }

    if (value < currentNode.value) {
      return searchNode(currentNode.left, value);
    }

    return searchNode(currentNode.right, value);
  };

  const findMin = (node: TreeNode): TreeNode => {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  };

  const deleteNode = (
    currentNode: TreeNode | null,
    value: number
  ): TreeNode | null => {
    if (!currentNode) {
      return null;
    }

    if (value < currentNode.value) {
      currentNode.left = deleteNode(currentNode.left, value);
    } else if (value > currentNode.value) {
      currentNode.right = deleteNode(currentNode.right, value);
    } else {
      // Node with only one child or no child
      if (!currentNode.left) {
        return currentNode.right;
      }
      if (!currentNode.right) {
        return currentNode.left;
      }

      // Node with two children
      const minNode = findMin(currentNode.right);
      currentNode.value = minNode.value;
      currentNode.right = deleteNode(currentNode.right, minNode.value);
    }

    return currentNode;
  };

  const inorderTraversal = async (node: TreeNode | null) => {
    if (!node) return;

    await inorderTraversal(node.left);
    setHighlightedNode(node);
    await sleep(500 / speed);
    await inorderTraversal(node.right);
  };

  const preorderTraversal = async (node: TreeNode | null) => {
    if (!node) return;

    setHighlightedNode(node);
    await sleep(500 / speed);
    await preorderTraversal(node.left);
    await preorderTraversal(node.right);
  };

  const postorderTraversal = async (node: TreeNode | null) => {
    if (!node) return;

    await postorderTraversal(node.left);
    await postorderTraversal(node.right);
    setHighlightedNode(node);
    await sleep(500 / speed);
  };

  const levelorderTraversal = async (root: TreeNode | null) => {
    if (!root) return;

    const queue: TreeNode[] = [root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      setHighlightedNode(node);
      await sleep(500 / speed);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  };

  const handleOperation = async () => {
    setIsRunning(true);
    setHighlightedNode(null);

    try {
      if (operation === "traverse") {
        switch (traversalType) {
          case "inorder":
            await inorderTraversal(root);
            break;
          case "preorder":
            await preorderTraversal(root);
            break;
          case "postorder":
            await postorderTraversal(root);
            break;
          case "levelorder":
            await levelorderTraversal(root);
            break;
        }
      } else {
        const numValue = parseInt(value);
        if (isNaN(numValue)) {
          alert("Please enter a valid number");
          return;
        }

        switch (operation) {
          case "insert":
            setRoot((prev) => {
              if (!prev) return { value: numValue, left: null, right: null };
              return insertNode({ ...prev }, numValue);
            });
            break;
          case "delete":
            setRoot((prev) =>
              prev ? deleteNode({ ...prev }, numValue) : null
            );
            break;
          case "search":
            await searchNode(root, numValue);
            break;
        }
      }
    } finally {
      setIsRunning(false);
      setValue("");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      <TreeControls
        operation={operation}
        setOperation={setOperation}
        value={value}
        setValue={setValue}
        speed={speed}
        setSpeed={setSpeed}
        isRunning={isRunning}
        onExecute={handleOperation}
        traversalType={traversalType}
        setTraversalType={setTraversalType}
      />
      <TreeView root={root} highlightedNode={highlightedNode} />
    </Box>
  );
};
