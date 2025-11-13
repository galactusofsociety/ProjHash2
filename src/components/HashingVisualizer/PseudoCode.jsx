import React from 'react';
import './Pseudocode.css';

const Pseudocode = ({ code, currentLine }) => {
    return (
        <div className="pseudocode-container">
            <h3>Pseudocode</h3>
            <pre className="pseudocode-box">
                {code.map((line, index) => (
                    <div
                        key={index}
                        className={`code-line ${currentLine === index + 1 ? 'highlighted-line' : ''}`}
                    >
                        {line}
                    </div>
                ))}
            </pre>
        </div>
    );
};

export default Pseudocode;