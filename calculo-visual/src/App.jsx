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
    colorScheme: 'default',
    visualization2DType: 'contour'
  });
  const [is2DView, setIs2DView] = useState(false);

  useEffect(() => {
    // Simular carga para asegurar que todo esté listo
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Event listener para la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && activeMenu !== null) {
        handleMenuClick(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeMenu]);


  // Función de validación robusta de funciones
  const validateFunction = (expression) => {
    try {
      // Lista de caracteres y patrones prohibidos
      const forbiddenPatterns = [
        /eval\s*\(/i,
        /alert\s*\(/i,
        /console\s*\./i,
        /window\s*\./i,
        /document\s*\./i,
        /process\s*\./i,
        /require\s*\(/i,
        /import\s+/i,
        /export\s+/i,
        /function\s+/i,
        /class\s+/i,
        /new\s+/i,
        /this\s*\./i,
        /prototype/i,
        /__proto__/i,
        /constructor/i,
        /setTimeout/i,
        /setInterval/i,
        /fetch/i,
        /XMLHttpRequest/i,
        /localStorage/i,
        /sessionStorage/i,
        /cookie/i,
        /script/i,
        /iframe/i,
        /object/i,
        /embed/i,
        /form/i,
        /input/i,
        /button/i,
        /select/i,
        /textarea/i,
        /javascript:/i,
        /vbscript:/i,
        /data:/i,
        /on\w+\s*=/i, // atributos de eventos
        /<[^>]*>/i, // etiquetas HTML
        /\$\{.*\}/i, // template literals
        /`.*`/i, // template literals
        /\\x[0-9a-fA-F]{2}/i, // caracteres hex
        /\\u[0-9a-fA-F]{4}/i, // caracteres unicode
      ];

      // Verificar caracteres prohibidos
      for (const pattern of forbiddenPatterns) {
        if (pattern.test(expression)) {
          throw new Error(`Caracteres o patrones no permitidos detectados: ${pattern}`);
        }
      }

      // Verificar que solo contenga caracteres matemáticos permitidos
      const allowedChars = /^[a-zA-Z0-9\s\+\-\*\/\^\(\)\.\,\!\=\<\>\&\|\%\?\:\[\]\{\}\'\"]*$/;
      if (!allowedChars.test(expression)) {
        throw new Error('La función contiene caracteres no permitidos');
      }

      // Verificar sintaxis usando math.js (sin evaluar)
      try {
        math.parse(expression);
      } catch (parseError) {
        throw new Error(`Error de sintaxis: ${parseError.message}`);
      }

      // Verificar que sea una función de x e y (o constantes)
      const parsed = math.parse(expression);
      const symbols = parsed.filter(node => node.isSymbolNode).map(node => node.name);

      // Permitir x, y, constantes matemáticas y funciones matemáticas comunes
      const allowedSymbols = [
        'x', 'y',
        'pi', 'e', 'tau', 'phi', 'E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2',
        'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
        'sinh', 'cosh', 'tanh',
        'exp', 'log', 'ln', 'log10', 'log2',
        'sqrt', 'pow', 'abs', 'ceil', 'floor', 'round',
        'min', 'max', 'sign',
        'random'
      ];
      const invalidSymbols = symbols.filter(symbol => !allowedSymbols.includes(symbol.toLowerCase()));

      if (invalidSymbols.length > 0) {
        throw new Error(`Funciones/variables no permitidas: ${invalidSymbols.join(', ')}.`);
      }

      // Verificar que no sea una expresión vacía
      if (!expression.trim()) {
        throw new Error('La función no puede estar vacía');
      }

      // Verificar longitud razonable
      if (expression.length > 500) {
        throw new Error('La función es demasiado larga (máximo 500 caracteres)');
      }

      return true;
    } catch (error) {
      console.error('Error de validación:', error);
      return error.message;
    }
  };

  const handleFunctionChange = (newFunction) => {
    const validationResult = validateFunction(newFunction);
    if (validationResult === true) {
      setCurrentFunction(newFunction);
    } else {
      // Mostrar error al usuario (podríamos agregar un estado para errores)
      alert(`Error en la función: ${validationResult}`);
    }
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
      // Análisis simplificado del dominio - detectar restricciones comunes
      let domainAnalysis = "Análisis del dominio:\n\n";
      let hasRestrictions = false;

      // Detectar sqrt con argumentos potencialmente negativos
      const sqrtRegex = /sqrt\s*\([^)]*\)/gi;
      const sqrtMatches = currentFunction.match(sqrtRegex);
      if (sqrtMatches) {
        hasRestrictions = true;
        domainAnalysis += "• Restricción por raíz cuadrada: el argumento debe ser ≥ 0\n";
        domainAnalysis += "  - Si el argumento contiene x o y, se restringen los valores donde el argumento < 0\n";
      }

      // Detectar log/ln con argumentos potencialmente ≤ 0
      const logRegex = /(log|ln)\s*\([^)]*\)/gi;
      const logMatches = currentFunction.match(logRegex);
      if (logMatches) {
        hasRestrictions = true;
        domainAnalysis += "• Restricción por logaritmo: el argumento debe ser > 0\n";
        domainAnalysis += "  - Si el argumento contiene x o y, se restringen los valores donde el argumento ≤ 0\n";
      }

      // Detectar divisiones que podrían causar división por cero
      if (currentFunction.includes('/')) {
        hasRestrictions = true;
        domainAnalysis += "• Restricción por división: el denominador no puede ser 0\n";
        domainAnalysis += "  - Se deben excluir puntos donde el denominador se anula\n";
      }

      if (!hasRestrictions) {
        domainAnalysis += "• Dominio: ℝ² (todos los números reales para x e y)\n";
        domainAnalysis += "• No se detectaron restricciones especiales en la función\n";
      } else {
        domainAnalysis += "\n• Nota: Para un análisis más preciso, considere el comportamiento específico\n";
        domainAnalysis += "  de cada restricción en el contexto de la función completa.\n";
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

      // Solicitar punto para evaluación
      const evalPoint = prompt("Ingrese el punto (x,y) para evaluar el gradiente (ej: 1,2):", "1,1");
      if (evalPoint) {
        const [xStr, yStr] = evalPoint.split(',').map(s => s.trim());
        const x = parseFloat(xStr);
        const y = parseFloat(yStr);

        if (!isNaN(x) && !isNaN(y)) {
          try {
            const gradX = math.evaluate(derivativeX.toString(), { x, y });
            const gradY = math.evaluate(derivativeY.toString(), { x, y });

            result += `Evaluación en el punto (${x}, ${y}):\n`;
            result += `∇f(${x}, ${y}) = (${gradX.toFixed(4)}, ${gradY.toFixed(4)})\n\n`;

            // Calcular magnitud del gradiente
            const magnitude = Math.sqrt(gradX * gradX + gradY * gradY);
            result += `Magnitud del gradiente: ${magnitude.toFixed(4)}\n`;

            // Dirección del gradiente (ángulo en radianes)
            const direction = Math.atan2(gradY, gradX);
            result += `Dirección del gradiente: ${direction.toFixed(4)} rad\n`;
          } catch (e) {
            result += `No se pudo evaluar el gradiente en (${x}, ${y})\n`;
            result += "Verifique que el punto esté en el dominio de la función\n";
          }
        } else {
          result += "Punto inválido. Use formato 'x,y' con números\n";
        }
      } else {
        result += "No se especificó punto de evaluación\n";
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

  // Función para manejar selección interactiva en la superficie 3D

  const handleSurfaceClick = (point) => {
    try {
      const [x, y, z] = point;

      // Calcular gradiente en el punto seleccionado
      const derivativeX = math.derivative(currentFunction, 'x');
      const derivativeY = math.derivative(currentFunction, 'y');

      const gradX = math.evaluate(derivativeX.toString(), { x, y });
      const gradY = math.evaluate(derivativeY.toString(), { x, y });

      let result = `Punto seleccionado en la superficie:\n\n`;
      result += `Coordenadas: (${x.toFixed(4)}, ${y.toFixed(4)}, ${z.toFixed(4)})\n\n`;
      result += `Gradiente local en (${x.toFixed(2)}, ${y.toFixed(2)}):\n`;
      result += `∂f/∂x = ${gradX.toFixed(4)}\n`;
      result += `∂f/∂y = ${gradY.toFixed(4)}\n`;
      result += `∇f = (${gradX.toFixed(4)}, ${gradY.toFixed(4)})\n\n`;

      const magnitude = Math.sqrt(gradX * gradX + gradY * gradY);
      result += `Magnitud: ${magnitude.toFixed(4)}\n`;

      setCalculationResult(result);
      setCalculationType('interactive');
    } catch (error) {
      setCalculationResult('Error al calcular gradiente en punto seleccionado: ' + error.message);
    }
  };

  // Función de optimización con restricciones (Método de Lagrange)
  const optimizeWithConstraints = () => {
    try {
      // Solicitar función objetivo
      const objectiveFunction = prompt("Ingrese la función objetivo f(x,y):", currentFunction);
      if (!objectiveFunction) return;

      // Solicitar restricción
      const constraintFunction = prompt("Ingrese la restricción g(x,y):", "x^2 + y^2 - 1");
      if (!constraintFunction) return;

      // Solicitar valor de la restricción
      const constraintValue = parseFloat(prompt("Ingrese el valor de la restricción c (g(x,y) = c):", "1"));
      if (isNaN(constraintValue)) {
        setCalculationResult('Error: Valor de restricción inválido');
        setCalculationType('optimize');
        return;
      }

      let result = "Optimización con Restricciones - Método de Lagrange\n\n";
      result += `Función objetivo: f(x,y) = ${objectiveFunction}\n`;
      result += `Restricción: g(x,y) = ${constraintFunction} = ${constraintValue}\n\n`;

      // Calcular derivadas
      const df_dx = math.derivative(objectiveFunction, 'x');
      const df_dy = math.derivative(objectiveFunction, 'y');
      const dg_dx = math.derivative(constraintFunction, 'x');
      const dg_dy = math.derivative(constraintFunction, 'y');

      result += "Derivadas calculadas:\n";
      result += `∂f/∂x = ${df_dx}\n`;
      result += `∂f/∂y = ${df_dy}\n`;
      result += `∂g/∂x = ${dg_dx}\n`;
      result += `∂g/∂y = ${dg_dy}\n\n`;

      // Sistema de ecuaciones de Lagrange:
      // ∂f/∂x = λ∂g/∂x
      // ∂f/∂y = λ∂g/∂y
      // g(x,y) = c

      result += "Sistema de ecuaciones de Lagrange:\n";
      result += `∂f/∂x - λ∂g/∂x = 0  ⇒  ${df_dx} - λ(${dg_dx}) = 0\n`;
      result += `∂f/∂y - λ∂g/∂y = 0  ⇒  ${df_dy} - λ(${dg_dy}) = 0\n`;
      result += `g(x,y) - c = 0     ⇒  ${constraintFunction} - ${constraintValue} = 0\n\n`;

      // Método numérico simple: búsqueda en cuadrícula
      result += "Resolviendo numéricamente (búsqueda en cuadrícula):\n\n";

      let bestPoint = null;
      let bestValue = null;
      let lambda = null;

      // Búsqueda en un rango razonable
      const range = 3;
      const steps = 20;

      for (let i = 0; i <= steps; i++) {
        for (let j = 0; j <= steps; j++) {
          const x = -range + (i / steps) * 2 * range;
          const y = -range + (j / steps) * 2 * range;

          try {
            // Verificar si satisface la restricción (aproximadamente)
            const g_val = math.evaluate(constraintFunction, { x, y });
            if (Math.abs(g_val - constraintValue) < 0.1) { // Tolerancia

              // Calcular gradientes
              const grad_fx = math.evaluate(df_dx.toString(), { x, y });
              const grad_fy = math.evaluate(df_dy.toString(), { x, y });
              const grad_gx = math.evaluate(dg_dx.toString(), { x, y });
              const grad_gy = math.evaluate(dg_dy.toString(), { x, y });

              // Estimar λ (grad_f = λ grad_g)
              if (Math.abs(grad_gx) > 0.01 || Math.abs(grad_gy) > 0.01) {
                const lambda_x = Math.abs(grad_gx) > 0.01 ? grad_fx / grad_gx : 0;
                const lambda_y = Math.abs(grad_gy) > 0.01 ? grad_fy / grad_gy : 0;
                const lambda_est = (lambda_x + lambda_y) / 2;

                const f_val = math.evaluate(objectiveFunction, { x, y });

                if (bestValue === null || f_val > bestValue) {
                  bestValue = f_val;
                  bestPoint = { x, y };
                  lambda = lambda_est;
                }
              }
            }
          } catch (e) {
            continue;
          }
        }
      }

      if (bestPoint) {
        result += `Punto crítico encontrado: (${bestPoint.x.toFixed(4)}, ${bestPoint.y.toFixed(4)})\n`;
        result += `Valor de la función objetivo: ${bestValue.toFixed(4)}\n`;
        result += `Multiplicador de Lagrange (λ): ${lambda.toFixed(4)}\n\n`;

        // Verificar tipo de extremo (aproximado)
        result += "Análisis del tipo de extremo:\n";
        result += "• Para confirmar si es máximo o mínimo, se requiere análisis de la matriz Hessiana\n";
        result += "• Este resultado es una aproximación numérica del punto crítico\n";
        result += "• Para soluciones exactas, se recomienda resolver el sistema analíticamente\n";
      } else {
        result += "No se encontró un punto crítico claro en el rango de búsqueda.\n";
        result += "Intente con diferentes funciones o valores de restricción.\n";
      }

      setCalculationResult(result);
      setCalculationType('optimize');
    } catch (error) {
      setCalculationResult('Error en la optimización: ' + error.message);
      setCalculationType('optimize');
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
        top: '90px',
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
          top: '323px',
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
              background: is2DView ? '#000000' : 'transparent',
              border: 'none',
              color: is2DView ? '#ffffff' : '#000000',
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
            onClick={() => setIs2DView(true)}
            title="Vista 2D"
          >
            2D
          </button>
          <button
            style={{
              background: !is2DView ? '#000000' : 'transparent',
              border: 'none',
              color: !is2DView ? '#ffffff' : '#000000',
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
            onClick={() => setIs2DView(false)}
            title="Vista 3D"
          >
            3D
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
            background: (activeMenu === 'calculate' || activeMenu === 'domain' || activeMenu === 'range' || activeMenu === 'derivative' || activeMenu === 'integral' || activeMenu === 'optimize') ? '#ffffff' : 'transparent',
            border: 'none',
            color: (activeMenu === 'calculate' || activeMenu === 'domain' || activeMenu === 'range' || activeMenu === 'derivative' || activeMenu === 'integral' || activeMenu === 'optimize') ? '#000000' : '#ffffff',
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
            background: activeMenu === 'optimize' ? '#ffffff' : 'transparent',
            border: 'none',
            color: activeMenu === 'optimize' ? '#000000' : '#ffffff',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => handleMenuClick('optimize')}
          title="Optimización"
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target-icon lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`
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
          top: '90px',
          width: '315px',
          backgroundColor: 'rgba(220, 20, 60, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          zIndex: 9,
          padding: '20px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 110px)'
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
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: '8px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                Graficación automática
              </div>

              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }}>
                <p style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: '10px' }}>Ejemplos de funciones:</p>
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
                  optimizeWithConstraints();
                  setActiveMenu('optimize');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: activeMenu === 'optimize' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                  color: activeMenu === 'optimize' ? '#dc143c' : '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-text)',
                  fontWeight: 'var(--font-weight-light)'
                }}
              >
                🎯 Optimización con Restricciones
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

         {activeMenu === 'optimize' && activeMenu !== null && (
           <div>
             <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
               Optimización con Restricciones
             </h3>
             <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
               <p style={{ marginBottom: '15px' }}>
                 <strong>¿Qué es la optimización con restricciones?</strong> Encontrar extremos (máximos/mínimos) de una función objetivo sujetos a restricciones usando el método de multiplicadores de Lagrange.
               </p>
               <p>El método resuelve el sistema:</p>
               <div style={{
                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 padding: '15px',
                 borderRadius: '4px',
                 marginTop: '10px',
                 fontFamily: 'var(--font-text)',
                 fontWeight: 'var(--font-weight-light)',
                 fontSize: '13px'
               }}>
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>∇f(x,y) = λ∇g(x,y)</strong><br />
                 <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>g(x,y) = c</strong><br />
                 <br />
                 Donde f es la función objetivo, g es la restricción, λ es el multiplicador de Lagrange, y c es el valor de la restricción.
               </div>
               <button
                 onClick={optimizeWithConstraints}
                 style={{
                   width: '100%',
                   padding: '12px',
                   margin: '15px 0',
                   backgroundColor: '#ffffff',
                   color: '#dc143c',
                   border: '1px solid #ffffff',
                   borderRadius: '4px',
                   cursor: 'pointer',
                   fontFamily: 'var(--font-text)',
                   fontWeight: 'var(--font-weight-bold)',
                   fontSize: '14px'
                 }}
               >
                 🚀 Resolver Optimización (Método de Lagrange)
               </button>
               <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                 Se resolverá numéricamente usando búsqueda en cuadrícula para encontrar puntos críticos aproximados.
               </p>
             </div>
           </div>
         )}





        {activeMenu === 'params' && activeMenu !== null && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Parámetros de Visualización {is2DView ? '2D' : '3D'}
            </h3>
            <ParametrosVisualizacion
              is2D={is2DView}
              onParamsChange={is2DView ? setVisualizationParams2D : setVisualizationParams3D}
              currentParams={is2DView ? visualizationParams2D : visualizationParams3D}
              on2DTypeChange={is2DView ? setVisualization2DType : null}
            />
          </div>
        )}


        {activeMenu === 'info' && activeMenu !== null && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-title)' }}>
              Información
            </h3>
            <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.6', fontFamily: 'var(--font-text)', fontWeight: 'var(--font-weight-light)' }}>
              <p style={{ marginBottom: '15px' }}>
                <strong>NeoCalc</strong> es una herramienta interactiva para explorar funciones de dos variables de forma visual e intuitiva.
                Permite analizar propiedades fundamentales del cálculo multivariable apoyándose en visualizaciones 2D y 3D.
              </p>

              <h4 style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: '8px' }}>Funciones principales:</h4>
              <ul style={{ marginBottom: '15px' }}>
                - Visualización 3D de superficies f(x, y)
                <br></br>
                - Gráficos 2D: curvas de nivel y mapa de calor
                <br></br>
                - Cálculo de derivadas parciales y gradiente
                <br></br>
                - Análisis de dominio y rango
                <br></br>
                - Optimización con restricciones (Método de Lagrange)
                <br></br>
                - Evaluación en puntos y exploración interactiva
              </ul>

              <h4 style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: '8px' }}>Cómo usar:</h4>
              <ol>
                <strong>1°</strong> Ingresa una función en el menú Función.
                <br></br>
                <strong>2°</strong> Cambia entre vistas 2D y 3D según el análisis deseado.
                <br></br>
                <strong>3°</strong> Utiliza los menús laterales para cálculos y parámetros.
                <br></br>
                <strong>4°</strong> Haz clic en la superficie para obtener valores y gradiente local.
              </ol>

              <p style={{ marginTop: '15px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                Proyecto Final de Cálculo Multivariable<br />
                Desarrollado por <strong>Daniel Pérez</strong>
              </p>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 15
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
        top: '80px',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
      }}>
        {is2DView ? (
          <Visualizador2D
            expression={currentFunction}
            type={visualization2DType}
            params={visualizationParams2D}
          />
        ) : (
          <Visualizador3D
            expression={currentFunction}
            onSurfaceClick={handleSurfaceClick}
            params={visualizationParams3D}
          />
        )}
      </div>

      {/* Controles de ayuda para vista 3D */}
      {!is2DView && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: 'var(--font-text)',
          zIndex: 5,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          whiteSpace: 'nowrap'
        }}>
          <strong>Clic izquierdo:</strong> rotar • <strong>Clic derecho:</strong> desplazar • <strong>Rueda:</strong> zoom
        </div>
      )}
    </div>
  );
}

export default App;

