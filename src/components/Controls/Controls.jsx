
import React, { useState, useEffect } from 'react';
import './Controls.css';

// Define min/max constants for table size
const MIN_TABLE_SIZE = 5;
const MAX_TABLE_SIZE = 25;

const Controls = ({ tableSize, setTableSize, mode, setMode, algorithm, setAlgorithm, onInsert, onSearch, onDelete, onClear, isVisualizing }) => {
    // --- State Management ---
    const [inputValue, setInputValue] = useState('');
    const [c1, setC1] = useState('1');
    const [c2, setC2] = useState('0');
    const [prime, setPrime] = useState('7');

    // NEW: Local state for the table size input to allow temporary invalid states (like being empty)
    const [localTableSize, setLocalTableSize] = useState(tableSize.toString());

    // Sync local state if the prop changes from above (e.g., on initial load)
    useEffect(() => {
        setLocalTableSize(tableSize.toString());
    }, [tableSize]);

    // --- Event Handlers ---

    const handleOperation = (operation) => {
        if (inputValue) {
            const params = { value: inputValue, c1, c2, prime };
            operation(params);
            setInputValue('');
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        if (newMode === 'closed') {
            setAlgorithm('chaining');
        } else {
            setAlgorithm('linearProbing');
        }
    };

    // NEW: Robust handler for changing table size
    const handleTableSizeChange = (e) => {
        setLocalTableSize(e.target.value); // Allow user to type anything
    };
    
    // NEW: Validate and commit the new table size when the user is done editing
    const validateAndSetTableSize = () => {
        let newSize = parseInt(localTableSize, 10);
        
        // If empty or not a number, revert to the last valid size
        if (isNaN(newSize)) {
            setLocalTableSize(tableSize.toString());
            return;
        }

        // Clamp the value between min and max bounds
        if (newSize < MIN_TABLE_SIZE) newSize = MIN_TABLE_SIZE;
        if (newSize > MAX_TABLE_SIZE) newSize = MAX_TABLE_SIZE;
        
        setLocalTableSize(newSize.toString());
        // Only update the parent component if the size has actually changed
        if (newSize !== tableSize) {
            setTableSize(newSize);
        }
    };

    return (
        <div className="controls-container">
            <div className="control-group">
                <label>Table Size ({MIN_TABLE_SIZE}-{MAX_TABLE_SIZE}):</label>
                <input
                    type="number"
                    value={localTableSize}
                    onChange={handleTableSizeChange}
                    onBlur={validateAndSetTableSize} // Validate when user clicks away
                    onKeyDown={(e) => { if (e.key === 'Enter') validateAndSetTableSize() }} // Validate on Enter key
                    disabled={isVisualizing}
                />
            </div>

            <div className="control-group">
                <label>Addressing Mode:</label>
                <select value={mode} onChange={(e) => handleModeChange(e.target.value)} disabled={isVisualizing}>
                    <option value="open">Open Addressing</option>
                    <option value="closed">Closed Addressing (Chaining)</option>
                </select>
            </div>
            
            <div className="control-group">
                <label>Algorithm:</label>
                {mode === 'open' ? (
                    <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} disabled={isVisualizing}>
                        <option value="linearProbing">Linear Probing</option>
                        <option value="quadraticProbing">Quadratic Probing</option>
                        <option value="doubleHashing">Double Hashing</option>
                    </select>
                ) : (
                    <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} disabled={isVisualizing}>
                        <option value="chaining">Chaining</option>
                    </select>
                )}
            </div>
            
            {algorithm === 'quadraticProbing' && mode === 'open' && (
                <div className="control-group-inline">
                    <label>c1:</label> <input type="number" value={c1} onChange={(e) => setC1(e.target.value)} disabled={isVisualizing} />
                    <label>c2:</label> <input type="number" value={c2} onChange={(e) => setC2(e.target.value)} disabled={isVisualizing} />
                </div>
            )}

            {algorithm === 'doubleHashing' && mode === 'open' && (
                <div className="control-group">
                    <label>Prime ({`<${tableSize}`}):</label>
                    <input type="number" value={prime} onChange={(e) => setPrime(e.target.value)} disabled={isVisualizing} />
                </div>
            )}
            
            <div className="control-group action-group">
                <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter a value" disabled={isVisualizing} />
                <button onClick={() => handleOperation(onInsert)} disabled={isVisualizing || !inputValue}>Insert</button>
                <button onClick={() => handleOperation(onSearch)} disabled={isVisualizing || !inputValue} className="search-btn">Search</button>
                <button onClick={() => handleOperation(onDelete)} disabled={isVisualizing || !inputValue} className="delete-btn">Delete</button>
                <button onClick={onClear} disabled={isVisualizing}>Clear</button>
            </div>
        </div>
    );
};

export default Controls;