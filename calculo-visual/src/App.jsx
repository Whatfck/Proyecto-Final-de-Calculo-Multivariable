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
      {/* Barra lateral negra con íconos de menú */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: '72px',
        bottom: 0,
        width: '64px',
        backgroundColor: '#000000',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        gap: '15px'
      }}>
        {/* Íconos de menú dentro de la barra negra */}
        <button
          style={{
            background: activeMenu === 'function' ? '#ffffff' : 'transparent',
            border: 'none',
            color: activeMenu === 'function' ? '#000000' : '#ffffff',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('function')}
          title="Función"
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-spline-icon lucide-chart-spline"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7"/></svg>`
          }}
        />

        <button
          style={{
            background: activeMenu === 'calculate' ? '#ffffff' : 'transparent',
            border: 'none',
            color: activeMenu === 'calculate' ? '#000000' : '#ffffff',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('calculate')}
          title="Resolver"
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator-icon lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`
          }}
        />

        <button
          style={{
            background: activeMenu === 'domain' ? '#ffffff' : 'transparent',
            border: 'none',
            color: activeMenu === 'domain' ? '#000000' : '#ffffff',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('domain')}
          title="Dominio"
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crosshair-icon lucide-crosshair"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>`
          }}
        />

        <button
          style={{
            background: activeMenu === 'range' ? '#ffffff' : 'transparent',
            border: 'none',
            color: activeMenu === 'range' ? '#000000' : '#ffffff',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('range')}
          title="Rango"
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors-line-dashed-icon lucide-scissors-line-dashed"><path d="M5.42 9.42 8 12"/><circle cx="4" cy="8" r="2"/><path d="m14 6-8.58 8.58"/><circle cx="4" cy="16" r="2"/><path d="M10.8 14.8 14 18"/><path d="M16 12h-2"/><path d="M22 12h-2"/></svg>`
          }}
        />

        <button
          style={{
            background: activeMenu === 'derivative' ? '#ffffff' : 'transparent',
            border: 'none',
            color: activeMenu === 'derivative' ? '#000000' : '#ffffff',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('derivative')}
          title="Derivadas"
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-right-icon lucide-triangle-right"><path d="M22 18a2 2 0 0 1-2 2H3c-1.1 0-1.3-.6-.4-1.3L20.4 4.3c.9-.7 1.6-.4 1.6.7Z"/></svg>`
          }}
        />

        <button
          style={{
            background: activeMenu === 'integral' ? '#ffffff' : 'transparent',
            border: 'none',
            color: activeMenu === 'integral' ? '#000000' : '#ffffff',
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

      {/* Visualizador 3D a pantalla completa */}
      <div style={{
        position: 'fixed',
        top: '72px',
        left: '364px',
        right: 0,
        bottom: 0,
        zIndex: 1
      }}>
        <Visualizador3D expression={currentFunction} />
      </div>
    </div>
  );
}

export default App;
