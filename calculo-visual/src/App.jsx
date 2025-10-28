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
      backgroundColor: '#111111',
      color: '#ffffff',
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Barra lateral blanca con íconos de menú */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: '80px',
        bottom: 0,
        width: '64px',
        backgroundColor: '#ffffff',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        gap: '15px'
      }}>
        {/* Íconos de menú dentro de la barra blanca */}
        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Función"
        >
          📊
        </button>

        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Resolver"
        >
          🧮
        </button>

        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Dominio"
        >
          🎯
        </button>

        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Rango"
        >
          📈
        </button>

        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Derivadas"
        >
          📐
        </button>

        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Integrales"
        >
          ∫
        </button>
      </div>

      {/* Panel lateral rojo para contenido de menú */}
      <div style={{
        position: 'fixed',
        left: '64px',
        top: '80px',
        bottom: 0,
        width: '300px',
        backgroundColor: '#dc143c',
        zIndex: 9,
        padding: '20px',
        overflowY: 'auto'
      }}>
        <h3 style={{
          color: '#ffffff',
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Contenido del Menú
        </h3>
        <div style={{
          color: '#ffffff',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <p>Selecciona un ícono del menú lateral para ver el contenido aquí.</p>
          <p>Esta área mostrará los controles y opciones para cada funcionalidad matemática.</p>
        </div>
      </div>

      {/* Header */}
      <header style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        marginLeft: '4px'
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
        gridTemplateColumns: '1fr',
        gap: '2rem',
        alignItems: 'start',
        marginLeft: '374px'
      }}>

        {/* Visualizador 3D - Lado derecho */}
        <div style={{
          background: '#1a1a1a',
          border: '1px solid #ffffff',
          borderRadius: '8px',
          boxShadow: '0 0 20px #ffffff',
          overflow: 'hidden',
          width: '400px',
          height: '300px',
          justifySelf: 'end'
        }}>
          <Visualizador3D expression={currentFunction} />
        </div>
      </div>
    </div>
  );
}

export default App;
