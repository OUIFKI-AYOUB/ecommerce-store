import { cn } from "@/lib/utils";
import { MouseEventHandler } from "react";

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  icon: React.ReactElement;
  className?: string;
  disabled?: boolean; // Add the disabled prop

}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  className,
  disabled,
}) => {
  return ( 
    <button 
      onClick={onClick} 
      className={cn (
        "rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition", 
         className )}
         disabled={disabled} // Pass the disabled prop to the button

    >
      {icon}
    </button>
   );
}
 
export default IconButton;