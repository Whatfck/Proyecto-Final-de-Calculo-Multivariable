import React, { useState, useEffect } from 'react';
import Visualizador3D from './components/Visualizador3D';
import MenuPanel from './components/MenuPanel';

function App() {
  const [currentFunction, setCurrentFunction] = useState('x^2 + y^2');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simular carga para asegurar que todo esté listo
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFunctionChange = (newFunction) => {
    setCurrentFunction(newFunction);
  };

  if (!isLoaded) {
    return (
      <div style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem'
      }}>
        Cargando aplicación...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efectos de luces de fondo */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: -1
      }} />
      <div style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(65, 105, 225, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: -1
      }} />

      <div style={{
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: 900,
          marginBottom: '2rem',
          textShadow: '0 0 10px #00ffff',
          letterSpacing: '3px',
          color: '#ffffff',
          fontFamily: 'var(--font-title)',
          textTransform: 'uppercase'
        }}>
          NeoCalc
        </h1>

        {/* Visualizador 3D - 16:9 */}
        <div style={{
          width: '100%',
          height: 'calc(100vw * 9 / 16)',
          maxHeight: '60vh',
          background: '#1a1a1a',
          border: '1px solid #00ffff',
          borderRadius: '8px',
          marginBottom: '2rem',
          boxShadow: '0 0 10px #00ffff',
          overflow: 'hidden'
        }}>
          <Visualizador3D expression={currentFunction} />
        </div>

        {/* Panel de menús */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '8px',
          border: '1px solid #00ffff',
          boxShadow: '0 0 10px #00ffff',
          padding: '1.5rem'
        }}>
          <MenuPanel
            onFunctionChange={handleFunctionChange}
            currentFunction={currentFunction}
          />
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '2rem 0',
          color: '#cccccc',
          fontSize: '0.9rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '2rem',
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          letterSpacing: '1px'
        }}>
          NeoCalc - Proyecto Final @2025
        </footer>
      </div>
    </div>
  );
}

export default App;
