import React from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Slider,
    Typography,
} from '@mui/material';
import type { TreeOperation, TraversalType } from './types';

interface TreeControlsProps {
    operation: TreeOperation;
    setOperation: (op: TreeOperation) => void;
    value: string;
    setValue: (val: string) => void;
    speed: number;
    setSpeed: (speed: number) => void;
    isRunning: boolean;
    onExecute: () => void;
    traversalType?: TraversalType;
    setTraversalType?: (type: TraversalType) => void;
}

export const TreeControls: React.FC<TreeControlsProps> = ({
    operation,
    setOperation,
    value,
    setValue,
    speed,
    setSpeed,
    isRunning,
    onExecute,
    traversalType,
    setTraversalType,
}) => {
    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Operation</InputLabel>
                <Select
                    value={operation}
                    label="Operation"
                    onChange={(e) => setOperation(e.target.value as TreeOperation)}
                    disabled={isRunning}
                >
                    <MenuItem value="insert">Insert</MenuItem>
                    <MenuItem value="delete">Delete</MenuItem>
                    <MenuItem value="search">Search</MenuItem>
                    <MenuItem value="traverse">Traverse</MenuItem>
                </Select>
            </FormControl>

            {operation === 'traverse' && setTraversalType && (
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Traversal</InputLabel>
                    <Select
                        value={traversalType}
                        label="Traversal"
                        onChange={(e) => setTraversalType(e.target.value as TraversalType)}
                        disabled={isRunning}
                    >
                        <MenuItem value="inorder">In-order</MenuItem>
                        <MenuItem value="preorder">Pre-order</MenuItem>
                        <MenuItem value="postorder">Post-order</MenuItem>
                        <MenuItem value="levelorder">Level-order</MenuItem>
                    </Select>
                </FormControl>
            )}

            {operation !== 'traverse' && (
                <TextField
                    label="Value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type="number"
                    disabled={isRunning}
                    sx={{ width: 100 }}
                />
            )}

            <Box sx={{ width: 200 }}>
                <Typography gutterBottom>Speed</Typography>
                <Slider
                    value={speed}
                    onChange={(_, newValue) => setSpeed(newValue as number)}
                    min={1}
                    max={5}
                    step={1}
                    marks
                    disabled={isRunning}
                />
            </Box>

            <Button
                variant="contained"
                onClick={onExecute}
                disabled={isRunning || (!value && operation !== 'traverse')}
            >
                Execute
            </Button>
        </Box>
    );
};
