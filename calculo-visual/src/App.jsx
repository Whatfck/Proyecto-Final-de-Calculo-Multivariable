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
      {/* Header */}
      <header style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          margin: 0,
          color: '#ffffff',
          fontFamily: 'var(--font-title)',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          NeoCalc
        </h1>
      </header>

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
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Menú lateral - Lado izquierdo */}
        <div>
          <MenuPanel
            onFunctionChange={handleFunctionChange}
            currentFunction={currentFunction}
          />
        </div>

        {/* Visualizador 3D - Lado derecho */}
        <div style={{
          background: '#1a1a1a',
          border: '1px solid #ffffff',
          borderRadius: '8px',
          boxShadow: '0 0 20px #ffffff',
          overflow: 'hidden',
          aspectRatio: '16/9',
          width: '100%'
        }}>
          <Visualizador3D expression={currentFunction} />
        </div>
      </div>
    </div>
  );
}

export default App;
