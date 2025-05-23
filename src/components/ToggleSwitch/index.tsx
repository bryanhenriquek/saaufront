import { useState } from 'react';

export default function ToggleSwitch({
  defaultOn = false,
  onChange,
}: {
  defaultOn?: boolean;
  onChange?: (on: boolean) => void;
}) {
  const [on, setOn] = useState(defaultOn);

  const toggle = () => {
    setOn(!on);
    onChange?.(!on);
  };

  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={toggle}
      className={`
        relative inline-flex flex-shrink-0 h-6 w-11
        cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out
        ${on ? 'bg-[#5f259f]' : 'bg-gray-200'}`}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 rounded-full bg-white
          shadow transform ring-0 transition-transform duration-200 ease-in-out
          ${on ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}