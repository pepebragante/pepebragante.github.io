import React from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../servers/Crud";

import logotipo from "../assets/BentoGOLogotipo.png";
import logo from "../assets/logo-Bento-Quirino-sem-fundo-branco.png";

import styles from "../styles/Home.module.css";

export default function HomePage() {
  const navigate = useNavigate();

  async function testarBanco() {
    try {
      const data = await get();
      console.log("Dados do db.json:", data);
    } catch (error) {
      console.error("Erro ao conectar:", error);
    }
  }

  return (
    <div className={styles.container}>

      <img
        src={logotipo}
        className={styles.smallLogo}
        alt="BentoGo"
      />

      <div className={styles.logos}>

        <h1 className={styles.title}>
          BentoGo
        </h1>

        <h3 className={styles.title2}>
          "Sempre siga em frente"
        </h3>


        <div className={styles.logoArea}>

          <div className={styles.divtextos}>
            <span>
              Nosso projeto é um mapa interativo em 3D da Escola Técnica
              Estadual Bento Quirino, desenvolvido para facilitar a orientação
              de pais, familiares, estudantes e visitantes durante a primeira
              visita à escola. O problema identificado é a dificuldade de se
              localizar em um ambiente ainda desconhecido e encontrar os
              espaços onde estão os diferentes projetos da Bentotec. Como
              solução, o BentoGo apresenta um mapa interativo que permite
              visualizar a escola, acompanhar a localização do usuário e
              identificar onde cada projeto e espaço está localizado. Dessa
              forma, o aplicativo torna a visita mais simples, intuitiva e
              acessível para todos.
            </span>
          </div>

          <img
            src={logo}
            className={styles.mainLogo}
            alt="Logo Bento Quirino"
          />
    
          <div className={styles.divtextos}>
            <span>
              O BentoGo é uma solução digital desenvolvida para facilitar a
              orientação dentro da Escola Técnica Estadual Bento Quirino. Por
              meio de um mapa interativo em 3D, o usuário pode explorar a
              escola, visualizar a localização dos espaços e projetos da
              Bentotec e acompanhar sua própria posição utilizando o GPS do
              dispositivo. O sistema também oferece uma visão superior do
              mapa para facilitar a compreensão do ambiente. Para desenvolver
              a aplicação, foram utilizadas tecnologias como React, React
              Router, Three.js, React Three Fiber, Drei, Geolocation API, CSS
              Modules e um modelo 3D da escola em formato GLB.
            </span>
          </div>

        </div>

      </div>
      <div className={styles.creators}>
        Criadores: Nathan Novais e Pedro de Souza Bragante, caso erro ou duvidas digite para pepe.bragante@gmail.com 
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.buttonPrimary}
          onClick={() => navigate("/main")}
        >
          Começar
        </button>
      </div>
    
    </div>
  );
}