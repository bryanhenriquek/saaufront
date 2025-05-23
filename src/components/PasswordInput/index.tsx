'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, InputHTMLAttributes } from 'react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function PasswordInput({
  label,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={props.id} className="mb-1 font-semibold text-sm text-black">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          {...props}
          className="w-full border border-gray-300 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          {showPassword ? <EyeOff size={20} color="black" /> : <Eye size={20} color="black" />}
        </button>
      </div>
    </div>
  );
}
