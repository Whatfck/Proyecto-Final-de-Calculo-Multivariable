import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import * as math from 'mathjs';

// Componente para manejar clicks en la superficie
function ClickHandler({ onSurfaceClick }) {
  const { camera, scene, raycaster } = useThree();

  useEffect(() => {
    const handleClick = (event) => {
      // Convertir coordenadas del mouse a normalized device coordinates
      const rect = event.target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Actualizar raycaster
      raycaster.setFromCamera({ x, y }, camera);

      // Buscar intersecciones con objetos en la escena
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        // Solo procesar si es la superficie (mesh con geometría)
        if (intersects[0].object.geometry && point) {
          onSurfaceClick([point.x, point.y, point.z]);
        }
      }
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('click', handleClick);
      return () => canvas.removeEventListener('click', handleClick);
    }
  }, [camera, scene, raycaster, onSurfaceClick]);

  return null;
}

// Componente para generar la superficie 3D
function Surface({ expression, colorMap, range, resolution }) {
  const meshRef = useRef();

  const { geometry, colors } = useMemo(() => {
    try {
      // Usar parámetros dinámicos
      const size = range * 2; // De -range a +range
      const geo = new THREE.PlaneGeometry(size, size, resolution, resolution);
      const positions = geo.attributes.position.array;
      const colorArray = new Float32Array(geo.attributes.position.count * 3);

      // Generación eficiente de malla: un solo loop para posiciones y colores
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];

        let z;
        try {
          const scope = { x, y };
          z = math.evaluate(expression, scope);

          // Manejo mejorado de NaN: usar interpolación simple o valor por defecto
          if (isNaN(z) || !isFinite(z)) {
            z = 0; // Valor por defecto para puntos no definidos
          }

          // Limitar rango para estabilidad visual (relativo al range actual)
          z = Math.max(-range * 2, Math.min(range * 2, z));
        } catch (error) {
          z = 0; // Fallback para errores de evaluación
        }

        positions[i + 2] = z;

        // Calcular colores en el mismo loop (evita iteración redundante)
        const color = colorMap(z);
        colorArray[i] = color.r;
        colorArray[i + 1] = color.g;
        colorArray[i + 2] = color.b;
      }

      geo.computeVertexNormals();
      return { geometry: geo, colors: colorArray };
    } catch (error) {
      console.error('Error creando geometría y colores:', error);
      const fallbackGeo = new THREE.PlaneGeometry(range * 2, range * 2, Math.min(resolution, 20), Math.min(resolution, 20));
      const fallbackColors = new Float32Array(fallbackGeo.attributes.position.count * 3).fill(1);
      return { geometry: fallbackGeo, colors: fallbackColors };
    }
  }, [expression, colorMap, range, resolution]);

  useEffect(() => {
    if (meshRef.current && meshRef.current.geometry) {
      meshRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      meshRef.current.geometry.attributes.color.needsUpdate = true;
    }
  }, [colors]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        side={THREE.DoubleSide}
        transparent
        opacity={0.95}
        wireframe={false}
      />
    </mesh>
  );
}

// Componente de carga
function LoadingFallback() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a1a',
      color: '#ffffff',
      fontSize: '1.2rem'
    }}>
      Cargando visualizador 3D...
    </div>
  );
}

// Componente principal del visualizador
export default function Visualizador3D({ expression = 'x^2 + y^2', onSurfaceClick, params }) {
  const range = params?.range || 5;
  const resolution = params?.resolution || 50;
  const showGrid = params?.showGrid !== false;
  const colorScheme = params?.colorScheme || 'default';
  // Función de mapeo de colores según esquema seleccionado
  const colorMap = useMemo(() => {
    return (value) => {
      try {
        // Normalizar basado en el rango actual
        const normalizedValue = (value + range) / (range * 2); // Normalizar entre 0 y 1
        const clampedValue = Math.max(0, Math.min(1, normalizedValue));

        let red, green, blue;

        switch (colorScheme) {
          case 'viridis':
            // Viridis: azul → verde → amarillo
            if (clampedValue < 0.5) {
              red = 0;
              green = clampedValue * 2;
              blue = 0.5 + clampedValue;
            } else {
              red = (clampedValue - 0.5) * 2;
              green = 1;
              blue = 1 - (clampedValue - 0.5) * 2;
            }
            break;

          case 'plasma':
            // Plasma: morado → rosa → amarillo
            red = Math.sin(clampedValue * Math.PI * 0.5) * 0.8 + 0.2;
            green = Math.sin(clampedValue * Math.PI) * 0.5 + 0.5;
            blue = Math.sin(clampedValue * Math.PI * 1.5) * 0.3 + 0.7;
            break;

          case 'inferno':
            // Inferno: negro → rojo → amarillo
            if (clampedValue < 0.3) {
              red = clampedValue * 3.33;
              green = 0;
              blue = 0;
            } else if (clampedValue < 0.7) {
              red = 1;
              green = (clampedValue - 0.3) * 2.5;
              blue = 0;
            } else {
              red = 1;
              green = 1;
              blue = (clampedValue - 0.7) * 3.33;
            }
            break;

          case 'magma':
            // Magma: negro → púrpura → rosa
            red = Math.sin(clampedValue * Math.PI * 0.7) * 0.6 + 0.4;
            green = Math.sin(clampedValue * Math.PI * 0.3) * 0.4;
            blue = Math.sin(clampedValue * Math.PI * 1.2) * 0.5 + 0.5;
            break;

          default: // 'default': Rojo → Verde → Azul
            if (clampedValue < 0.5) {
              // Rojo → Verde: de (1,0,0) a (0,1,0)
              red = 1 - clampedValue * 2;
              green = clampedValue * 2;
              blue = 0;
            } else {
              // Verde → Azul: de (0,1,0) a (0,0,1)
              red = 0;
              green = 1 - (clampedValue - 0.5) * 2;
              blue = (clampedValue - 0.5) * 2;
            }
            break;
        }

        return new THREE.Color().setRGB(red, green, blue);
      } catch (error) {
        return new THREE.Color(1.0, 0.5, 0); // Naranja por defecto
      }
    };
  }, [colorScheme, range]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [8, 8, 8], fov: 60 }}
          style={{ background: 'transparent' }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.4} />

          <Surface expression={expression} colorMap={colorMap} range={range} resolution={resolution} />

          {/* Click handler */}
          {onSurfaceClick && <ClickHandler onSurfaceClick={onSurfaceClick} />}


          {/* Grid blanco - condicional */}
          {showGrid && (
            <Grid
              args={[20, 20]}
              cellSize={1}
              cellThickness={0.5}
              cellColor="#ffffff"
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#ffffff"
              fadeDistance={30}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid={true}
            />
          )}

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI}
            minDistance={5}
            maxDistance={50}
          />
        </Canvas>
      </Suspense>

    </div>
  );
}