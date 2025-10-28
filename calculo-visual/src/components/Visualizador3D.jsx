import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import * as math from 'mathjs';

// Componente para generar la superficie 3D
function Surface({ expression, colorMap }) {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    try {
      const geo = new THREE.PlaneGeometry(10, 10, 50, 50); // Reducido para mejor rendimiento
      const positions = geo.attributes.position.array;

      // Evaluar la función en cada punto
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];

        try {
          const scope = { x, y };
          const z = math.evaluate(expression, scope);
          positions[i + 2] = isNaN(z) ? 0 : Math.max(-10, Math.min(10, z)); // Limitar rango
        } catch (error) {
          positions[i + 2] = 0;
        }
      }

      geo.computeVertexNormals();
      return geo;
    } catch (error) {
      console.error('Error creando geometría:', error);
      return new THREE.PlaneGeometry(10, 10, 10, 10);
    }
  }, [expression]);

  // Calcular colores basados en el valor Z
  const colors = useMemo(() => {
    try {
      const colorArray = new Float32Array(geometry.attributes.position.count * 3);
      const positions = geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        const z = positions[i + 2];
        const color = colorMap(z);
        colorArray[i] = color.r;
        colorArray[i + 1] = color.g;
        colorArray[i + 2] = color.b;
      }

      return colorArray;
    } catch (error) {
      console.error('Error calculando colores:', error);
      return new Float32Array(geometry.attributes.position.count * 3).fill(1);
    }
  }, [geometry, colorMap]);

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
export default function Visualizador3D({ expression = 'x^2 + y^2' }) {
  // Función de mapeo de colores (gradiente rojo simple)
  const colorMap = (value) => {
    try {
      const normalizedValue = (value + 5) / 10; // Normalizar entre -5 y 5
      const clampedValue = Math.max(0, Math.min(1, normalizedValue));

      // Gradiente rojo simple: negro → rojo
      return new THREE.Color().setRGB(clampedValue, 0, 0);
    } catch (error) {
      return new THREE.Color(0.5, 0, 0); // Rojo medio por defecto
    }
  };

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

          <Surface expression={expression} colorMap={colorMap} />

          {/* Grid blanco */}
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