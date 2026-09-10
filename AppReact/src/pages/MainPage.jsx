import React, { Suspense, useState, useEffect, useRef, useCallback } from "react"; 
import { Canvas, useFrame } from "@react-three/fiber"; 
import { OrbitControls, useGLTF, Html } from "@react-three/drei";  
import * as THREE from "three"; 
import settings from "../assets/settings.png"; 
import voltar from "../assets/voltar.png"; 
import info from "../assets/info.png"; 
import mapa from "../assets/mapa.png";
import styles from "../styles/Main.module.css"; 
import { useNavigate } from "react-router-dom"; 
 
import modelPath from "../assets/Bentao.glb"; 
import PersonagemAnimado from "../assets/PersonagemAnimado"; 
 
// Coordenadas GPS da entrada da escola. 
// Usamos esse ponto real como o centro (0,0,0) do nosso mundo 3D. 
const ANCHOR_LAT = -22.9068;  
const ANCHOR_LNG = -47.0616;  
 
// Converte a Latitude e Longitude do celular para coordenadas X, Y, Z em metros dentro do mapa 3D 
function latLngToVector3(lat, lng) { 
  const latRad = (ANCHOR_LAT * Math.PI) / 180; 
  const deltaLat = lat - ANCHOR_LAT; 
  const deltaLng = lng - ANCHOR_LNG; 
 
  // Cada 1 grau equivale a cerca de 111.320 metros na Terra 
  const z = -deltaLat * 111320 * 1000; 
  const x = deltaLng * 111320 * Math.cos(latRad) * 1000; 
 
  return new THREE.Vector3(x, 0, z); 
} 
 
// Componente responsável por movimentar e focar a câmera em 3ª pessoa acompanhando o boneco 
function CameraController({ targetPos, topView, mapCenter, mapSize }) { 
  const controlsRef = useRef(); 
 
  useFrame((state) => { 
    if (controlsRef.current) { 
      // Posição onde o boneco está no chão (pés) 
      const characterPos = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z); 
       
      // Visão de cima do mapa
      if (topView) {
        const center = mapCenter || new THREE.Vector3(0, 0, 0);
        const size = mapSize || new THREE.Vector3(100, 0, 100);
        const camera = state.camera;
        const fovRadians = (camera.fov * Math.PI) / 180;
        const aspect = camera.aspect || 1;

        const widthNeeded = size.x / aspect;
        const depthNeeded = size.z;
        const largestDimension = Math.max(widthNeeded, depthNeeded);

        let cameraHeight =
          largestDimension /
          (2 * Math.tan(fovRadians / 2));

        // Adiciona uma margem para não cortar as bordas do mapa
        cameraHeight *= 1.25;

        // Impede que a câmera fique muito próxima do mapa
        cameraHeight = Math.max(cameraHeight, 50);

        // Posiciona a câmera diretamente acima do centro do mapa
        state.camera.position.set(
          center.x,
          center.y + cameraHeight,
          center.z
        );

        // Faz a câmera olhar para o centro do mapa
        controlsRef.current.target.set(
          center.x,
          center.y,
          center.z
        );

        controlsRef.current.minDistance = 1;
        controlsRef.current.maxDistance = cameraHeight * 3;

        // Mantém a câmera olhando praticamente de cima
        controlsRef.current.minPolarAngle = 0;
        controlsRef.current.maxPolarAngle = 0.05;

        return;
      }

      // O ponto original do boneco fica nos pés. Para a câmera não olhar pro chão e cortar a cabeça, 
      // criamos um ponto de foco elevando o alvo em +1.8 metros (altura do peito/cabeça). 
      const targetLookAt = new THREE.Vector3( 
        characterPos.x, 
        characterPos.y + 1.8,  
        characterPos.z 
      ); 
 
      // Define a distância fixa da câmera em relação ao boneco: 
      // Y = 3.2 (altura da visão) e Z = -4 (valor negativo posiciona a câmera atrás do boneco) 
      const cameraOffset = new THREE.Vector3(0, 3.2, -4);  
       
      // Posiciona a câmera no espaço 3D acompanhando o deslocamento do personagem 
      state.camera.position.set( 
        characterPos.x + cameraOffset.x, 
        characterPos.y + cameraOffset.y, 
        characterPos.z + cameraOffset.z 
      ); 
       
      // Aponta o foco do OrbitControls diretamente para a cabeça do personagem 
      controlsRef.current.target.copy(targetLookAt); 

      // Restaura os limites normais da câmera
      controlsRef.current.minDistance = 1;
      controlsRef.current.maxDistance = 10;
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.05;
    } 
  }); 
 
  return ( 
    <OrbitControls 
      ref={controlsRef} 
      makeDefault 
      enableZoom={true} // Permite aproximar ou afastar a visão com pinça/scroll 
      enablePan={false} // Desativa o pan (arrastar) para o usuário não perder o boneco de vista no mapa 
      maxPolarAngle={Math.PI / 2 - 0.05} // Impede que a câmera gire para debaixo do chão 
      minDistance={1}   // Limite mínimo de aproximação 
      maxDistance={10}  // Limite máximo de afastamento 
    /> 
  ); 
} 

