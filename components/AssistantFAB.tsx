import React from 'react';
import { BotIcon } from './icons';

interface AssistantFABProps {
  onClick: () => void;
}

const AssistantFAB = ({ onClick }: AssistantFABProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 w-16 h-16 bg-v3-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-v3-primary-hover transform transition-transform duration-200 hover:scale-105"
      aria-label="Open AI Assistant"
    >
      <BotIcon className="w-8 h-8" />
    </button>
  );
};

export default AssistantFAB;