import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOMBSTONE } from '../../algorithms/hashingLogic';
import './HashTable.css';

const HashTable = ({ table, mode, highlightedIndex, highlightedChainIndex }) => {
    return (
        <div className="hash-table-container">
            <h3>Hash Table</h3>
            <div className="hash-table">
                {table.map((bucket, index) => (
                    <motion.div
                        className="table-column"
                        key={index}
                        animate={{
                            backgroundColor: highlightedIndex === index ? '#ffc107' : '#e0e0e03a',
                            scale: highlightedIndex === index ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="table-index">{index}</div>
                        <div className="table-cell">
                            <AnimatePresence>
                                {mode === 'open' ? (
                                    (bucket !== null && bucket !== TOMBSTONE) && (
                                        <motion.div className="table-value" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                            {bucket}
                                        </motion.div>
                                    )
                                ) : ( // Chaining mode
                                    <div className="chain-container">
                                        {/* THIS IS THE FIX: Check if the bucket is actually an array before mapping */}
                                        {Array.isArray(bucket) && bucket.map((value, i) => (
                                            <React.Fragment key={i}>
                                                <motion.div
                                                    className={`table-value chain-node ${highlightedChainIndex === i ? 'highlight-chain' : ''}`}
                                                    initial={{ y: -20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                >
                                                    {value}
                                                </motion.div>
                                                {i < bucket.length - 1 && <div className="chain-arrow">↓</div>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HashTable;