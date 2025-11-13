// This file contains the pure logic for hashing operations.
export const TOMBSTONE = 'DELETED';

// --- UTILITY ---
const hash = (key, tableSize) => key % tableSize;

// --- CLOSED ADDRESSING (CHAINING) ---

export const chainingInsert = (table, value, tableSize) => {
    const steps = [];
    const index = hash(value, tableSize);
    steps.push({ calculation: `hash(${value}) = ${value} % ${tableSize} = ${index}`, message: `Hashing value ${value}. Targeting index ${index}.`, highlightIndex: index, codeLine: 1 });
    const newTable = table.map(chain => [...chain]);
    if (!newTable[index]) newTable[index] = [];
    newTable[index].push(value);
    steps.push({ tableState: newTable, message: `Value ${value} inserted into the chain at index ${index}.`, highlightIndex: index, codeLine: 2 });
    return steps;
};

export const chainingSearch = (table, value, tableSize) => {
    const steps = [];
    const index = hash(value, tableSize);
    steps.push({ calculation: `hash(${value}) = ${value} % ${tableSize} = ${index}`, message: `Hashing value ${value}. Checking index ${index}.`, highlightIndex: index, codeLine: 1 });
    
    const chain = table[index] || [];
    for (let i = 0; i < chain.length; i++) {
        steps.push({ message: `Checking element ${chain[i]} in the chain.`, highlightIndex: index, highlightChainIndex: i, codeLine: 2 });
        if (chain[i] === value) {
            steps.push({ message: `Value ${value} found in the chain at index ${index}.`, highlightIndex: index, highlightChainIndex: i, codeLine: 3 });
            return steps;
        }
    }
    steps.push({ message: `Value ${value} not found in the chain at index ${index}.`, highlightIndex: index, codeLine: 4 });
    return steps;
};

export const chainingDelete = (table, value, tableSize) => {
    const steps = [];
    const index = hash(value, tableSize);
    steps.push({ calculation: `hash(${value}) = ${value} % ${tableSize} = ${index}`, message: `Hashing value ${value}. Checking index ${index}.`, highlightIndex: index, codeLine: 1 });

    const newTable = table.map(chain => [...chain]);
    const chain = newTable[index] || [];
    const itemIndex = chain.indexOf(value);
    
    steps.push({ message: `Searching for ${value} in the chain at index ${index}.`, highlightIndex: index, codeLine: 2 });

    if (itemIndex !== -1) {
        chain.splice(itemIndex, 1);
        steps.push({ tableState: newTable, message: `Value ${value} found and deleted from index ${index}.`, highlightIndex: index, codeLine: 3 });
    } else {
        steps.push({ message: `Value ${value} not found. Nothing to delete.`, highlightIndex: index, codeLine: 4 });
    }
    return steps;
};

// --- OPEN ADDRESSING: UTILITY & SHARED LOGIC ---

const openAddressingProbe = (probeType, table, value, action, tableSize, { c1, c2, prime } = {}) => {
    const steps = [];
    const hash1 = hash(value, tableSize);
    const hash2 = probeType === 'doubleHashing' ? prime - (value % prime) : null;

    steps.push({ calculation: `hash(${value}) = ${value} % ${tableSize} = ${hash1}`, message: `Initial hash for ${value} is ${hash1}.`, highlightIndex: hash1, codeLine: 1 });
    if (probeType === 'doubleHashing') {
        steps.push({ calculation: `hash2(${value}) = ${prime} - (${value} % ${prime}) = ${hash2}`, message: `Step size hash is ${hash2}.`, codeLine: 2 });
    }
    
    let i = 0;
    while (i < tableSize) {
        let probeIndex;
        let calcString = '';
        if (probeType === 'linearProbing') {
            probeIndex = (hash1 + i) % tableSize;
            calcString = `Probe ${i}: (${hash1} + ${i}) % ${tableSize} = ${probeIndex}`;
        } else if (probeType === 'quadraticProbing') {
            probeIndex = (hash1 + c1 * i + c2 * i * i) % tableSize;
            calcString = `Probe ${i}: (${hash1} + ${c1}*${i} + ${c2}*${i}^2) % ${tableSize} = ${probeIndex}`;
        } else { // doubleHashing
            probeIndex = (hash1 + i * hash2) % tableSize;
            calcString = `Probe ${i}: (${hash1} + ${i}*${hash2}) % ${tableSize} = ${probeIndex}`;
        }

        steps.push({ calculation: calcString, message: `Probing index ${probeIndex}.`, highlightIndex: probeIndex, codeLine: 3 });
        
        const slot = table[probeIndex];
        
        if (action === 'insert') {
            if (slot === null || slot === TOMBSTONE) {
                const newTable = [...table]; newTable[probeIndex] = value;
                steps.push({ tableState: newTable, message: `Found empty slot. Inserting ${value} at index ${probeIndex}.`, highlightIndex: probeIndex, codeLine: 5 });
                return steps;
            }
        } else if (action === 'search') {
            if (slot === value) {
                steps.push({ message: `Value ${value} found at index ${probeIndex}.`, highlightIndex: probeIndex, codeLine: 4 }); return steps;
            }
            if (slot === null) {
                steps.push({ message: `Found empty slot. Value ${value} not in table.`, highlightIndex: probeIndex, codeLine: 6 }); return steps;
            }
        } else if (action === 'delete') {
            if (slot === value) {
                const newTable = [...table]; newTable[probeIndex] = TOMBSTONE;
                steps.push({ tableState: newTable, message: `Found ${value}. Marking index ${probeIndex} as deleted.`, highlightIndex: probeIndex, codeLine: 4 });
                return steps;
            }
            if (slot === null) {
                steps.push({ message: `Found empty slot. Value ${value} not in table.`, highlightIndex: probeIndex, codeLine: 6 }); return steps;
            }
        }
        i++;
    }

    steps.push({ message: action === 'insert' ? 'Table is full. Cannot insert.' : `Value ${value} not found after full scan.` });
    return steps;
};


// --- EXPORTED OPEN ADDRESSING FUNCTIONS ---
export const linearProbingInsert = (t, v, s) => openAddressingProbe('linearProbing', t, v, 'insert', s);
export const linearProbingSearch = (t, v, s) => openAddressingProbe('linearProbing', t, v, 'search', s);
export const linearProbingDelete = (t, v, s) => openAddressingProbe('linearProbing', t, v, 'delete', s);

export const quadraticProbingInsert = (t, v, s, c1, c2) => openAddressingProbe('quadraticProbing', t, v, 'insert', s, { c1, c2 });
export const quadraticProbingSearch = (t, v, s, c1, c2) => openAddressingProbe('quadraticProbing', t, v, 'search', s, { c1, c2 });
export const quadraticProbingDelete = (t, v, s, c1, c2) => openAddressingProbe('quadraticProbing', t, v, 'delete', s, { c1, c2 });

export const doubleHashingInsert = (t, v, s, p) => openAddressingProbe('doubleHashing', t, v, 'insert', s, { prime: p });
export const doubleHashingSearch = (t, v, s, p) => openAddressingProbe('doubleHashing', t, v, 'search', s, { prime: p });
export const doubleHashingDelete = (t, v, s, p) => openAddressingProbe('doubleHashing', t, v, 'delete', s, { prime: p });