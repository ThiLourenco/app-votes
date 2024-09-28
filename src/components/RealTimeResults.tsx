"use client"

import { useState, useEffect } from "react";

interface PollOption {
  id: string;
  title: string;
  votes: number;
}

interface InitialResultsMessage {
  type: 'initialResults';
  results: PollOption[];
}

interface UpdateMessage {
  type: 'update';
  pollOptionId: string;
  votes: number;
}

interface RealTimeResultsProps {
  pollId: string;
}

const RealTimeResults: React.FC<RealTimeResultsProps> = ({ pollId }) => {
  const [results, setResults] = useState<Record<string, PollOption>>({});

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3333/polls/${pollId}/results`);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'initialResults') {
        // Update status with initial results
        const initialResults = message.results.reduce((acc: Record<string, PollOption>, option: PollOption) => {
          acc[option.id] = { ...option, votes: option.votes };
          return acc;
        }, {});
        setResults(initialResults);
      } else if (message.type === 'update') {
        // Real-time update
        const { pollOptionId, votes } = message;
        setResults((prevResults) => ({
          ...prevResults,
          [pollOptionId]: { ...prevResults[pollOptionId], votes },
        }));
      }
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
            {results[optionId].title}: {results[optionId].votes} votos
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RealTimeResults;
