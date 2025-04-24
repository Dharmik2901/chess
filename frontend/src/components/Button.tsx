interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = ({ 
    onClick, 
    children, 
    variant = 'primary',
    size = 'md',
    fullWidth = false
}: ButtonProps) => {
    const baseClasses = "flex items-center justify-center font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500",
        secondary: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white focus:ring-emerald-500",
        outline: "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500"
    };
    
    const sizes = {
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-6 py-3"
    };
    
    const widthClass = fullWidth ? "w-full" : "";
    
    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} transform hover:scale-105 active:scale-95`}
        >
            {children}
        </button>
    );
};