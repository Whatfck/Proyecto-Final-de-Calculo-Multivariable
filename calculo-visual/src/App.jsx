import React, { useState, useEffect } from 'react';
import Visualizador3D from './components/Visualizador3D';
import MenuPanel from './components/MenuPanel';

function App() {
  const [currentFunction, setCurrentFunction] = useState('sin(x) * cos(y)');
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
      {/* Barra lateral negra con íconos de menú - Menú flotante */}
      <div style={{
        position: 'fixed',
        left: '10px',
        top: '82px',
        width: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px',
        gap: '10px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
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
            fontSize: '20px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('integral')}
          title="Integrales"
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-integral-icon lucide-integral"><path d="M11.5 3H20v18"/><path d="M6.5 21H4V3h7.5"/><path d="M6.5 12.5h11"/></svg>`
          }}
        />
      </div>

      {/* Panel lateral rojo para contenido de menú - Flotante */}
      <div style={{
        position: 'fixed',
        left: '90px',
        top: '82px',
        width: '300px',
        backgroundColor: 'rgba(220, 20, 60, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        zIndex: 9,
        padding: '20px',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(220, 20, 60, 0.3)',
        maxHeight: 'calc(100vh - 102px)'
      }}>
        {activeMenu === 'function' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Función
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
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
                  fontSize: '14px',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
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
                  fontWeight: 'var(--font-weight-bold)',
                  fontFamily: 'var(--font-text)'
                }}
              >
                Graficar Función
              </button>

              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }}>
                <p style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: '10px' }}>Funciones para probar:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => handleFunctionChange('x^2 + y^2')}
                    style={{
                      padding: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'var(--font-text)',
                      fontWeight: 'var(--font-weight-light)',
                      textAlign: 'left'
                    }}
                  >
                    x² + y² (Parabolóide)
                  </button>
                  <button
                    onClick={() => handleFunctionChange('sin(x) * cos(y)')}
                    style={{
                      padding: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'var(--font-text)',
                      fontWeight: 'var(--font-weight-light)',
                      textAlign: 'left'
                    }}
                  >
                    sin(x) × cos(y) (Onda)
                  </button>
                  <button
                    onClick={() => handleFunctionChange('exp(-(x^2 + y^2))')}
                    style={{
                      padding: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'var(--font-text)',
                      fontWeight: 'var(--font-weight-light)',
                      textAlign: 'left'
                    }}
                  >
                    e^(-(x² + y²)) (Gaussiana)
                  </button>
                  <button
                    onClick={() => handleFunctionChange('(x^2/4) - (y^2/9)')}
                    style={{
                      padding: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'var(--font-text)',
                      fontWeight: 'var(--font-weight-light)',
                      textAlign: 'left'
                    }}
                  >
                    (x²/4) - (y²/9) (Hipérbola)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'calculate' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Resolver
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
              <p>Selecciona el tipo de cálculo:</p>
              <button
                onClick={() => {
                  try {
                    const result = `Dominio: ℝ² (todos los números reales para x e y)`;
                    alert(`Resultado del cálculo:\n\n${result}`);
                  } catch (error) {
                    alert('Error al calcular el dominio');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                Calcular Dominio
              </button>
              <button
                onClick={() => {
                  try {
                    const result = `Rango: Depende de f(x,y) = ${currentFunction}`;
                    alert(`Resultado del cálculo:\n\n${result}\n\n(Análisis detallado disponible próximamente)`);
                  } catch (error) {
                    alert('Error al calcular el rango');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                Calcular Rango
              </button>
              <button
                onClick={() => {
                  try {
                    const math = require('mathjs');
                    const derivativeX = math.derivative(currentFunction, 'x').toString();
                    const derivativeY = math.derivative(currentFunction, 'y').toString();
                    const result = `∂f/∂x = ${derivativeX}\n∂f/∂y = ${derivativeY}`;
                    alert(`Derivadas parciales calculadas:\n\n${result}`);
                  } catch (error) {
                    alert('Error al calcular las derivadas. Verifica que la función sea válida.');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                Calcular Derivadas
              </button>
              <button
                onClick={() => {
                  try {
                    const result = `Integral doble de ${currentFunction}:\n\n∫∫ f(x,y) dx dy\n\n(Cálculo numérico próximamente)`;
                    alert(result);
                  } catch (error) {
                    alert('Error al calcular la integral');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                Calcular Integrales
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'domain' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Dominio
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
              <p>El dominio de la función {currentFunction} es:</p>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '10px',
                fontFamily: 'var(--font-text)',
                fontWeight: 'var(--font-weight-light)'
              }}>
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>Dominio: ℝ²</strong><br />
                (Todos los números reales para x e y)
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'range' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Rango
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
              <p>El rango de la función {currentFunction} depende de su comportamiento:</p>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '10px',
                fontFamily: 'var(--font-text)',
                fontWeight: 'var(--font-weight-light)'
              }}>
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>Rango: Depende de f(x,y)</strong><br />
                (Se calcula analizando el comportamiento de la función)
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'derivative' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Derivadas
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
              <p>Derivadas parciales de {currentFunction}:</p>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '10px',
                fontFamily: 'var(--font-text)',
                fontWeight: 'var(--font-weight-light)'
              }}>
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>∂f/∂x:</strong> Derivada parcial respecto a x<br />
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>∂f/∂y:</strong> Derivada parcial respecto a y<br />
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>∇f:</strong> Gradiente de la función
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'integral' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Integrales
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
              <p>Integrales de {currentFunction}:</p>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '10px',
                fontFamily: 'var(--font-text)',
                fontWeight: 'var(--font-weight-light)'
              }}>
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>∫∫ f(x,y) dx dy:</strong> Integral doble<br />
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>∫ f(x,y) dl:</strong> Integral de línea<br />
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>Volumen:</strong> ∭ f(x,y,z) dx dy dz
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
          letterSpacing: '2px',
          fontWeight: 'var(--font-weight-bold)'
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

      {/* Visualizador 3D como fondo de toda la página */}
      <div style={{
        position: 'fixed',
        top: '72px',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
      }}>
        <Visualizador3D expression={currentFunction} />
      </div>
    </div>
  );
}

export default App;
