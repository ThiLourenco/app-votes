"use client"

import { useState, useEffect } from "react";

interface RealTimeResultsProps {
  pollId: string;
}

const RealTimeResults: React.FC<RealTimeResultsProps> = ({ pollId }) => {
  const [results, setResults] = useState<Record<string, number>>({});

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3333/polls/${pollId}/results`);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setResults((prevResults) => ({
        ...prevResults,
        [message.pollOptionId]: message.votes,
      }));
    };

    return () => {
      socket.close();
    };
  }, [pollId]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Resultados em Tempo Real</h3>
      <ul>
        {Object.keys(results).map((optionId) => (
          <li key={optionId}>
            Opção {optionId}: {results[optionId]} votos
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RealTimeResults;
