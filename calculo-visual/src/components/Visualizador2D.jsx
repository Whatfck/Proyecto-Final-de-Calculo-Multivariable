import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as math from 'mathjs';

export default function Visualizador2D({ expression = 'x^2 + y^2', type = 'contour', params }) {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const range = params?.range || 5;
  const resolution = params?.resolution || 50;

  // Función para calcular dimensiones responsive
  const calculateDimensions = () => {
    const containerWidth = window.innerWidth - 320; // Menos espacio para paneles (antes 400)
    const containerHeight = window.innerHeight - 150; // Menos espacio para header (antes 200)

    // Usar más espacio disponible, límites más amplios
    let width = Math.min(containerWidth, 1400); // Aumentado a 1400px
    let height = Math.min(containerHeight, 1050); // Aumentado a 1050px

    // Ajustar para mantener proporción 16:9
    if (width / height > 16/9) {
      width = height * (16/9);
    } else if (width / height < 16/9) {
      height = width / (16/9);
    }

    // Mínimos más pequeños para móviles
    width = Math.max(width, 350);
    height = Math.max(height, 250);

    return { width: Math.floor(width), height: Math.floor(height) };
  };

  // Actualizar dimensiones al montar y al cambiar tamaño de ventana
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions(calculateDimensions());
    };

    updateDimensions(); // Inicial
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    // Limpiar SVG anterior
    d3.select(svgRef.current).selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 80, left: 60 };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleLinear()
      .domain([-range, range])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-range, range])
      .range([height - margin.bottom, margin.top]);

    // Ejes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style('color', '#ffffff');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)
      .style('color', '#ffffff');

    // Etiquetas de ejes
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom + 15)
      .attr('text-anchor', 'middle')
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text('x');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text('y');

    if (type === 'contour') {
      // Gráfico de contorno
      const contours = [];

      for (let i = 0; i <= resolution; i++) {
        for (let j = 0; j <= resolution; j++) {
          const x = -range + (i / resolution) * (range * 2);
          const y = -range + (j / resolution) * (range * 2);

          try {
            const z = math.evaluate(expression, { x, y });
            if (!isNaN(z) && isFinite(z)) {
              contours.push({ x, y, z });
            }
          } catch (e) {
            // Ignorar puntos inválidos
          }
        }
      }

      // Crear contornos usando D3
      const contourGenerator = d3.contours()
        .size([resolution + 1, resolution + 1])
        .thresholds(d3.range(-range * 2, range * 2 + 1, 1));

      // Datos para contornos
      const values = [];
      for (let i = 0; i <= resolution; i++) {
        values[i] = [];
        for (let j = 0; j <= resolution; j++) {
          const x = -range + (i / resolution) * (range * 2);
          const y = -range + (j / resolution) * (range * 2);
          try {
            values[i][j] = math.evaluate(expression, { x, y }) || 0;
          } catch (e) {
            values[i][j] = 0;
          }
        }
      }

      const contourData = contourGenerator(values.flat());

      const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
        .domain(d3.extent(contours, d => d.z));

      svg.selectAll('path')
        .data(contourData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath(d3.geoIdentity().scale(width / (resolution + 1)).translate([margin.left, margin.top])))
        .attr('fill', (d, i) => colorScale(d.value))
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.7);

    } else if (type === 'heatmap') {
      // Mapa de calor
      const cellWidth = (width - margin.left - margin.right) / resolution;
      const cellHeight = (height - margin.top - margin.bottom) / resolution;

      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const x = -range + (i / resolution) * (range * 2);
          const y = -range + (j / resolution) * (range * 2);

          try {
            const z = math.evaluate(expression, { x, y });
            if (!isNaN(z) && isFinite(z)) {
              const color = getColorFromValue(z);

              svg.append('rect')
                .attr('x', xScale(x))
                .attr('y', yScale(y))
                .attr('width', cellWidth)
                .attr('height', cellHeight)
                .attr('fill', color)
                .attr('opacity', 0.8);
            }
          } catch (e) {
            // Ignorar celdas inválidas
          }
        }
      }
    }

    // Función auxiliar para color
    function getColorFromValue(value) {
      const normalized = (value + 5) / 10;
      const clamped = Math.max(0, Math.min(1, normalized));

      if (clamped < 0.5) {
        const red = Math.floor(255 * (1 - clamped * 2));
        const green = Math.floor(255 * (clamped * 2));
        return `rgb(${red}, ${green}, 0)`;
      } else {
        const green = Math.floor(255 * (1 - (clamped - 0.5) * 2));
        const blue = Math.floor(255 * ((clamped - 0.5) * 2));
        return `rgb(0, ${green}, ${blue})`;
      }
    }

  }, [expression, type, range, resolution, dimensions]);

  return (
    <div style={{
      padding: '10px',
      backgroundColor: '#111111',
      borderRadius: '8px',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <h3 style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#ffffff',
          margin: '0',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 2,
          backgroundColor: 'rgba(17, 17, 17, 0.8)',
          padding: '2px 8px',
          borderRadius: '4px'
        }}>
          Visualización 2D - {type === 'contour' ? 'Curvas de Nivel' : 'Mapa de Calor'}
        </h3>
        <svg
          ref={svgRef}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'block'
          }}
        ></svg>
      </div>
    </div>
  );
}