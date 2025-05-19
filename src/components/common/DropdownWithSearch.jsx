import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import clsx from 'clsx';

const DropdownWithSearch = ({
  label = "Select option",
  items = [],
  onSelect,
  error = '',
  selectedItem = null,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleItemClick = (item) => {
    onSelect?.(item);
    setOpen(false);
    setSearch('');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full space-y-1.5 relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <button
        onClick={() => setOpen(!open)}
        type="button"
        className={clsx(
          "w-full flex justify-between items-center px-4 py-2 text-sm rounded-lg shadow-sm transition-all",
          "bg-white border",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500",
          "focus:outline-none focus:ring-2 focus:ring-offset-1"
        )}
      >
        <span className="truncate flex items-center gap-2">
          {selectedItem?.photo && (
            <img
              src={selectedItem.photo}
              alt="profile"
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          {selectedItem?.label || 'Select an option'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-64 overflow-y-auto">
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center px-2 py-1 bg-gray-100 rounded">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="py-1">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
            ) : (
              filteredItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleItemClick(item)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item.photo && (
                    <img
                      src={item.photo}
                      alt="profile"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span className="truncate">{item.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DropdownWithSearch;
