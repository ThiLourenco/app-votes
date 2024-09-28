"use client";

import { useEffect, useState } from "react";
import { getCookie, setCookie } from 'cookies-next';
import VoteOption from "../components/VoteOption";
import RealTimeResults from "@/components/RealTimeResults";

const Home = () => {
  const pollId = process.env.NEXT_PUBLIC_POLLID!;
  const [poll, setPoll] = useState<any>(null);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [voted, setVoted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const sessionId = getCookie('sessionId');

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

    try {
      if (!sessionId) {
        const newSessionId = crypto.randomUUID();
        setCookie('sessionId', newSessionId, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
      }

      const response = await fetch(`http://localhost:3333/polls/${pollId}/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pollOptionId: optionId }),
        credentials: "include", 
      });

      if (response.status === 400) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      setSelectedVote(optionId);
      setVoted(true);

      setError(null);

      setTimeout(() => {
        setVoted(false);
        setSelectedVote(null);
      }, 3000);

    } catch (error) {
      console.error("Erro ao votar:", error);
      setError("Ocorreu um erro ao tentar votar.");
    }
  };

  if (!poll) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        {!voted ? (
          <>
            <VoteOption options={poll.options} onVote={handleVote} />

            {error && (
              <p className="text-red-500 mt-4 text-center">
                {error}
              </p>
            )}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Voto confirmado!</h2>
            <p className="text-lg">Você votou na opção: {selectedVote}</p>
            <p className="text-gray-500">Voltando à votação em 3 segundos...</p>
          </div>
        )}
        <RealTimeResults pollId={pollId} />
      </div>
    </div>
  );
};

export default Home;
