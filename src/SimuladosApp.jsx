// Web App de Simulados Militares com IA (GPT-4 via Make)
// Componente principal: SimuladosApp.jsx

import { useState } from "react";

const disciplinas = {
  "História": [
    "Brasil Colônia",
    "Brasil Império",
    "Período Regencial",
    "Era Vargas",
    "Ditadura Militar",
    "Revoltas Coloniais"
  ],
  "Matemática": [
    "Equações do 1º Grau",
    "Equações do 2º Grau",
    "PA e PG",
    "Razão e Proporção",
    "Porcentagem"
  ],
  "Geografia": [
    "Relevo Brasileiro",
    "Clima e Vegetação",
    "Demografia",
    "Urbanização",
    "Geopolítica"
  ],
  "Português": [
    "Interpretação de Texto",
    "Ortografia",
    "Pontuação",
    "Crase",
    "Concordância Verbal"
  ],
  "Inglês": [
    "Reading",
    "Simple Present",
    "Past Tense",
    "Vocabulary"
  ]
};

export default function SimuladosApp() {
  const [disciplina, setDisciplina] = useState("");
  const [tema, setTema] = useState("");
  const [dificuldade, setDificuldade] = useState("Média");
  const [questao, setQuestao] = useState(null);
  const [respostaAluno, setRespostaAluno] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function gerarQuestao() {
    setQuestao(null);
    setFeedback(null);
    setCarregando(true);
    const response = await fetch("https://hook.us1.make.com/SEU_WEBHOOK_DE_GERACAO", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disciplina, tema, dificuldade })
    });
    const data = await response.json();
    setQuestao(data);
    setCarregando(false);
  }

  async function responder(alternativa) {
    setRespostaAluno(alternativa);
    const response = await fetch("https://hook.us1.make.com/SEU_WEBHOOK_DE_FEEDBACK", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enunciado: questao.enunciado,
        alternativas: questao.alternativas,
        gabarito: questao.gabarito,
        respostaAluno: alternativa
      })
    });
    const data = await response.json();
    setFeedback(data);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>🎖️ Simulados Militares com IA</h1>

      <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem" }}>
        <select onChange={(e) => {
          setDisciplina(e.target.value);
          setTema("");
        }} value={disciplina}>
          <option value="">Selecione a disciplina</option>
          {Object.keys(disciplinas).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {disciplina && (
          <select onChange={(e) => setTema(e.target.value)} value={tema}>
            <option value="">Selecione o tema</option>
            {disciplinas[disciplina].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        )}

        <select onChange={(e) => setDificuldade(e.target.value)} value={dificuldade}>
          <option value="Fácil">Fácil</option>
          <option value="Média">Média</option>
          <option value="Difícil">Difícil</option>
        </select>

        <button onClick={gerarQuestao} disabled={!disciplina || !tema || carregando}>
          {carregando ? "Gerando..." : "Gerar Questão"}
        </button>
      </div>

      {questao && (
        <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", marginTop: "1rem" }}>
          <p><strong>Questão:</strong> {questao.enunciado}</p>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
            {questao.alternativas.map((alt, i) => (
              <button
                key={i}
                onClick={() => responder(alt.letra)}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #999",
                  borderRadius: "4px",
                  background: respostaAluno === alt.letra ? "#0070f3" : "white",
                  color: respostaAluno === alt.letra ? "white" : "black",
                  cursor: "pointer"
                }}
              >
                {alt.letra}) {alt.texto}
              </button>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f1f1f1", borderRadius: "8px" }}>
          <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
            {feedback.acertou ? "✅ Você acertou!" : "❌ Você errou."}
          </p>
          <p><strong>Gabarito:</strong> {feedback.gabarito}</p>
          <p><strong>Explicação:</strong> {feedback.explicacao}</p>
          {feedback.dica && <p><strong>Dica:</strong> {feedback.dica}</p>}
        </div>
      )}
    </div>
  );
}
