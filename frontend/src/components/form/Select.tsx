import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string | number) => void;
  className?: string;
  defaultValue?: string | number | null;
  id?: string;
  name?: string;
}

const Select = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  id,
  name,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | null>(
    defaultValue
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevDefaultValue = useRef<string | number | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (
      defaultValue !== undefined &&
      defaultValue !== selectedValue &&
      defaultValue !== prevDefaultValue.current
    ) {
      setSelectedValue(defaultValue);
      prevDefaultValue.current = defaultValue;
    }
  }, [defaultValue, selectedValue]);

  // Cari label dari value yang dipilih
  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string | number) => {
    setSelectedValue(value);
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* hidden input untuk submit */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedValue?.toString() || ""}
          id={id}
        />
      )}
      {/* Tombol Select */}
      <div
        className="h-11 w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-800 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        onClick={() => setIsOpen(!isOpen)}
        id={id && !name ? id : undefined}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedValue ? "text-white" : "text-gray-400"}>
          {selectedLabel}
        </span>
        <FaChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value.toString()}
              className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