// Componente responsável por mostrar onde o personagem está no mapa quando a visão ampla está ativada
function PlayerMarker({ targetPos, topView }) {
  if (!topView) return null;

  return (
    <Html
      position={[
        targetPos.x - 4,
        targetPos.y + 15,
        targetPos.z
      ]}
      center
      zIndexRange={[10, 20]}
      style={{
        pointerEvents: "none",
        width: "10px",
        height: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          position: "relative",
          width: "10px",
          height: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* Animação de pulsação ao redor do marcador */}
        <div
          style={{
            position: "absolute",
            width: "85px",
            height: "85px",
            borderRadius: "50%",
            backgroundColor: "rgba(66, 133, 244, 0.30)",
            animation: "locationPulse 1.5s infinite"
          }}
        />

        {/* Marcador principal */}
        <div
          style={{
            position: "relative",
            width: "20px",
            height: "20px",
            borderRadius: "50% 50% 50% 0",
            backgroundColor: "#4285F4",
            border: "5px solid white",
            transform: "rotate(-45deg)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* Ponto branco no centro */}
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#4285F4",
              transform: "rotate(45deg)"
            }}
          />
        </div>
      </div>

      {/* Animação do círculo externo */}
      <style>
        {`
          @keyframes locationPulse {
            0% {
              transform: scale(0.7);
              opacity: 0.8;
            }

            70% {
              transform: scale(1.4);
              opacity: 0;
            }

            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
        `}
      </style>
    </Html>
  );
}

// Componente que carrega e exibe o modelo 3D da escola (.glb) 
function Modelo({ onBoundsReady }) { 
  const { scene } = useGLTF(modelPath); 
  const groupRef = useRef();

  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    box.getCenter(center);
    box.getSize(size);

    if (onBoundsReady) {
      onBoundsReady({ center, size });
    }
  }, [scene, onBoundsReady]);

  return ( 
    <group 
      ref={groupRef}
      scale={[1000, 1000, 1000]} 
      position={[ 
        -54.8837811357049, 
        -3.00000002607705, 
        64.7137628134997 
      ]} 
      rotation={[-Math.PI / 2, 0, Math.PI]} 
      onClick={(e) => { 
        e.stopPropagation(); 
        console.log("Coordenada 3D do clique:", e.point); 
      }} 
    > 
      <primitive object={scene} /> 
    </group> 
  ); 
} 
 
