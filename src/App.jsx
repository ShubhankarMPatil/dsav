import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import './App.css';
import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";



// Tree data: X-coordinates for each level
const treeData = [
  [0],         // Root
  [-2, 2],     // Level 1
  [-3, -1, 1, 3], // Level 2
  [-4, -2, 0, 2, 4]
];

const Node = ({ position, visible }) => {
  const props = useSpring({
    scale: visible ? [1, 1, 1] : [0, 0, 0],
    config: { tension: 200, friction: 10 }
  });

  return (
    <animated.mesh position={position} scale={props.scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="lightblue" />
    </animated.mesh>
  );
};

const Line = ({ start, end, visible }) => {
  if (!visible) return null;
  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array([...start, ...end])}
          itemSize={3}
          count={2}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="white" linewidth={5} />
    </line>
  );
};

const BinaryTree = () => {

    const cameraControlsRef = useRef();
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (cameraControlsRef.current) {
          const cam = cameraControlsRef.current.camera;
          console.log("Position:", cam.position.toArray());
          console.log("Rotation:", cam.rotation.toArray());
        }
      }, 1000); // Log every second
  
      return () => clearInterval(interval);
    }, []);
  

  const [stage, setStage] = useState(0);
  const maxStage = treeData.length - 1; // Ensures we reach the last stage
  
    let xRotation = 40 * (3.14 / 180);
    let yRotation = 0 * (3.14 / 180);
    let zRotation = 45 * (3.14 / 180);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas camera={{fov: 50, position: [2.4, -3.1, 4.1], rotation: [xRotation, yRotation, zRotation]}}>
        {/* <CameraControls ref={cameraControlsRef} /> */}
        <ambientLight intensity={0} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        {/* <OrbitControls enableRotate enableZoom /> */}

        {/* Render nodes */}
        {treeData.map((level, i) =>
          level.map((x, j) => (
            <Node
              key={`${i}-${j}`}
              position={[x, -(i * 1.5) + 2, 0]} // Shifted up to center tree
              visible={i <= stage}
            />
          ))
        )}

        {/* Render lines */}
        {stage > 0 &&
          treeData.slice(1).map((level, i) =>
            level.map((x, j) => (
              <Line
                key={`line-${i}-${j}`}
                start={[
                  treeData[i][Math.floor(j / 2)],
                  -(i * 1.5) + 2,
                  0
                ]}
                end={[x, -((i + 1) * 1.5) + 2, 0]}
                visible={i + 1 <= stage}
              />
            ))
          )}
      </Canvas>

      <button
        onClick={() => setStage((s) => (s < maxStage ? s + 1 : s))}
        style={{
          position: "absolute",
          top: "10px",
          left: "40%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Increment Stage
      </button>

      <button
        onClick={() => setStage((s) => (s > 0 ? s - 1 : s))}
        style={{
          position: "absolute",
          top: "10px",
          left: "60%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      > 
      Decrement Stage
        </button>
    </div>
  );
};

export default BinaryTree;
