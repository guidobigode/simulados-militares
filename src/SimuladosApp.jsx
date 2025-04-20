// Web App de Simulados Militares com IA (GPT-4 via Make)
// Desenvolvido para rodar no domínio www.guidobigode.com

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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

  async function gerarQuestao() {
    setQuestao(null);
    setFeedback(null);
    const response = await fetch("https://hook.us1.make.com/SEU_WEBHOOK_DO_MAKE", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disciplina, tema, dificuldade })
    });
    const data = await response.json();
    setQuestao(data);
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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simulados Militares com IA</h1>

      <div className="grid gap-4">
        <select
          className="p-2 border rounded"
          onChange={(e) => {
            setDisciplina(e.target.value);
            setTema("");
          }}
        >
          <option value="">Selecione a disciplina</option>
          {Object.keys(disciplinas).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {disciplina && (
          <select
            className="p-2 border rounded"
            onChange={(e) => setTema(e.target.value)}
          >
            <option value="">Selecione o tema</option>
            {disciplinas[disciplina].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        )}

        <select
          className="p-2 border rounded"
          onChange={(e) => setDificuldade(e.target.value)}
        >
          <option value="Fácil">Fácil</option>
          <option value="Média">Média</option>
          <option value="Difícil">Difícil</option>
        </select>

        <Button onClick={gerarQuestao} disabled={!disciplina || !tema}>
          Gerar Questão
        </Button>
      </div>

      {questao && (
        <Card className="mt-6">
          <CardContent className="space-y-4">
            <p><strong>Questão:</strong> {questao.enunciado}</p>
            {questao.alternativas.map((alt, i) => (
              <Button
                key={i}
                onClick={() => responder(alt.letra)}
                variant={respostaAluno === alt.letra ? "default" : "outline"}
              >
                {alt.letra}) {alt.texto}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 border rounded bg-gray-100"
        >
          <p className="font-bold text-lg">
            {feedback.acertou ? "✅ Você acertou!" : "❌ Você errou."}
          </p>
          <p><strong>Gabarito:</strong> {feedback.gabarito}</p>
          <p><strong>Explicação:</strong> {feedback.explicacao}</p>
          {feedback.dica && <p><strong>Dica:</strong> {feedback.dica}</p>}
        </motion.div>
      )}
    </div>
  );
}
