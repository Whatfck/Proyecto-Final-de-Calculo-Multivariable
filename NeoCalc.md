# NeoCalc – Guía de Desarrollo Asistido (Kilo Code)

Este documento define el plan de trabajo para finalizar el proyecto **NeoCalc**, priorizando tiempo, claridad y la funcionalidad mínima necesaria.  
El proyecto ya cuenta con **la mayor parte del frontend implementado**, por lo que **NO se debe rehacer la interfaz**, únicamente mejorar integración y completitud lógica.

---

## 1. Objetivo General
Completar las funciones centrales del cálculo multivariable y asegurar una visualización clara e interactiva en 3D y 2D.  
El enfoque será **depurar, completar y optimizar el código existente**.

---

## 2. Mantener (Estas funciones ya están y solo requieren revisión ligera)

| Función / Módulo | Estado | Acción |
|---|---|---|
| Ingreso y parsing de función | Parcial | Mantener y reforzar validación |
| Visualización 3D (Three.js) | Funciona | Optimizar rendimiento y color mapping |
| Derivadas parciales (math.js) | Funciona | Verificar precisión numérica |
| Gradiente | Funciona | Centralizar como función auxiliar |
| Integrales simbólicas | Funciona parcialmente | Mantener como opcional (no prioritaria) |

---

## 3. Simplificar (Reducir alcance para ahorrar tiempo)

| Función / Módulo | Acción recomendada |
|---|---|
| Dominio automático | Mantener análisis simple basado en restricciones comunes (log, sqrt, división entre cero) |
| Rango (máx/min global) | Hacer solo estimación numérica sobre la malla, no análisis exacto |
| Visualización 2D | Implementar solo contornos básicos, NO mapas avanzados |

---

## 4. Eliminar o Posponer (No son necesarias para aprobar el proyecto)

| Función compleja | Motivo |
|---|---|
| Optimización con restricciones (Lagrange) | Consume tiempo y no es requisito mínimo |
| Puntos críticos con Hessiana compleja | No aporta valor visual inmediato |
| Integrales triples con cambio de variable | No necesario |
| Centros de masa, momentos de inercia, etc. | Bonito pero *fuera del requerimiento* |

> Si el profesor pregunta, estas funciones se mencionan como **extensiones posibles** en la presentación final.

---

## 5. Flujo de Trabajo por Tareas (Para Kilo Code)
> **IMPORTANTE:** Después de cada tarea, la IA debe **detenerse y preguntarme:**
> **"¿Confirmas que esta parte funciona correctamente?"**

No continuará sin mi confirmación.

### **Tarea 1:** Validación robusta de funciones
- Verificar sintaxis
- Prevenir caracteres prohibidos
- Evitar evaluaciones peligrosas (`eval`, funciones externas)
- Usar únicamente `math.js`

### **Tarea 2:** Generación eficiente de malla `(x,y,z)`
- Evitar loops redundantes
- Manejar valores `NaN` y puntos no definidos
- Generar matriz lista para Three.js

### **Tarea 3:** Mejora de visualización 3D
- Color mapping por valor de `z`
- Suavizar cámara y rotación
- Permitir zoom estable

### **Tarea 4:** Dominio automático simplificado
- Detectar:
  - `sqrt(argumento < 0)`
  - `log(argumento ≤ 0)`
  - `división por 0`

### **Tarea 5:** Derivadas y Gradiente
- Confirmar cálculo con `math.derivative`
- Permitir evaluar en puntos seleccionados

### **Tarea 6:** Selección interactiva sobre la superficie
- Click → obtener `(x,y,z)`
- Mostrar gradiente local

### **Tarea 7:** Visualización 2D básica (contornos)
- Usar la misma malla
- Colores por nivel

### **Tarea 8:** Guardado local
- Guardar funciones y configuraciones en `localStorage`

---

## 6. Restricción Principal
> **No modificar la estructura del frontend.**  
> Solo ajustar componentes si es necesario conectar lógica existente.

---

## 7. Inicio de Trabajo
Kilo debe comenzar mostrando:
> Preparado. Iniciando con la Tarea 1: Validación de función.


Y a partir de ahí proceder **una tarea por vez**, preguntando después de cada una.

---

## 8. Resultado Esperado
Una aplicación funcional, clara, interactiva, demostrable y estable.  
No hace falta cubrir casos extremos o teoría avanzada: **solo lo que se puede mostrar y usar en clase.**

---
