import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";

const Dropdown = ({
  label = "Menu",
  align = "left",
  useCaret = true,
  children,
  isCustomize = false,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignClass =
    align === "right" ? "origin-top-right right-0" : (align === "left" ? "origin-top-left left-0" : "origin-top-center left-1/2 transform -translate-x-1/2");

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {!isCustomize ? (
        <Button
          onClick={() => setOpen(!open)}
          bg={props.bg}
          hover={props.hover}
          color={props.color}
        >
          {label}{" "}
          {useCaret && <FontAwesomeIcon icon={faCaretDown} className="ml-2" />}
        </Button>
      ) : (
        <button {...props} onClick={() => setOpen(!open)}>
          {label}
        </button>
      )}
      {open && (
        <div
          className={`absolute z-15 mt-2 min-w-72 max-w-80 rounded-md bg-white shadow-lg ${alignClass}`}
        >
          <ul className="py-1">
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return child;
              return React.cloneElement(child, {
                onClick: (e) => {
                  setOpen(false);
                  if (child.props.onClick) child.props.onClick(e);
                },
              });
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

// Subkomponen item
Dropdown.Item = ({ children, className = "", ...props }) => (
  <li>
    <button
      {...props}
      className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${className} cursor-pointer`}
    >
      {children}
    </button>
  </li>
);

// Divider
Dropdown.Divider = () => (
  <li>
    <hr className="my-1 border-gray-200" />
  </li>
);

// Header
Dropdown.Header = ({ children }) => (
  <li>
    <span className="block px-4 py-2 text-sm font-semibold text-gray-500">
      {children}
    </span>
  </li>
);

Dropdown.Custom = ({ children }) => <>{children}</>;

export default Dropdown;
