import React from "react";
import clsx from "clsx";

const variantStyles = {
    default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 text-gray-900 hover:bg-gray-100",
    ghost: "bg-transparent text-blue-500 hover:bg-gray-100",
    link: "text-blue-600 underline hover:text-blue-700",
    grayTrans: "text-blue-500 text-lg font-medium",
};

const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    icon: "p-2 aspect-square",
};

const Button = React.forwardRef(
    ({ children, className, variant = "default", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

export default Button;