export default function MainPage() { 
  const navigate = useNavigate(); 
  const [targetPos, setTargetPos] = useState(new THREE.Vector3(0, 0, 0)); 

  // Define se a câmera está mostrando o mapa de cima
  const [topView, setTopView] = useState(false);

  // Guarda o centro e o tamanho do mapa para calcular a visão de cima
  const [mapCenter, setMapCenter] = useState(new THREE.Vector3(0, 0, 0));
  const [mapSize, setMapSize] = useState(new THREE.Vector3(100, 0, 100));
 
  // Hook que lê o sensor de GPS do dispositivo em tempo real 
  useEffect(() => { 
    if (!navigator.geolocation) return; 
 
    // watchPosition escuta as atualizações de localização conforme a pessoa anda 
    const watchId = navigator.geolocation.watchPosition( 
      (position) => { 
        const { latitude, longitude } = position.coords; 
        // Converte as coordenadas do mundo real para posições dentro do mapa 3D 
        const new3DPos = latLngToVector3(latitude, longitude); 
        setTargetPos(new3DPos); 
      }, 
      (err) => console.error("Erro ao obter GPS:", err), 
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 } 
    ); 
 
    // Limpa o monitoramento do GPS ao fechar a tela para não gastar bateria 
    return () => navigator.geolocation.clearWatch(watchId); 
  }, []); 

  // Recebe o centro e o tamanho do modelo para calcular automaticamente a visão de cima
  const handleBoundsReady = useCallback(({ center, size }) => {
    setMapCenter(center);
    setMapSize(size);
  }, []);
 
  return ( 
    <div className={styles.container}> 
       <div className={styles.containerVoltar}> 
        <button className={styles.buttonVoltar} onClick={() => navigate("/")}> 
          <img src={voltar} style={{ width: '50px', height: '50px', objectFit: 'contain', display: 'block', margin: '20px auto' }} />   
        </button>  
       </div> 
 
       <h1 className={styles.title} style={{ fontFamily: 'DaysOne'}}> 
         Localização 
       </h1> 
 
       <div className={styles.containerSettings}> 
        <button className={styles.buttonInfo} onClick={() => navigate("/info")}> 
          <img src={info} style={{ width: '50px', height: '50px', objectFit: 'contain', display: 'block', margin: '20px auto' }} />  
        </button>  
 
        <button className={styles.buttonSettings} onClick={() => navigate("/settings")}> 
          <img src={settings} style={{ width: '50px', height: '50px', objectFit: 'contain', display: 'block', margin: '20px auto' }} />   
        </button>         
       </div> 
 
       {/* Container onde a viewport 3D do WebGL é renderizada */} 
       <div style={{ position: 'absolute', top: '120px', left: '15px', width: 'calc(100% - 30px)', height: 'calc(100% - 135px)', zIndex: 0 }}> 
        <Canvas camera={{ position: [0, 3.2, -4], far: 10000 }}> 
          <ambientLight intensity={1.5} /> 
          <pointLight position={[10, 10, 10]} /> 
           
          {/* Suspense exibe a mensagem de carregamento enquanto os arquivos 3D baixam */} 
          <Suspense fallback={<div style={{color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>Carregando Mapa...</div>}> 
             
            {/* Cenário da escola */} 
            <Modelo onBoundsReady={handleBoundsReady} /> 
 
            {/* Boneco animado controlado pela posição do GPS */} 
            <PersonagemAnimado targetPosition={targetPos} /> 
             
            {/* Sistema de câmera em terceira pessoa acompanhando o boneco */} 
            <CameraController 
              targetPos={targetPos}
              topView={topView}
              mapCenter={mapCenter}
              mapSize={mapSize}
            />

            {/* Marcador que mostra a posição do personagem na visão ampla */}
            <PlayerMarker
              targetPos={targetPos}
              topView={topView}
            />
 
          </Suspense> 
        </Canvas>   

        {/* Botão para alternar entre a visão normal e a visão de cima */}
        <button
          onClick={() => setTopView((prev) => !prev)}
          aria-label={topView ? "Voltar para visão normal" : "Ver mapa de cima"}
          style={{
            position: 'absolute',
            right: '20px',
            bottom: '20px',
            width: '65px',
            height: '65px',
            padding: '8px',
            border: 'none',
            borderRadius: '15px',
            backgroundColor: 'white',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)'
          }}
        >
          <img
            src={mapa}
            alt="Visão de cima"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </button>

      </div> 
    </div> 
  ); 
} 
 
// Carrega o arquivo do mapa em segundo plano para não travar a navegação 
useGLTF.preload(modelPath);