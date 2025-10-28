import React, { useState, useEffect } from 'react';
import Visualizador3D from './components/Visualizador3D';
import MenuPanel from './components/MenuPanel';

function App() {
  const [currentFunction, setCurrentFunction] = useState('x^2 + y^2');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeMenu, setActiveMenu] = useState('function');

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

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
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
            background: activeMenu === 'function' ? '#dc143c' : 'transparent',
            border: 'none',
            color: activeMenu === 'function' ? '#ffffff' : '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('function')}
          title="Función"
        >
          📊
        </button>

        <button
          style={{
            background: activeMenu === 'calculate' ? '#dc143c' : 'transparent',
            border: 'none',
            color: activeMenu === 'calculate' ? '#ffffff' : '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('calculate')}
          title="Resolver"
        >
          🧮
        </button>

        <button
          style={{
            background: activeMenu === 'domain' ? '#dc143c' : 'transparent',
            border: 'none',
            color: activeMenu === 'domain' ? '#ffffff' : '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('domain')}
          title="Dominio"
        >
          🎯
        </button>

        <button
          style={{
            background: activeMenu === 'range' ? '#dc143c' : 'transparent',
            border: 'none',
            color: activeMenu === 'range' ? '#ffffff' : '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('range')}
          title="Rango"
        >
          📈
        </button>

        <button
          style={{
            background: activeMenu === 'derivative' ? '#dc143c' : 'transparent',
            border: 'none',
            color: activeMenu === 'derivative' ? '#ffffff' : '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('derivative')}
          title="Derivadas"
        >
          📐
        </button>

        <button
          style={{
            background: activeMenu === 'integral' ? '#dc143c' : 'transparent',
            border: 'none',
            color: activeMenu === 'integral' ? '#ffffff' : '#0a0a0a',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('integral')}
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
        {activeMenu === 'function' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              📊 Función
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6' }}>
              <p>Ingrese la función matemática a visualizar:</p>
              <input
                type="text"
                value={currentFunction}
                onChange={(e) => handleFunctionChange(e.target.value)}
                placeholder="ej: x^2 + y^2, sin(x)*cos(y)"
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={() => handleFunctionChange(currentFunction)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '10px',
                  backgroundColor: '#ffffff',
                  color: '#dc143c',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Graficar Función
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'calculate' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              🧮 Resolver
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6' }}>
              <p>Selecciona el tipo de cálculo:</p>
              <button style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid #ffffff',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Calcular Dominio
              </button>
              <button style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid #ffffff',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Calcular Rango
              </button>
              <button style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid #ffffff',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Calcular Derivadas
              </button>
              <button style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid #ffffff',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Calcular Integrales
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'domain' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              🎯 Dominio
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6' }}>
              <p>El dominio de la función {currentFunction} es:</p>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '10px'
              }}>
                <strong>Dominio: ℝ²</strong><br />
                (Todos los números reales para x e y)
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'range' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              📈 Rango
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6' }}>
              <p>El rango de la función {currentFunction} depende de su comportamiento:</p>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '10px'
              }}>
                <strong>Rango: Depende de f(x,y)</strong><br />
                (Se calcula analizando el comportamiento de la función)
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'derivative' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              📐 Derivadas
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6' }}>
              <p>Derivadas parciales de {currentFunction}:</p>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '10px'
              }}>
                <strong>∂f/∂x:</strong> Derivada parcial respecto a x<br />
                <strong>∂f/∂y:</strong> Derivada parcial respecto a y<br />
                <strong>∇f:</strong> Gradiente de la función
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'integral' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              ∫ Integrales
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6' }}>
              <p>Integrales de {currentFunction}:</p>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '10px'
              }}>
                <strong>∫∫ f(x,y) dx dy:</strong> Integral doble<br />
                <strong>∫ f(x,y) dl:</strong> Integral de línea<br />
                <strong>Volumen:</strong> ∭ f(x,y,z) dx dy dz
              </div>
            </div>
          </div>
        )}
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
