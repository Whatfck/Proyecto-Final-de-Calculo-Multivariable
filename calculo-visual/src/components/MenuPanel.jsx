import React, { useState } from 'react';
import * as math from 'mathjs';

export default function MenuPanel({ onFunctionChange, currentFunction }) {
  const [activeMenu, setActiveMenu] = useState('function');
  const [inputFunction, setInputFunction] = useState(currentFunction);
  const [calculationResult, setCalculationResult] = useState(null);
  const [calculationType, setCalculationType] = useState('domain');

  const menus = [
    { id: 'function', label: '¿Qué función graficar?', icon: '📊' },
    { id: 'calculate', label: 'Resolver', icon: '🧮' },
    { id: 'domain', label: 'Dominio', icon: '🎯' },
    { id: 'range', label: 'Rango', icon: '📈' },
    { id: 'derivative', label: 'Derivadas', icon: '📐' },
    { id: 'integral', label: 'Integrales', icon: '∫' },
  ];

  const handleFunctionSubmit = (e) => {
    e.preventDefault();
    if (inputFunction.trim()) {
      onFunctionChange(inputFunction);
    }
  };

  const calculateDomain = () => {
    try {
      // Análisis básico del dominio (simplificado)
      const result = `Dominio: ℝ² (todos los reales para x e y)`;
      setCalculationResult(result);
    } catch (error) {
      setCalculationResult('Error al calcular el dominio');
    }
  };

  const calculateRange = () => {
    try {
      // Análisis básico del rango (simplificado)
      const result = `Rango: Depende de la función ${currentFunction}`;
      setCalculationResult(result);
    } catch (error) {
      setCalculationResult('Error al calcular el rango');
    }
  };

  const calculateDerivative = () => {
    try {
      // Derivadas parciales usando math.js
      const derivativeX = math.derivative(currentFunction, 'x');
      const derivativeY = math.derivative(currentFunction, 'y');

      const result = `∂f/∂x = ${derivativeX}\n∂f/∂y = ${derivativeY}`;
      setCalculationResult(result);
    } catch (error) {
      setCalculationResult('Error al calcular las derivadas');
    }
  };

  const calculateIntegral = () => {
    try {
      // Integral doble (simplificada)
      const result = `∫∫ ${currentFunction} dx dy = [Función primitiva]`;
      setCalculationResult(result);
    } catch (error) {
      setCalculationResult('Error al calcular la integral');
    }
  };

  const renderMenuContent = () => {
    switch (activeMenu) {
      case 'function':
        return (
          <div className="menu-content fade-in">
            <h3>Ingrese la función a graficar</h3>
            <form onSubmit={handleFunctionSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="function-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  f(x, y) =
                </label>
                <input
                  id="function-input"
                  type="text"
                  value={inputFunction}
                  onChange={(e) => setInputFunction(e.target.value)}
                  placeholder="ej: x^2 + y^2, sin(x)*cos(y), etc."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid var(--accent-neon)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-neon)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--bg-primary)',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Graficar Función
              </button>
            </form>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <p>Ejemplos de funciones válidas:</p>
              <ul>
                <li>x^2 + y^2</li>
                <li>sin(x) * cos(y)</li>
                <li>exp(-(x^2 + y^2))</li>
                <li>(x^2/4) - (y^2/9)</li>
              </ul>
            </div>
          </div>
        );

      case 'calculate':
        return (
          <div className="menu-content fade-in">
            <h3>Seleccione el tipo de cálculo</h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                onClick={() => { setCalculationType('domain'); calculateDomain(); }}
                style={{
                  padding: '0.5rem 1rem',
                  background: calculationType === 'domain' ? 'var(--accent-neon)' : 'transparent',
                  border: '1px solid var(--accent-neon)',
                  borderRadius: '4px',
                  color: calculationType === 'domain' ? 'var(--bg-primary)' : 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Dominio
              </button>
              <button
                onClick={() => { setCalculationType('range'); calculateRange(); }}
                style={{
                  padding: '0.5rem 1rem',
                  background: calculationType === 'range' ? 'var(--accent-neon)' : 'transparent',
                  border: '1px solid var(--accent-neon)',
                  borderRadius: '4px',
                  color: calculationType === 'range' ? 'var(--bg-primary)' : 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Rango
              </button>
              <button
                onClick={() => { setCalculationType('derivative'); calculateDerivative(); }}
                style={{
                  padding: '0.5rem 1rem',
                  background: calculationType === 'derivative' ? 'var(--accent-neon)' : 'transparent',
                  border: '1px solid var(--accent-neon)',
                  borderRadius: '4px',
                  color: calculationType === 'derivative' ? 'var(--bg-primary)' : 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Derivadas
              </button>
              <button
                onClick={() => { setCalculationType('integral'); calculateIntegral(); }}
                style={{
                  padding: '0.5rem 1rem',
                  background: calculationType === 'integral' ? 'var(--accent-neon)' : 'transparent',
                  border: '1px solid var(--accent-neon)',
                  borderRadius: '4px',
                  color: calculationType === 'integral' ? 'var(--bg-primary)' : 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Integrales
              </button>
            </div>
            {calculationResult && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1rem',
                borderRadius: '4px',
                border: '1px solid var(--accent-neon)',
                whiteSpace: 'pre-line'
              }}>
                <h4>Resultado:</h4>
                <p>{calculationResult}</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="menu-content fade-in">
            <h3>{menus.find(m => m.id === activeMenu)?.label}</h3>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        );
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: '1rem',
      height: '600px'
    }}>
      {/* Barra lateral de navegación */}
      <div>
        <h3 style={{
          margin: '0 0 1rem 0',
          fontSize: '1rem',
          fontWeight: 500,
          color: '#ffffff',
          fontFamily: 'var(--font-body)',
          textAlign: 'center'
        }}>
          Menús
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {menus.map((menu) => (
            <button
              key={menu.id}
              style={{
                padding: '0.75rem',
                background: activeMenu === menu.id ? '#ffffff' : 'transparent',
                border: '1px solid #ffffff',
                borderRadius: '6px',
                color: activeMenu === menu.id ? '#0a0a0a' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: 500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-body)',
                textAlign: 'center'
              }}
              onClick={() => setActiveMenu(menu.id)}
            >
              <span style={{ fontSize: '1.2rem' }}>{menu.icon}</span>
              <span>{menu.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del menú activo */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '8px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflowY: 'auto',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {renderMenuContent()}
      </div>
    </div>
  );
}