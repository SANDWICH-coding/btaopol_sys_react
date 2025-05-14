import React from "react";
import clsx from "clsx";

const Input = React.forwardRef(
  ({ type = "text", label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            "block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default Input;
