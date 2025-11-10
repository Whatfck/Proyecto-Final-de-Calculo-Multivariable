import React, { useState, useEffect } from 'react';
import Visualizador3D from './components/Visualizador3D';
import Visualizador2D from './components/Visualizador2D';
import ParametrosVisualizacion from './components/ParametrosVisualizacion';
import * as math from 'mathjs';

function App() {
  const [currentFunction, setCurrentFunction] = useState('sin(x) * cos(y)');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [calculationResult, setCalculationResult] = useState('');
  const [calculationType, setCalculationType] = useState('');
  const [visualization2DType, setVisualization2DType] = useState('contour');
  const [visualizationParams3D, setVisualizationParams3D] = useState({
    range: 5,
    resolution: 50,
    showGrid: true,
    colorScheme: 'default'
  });
  const [visualizationParams2D, setVisualizationParams2D] = useState({
    range: 5,
    resolution: 50,
    showGrid: true,
    colorScheme: 'default'
  });
  const [is2DView, setIs2DView] = useState(false);

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
    if (activeMenu === menuId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuId);
    }
    setCalculationResult('');
    setCalculationType('');
  };

  // Funciones de cálculo matemático avanzadas
  const calculateDomain = () => {
    try {
      // Análisis básico del dominio - detectar restricciones comunes
      let domainAnalysis = "Análisis del dominio:\n\n";

      if (currentFunction.includes('sqrt(') || currentFunction.includes('√')) {
        domainAnalysis += "• Restricción por raíz cuadrada: x ≥ 0, y ≥ 0\n";
      }

      if (currentFunction.includes('log(') || currentFunction.includes('ln(')) {
        domainAnalysis += "• Restricción por logaritmo: x > 0, y > 0\n";
      }

      if (currentFunction.includes('/')) {
        domainAnalysis += "• Posibles restricciones por división: denominador ≠ 0\n";
      }

      if (domainAnalysis === "Análisis del dominio:\n\n") {
        domainAnalysis += "• Dominio: ℝ² (todos los números reales para x e y)\n";
        domainAnalysis += "• No se detectaron restricciones especiales en la función\n";
      }

      setCalculationResult(domainAnalysis);
      setCalculationType('domain');
    } catch (error) {
      setCalculationResult('Error al analizar el dominio: ' + error.message);
    }
  };

  const calculateRange = () => {
    try {
      // Análisis numérico del rango evaluando en múltiples puntos
      const testPoints = [
        [0, 0], [1, 0], [0, 1], [-1, 0], [0, -1],
        [1, 1], [-1, -1], [2, 2], [-2, -2],
        [0.5, 0.5], [-0.5, -0.5]
      ];

      let minVal = Infinity;
      let maxVal = -Infinity;
      let values = [];

      testPoints.forEach(([x, y]) => {
        try {
          const val = math.evaluate(currentFunction, { x, y });
          if (typeof val === 'number' && isFinite(val)) {
            values.push(val);
            minVal = Math.min(minVal, val);
            maxVal = Math.max(maxVal, val);
          }
        } catch (e) {
          // Ignorar puntos que causen errores
        }
      });

      let rangeResult = "Análisis del rango:\n\n";

      if (values.length > 0) {
        rangeResult += `• Valor mínimo aproximado: ${minVal.toFixed(4)}\n`;
        rangeResult += `• Valor máximo aproximado: ${maxVal.toFixed(4)}\n`;
        rangeResult += `• Rango aproximado: [${minVal.toFixed(2)}, ${maxVal.toFixed(2)}]\n\n`;
        rangeResult += `• Evaluado en ${values.length} puntos de prueba\n`;
        rangeResult += `• Para un análisis más preciso, considere el comportamiento analítico de la función\n`;
      } else {
        rangeResult += "• No se pudieron evaluar valores numéricos\n";
        rangeResult += "• Verifique que la función esté correctamente definida\n";
      }

      setCalculationResult(rangeResult);
      setCalculationType('range');
    } catch (error) {
      setCalculationResult('Error al calcular el rango: ' + error.message);
    }
  };

  const calculateDerivative = () => {
    try {
      // Calcular derivadas parciales usando math.js
      const derivativeX = math.derivative(currentFunction, 'x');
      const derivativeY = math.derivative(currentFunction, 'y');

      // Calcular gradiente
      const gradient = `∇f = (${derivativeX}, ${derivativeY})`;

      let result = "Derivadas parciales calculadas:\n\n";
      result += `∂f/∂x = ${derivativeX}\n`;
      result += `∂f/∂y = ${derivativeY}\n\n`;
      result += `Gradiente: ${gradient}\n\n`;

      // Intentar evaluar el gradiente en algunos puntos
      try {
        const testPoint = [1, 1];
        const gradX = math.evaluate(derivativeX.toString(), { x: testPoint[0], y: testPoint[1] });
        const gradY = math.evaluate(derivativeY.toString(), { x: testPoint[0], y: testPoint[1] });

        result += `Ejemplo en el punto (${testPoint[0]}, ${testPoint[1]}):\n`;
        result += `∇f(${testPoint[0]}, ${testPoint[1]}) = (${gradX.toFixed(4)}, ${gradY.toFixed(4)})\n`;
      } catch (e) {
        result += "No se pudo evaluar el gradiente en un punto de ejemplo\n";
      }

      setCalculationResult(result);
      setCalculationType('derivative');
    } catch (error) {
      setCalculationResult('Error al calcular las derivadas: ' + error.message);
    }
  };

  const calculateIntegral = () => {
    try {
      let result = "Cálculo de integrales múltiples:\n\n";

      // Solicitar límites de integración
      const xMin = parseFloat(prompt("Límite inferior para x:", "-1"));
      const xMax = parseFloat(prompt("Límite superior para x:", "1"));
      const yMin = parseFloat(prompt("Límite inferior para y:", "-1"));
      const yMax = parseFloat(prompt("Límite superior para y:", "1"));

      if (isNaN(xMin) || isNaN(xMax) || isNaN(yMin) || isNaN(yMax)) {
        setCalculationResult('Error: Límites de integración inválidos');
        setCalculationType('integral');
        return;
      }

      result += `Calculando ∬ f(x,y) dx dy sobre [${xMin}, ${xMax}] × [${yMin}, ${yMax}]\n\n`;
      result += `Función: f(x,y) = ${currentFunction}\n\n`;

      // Método 1: Integración numérica simple (regla del trapecio)
      const numPoints = 20;
      let integralValue = 0;
      const dx = (xMax - xMin) / numPoints;
      const dy = (yMax - yMin) / numPoints;

      for (let i = 0; i <= numPoints; i++) {
        for (let j = 0; j <= numPoints; j++) {
          const x = xMin + i * dx;
          const y = yMin + j * dy;

          try {
            const f_val = math.evaluate(currentFunction, { x, y });
            if (!isNaN(f_val) && isFinite(f_val)) {
              let weight = 1;
              if ((i === 0 || i === numPoints) && (j === 0 || j === numPoints)) weight = 1; // esquinas
              else if (i === 0 || i === numPoints || j === 0 || j === numPoints) weight = 2; // bordes
              else weight = 4; // interior

              integralValue += weight * f_val;
            }
          } catch (e) {
            continue;
          }
        }
      }

      integralValue *= (dx * dy) / 4; // regla del trapecio 2D

      result += `Valor aproximado de la integral doble: ${integralValue.toFixed(6)}\n\n`;

      // Método 2: Antiderivadas simbólicas
      try {
        const integralX = math.integral(currentFunction, 'x');
        const integralY = math.integral(currentFunction, 'y');

        result += "Antiderivadas simbólicas:\n";
        result += `∫ f(x,y) dx = ${integralX} + C(y)\n`;
        result += `∫ f(x,y) dy = ${integralY} + C(x)\n\n`;
      } catch (e) {
        result += "No se pudieron calcular antiderivadas simbólicas\n\n";
      }

      // Método 3: Para integrales triples (conceptual)
      result += "Para integrales triples ∭ f(x,y,z) dx dy dz:\n";
      result += "1. Integrar respecto a z primero (manteniendo x,y constantes)\n";
      result += "2. Integrar el resultado respecto a y (manteniendo x constante)\n";
      result += "3. Integrar el resultado final respecto a x\n\n";

      // Aplicaciones prácticas
      result += "Aplicaciones del valor calculado:\n";
      if (currentFunction.includes('1') && !currentFunction.includes('x') && !currentFunction.includes('y')) {
        result += "• Área de la región de integración: " + ((xMax - xMin) * (yMax - yMin)).toFixed(4) + "\n";
      } else {
        result += "• Volumen bajo la superficie: " + integralValue.toFixed(4) + "\n";
      }

      result += "• Centro de masa (si f es densidad): requiere cálculo adicional\n";
      result += "• Momento de inercia: requiere cálculo adicional\n\n";

      result += "Nota: Para mayor precisión, considere métodos numéricos\n";
      result += "más avanzados como Simpson o cuadratura Gaussiana.\n";

      setCalculationResult(result);
      setCalculationType('integral');
    } catch (error) {
      setCalculationResult('Error al calcular las integrales: ' + error.message);
    }
  };

  const calculateLimits = () => {
    try {
      let result = "Cálculo de límites de funciones de dos variables:\n\n";

      // Solicitar punto límite al usuario
      const limitPoint = prompt("Ingrese el punto límite (x,y) separado por coma (ej: 0,0):", "0,0");
      if (!limitPoint) return;

      const [a, b] = limitPoint.split(',').map(val => parseFloat(val.trim()));
      if (isNaN(a) || isNaN(b)) {
        setCalculationResult('Error: Punto límite inválido. Use formato "x,y"');
        setCalculationType('limits');
        return;
      }

      result += `Calculando límite de f(x,y) = ${currentFunction} cuando (x,y) → (${a}, ${b})\n\n`;

      // Método 1: Evaluación directa
      try {
        const directValue = math.evaluate(currentFunction, { x: a, y: b });
        result += `1. Evaluación directa en (${a}, ${b}): ${directValue.toFixed(6)}\n`;
      } catch (e) {
        result += `1. Evaluación directa: No definida en el punto (${a}, ${b})\n`;
      }

      // Método 2: Límites iterados
      result += "\n2. Límites iterados:\n";

      // lim x→a lim y→b f(x,y)
      try {
        let iter1 = "No definido";
        const epsilon = 0.01;
        const testPoints = [b - epsilon, b, b + epsilon];

        for (const y_val of testPoints) {
          try {
            const innerLimit = math.evaluate(currentFunction, { x: a, y: y_val });
            if (!isNaN(innerLimit) && isFinite(innerLimit)) {
              iter1 = innerLimit.toFixed(6);
              break;
            }
          } catch (e) {
            continue;
          }
        }
        result += `   lim x→${a} lim y→${b} f(x,y) = ${iter1}\n`;
      } catch (e) {
        result += `   lim x→${a} lim y→${b} f(x,y) = No definido\n`;
      }

      // lim y→b lim x→a f(x,y)
      try {
        let iter2 = "No definido";
        const epsilon = 0.01;
        const testPoints = [a - epsilon, a, a + epsilon];

        for (const x_val of testPoints) {
          try {
            const innerLimit = math.evaluate(currentFunction, { x: x_val, y: b });
            if (!isNaN(innerLimit) && isFinite(innerLimit)) {
              iter2 = innerLimit.toFixed(6);
              break;
            }
          } catch (e) {
            continue;
          }
        }
        result += `   lim y→${b} lim x→${a} f(x,y) = ${iter2}\n`;
      } catch (e) {
        result += `   lim y→${b} lim x→${a} f(x,y) = No definido\n`;
      }

      // Método 3: Límites a lo largo de rectas
      result += "\n3. Límites a lo largo de rectas:\n";

      // y = x (diagonal)
      try {
        const diagonalValue = math.evaluate(currentFunction, { x: a, y: a });
        result += `   A lo largo de y = x: ${diagonalValue.toFixed(6)}\n`;
      } catch (e) {
        result += `   A lo largo de y = x: No definido\n`;
      }

      // y = mx + c (recta arbitraria)
      try {
        const m = 1; // pendiente
        const c = b - m * a; // intersección
        const lineValue = math.evaluate(currentFunction, { x: a, y: m * a + c });
        result += `   A lo largo de y = x + ${c.toFixed(2)}: ${lineValue.toFixed(6)}\n`;
      } catch (e) {
        result += `   A lo largo de y = x + ${(b - a).toFixed(2)}: No definido\n`;
      }

      // Método 4: Aproximación numérica
      result += "\n4. Aproximación numérica:\n";
      const deltas = [0.1, 0.01, 0.001];
      let numericalLimit = null;
      let converged = false;

      for (const delta of deltas) {
        const points = [
          [a + delta, b + delta],
          [a + delta, b - delta],
          [a - delta, b + delta],
          [a - delta, b - delta],
          [a + delta, b],
          [a - delta, b],
          [a, b + delta],
          [a, b - delta]
        ];

        let values = [];
        for (const [x, y] of points) {
          try {
            const val = math.evaluate(currentFunction, { x, y });
            if (!isNaN(val) && isFinite(val)) {
              values.push(val);
            }
          } catch (e) {
            continue;
          }
        }

        if (values.length >= 4) {
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;

          if (variance < 0.01) { // baja varianza indica convergencia
            numericalLimit = avg;
            converged = true;
            result += `   Para δ = ${delta}: ${avg.toFixed(6)} (convergente)\n`;
            break;
          } else {
            result += `   Para δ = ${delta}: ${avg.toFixed(6)} (no convergente)\n`;
          }
        }
      }

      if (!converged) {
        result += "   No se pudo determinar un límite numérico convergente\n";
      }

      result += "\nNota: Para confirmar que existe el límite, todos los métodos\n";
      result += "deben converger al mismo valor. Si los valores difieren,\n";
      result += "el límite no existe o requiere análisis adicional.\n";

      setCalculationResult(result);
      setCalculationType('limits');
    } catch (error) {
      setCalculationResult('Error al calcular límites: ' + error.message);
    }
  };

  const calculateLagrangeOptimization = () => {
    try {
      let result = "Optimización con Multiplicadores de Lagrange:\n\n";

      // Solicitar función objetivo y restricción
      const objectiveInput = prompt("Ingrese la función objetivo f(x,y):", currentFunction);
      if (!objectiveInput) return;

      const constraintInput = prompt("Ingrese la restricción g(x,y) = k (solo g(x,y), sin =k):", "x^2 + y^2");
      if (!constraintInput) return;

      const constraintValue = parseFloat(prompt("Ingrese el valor de la restricción k:", "1"));
      if (isNaN(constraintValue)) {
        setCalculationResult('Error: Valor de restricción inválido');
        setCalculationType('lagrange');
        return;
      }

      result += `Función objetivo: f(x,y) = ${objectiveInput}\n`;
      result += `Restricción: g(x,y) = ${constraintInput} = ${constraintValue}\n\n`;

      // Calcular gradientes
      const gradF_x = math.derivative(objectiveInput, 'x');
      const gradF_y = math.derivative(objectiveInput, 'y');
      const gradG_x = math.derivative(constraintInput, 'x');
      const gradG_y = math.derivative(constraintInput, 'y');

      result += "Sistema de ecuaciones de Lagrange:\n";
      result += `∇f = λ∇g\n\n`;
      result += `∂f/∂x = λ ∂g/∂x\n`;
      result += `∂f/∂y = λ ∂g/∂y\n`;
      result += `g(x,y) = ${constraintValue}\n\n`;

      result += "Ecuaciones específicas:\n";
      result += `${gradF_x} = λ (${gradG_x})\n`;
      result += `${gradF_y} = λ (${gradG_y})\n`;
      result += `${constraintInput} = ${constraintValue}\n\n`;

      // Método numérico para encontrar puntos críticos
      result += "Búsqueda numérica de puntos críticos:\n";

      const gridSize = 30;
      const range = 3;
      let candidates = [];

      for (let i = 0; i <= gridSize; i++) {
        for (let j = 0; j <= gridSize; j++) {
          const x = -range + (i * 2 * range) / gridSize;
          const y = -range + (j * 2 * range) / gridSize;

          try {
            // Verificar si satisface la restricción
            const g_val = math.evaluate(constraintInput, { x, y });
            if (Math.abs(g_val - constraintValue) < 0.05) { // cerca de la restricción
              const f_val = math.evaluate(objectiveInput, { x, y });
              candidates.push({ x, y, f: f_val });
            }
          } catch (e) {
            continue;
          }
        }
      }

      // Encontrar máximo y mínimo en la restricción
      if (candidates.length > 0) {
        candidates.sort((a, b) => a.f - b.f);
        const min = candidates[0];
        const max = candidates[candidates.length - 1];

        result += `Punto candidato a mínimo: (${min.x.toFixed(3)}, ${min.y.toFixed(3)}) con f = ${min.f.toFixed(4)}\n`;
        result += `Punto candidato a máximo: (${max.x.toFixed(3)}, ${max.y.toFixed(3)}) con f = ${max.f.toFixed(4)}\n\n`;

        // Verificar segunda derivada (condición de segundo orden)
        result += "Verificación de la condición de segundo orden:\n";
        result += "Para confirmar si son máximos/mínimos, se requiere\n";
        result += "evaluar la matriz Hessiana en estos puntos.\n\n";

        // Calcular derivadas segundas
        const f_xx = math.derivative(gradF_x.toString(), 'x');
        const f_yy = math.derivative(gradF_y.toString(), 'y');
        const f_xy = math.derivative(gradF_x.toString(), 'y');

        result += "Matriz Hessiana de f:\n";
        result += `[${f_xx}    ${f_xy}]\n`;
        result += `[${f_xy}    ${f_yy}]\n\n`;

        result += "Nota: Para una verificación completa, evalúe los\n";
        result += "autovalores de la Hessiana restringida en cada punto.\n";
      } else {
        result += "No se encontraron puntos candidatos en la restricción\n";
        result += "dentro del rango de búsqueda numérica.\n";
      }

      result += "\nInterpretación geométrica:\n";
      result += "Los multiplicadores de Lagrange λ representan la\n";
      result += "sensibilidad de la función objetivo respecto a\n";
      result += "cambios en la restricción.\n";

      setCalculationResult(result);
      setCalculationType('lagrange');
    } catch (error) {
      setCalculationResult('Error en optimización de Lagrange: ' + error.message);
    }
  };

  const calculateCentroidAndInertia = () => {
    try {
      let result = "Cálculo de centros de masa y momentos de inercia:\n\n";

      // Solicitar límites de integración
      const xMin = parseFloat(prompt("Límite inferior para x:", "-1"));
      const xMax = parseFloat(prompt("Límite superior para x:", "1"));
      const yMin = parseFloat(prompt("Límite inferior para y:", "-1"));
      const yMax = parseFloat(prompt("Límite superior para y:", "1"));

      if (isNaN(xMin) || isNaN(xMax) || isNaN(yMin) || isNaN(yMax)) {
        setCalculationResult('Error: Límites de integración inválidos');
        setCalculationType('centroid');
        return;
      }

      result += `Calculando propiedades sobre [${xMin}, ${xMax}] × [${yMin}, ${yMax}]\n\n`;
      result += `Función de densidad: ρ(x,y) = ${currentFunction}\n\n`;

      // Calcular masa total (integral doble de ρ)
      const numPoints = 20;
      let totalMass = 0;
      let momentX = 0;
      let momentY = 0;
      let momentXX = 0;
      let momentYY = 0;
      let momentXY = 0;

      const dx = (xMax - xMin) / numPoints;
      const dy = (yMax - yMin) / numPoints;

      for (let i = 0; i <= numPoints; i++) {
        for (let j = 0; j <= numPoints; j++) {
          const x = xMin + i * dx;
          const y = yMin + j * dy;

          try {
            const rho = math.evaluate(currentFunction, { x, y });
            if (!isNaN(rho) && isFinite(rho) && rho >= 0) {
              let weight = 1;
              if ((i === 0 || i === numPoints) && (j === 0 || j === numPoints)) weight = 1;
              else if (i === 0 || i === numPoints || j === 0 || j === numPoints) weight = 2;
              else weight = 4;

              const dA = dx * dy * weight / 4;
              const massElement = rho * dA;

              totalMass += massElement;
              momentX += x * massElement;
              momentY += y * massElement;
              momentXX += x * x * massElement;
              momentYY += y * y * massElement;
              momentXY += x * y * massElement;
            }
          } catch (e) {
            continue;
          }
        }
      }

      if (totalMass > 0) {
        // Centro de masa
        const centroidX = momentX / totalMass;
        const centroidY = momentY / totalMass;

        result += `Masa total: ${totalMass.toFixed(6)}\n\n`;
        result += `Centro de masa: (${centroidX.toFixed(4)}, ${centroidY.toFixed(4)})\n\n`;

        // Momentos de inercia
        result += "Momentos de inercia (respecto al origen):\n";
        result += `I_xx = ${momentXX.toFixed(6)}\n`;
        result += `I_yy = ${momentYY.toFixed(6)}\n`;
        result += `I_xy = ${momentXY.toFixed(6)}\n\n`;

        // Momentos de inercia respecto al centro de masa
        const Ixx_cm = momentXX - totalMass * centroidX * centroidX;
        const Iyy_cm = momentYY - totalMass * centroidY * centroidY;
        const Ixy_cm = momentXY - totalMass * centroidX * centroidY;

        result += "Momentos de inercia (respecto al centro de masa):\n";
        result += `I_xx' = ${Ixx_cm.toFixed(6)}\n`;
        result += `I_yy' = ${Iyy_cm.toFixed(6)}\n`;
        result += `I_xy' = ${Ixy_cm.toFixed(6)}\n\n`;

        // Radio de giro
        const radiusOfGyration = Math.sqrt((Ixx_cm + Iyy_cm) / totalMass);
        result += `Radio de giro: ${radiusOfGyration.toFixed(6)}\n\n`;

        // Aplicaciones
        result += "Aplicaciones:\n";
        result += "• Centro de masa: equilibrio del sistema\n";
        result += "• Momentos de inercia: resistencia a la rotación\n";
        result += "• Radio de giro: distribución de masa\n\n";

        result += "Nota: Para densidad constante ρ = 1, el centro de masa\n";
        result += "coincide con el centroide geométrico de la región.\n";
      } else {
        result += "No se pudo calcular masa total (posiblemente densidad negativa)\n";
        result += "o región sin área en el dominio de integración.\n";
      }

      setCalculationResult(result);
      setCalculationType('centroid');
    } catch (error) {
      setCalculationResult('Error en cálculo de centroides: ' + error.message);
    }
  };

  const calculateJacobian = () => {
    try {
      let result = "Cálculo del Jacobiano y cambio de variable:\n\n";

      // Solicitar las funciones de transformación
      const x_transform = prompt("Ingrese x(u,v):", "u*cos(v)");
      const y_transform = prompt("Ingrese y(u,v):", "u*sin(v)");

      if (!x_transform || !y_transform) return;

      result += `Transformación de coordenadas:\n`;
      result += `x = ${x_transform}\n`;
      result += `y = ${y_transform}\n\n`;

      // Calcular derivadas parciales
      const dx_du = math.derivative(x_transform, 'u');
      const dx_dv = math.derivative(x_transform, 'v');
      const dy_du = math.derivative(y_transform, 'u');
      const dy_dv = math.derivative(y_transform, 'v');

      result += `Derivadas parciales:\n`;
      result += `∂x/∂u = ${dx_du}\n`;
      result += `∂x/∂v = ${dx_dv}\n`;
      result += `∂y/∂u = ${dy_du}\n`;
      result += `∂y/∂v = ${dy_dv}\n\n`;

      // Matriz Jacobiana
      result += `Matriz Jacobiana J:\n`;
      result += `| ∂x/∂u  ∂x/∂v |\n`;
      result += `| ∂y/∂u  ∂y/∂v |\n\n`;
      result += `J = | ${dx_du}  ${dx_dv} |\n`;
      result += `    | ${dy_du}  ${dy_dv} |\n\n`;

      // Determinante del Jacobiano
      const jacobian_det = math.evaluate(`${dx_du} * ${dy_dv} - ${dx_dv} * ${dy_du}`);
      result += `Determinante del Jacobiano: det(J) = ${jacobian_det}\n\n`;

      // Evaluar en algunos puntos
      const testPoints = [
        [1, 0], [1, Math.PI/4], [1, Math.PI/2], [2, 0], [2, Math.PI/4]
      ];

      result += `Evaluación del Jacobiano en puntos de prueba:\n`;
      testPoints.forEach(([u, v]) => {
        try {
          const det_val = math.evaluate(jacobian_det.toString(), { u, v });
          const x_val = math.evaluate(x_transform, { u, v });
          const y_val = math.evaluate(y_transform, { u, v });
          result += `(u,v)=(${u.toFixed(2)}, ${v.toFixed(2)}) → (x,y)=(${x_val.toFixed(2)}, ${y_val.toFixed(2)}) → det(J)=${det_val.toFixed(4)}\n`;
        } catch (e) {
          result += `(u,v)=(${u.toFixed(2)}, ${v.toFixed(2)}) → Error de evaluación\n`;
        }
      });

      result += `\nCambio de variable en integrales dobles:\n`;
      result += `∬ f(x,y) dx dy = ∬ f(x(u,v), y(u,v)) |det(J)| du dv\n\n`;

      result += `Interpretación geométrica:\n`;
      result += `• |det(J)| representa el factor de escala local\n`;
      result += `• Si |det(J)| > 1: la transformación expande el área\n`;
      result += `• Si |det(J)| < 1: la transformación contrae el área\n`;
      result += `• Si det(J) = 0: transformación singular (no invertible)\n\n`;

      // Aplicación a la función actual
      result += `Aplicando a f(x,y) = ${currentFunction}:\n`;
      result += `∬ ${currentFunction} dx dy = ∬ ${currentFunction.replace(/x/g, `(${x_transform})`).replace(/y/g, `(${y_transform})`)} |${jacobian_det}| du dv\n`;

      setCalculationResult(result);
      setCalculationType('jacobian');
    } catch (error) {
      setCalculationResult('Error en cálculo del Jacobiano: ' + error.message);
    }
  };

  const calculateTaylorSeries = () => {
    try {
      let result = "Serie de Taylor para funciones de dos variables:\n\n";

      // Solicitar punto de expansión
      const a = parseFloat(prompt("Ingrese el punto a (para x):", "0"));
      const b = parseFloat(prompt("Ingrese el punto b (para y):", "0"));
      const order = parseInt(prompt("Ingrese el orden de la serie (1-3):", "2"));

      if (isNaN(a) || isNaN(b) || isNaN(order) || order < 1 || order > 3) {
        setCalculationResult('Error: Parámetros inválidos para la serie de Taylor');
        setCalculationType('taylor');
        return;
      }

      result += `Desarrollando f(x,y) = ${currentFunction} alrededor del punto (${a}, ${b})\n\n`;
      result += `Orden de aproximación: ${order}\n\n`;

      // Calcular derivadas parciales hasta el orden requerido
      const derivatives = {};
      for (let i = 0; i <= order; i++) {
        for (let j = 0; j <= order - i; j++) {
          if (i + j > 0 && i + j <= order) {
            let deriv = currentFunction;
            for (let k = 0; k < i; k++) deriv = math.derivative(deriv.toString(), 'x');
            for (let k = 0; k < j; k++) deriv = math.derivative(deriv.toString(), 'y');
            derivatives[`${i}${j}`] = deriv;
          }
        }
      }

      // Evaluar derivadas en el punto (a,b)
      const evaluatedDerivs = {};
      for (const key in derivatives) {
        try {
          evaluatedDerivs[key] = math.evaluate(derivatives[key].toString(), { x: a, y: b });
        } catch (e) {
          evaluatedDerivs[key] = 0;
        }
      }

      // Construir la serie de Taylor
      result += "Serie de Taylor:\n";
      result += `f(x,y) ≈ f(${a},${b}) + `;

      let terms = [];
      if (evaluatedDerivs['10'] !== undefined) {
        terms.push(`${evaluatedDerivs['10'].toFixed(4)}(x-${a})`);
      }
      if (evaluatedDerivs['01'] !== undefined) {
        terms.push(`${evaluatedDerivs['01'].toFixed(4)}(y-${b})`);
      }
      if (order >= 2) {
        if (evaluatedDerivs['20'] !== undefined) {
          terms.push(`${(evaluatedDerivs['20']/2).toFixed(4)}(x-${a})²`);
        }
        if (evaluatedDerivs['11'] !== undefined) {
          terms.push(`${evaluatedDerivs['11'].toFixed(4)}(x-${a})(y-${b})`);
        }
        if (evaluatedDerivs['02'] !== undefined) {
          terms.push(`${(evaluatedDerivs['02']/2).toFixed(4)}(y-${b})²`);
        }
      }
      if (order >= 3 && evaluatedDerivs['30'] !== undefined) {
        terms.push(`${(evaluatedDerivs['30']/6).toFixed(4)}(x-${a})³`);
      }

      result += terms.join(' + ') + " + ...\n\n";

      // Evaluar función original y aproximación en algunos puntos
      result += "Comparación en puntos de prueba:\n";
      const testPoints = [
        [a + 0.1, b + 0.1],
        [a + 0.2, b - 0.1],
        [a - 0.1, b + 0.2]
      ];

      testPoints.forEach(([x, y]) => {
        try {
          const original = math.evaluate(currentFunction, { x, y });

          // Calcular aproximación
          let approximation = evaluatedDerivs['00'] || 0;
          const dx = x - a;
          const dy = y - b;

          if (evaluatedDerivs['10'] !== undefined) approximation += evaluatedDerivs['10'] * dx;
          if (evaluatedDerivs['01'] !== undefined) approximation += evaluatedDerivs['01'] * dy;
          if (order >= 2) {
            if (evaluatedDerivs['20'] !== undefined) approximation += (evaluatedDerivs['20'] / 2) * dx * dx;
            if (evaluatedDerivs['11'] !== undefined) approximation += evaluatedDerivs['11'] * dx * dy;
            if (evaluatedDerivs['02'] !== undefined) approximation += (evaluatedDerivs['02'] / 2) * dy * dy;
          }

          const error = Math.abs(original - approximation);
          result += `(${x.toFixed(1)}, ${y.toFixed(1)}): Original=${original.toFixed(4)}, Aprox=${approximation.toFixed(4)}, Error=${error.toFixed(6)}\n`;
        } catch (e) {
          result += `(${x.toFixed(1)}, ${y.toFixed(1)}): Error de evaluación\n`;
        }
      });

      result += "\nFórmula general de Taylor de orden n:\n";
      result += "f(x,y) = Σ Σ (1/(i!j!)) * ∂^(i+j)f/∂x^i∂y^j |(a,b) * (x-a)^i * (y-b)^j\n\n";

      result += "Aplicaciones:\n";
      result += "• Aproximación local de funciones complicadas\n";
      result += "• Análisis de comportamiento cerca de puntos críticos\n";
      result += "• Optimización numérica y métodos iterativos\n";

      setCalculationResult(result);
      setCalculationType('taylor');
    } catch (error) {
      setCalculationResult('Error en serie de Taylor: ' + error.message);
    }
  };

  const calculateCriticalPoints = () => {
    try {
      // Calcular puntos críticos resolviendo ∇f = 0
      const derivativeX = math.derivative(currentFunction, 'x');
      const derivativeY = math.derivative(currentFunction, 'y');

      let result = "Análisis de puntos críticos:\n\n";
      result += "Los puntos críticos se encuentran resolviendo ∇f = 0:\n\n";
      result += `∂f/∂x = ${derivativeX} = 0\n`;
      result += `∂f/∂y = ${derivativeY} = 0\n\n`;

      result += "Método numérico mejorado para encontrar puntos críticos:\n";

      // Método de Newton-Raphson para sistemas 2D
      const newtonRaphson2D = (x0, y0, maxIter = 50, tol = 1e-6) => {
        let x = x0, y = y0;

        for (let iter = 0; iter < maxIter; iter++) {
          try {
            // Evaluar funciones y derivadas
            const fx = math.evaluate(derivativeX.toString(), { x, y });
            const fy = math.evaluate(derivativeY.toString(), { x, y });

            // Matriz Jacobiana del sistema ∇f
            const fxx = math.evaluate(math.derivative(derivativeX.toString(), 'x').toString(), { x, y });
            const fxy = math.evaluate(math.derivative(derivativeX.toString(), 'y').toString(), { x, y });
            const fyx = math.evaluate(math.derivative(derivativeY.toString(), 'x').toString(), { x, y });
            const fyy = math.evaluate(math.derivative(derivativeY.toString(), 'y').toString(), { x, y });

            // Determinante de la matriz Jacobiana
            const det = fxx * fyy - fxy * fyx;

            if (Math.abs(det) < 1e-10) {
              return null; // Singular, no se puede invertir
            }

            // Resolver sistema lineal: J * delta = -F
            const dx = (-fyy * fx + fxy * fy) / det;
            const dy = (fyx * fx - fxx * fy) / det;

            x += dx;
            y += dy;

            // Verificar convergencia
            if (Math.sqrt(dx*dx + dy*dy) < tol) {
              return [x, y];
            }
          } catch (e) {
            return null;
          }
        }
        return null; // No convergió
      };

      // Múltiples puntos iniciales para encontrar diferentes puntos críticos
      const initialPoints = [
        [0, 0], [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [-1, -1], [2, 2], [-2, -2],
        [0.5, 0.5], [-0.5, -0.5]
      ];

      let criticalPoints = [];
      let processedPoints = new Set();

      initialPoints.forEach(([x0, y0]) => {
        const solution = newtonRaphson2D(x0, y0);
        if (solution) {
          const [x, y] = solution;
          const key = `${x.toFixed(4)},${y.toFixed(4)}`;

          if (!processedPoints.has(key)) {
            processedPoints.add(key);
            criticalPoints.push([x, y]);
          }
        }
      });

      // Método de grilla como respaldo
      if (criticalPoints.length === 0) {
        result += "Usando método de búsqueda en grilla:\n";
        const gridSize = 30;
        const range = 4;

        for (let i = 0; i <= gridSize; i++) {
          for (let j = 0; j <= gridSize; j++) {
            const x = -range + (i * 2 * range) / gridSize;
            const y = -range + (j * 2 * range) / gridSize;

            try {
              const dx = math.evaluate(derivativeX.toString(), { x, y });
              const dy = math.evaluate(derivativeY.toString(), { x, y });

              if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
                const key = `${x.toFixed(4)},${y.toFixed(4)}`;
                if (!processedPoints.has(key)) {
                  processedPoints.add(key);
                  criticalPoints.push([x, y]);
                }
              }
            } catch (e) {
              continue;
            }
          }
        }
      }

      if (criticalPoints.length > 0) {
        result += `Se encontraron ${criticalPoints.length} puntos críticos:\n\n`;

        criticalPoints.slice(0, 8).forEach(([x, y], index) => {
          result += `Punto crítico ${index + 1}: (${x.toFixed(6)}, ${y.toFixed(6)})\n`;

          // Clasificar el punto crítico usando la matriz Hessiana
          try {
            const f_xx = math.evaluate(math.derivative(derivativeX.toString(), 'x').toString(), { x, y });
            const f_yy = math.evaluate(math.derivative(derivativeY.toString(), 'y').toString(), { x, y });
            const f_xy = math.evaluate(math.derivative(derivativeX.toString(), 'y').toString(), { x, y });

            const detH = f_xx * f_yy - f_xy * f_xy;
            const traceH = f_xx + f_yy;

            if (detH > 0 && traceH > 0) {
              result += `  → Punto de silla (máximo local)\n`;
            } else if (detH > 0 && traceH < 0) {
              result += `  → Mínimo local\n`;
            } else if (detH < 0) {
              result += `  → Punto de silla\n`;
            } else {
              result += `  → Clasificación indeterminada\n`;
            }
          } catch (e) {
            result += `  → No se pudo clasificar\n`;
          }
        });

        if (criticalPoints.length > 8) {
          result += `... y ${criticalPoints.length - 8} puntos más\n`;
        }
      } else {
        result += "No se encontraron puntos críticos en la región analizada\n";
        result += "La función puede no tener puntos críticos o estar fuera del rango de búsqueda.\n";
      }

      result += "\nNota: La clasificación se basa en el criterio de la segunda derivada.\n";
      result += "Para funciones más complejas, puede requerirse análisis adicional.\n";

      setCalculationResult(result);
      setCalculationType('critical');
    } catch (error) {
      setCalculationResult('Error al analizar puntos críticos: ' + error.message);
    }
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
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px',
        gap: '10px'
      }}>
        {/* Barra lateral para controles de vista */}
        <div style={{
          position: 'fixed',
          left: '10px',
          top: '315px',
          width: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '15px',
          gap: '10px'
        }}>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#000000',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '10px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
            onClick={() => setIs2DView(!is2DView)}
            title={is2DView ? "Cambiar a 3D" : "Cambiar a 2D"}
          >
            {is2DView ? "3D" : "2D"}
          </button>
        </div>
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
            background: (activeMenu === 'calculate' || activeMenu === 'domain' || activeMenu === 'range' || activeMenu === 'derivative' || activeMenu === 'integral') ? '#ffffff' : 'transparent',
            border: 'none',
            color: (activeMenu === 'calculate' || activeMenu === 'domain' || activeMenu === 'range' || activeMenu === 'derivative' || activeMenu === 'integral') ? '#000000' : '#ffffff',
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
            background: activeMenu === 'params' ? '#ffffff' : 'transparent',
            border: 'none',
            color: activeMenu === 'params' ? '#000000' : '#ffffff',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('params')}
          title="Parámetros"
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`
          }}
        />

        <button
          style={{
            background: activeMenu === 'info' ? '#ffffff' : 'transparent',
            border: 'none',
            color: activeMenu === 'info' ? '#000000' : '#ffffff',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('info')}
          title="Info"
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-question-mark-icon lucide-circle-question-mark"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`
          }}
        />

      </div>

      {/* Panel lateral rojo para contenido de menú - Solo aparece cuando hay menú activo */}
      {activeMenu !== null && (
        <div style={{
          position: 'fixed',
          left: '90px',
          top: '82px',
          width: '300px',
          backgroundColor: 'rgba(220, 20, 60, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          zIndex: 9,
          padding: '20px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 102px)'
        }}>
        {activeMenu === 'function' && activeMenu !== null && (
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

        {activeMenu === 'calculate' && activeMenu !== null && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Resolver
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
              <p>Selecciona el tipo de cálculo:</p>
              <button
                onClick={() => {
                  calculateDomain();
                  setActiveMenu('domain');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: activeMenu === 'domain' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: activeMenu === 'domain' ? '#dc143c' : '#ffffff',
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
                  calculateRange();
                  setActiveMenu('range');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: activeMenu === 'range' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: activeMenu === 'range' ? '#dc143c' : '#ffffff',
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
                  calculateDerivative();
                  setActiveMenu('derivative');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: activeMenu === 'derivative' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: activeMenu === 'derivative' ? '#dc143c' : '#ffffff',
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
                  calculateIntegral();
                  setActiveMenu('integral');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: activeMenu === 'integral' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: activeMenu === 'integral' ? '#dc143c' : '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                Calcular Integrales
              </button>
              <button
                onClick={() => {
                  calculateLimits();
                  setActiveMenu('limits');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: activeMenu === 'limits' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: activeMenu === 'limits' ? '#dc143c' : '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                Calcular Límites
              </button>
              <button
                onClick={() => {
                  calculateCriticalPoints();
                  setActiveMenu('critical');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: activeMenu === 'critical' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: activeMenu === 'critical' ? '#dc143c' : '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                Puntos Críticos
              </button>
              <button
                onClick={() => {
                  calculateLagrangeOptimization();
                  setActiveMenu('lagrange');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: activeMenu === 'lagrange' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: activeMenu === 'lagrange' ? '#dc143c' : '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                Optimización Lagrange
              </button>
              <button
                onClick={() => {
                  calculateCentroidAndInertia();
                  setActiveMenu('centroid');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: activeMenu === 'centroid' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: activeMenu === 'centroid' ? '#dc143c' : '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                Centro de Masa
              </button>
              <button
                onClick={() => {
                  calculateJacobian();
                  setActiveMenu('jacobian');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: activeMenu === 'jacobian' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: activeMenu === 'jacobian' ? '#dc143c' : '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                Jacobiano
              </button>
              <button
                onClick={() => {
                  calculateTaylorSeries();
                  setActiveMenu('taylor');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: activeMenu === 'taylor' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: activeMenu === 'taylor' ? '#dc143c' : '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                Serie de Taylor
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'domain' && activeMenu !== null && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Dominio
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
              <p style={{ marginBottom: '15px' }}>
                <strong>¿Qué es el dominio?</strong> Es el conjunto de valores de entrada (x,y) para los que la función está definida.
              </p>
              <p>El dominio de la función <strong>{currentFunction}</strong> es:</p>
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
                <br /><br />
                <em style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Para funciones con raíces cuadradas, logaritmos, etc., el dominio puede estar restringido.
                </em>
              </div>
              <button
                onClick={() => setActiveMenu('calculate')}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '20px',
                  backgroundColor: '#ffffff',
                  color: '#dc143c',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-bold)'
                }}
              >
                ← Atrás
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'range' && activeMenu !== null && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Rango
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
              <p style={{ marginBottom: '15px' }}>
                <strong>¿Qué es el rango?</strong> Es el conjunto de valores de salida (z) que la función puede tomar.
              </p>
              <p>El rango de la función <strong>{currentFunction}</strong> se calcula evaluando su comportamiento:</p>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '10px',
                fontFamily: 'var(--font-text)',
                fontWeight: 'var(--font-weight-light)'
              }}>
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>Rango aproximado:</strong><br />
                Se determina analizando los valores mínimo y máximo que puede alcanzar la función.
                <br /><br />
                <em style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  El rango exacto depende del comportamiento específico de cada función.
                </em>
              </div>
              <button
                onClick={() => setActiveMenu('calculate')}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '20px',
                  backgroundColor: '#ffffff',
                  color: '#dc143c',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-bold)'
                }}
              >
                ← Atrás
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'derivative' && activeMenu !== null && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Derivadas
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
              <p style={{ marginBottom: '15px' }}>
                <strong>¿Qué son las derivadas parciales?</strong> Miden cómo cambia la función cuando variamos una variable manteniendo las otras constantes.
              </p>
              <p>Derivadas parciales de <strong>{currentFunction}</strong>:</p>
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
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>∇f:</strong> Gradiente (vector de derivadas parciales)
                <br /><br />
                <em style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Las derivadas indican la pendiente de la función en cada dirección.
                </em>
              </div>
              <button
                onClick={() => setActiveMenu('calculate')}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '20px',
                  backgroundColor: '#ffffff',
                  color: '#dc143c',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-bold)'
                }}
              >
                ← Atrás
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'integral' && activeMenu !== null && (
           <div>
             <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
               Integrales
             </h3>
             <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
               <p style={{ marginBottom: '15px' }}>
                 <strong>¿Qué son las integrales múltiples?</strong> Calculan áreas, volúmenes y otras magnitudes acumuladas en el plano o espacio.
               </p>
               <p>Integrales de <strong>{currentFunction}</strong>:</p>
               <div style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 padding: '15px',
                 borderRadius: '4px',
                 marginTop: '10px',
                 fontFamily: 'var(--font-text)',
                 fontWeight: 'var(--font-weight-light)'
               }}>
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>∫∫ f(x,y) dx dy:</strong> Integral doble (área bajo la superficie)<br />
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>∫ f(x,y) dl:</strong> Integral de línea (a lo largo de curvas)<br />
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>∭ f(x,y,z) dx dy dz:</strong> Integral triple (volúmenes)
                 <br /><br />
                 <em style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                   Las integrales calculan magnitudes acumuladas como áreas y volúmenes.
                 </em>
               </div>
               <button
                 onClick={() => setActiveMenu('calculate')}
                 style={{
                   width: '100%',
                   padding: '10px',
                   marginTop: '20px',
                   backgroundColor: '#ffffff',
                   color: '#dc143c',
                   border: '1px solid #ffffff',
                   borderRadius: '4px',
                   cursor: 'pointer',
                   fontFamily: 'var(--font-text)',
                   fontWeight: 'var(--font-weight-bold)'
                 }}
               >
                 ← Atrás
               </button>
             </div>
           </div>
         )}

         {activeMenu === 'limits' && activeMenu !== null && (
           <div>
             <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
               Límites
             </h3>
             <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
               <p style={{ marginBottom: '15px' }}>
                 <strong>¿Qué son los límites de funciones de dos variables?</strong> Es el valor que toma la función cuando el punto (x,y) se acerca a un punto específico (a,b).
               </p>
               <p>Límite de <strong>{currentFunction}</strong> cuando (x,y) → (a,b):</p>
               <div style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 padding: '15px',
                 borderRadius: '4px',
                 marginTop: '10px',
                 fontFamily: 'var(--font-text)',
                 fontWeight: 'var(--font-weight-light)'
               }}>
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>lim (x,y)→(a,b) f(x,y)</strong><br />
                 Se calcula usando múltiples métodos para verificar convergencia.
                 <br /><br />
                 <em style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                   El límite existe si todos los métodos convergen al mismo valor.
                 </em>
               </div>
               <button
                 onClick={() => setActiveMenu('calculate')}
                 style={{
                   width: '100%',
                   padding: '10px',
                   marginTop: '20px',
                   backgroundColor: '#ffffff',
                   color: '#dc143c',
                   border: '1px solid #ffffff',
                   borderRadius: '4px',
                   cursor: 'pointer',
                   fontFamily: 'var(--font-text)',
                   fontWeight: 'var(--font-weight-bold)'
                 }}
               >
                 ← Atrás
               </button>
             </div>
           </div>
         )}

         {activeMenu === 'critical' && activeMenu !== null && (
           <div>
             <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
               Puntos Críticos
             </h3>
             <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
               <p style={{ marginBottom: '15px' }}>
                 <strong>¿Qué son los puntos críticos?</strong> Son puntos donde el gradiente es cero (∇f = 0), candidatos a máximos, mínimos o puntos de silla.
               </p>
               <p>Puntos críticos de <strong>{currentFunction}</strong>:</p>
               <div style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 padding: '15px',
                 borderRadius: '4px',
                 marginTop: '10px',
                 fontFamily: 'var(--font-text)',
                 fontWeight: 'var(--font-weight-light)'
               }}>
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>∇f = 0</strong><br />
                 ∂f/∂x = 0<br />
                 ∂f/∂y = 0
                 <br /><br />
                 <em style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                   Se requiere resolver el sistema no lineal para encontrar puntos exactos.
                 </em>
               </div>
               <button
                 onClick={() => setActiveMenu('calculate')}
                 style={{
                   width: '100%',
                   padding: '10px',
                   marginTop: '20px',
                   backgroundColor: '#ffffff',
                   color: '#dc143c',
                   border: '1px solid #ffffff',
                   borderRadius: '4px',
                   cursor: 'pointer',
                   fontFamily: 'var(--font-text)',
                   fontWeight: 'var(--font-weight-bold)'
                 }}
               >
                 ← Atrás
               </button>
             </div>
           </div>
         )}

         {activeMenu === 'lagrange' && activeMenu !== null && (
           <div>
             <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
               Optimización de Lagrange
             </h3>
             <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
               <p style={{ marginBottom: '15px' }}>
                 <strong>¿Qué es la optimización con restricciones?</strong> Encuentra extremos de una función sujeto a restricciones usando multiplicadores de Lagrange.
               </p>
               <p>Problema de optimización:</p>
               <div style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 padding: '15px',
                 borderRadius: '4px',
                 marginTop: '10px',
                 fontFamily: 'var(--font-text)',
                 fontWeight: 'var(--font-weight-light)'
               }}>
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>max/min f(x,y)</strong><br />
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>sujeto a g(x,y) = k</strong><br />
                 <br />
                 Sistema: ∇f = λ∇g
                 <br /><br />
                 <em style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                   λ representa la razón de cambio de f respecto a cambios en la restricción.
                 </em>
               </div>
               <button
                 onClick={() => setActiveMenu('calculate')}
                 style={{
                   width: '100%',
                   padding: '10px',
                   marginTop: '20px',
                   backgroundColor: '#ffffff',
                   color: '#dc143c',
                   border: '1px solid #ffffff',
                   borderRadius: '4px',
                   cursor: 'pointer',
                   fontFamily: 'var(--font-text)',
                   fontWeight: 'var(--font-weight-bold)'
                 }}
               >
                 ← Atrás
               </button>
             </div>
           </div>
         )}

         {activeMenu === 'centroid' && activeMenu !== null && (
           <div>
             <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
               Centro de Masa y Momentos de Inercia
             </h3>
             <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
               <p style={{ marginBottom: '15px' }}>
                 <strong>¿Qué son el centro de masa y momentos de inercia?</strong> Propiedades físicas que describen la distribución de masa en un sistema.
               </p>
               <p>Para una distribución de masa con densidad ρ(x,y):</p>
               <div style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 padding: '15px',
                 borderRadius: '4px',
                 marginTop: '10px',
                 fontFamily: 'var(--font-text)',
                 fontWeight: 'var(--font-weight-light)'
               }}>
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>Centro de masa:</strong><br />
                 x̄ = (∫x ρ dA) / M, ȳ = (∫y ρ dA) / M
                 <br /><br />
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>Momentos de inercia:</strong><br />
                 I_xx = ∫(y² ρ dA), I_yy = ∫(x² ρ dA), I_xy = ∫(xy ρ dA)
                 <br /><br />
                 <em style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                   ρ(x,y) es la función actual, representa densidad de masa.
                 </em>
               </div>
               <button
                 onClick={() => setActiveMenu('calculate')}
                 style={{
                   width: '100%',
                   padding: '10px',
                   marginTop: '20px',
                   backgroundColor: '#ffffff',
                   color: '#dc143c',
                   border: '1px solid #ffffff',
                   borderRadius: '4px',
                   cursor: 'pointer',
                   fontFamily: 'var(--font-text)',
                   fontWeight: 'var(--font-weight-bold)'
                 }}
               >
                 ← Atrás
               </button>
             </div>
           </div>
         )}

         {activeMenu === 'jacobian' && activeMenu !== null && (
           <div>
             <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
               Jacobiano y Cambio de Variable
             </h3>
             <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
               <p style={{ marginBottom: '15px' }}>
                 <strong>¿Qué es el Jacobiano?</strong> Matriz de derivadas parciales que describe cómo cambian las coordenadas en una transformación.
               </p>
               <p>Para transformación T(u,v) → (x,y):</p>
               <div style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 padding: '15px',
                 borderRadius: '4px',
                 marginTop: '10px',
                 fontFamily: 'var(--font-text)',
                 fontWeight: 'var(--font-weight-light)'
               }}>
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>Matriz Jacobiana:</strong><br />
                 J = | ∂x/∂u  ∂x/∂v |<br />
                 &nbsp;&nbsp;&nbsp;&nbsp;| ∂y/∂u  ∂y/∂v |
                 <br /><br />
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>Determinante:</strong><br />
                 det(J) = ∂x/∂u · ∂y/∂v - ∂x/∂v · ∂y/∂u
                 <br /><br />
                 <em style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                   |det(J)| es el factor de escala para integrales dobles.
                 </em>
               </div>
               <button
                 onClick={() => setActiveMenu('calculate')}
                 style={{
                   width: '100%',
                   padding: '10px',
                   marginTop: '20px',
                   backgroundColor: '#ffffff',
                   color: '#dc143c',
                   border: '1px solid #ffffff',
                   borderRadius: '4px',
                   cursor: 'pointer',
                   fontFamily: 'var(--font-text)',
                   fontWeight: 'var(--font-weight-bold)'
                 }}
               >
                 ← Atrás
               </button>
             </div>
           </div>
         )}

         {activeMenu === 'taylor' && activeMenu !== null && (
           <div>
             <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
               Serie de Taylor
             </h3>
             <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
               <p style={{ marginBottom: '15px' }}>
                 <strong>¿Qué es la serie de Taylor?</strong> Aproximación polinomial de una función alrededor de un punto específico.
               </p>
               <p>Para f(x,y) diferenciable:</p>
               <div style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 padding: '15px',
                 borderRadius: '4px',
                 marginTop: '10px',
                 fontFamily: 'var(--font-text)',
                 fontWeight: 'var(--font-weight-light)'
               }}>
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>Serie de Taylor de orden 2:</strong><br />
                 f(a+h,b+k) ≈ f(a,b) + h·f_x(a,b) + k·f_y(a,b)<br />
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ (1/2)h²f_xx + h k f_xy + (1/2)k²f_yy
                 <br /><br />
                 <em style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                   Donde todas las derivadas se evalúan en (a,b).
                 </em>
               </div>
               <button
                 onClick={() => setActiveMenu('calculate')}
                 style={{
                   width: '100%',
                   padding: '10px',
                   marginTop: '20px',
                   backgroundColor: '#ffffff',
                   color: '#dc143c',
                   border: '1px solid #ffffff',
                   borderRadius: '4px',
                   cursor: 'pointer',
                   fontFamily: 'var(--font-text)',
                   fontWeight: 'var(--font-weight-bold)'
                 }}
               >
                 ← Atrás
               </button>
             </div>
           </div>
         )}


        {activeMenu === 'params' && activeMenu !== null && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Parámetros de Visualización {is2DView ? '2D' : '3D'}
            </h3>
            <ParametrosVisualizacion
              onParamsChange={is2DView ? setVisualizationParams2D : setVisualizationParams3D}
              currentParams={is2DView ? visualizationParams2D : visualizationParams3D}
            />
          </div>
        )}

        {activeMenu === 'info' && activeMenu !== null && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Información
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
              <h4 style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: '10px' }}>NeoCalc - Cálculo Visual Multivariable</h4>
              <p style={{ marginBottom: '15px' }}>
                Una herramienta interactiva para visualizar y calcular conceptos de cálculo multivariable en tiempo real.
              </p>

              <h5 style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: '8px' }}>Funcionalidades:</h5>
              <ul style={{ marginBottom: '15px' }}>
                <li>• Visualización 3D interactiva de funciones</li>
                <li>• Gráficos 2D complementarios (contornos, mapas de calor)</li>
                <li>• Cálculo de derivadas parciales y gradientes</li>
                <li>• Análisis de dominio y rango</li>
                <li>• Búsqueda de puntos críticos</li>
                <li>• Integrales múltiples</li>
              </ul>

              <h5 style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: '8px' }}>Cómo usar:</h5>
              <ol>
                <li>Ingresa una función matemática en el menú "Función"</li>
                <li>Explora la visualización 3D rotando y haciendo zoom</li>
                <li>Usa los menús de cálculo para análisis matemático</li>
                <li>Cambia entre visualizaciones 2D y 3D según necesites</li>
              </ol>

              <p style={{ marginTop: '15px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Proyecto Final de Cálculo Multivariable - Universidad
              </p>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Header */}
      <header style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.8)',
        marginLeft: '4px'
      }}>
        <h1 style={{
          fontSize: '1.8rem',
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

      {/* Visualizador 3D/2D como fondo de toda la página */}
      <div style={{
        position: 'fixed',
        top: '72px',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
      }}>
        {is2DView ? (
          <Visualizador2D
            expression={currentFunction}
            visualizationType={visualization2DType}
            params={visualizationParams2D}
          />
        ) : (
          <Visualizador3D expression={currentFunction} />
        )}
      </div>
    </div>
  );
}

export default App;

