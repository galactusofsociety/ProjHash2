import React, { useState, useEffect, useCallback } from 'react';
import Controls from '../Controls/Controls';
import HashTable from '../HashTable/HashTable';
import Pseudocode from '../Pseudocode.jsx';
import {
    chainingInsert, chainingSearch, chainingDelete,
    linearProbingInsert, linearProbingSearch, linearProbingDelete,
    quadraticProbingInsert, quadraticProbingSearch, quadraticProbingDelete,
    doubleHashingInsert, doubleHashingSearch, doubleHashingDelete
} from '../../algorithms/hashingLogic';
import { pseudocode } from '../../algorithms/pseudocode';
import './HashingVisualizer.css';

const ANIMATION_SPEED_MS = 700;
const DEFAULT_TABLE_SIZE = 10;

const HashingVisualizer = () => {
    const [tableSize, setTableSize] = useState(DEFAULT_TABLE_SIZE);
    const [table, setTable] = useState(Array(DEFAULT_TABLE_SIZE).fill(null));
    
    const [mode, setMode] = useState('open');
    const [algorithm, setAlgorithm] = useState('linearProbing');
    const [operation, setOperation] = useState('insert');
    const [isVisualizing, setIsVisualizing] = useState(false);
    
    const [message, setMessage] = useState('Select an algorithm and operation.');
    const [calculation, setCalculation] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [highlightedChainIndex, setHighlightedChainIndex] = useState(null);
    const [currentCodeLine, setCurrentCodeLine] = useState(null);

    const resetMessages = () => {
        setMessage('Select an algorithm and operation.');
        setCalculation('');
        setHighlightedIndex(null);
        setHighlightedChainIndex(null);
        setCurrentCodeLine(null);
    };

    const handleClear = useCallback(() => {
        // SAFETY CHECK: Ensure tableSize is a valid number before creating an array.
        const size = Number.isInteger(tableSize) && tableSize > 0 ? tableSize : DEFAULT_TABLE_SIZE;
        const newTable = mode === 'closed' ? Array(size).fill([]) : Array(size).fill(null);
        setTable(newTable);
        resetMessages();
    }, [mode, tableSize]);

    useEffect(() => {
        handleClear();
    }, [tableSize, mode, handleClear]);

    const visualizeSteps = (steps) => {
        if (steps.length === 0) { setIsVisualizing(false); return; }
        setIsVisualizing(true);
        let stepIndex = 0;

        const stepExecutor = () => {
            if (stepIndex >= steps.length) {
                setIsVisualizing(false);
                setHighlightedIndex(null); setHighlightedChainIndex(null); setCurrentCodeLine(null);
                return;
            }
            const step = steps[stepIndex];
            if (step.tableState) setTable(step.tableState);
            if (step.message) setMessage(step.message);
            if (step.calculation) setCalculation(step.calculation);
            if (step.highlightIndex !== undefined) setHighlightedIndex(step.highlightIndex);
            if (step.highlightChainIndex !== undefined) setHighlightedChainIndex(step.highlightChainIndex);
            if (step.codeLine) setCurrentCodeLine(step.codeLine);
            stepIndex++;
            setTimeout(stepExecutor, ANIMATION_SPEED_MS);
        };
        stepExecutor();
    };
    
    const runOperation = (op, params) => {
        if (isVisualizing) return;
        setOperation(op);
        const value = parseInt(params.value, 10);
        if (isNaN(value)) { setMessage('Please enter a valid number.'); return; }
        
        const { c1, c2, prime } = params;
        const pC1 = parseInt(c1, 10), pC2 = parseInt(c2, 10), pPrime = parseInt(prime, 10);
        
        const funcs = {
            chaining: { insert: chainingInsert, search: chainingSearch, delete: chainingDelete },
            linearProbing: { insert: linearProbingInsert, search: linearProbingSearch, delete: linearProbingDelete },
            quadraticProbing: { insert: (t, v, s) => quadraticProbingInsert(t, v, s, pC1, pC2), search: (t, v, s) => quadraticProbingSearch(t, v, s, pC1, pC2), delete: (t, v, s) => quadraticProbingDelete(t, v, s, pC1, pC2) },
            doubleHashing: { insert: (t, v, s) => doubleHashingInsert(t, v, s, pPrime), search: (t, v, s) => doubleHashingSearch(t, v, s, pPrime), delete: (t, v, s) => doubleHashingDelete(t, v, s, pPrime) }
        };

        const func = funcs[algorithm]?.[op];
        if (func) {
            const steps = func(table, value, tableSize);
            visualizeSteps(steps);
        }
    };

    const getPseudocode = () => pseudocode[algorithm]?.[operation] || [];

    return (
        <div className="hashing-visualizer">
            <Controls
                tableSize={tableSize} setTableSize={setTableSize} mode={mode} setMode={setMode}
                algorithm={algorithm} setAlgorithm={setAlgorithm}
                onInsert={(params) => runOperation('insert', params)}
                onSearch={(params) => runOperation('search', params)}
                onDelete={(params) => runOperation('delete', params)}
                onClear={handleClear} isVisualizing={isVisualizing}
            />
            <div className="main-content">
                <HashTable table={table} mode={mode} highlightedIndex={highlightedIndex} highlightedChainIndex={highlightedChainIndex} />
            </div>
            <div className="info-container">
                <div className="messages-container">
                    <div className="message-box calculation-box"><strong>Calculation:</strong> {calculation}</div>
                    <div className="message-box"><strong>Status:</strong> {message}</div>
                </div>
                <Pseudocode code={getPseudocode()} currentLine={currentCodeLine} />
            </div>
        </div>
    );
};

export default HashingVisualizer;