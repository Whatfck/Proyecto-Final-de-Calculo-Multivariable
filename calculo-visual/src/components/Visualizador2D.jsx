import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as math from 'mathjs';

export default function Visualizador2D({ expression = 'x^2 + y^2', type = 'contour' }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current) return;

    // Limpiar SVG anterior
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-5, 5])
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
      .attr('y', height - 5)
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
      const resolution = 50;

      for (let i = 0; i <= resolution; i++) {
        for (let j = 0; j <= resolution; j++) {
          const x = -5 + (i / resolution) * 10;
          const y = -5 + (j / resolution) * 10;

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
        .thresholds(d3.range(-10, 11, 1));

      // Datos para contornos
      const values = [];
      for (let i = 0; i <= resolution; i++) {
        values[i] = [];
        for (let j = 0; j <= resolution; j++) {
          const x = -5 + (i / resolution) * 10;
          const y = -5 + (j / resolution) * 10;
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
      const resolution = 50;
      const cellWidth = (width - margin.left - margin.right) / resolution;
      const cellHeight = (height - margin.top - margin.bottom) / resolution;

      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const x = -5 + (i / resolution) * 10;
          const y = -5 + (j / resolution) * 10;

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

  }, [expression, type]);

  return (
    <div style={{ padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '8px' }}>
      <h3 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
        Visualización 2D - {type === 'contour' ? 'Curvas de Nivel' : 'Mapa de Calor'}
      </h3>
      <svg ref={svgRef} style={{ display: 'block', margin: '0 auto' }}></svg>
    </div>
  );
}