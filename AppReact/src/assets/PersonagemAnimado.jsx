import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

// Link do modelo 3D de teste do Three.js (ele já vem com as animações de andar e parado)
const MODEL_URL = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Xbot.glb";

export default function PersonagemAnimado({ targetPosition }) {
  // Referência pra conseguir mexer a posição e rotação do boneco na tela
  const groupRef = useRef();
  
  // Carrega o modelo 3D e as animações dele
  const { scene, animations } = useGLTF(MODEL_URL);
  
  // Pega os controles das animações do boneco
  const { actions } = useAnimations(animations, groupRef);

  // Guarda se o boneco tá parado ("idle") ou andando ("walk")
  const [animationState, setAnimationState] = useState("idle");

  // Troca a animação quando o estado muda (parado / andando)
  useEffect(() => {
    const currentActionName = animationState === "walk" ? "walk" : "idle";
    const currentAction = actions[currentActionName];

    // Solta a animação atual com uma transição suave de 0.2 segundos
    if (currentAction) {
      currentAction.reset().fadeIn(0.2).play();
    }

    // Limpa a animação anterior quando for trocar
    return () => {
      if (currentAction) currentAction.fadeOut(0.2);
    };
  }, [animationState, actions]);

  // Roda a cada frame (60fps) pra calcular a movimentação do boneco
  useFrame((state, delta) => {
    if (!groupRef.current || !targetPosition) return;

    const currentPos = groupRef.current.position;
    // Ve a distância entre o boneco e o ponto do GPS
    const distance = currentPos.distanceTo(targetPosition);

    // Se estiver a mais de 20cm do ponto do GPS, ele anda
    if (distance > 0.2) {
      if (animationState !== "walk") setAnimationState("walk");
      
      // O lerp faz o boneco ir deslizando até a posição, em vez de dar um pulo seco
      currentPos.lerp(targetPosition, delta * 2.5);
      
      // Vira o boneco pra direção que ele tá caminhando
      groupRef.current.lookAt(targetPosition.x, currentPos.y, targetPosition.z);
    } else {
      // Se chegou perto do ponto, fica parado
      if (animationState !== "idle") setAnimationState("idle");
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      {/* Coloca o boneco no mapa com o tamanho ajustado */}
      <primitive object={scene} scale={1.5} position={[0, 0, 0]} />
    </group>
  );
}

// Carrega o modelo antes pra tela não travar quando abrir
useGLTF.preload(MODEL_URL);