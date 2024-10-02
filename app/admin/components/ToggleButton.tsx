// components/ToggleButton.tsx

import { FiMenu, FiChevronLeft } from "react-icons/fi";

interface ToggleButtonProps {
  isMinimized: boolean;
  toggleSidebar: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isMinimized, toggleSidebar }) => {
  return (
    <button onClick={toggleSidebar} className="text-white hover:bg-gray-700 p-2 rounded flex items-center">
      {isMinimized ? <FiChevronLeft size={24} /> : <FiMenu size={24} />}
    </button>
  );
};

export default ToggleButton;
