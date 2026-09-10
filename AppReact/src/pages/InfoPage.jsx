import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-Bento-Quirino-sem-fundo-branco.png";
import styles from "../styles/Info.module.css";
import voltar from "../assets/voltar.png"

export default function InfoPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.containerVoltar}>
              <button
                className={styles.buttonVoltar}
                onClick={() => navigate("/main")}
                >
                  <img 
                    src={voltar} 
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      objectFit: 'contain', 
                      display: 'block',
                      margin: '20px auto' 
                           }} 
                         />  
              </button> 
             </div>
      <h1 className={styles.title} style={{ fontFamily: 'DaysOne' }}>
        Sobre o Projeto:...
      </h1>

    </div>
    
  );
}