import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-Bento-Quirino-sem-fundo-branco.png";
import styles from "../styles/Setting.module.css";

export default function SettingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{ fontFamily: 'DaysOne' }}>
        Configurações
      </h1> 

      <div className={styles.buttonContainer}>
        <button
          className={styles.buttonPrimary2}
          //implementar modo escuro
        >
          Modo Escuro
        </button>
        <button
          className={styles.buttonPrimary}
          onClick={() => navigate("/main")}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}