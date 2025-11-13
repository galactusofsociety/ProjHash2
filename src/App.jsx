import React from 'react';
import HashingVisualizer from './components/HashingVisualizer/HashingVisualizer';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hashing Algorithm Visualizer</h1>
      </header>
      <main>
        <HashingVisualizer />
      </main>
    </div>
  );
}

export default App;