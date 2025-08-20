export interface TreeNode {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
    height?: number;  // for AVL trees
    balanceFactor?: number;
    isHighlighted?: boolean;
    isVisited?: boolean;
}

export type TreeType = 'bst' | 'avl' | 'rb';
export type TreeOperation = 'insert' | 'delete' | 'search' | 'traverse';
export type TraversalType = 'inorder' | 'preorder' | 'postorder' | 'levelorder';

export interface TreeVisualizerProps {
    treeType: TreeType;
    operation: TreeOperation;
    traversalType?: TraversalType;
    speed: number;
    isRunning: boolean;
}

export interface TreeNodeProps {
    node: TreeNode;
    x: number;
    y: number;
    isAnimating?: boolean;
}

export interface TreeState {
    root: TreeNode | null;
    highlightedNode: TreeNode | null;
    visitedNodes: Set<TreeNode>;
}
