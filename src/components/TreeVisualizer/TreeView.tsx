import React, { useEffect, useRef, useCallback } from 'react';
import type { TreeNode } from './types';

interface TreeViewProps {
    root: TreeNode | null;

    highlightedNode: TreeNode | null;
}

export const TreeView: React.FC<TreeViewProps> = ({ root, highlightedNode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodeRadius = 25;
    const levelHeight = 80;
    const minNodeSpacing = 60;

    useEffect(() => {
        if (!canvasRef.current || !root) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Calculate tree dimensions
        const treeHeight = getTreeHeight(root);
        const canvasWidth = Math.max(800, Math.pow(2, treeHeight) * minNodeSpacing);
        const canvasHeight = (treeHeight + 1) * levelHeight;

        // Update canvas dimensions
        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;

        // Draw the tree
        drawTree(ctx, root, canvasWidth / 2, nodeRadius + 10, canvasWidth / 4);
    }, [root, highlightedNode]);

    const getTreeHeight = useCallback((node: TreeNode | null): number => {
        if (!node) return 0;
        return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
    }, []);

    const drawTree = useCallback((
        ctx: CanvasRenderingContext2D,
        node: TreeNode,
        x: number,
        y: number,
        offset: number
    ) => {
        // Draw connections to children
        if (node.left) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - offset, y + levelHeight);
            ctx.strokeStyle = '#666';
            ctx.stroke();
            drawTree(ctx, node.left, x - offset, y + levelHeight, offset / 2);
        }

        if (node.right) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + offset, y + levelHeight);
            ctx.strokeStyle = '#666';
            ctx.stroke();
            drawTree(ctx, node.right, x + offset, y + levelHeight, offset / 2);
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = node === highlightedNode ? '#ffd700' : 
                       node.isVisited ? '#90ee90' : '#fff';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();

        // Draw value
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.value.toString(), x, y);
    }, [highlightedNode, levelHeight, nodeRadius]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: '#f5f5f5',
            }}
        />
    );
};
