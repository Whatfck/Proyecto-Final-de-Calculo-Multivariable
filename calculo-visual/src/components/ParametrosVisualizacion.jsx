import React, { useState } from 'react';

export default function ParametrosVisualizacion({ onParamsChange, currentParams }) {
  const [range, setRange] = useState(currentParams?.range || 5);
  const [resolution, setResolution] = useState(currentParams?.resolution || 50);
  const [showGrid, setShowGrid] = useState(currentParams?.showGrid !== false);
  const [colorScheme, setColorScheme] = useState(currentParams?.colorScheme || 'default');

  const handleParamChange = (param, value) => {
    const newParams = {
      range,
      resolution,
      showGrid,
      colorScheme,
      [param]: value
    };

    // Actualizar estado local
    switch (param) {
      case 'range':
        setRange(value);
        break;
      case 'resolution':
        setResolution(value);
        break;
      case 'showGrid':
        setShowGrid(value);
        break;
      case 'colorScheme':
        setColorScheme(value);
        break;
      default:
        break;
    }

    // Notificar cambios al componente padre
    if (onParamsChange) {
      onParamsChange(newParams);
    }
  };

  return (
    <div>
      <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
        Parámetros de Visualización
      </h3>
      <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>

        {/* Rango de visualización */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-bold)' }}>
            Rango de visualización: ±{range}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={range}
            onChange={(e) => handleParamChange('range', parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: 'rgba(255, 255, 255, 0.2)',
              outline: 'none',
              appearance: 'none'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* Resolución */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-bold)' }}>
            Resolución: {resolution} puntos
          </label>
          <input
            type="range"
            min="20"
            max="100"
            step="10"
            value={resolution}
            onChange={(e) => handleParamChange('resolution', parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: 'rgba(255, 255, 255, 0.2)',
              outline: 'none',
              appearance: 'none'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
            <span>20</span>
            <span>100</span>
          </div>
        </div>

        {/* Mostrar grid */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => handleParamChange('showGrid', e.target.checked)}
              style={{
                marginRight: '10px',
                width: '16px',
                height: '16px',
                accentColor: '#ffffff'
              }}
            />
            <span style={{ fontWeight: 'var(--font-weight-bold)' }}>Mostrar grid</span>
          </label>
        </div>

        {/* Esquema de colores */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'var(--font-weight-bold)' }}>
            Esquema de colores:
          </label>
          <select
            value={colorScheme}
            onChange={(e) => handleParamChange('colorScheme', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid #ffffff',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '14px',
              fontFamily: 'var(--font-text)',
              fontWeight: 'var(--font-weight-light)'
            }}
          >
            <option value="default">Rojo → Verde → Azul</option>
            <option value="viridis">Viridis (azul → verde → amarillo)</option>
            <option value="plasma">Plasma (morado → rosa → amarillo)</option>
            <option value="inferno">Inferno (negro → rojo → amarillo)</option>
            <option value="magma">Magma (negro → púrpura → rosa)</option>
          </select>
        </div>

        {/* Información adicional */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          padding: '15px',
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <h4 style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: '10px', fontSize: '14px' }}>
            Información de parámetros:
          </h4>
          <ul style={{ fontSize: '12px', lineHeight: '1.4' }}>
            <li><strong>Rango:</strong> Define el dominio de visualización (±rango)</li>
            <li><strong>Resolución:</strong> Número de puntos para generar la superficie</li>
            <li><strong>Grid:</strong> Muestra líneas de referencia en el plano XY</li>
            <li><strong>Colores:</strong> Esquemas de color para representar valores Z</li>
          </ul>
        </div>

      </div>
    </div>
  );
}