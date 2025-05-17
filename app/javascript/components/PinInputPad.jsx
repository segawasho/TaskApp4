import React from 'react';

const PinInputPad = ({ value, setValue, onSubmit, maxLength = 8 }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          onClick={() => {
            if (value.length < maxLength) setValue(value + num);
          }}
          className="py-4 bg-gray-200 rounded text-xl font-semibold hover:bg-gray-300"
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => setValue('')}
        className="py-4 bg-red-200 text-red-700 rounded text-sm font-medium hover:bg-red-300"
      >
        クリア
      </button>

      <button
        onClick={() => {
          if (value.length < maxLength) setValue(value + '0');
        }}
        className="py-4 bg-gray-200 rounded text-xl font-semibold hover:bg-gray-300"
      >
        0
      </button>

      <button
        onClick={onSubmit}
        className="py-4 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
      >
        決定
      </button>
    </div>
  );
};

export default PinInputPad;
