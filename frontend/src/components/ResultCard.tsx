import React from 'react';

interface ResultCardProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ label, value, unit, highlight }) => {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-lg font-semibold ${highlight ? 'text-green-700' : 'text-gray-900'}`}>
        {value} {unit && <span className="text-sm text-gray-500 font-normal ml-1">{unit}</span>}
      </div>
    </div>
  );
};

export default ResultCard;
