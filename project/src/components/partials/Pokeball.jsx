import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three';
import { Environment, Float } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import pokeballModel from '/src/assets/models/pokeball.fbx';

const PokemonModel = () => {
  const fbx = useLoader(FBXLoader, pokeballModel);
  const modelRef = useRef();

  useFrame(() => {
    modelRef.current.rotation.y += 0.005;
  });

  const chromeMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0,
    envMapIntensity: 1.8
  });

  fbx.traverse((child) => {
    if (child.isMesh) {
      child.material = chromeMaterial;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  fbx.scale.set(0.04, 0.04, 0.04);
  fbx.position.set(0, 0, 0);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.01}>
      <primitive ref={modelRef} object={fbx} />
    </Float>
  );
};

const Pokeball3D = () => {
  return (
    <div className="poke-pokeball flex items-center justify-center h-96 relative">
      <div className="poke-aurora"></div>
      <div className="poke-glow"></div>
      
      <Canvas
        camera={{
          position: [0, 0, 12],
          fov: 0.4,
          near: 0.5,
          far: 100
        }}
        shadows
              style={{ background: 'transparent', margin: '0 0 0 -4rem' }}
        gl={{ alpha: true, antialias: true, toneMapping: 3 }}
      >
        <Environment preset="studio" background={false} blur={0.8} />
        
        <pointLight position={[10, 10, 10]} intensity={0.4} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        <pointLight position={[0, 5, 5]} intensity={0.4} />
        
        <Suspense fallback={null}>
          <PokemonModel />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Pokeball3D;