'use client'

import React from 'react';

interface InputFieldProps {
  attribute: string;
  label: string;
  currentValue: string;
  handleAttributeChange: (attribute: string, value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  attribute,
  label,
  currentValue,
  handleAttributeChange
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    handleAttributeChange(attribute, value);
  };

  return (
    <>
      <div className="flex flex-col items-start w-full">
        <textarea
          placeholder='text'
          value={currentValue}
          onChange={handleInputChange}
          className='mt-2 w-full p-1 md:p-2 border rounded-md min-h-[80px] md:min-h-[100px] resize-y overflow-auto'
        />
      </div>
    </>
  );
};

export default InputField;
