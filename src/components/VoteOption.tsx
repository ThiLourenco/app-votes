"use client"

import React, { useState } from "react";

interface VoteOptionProps {
  options: { id: string; title: string }[];
  onVote: (optionId: string) => void;
}

const VoteOption: React.FC<VoteOptionProps> = ({ options, onVote }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleVote = () => {
    if (selectedOption) {
      onVote(selectedOption);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Escolha sua opção de voto</h2>
      <ul className="space-y-2">
        {options.map((option) => (
          <li key={option.id}>
            <button
              className={`w-full py-2 px-4 rounded ${
                selectedOption === option.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              {option.title}
            </button>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
        onClick={handleVote}
        disabled={!selectedOption}
      >
        Confirmar Voto
      </button>
    </div>
  );
};

export default VoteOption;
