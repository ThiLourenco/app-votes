"use client"

import { useEffect, useState } from "react";
import VoteOption from "../components/VoteOption";
import RealTimeResults from "@/components/RealTimeResults";

const Home = () => {
  const pollId = process.env.POLLID!; // Substituir com o ID real da enquete
  const [poll, setPoll] = useState<any>(null);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [voted, setVoted] = useState<boolean>(false);

  // Busca as opções da enquete
  useEffect(() => {
    const fetchPoll = async () => {
      const response = await fetch(`http://localhost:3333/polls/${pollId}`);
      const data = await response.json();
      setPoll(data.poll);
    };

    fetchPoll();
  }, [pollId]);

  const handleVote = async (optionId: string) => {
    if (!pollId || !optionId) return;

    await fetch(`http://localhost:3333/polls/${pollId}/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pollOptionId: optionId }),
    });

    setSelectedVote(optionId);
    setVoted(true);
  };

  if (!poll) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        {!voted ? (
          <VoteOption options={poll.options} onVote={handleVote} />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Voto confirmado!</h2>
            <p className="text-lg">Você votou na opção: {selectedVote}</p>
          </div>
        )}
        <RealTimeResults pollId={pollId} />
      </div>
    </div>
  );
};

export default Home;
