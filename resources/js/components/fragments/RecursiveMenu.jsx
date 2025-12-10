import { faChevronRight, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useWindowSize from "../../hooks/useWindowSize";

const RecursiveMenu = ({ menus }) => {
  const windowSize = useWindowSize();
  const [shownMenu, setShownMenu] = useState([]);
  const [hiddenMenu, setHiddenMenu] = useState([]);
  const [openMore, setOpenMore] = useState(false);

  useEffect(() => {
    let totalMenu = 5;
    if (windowSize.width <= 1280) {
      totalMenu = 5;
    } else if (windowSize.width <= 1366) {
      totalMenu = 6;
    } else if (windowSize.width <= 1920) {
      totalMenu = 9;
    } else {
      totalMenu = 5;
    }
    setShownMenu(menus.slice(0, totalMenu));
    setHiddenMenu(menus.slice(totalMenu, menus.length));
  }, [windowSize]);

  return (
    <>
      <nav className="w-full h-auto flex justify-center items-center relative text-white">
        {shownMenu.map((menu, idx) => (
          <MenuItem
            key={idx}
            menu={menu}
            rounded={`${idx === 0 ? "rounded-l-lg" : (idx === menus.length - 1 ? "rounded-r-lg" : "")} `}
          />
        ))}
        {hiddenMenu.length > 0 && (
          <div className="relative group">
            <button
              onMouseEnter={() => setOpenMore(true)}
              onMouseLeave={() => setOpenMore(false)}
              className={`
                px-3 py-2 hover:bg-rise text-nowrap rounded-r-lg
                transition-all duration-200 ease-in-out
                ${ openMore ? "bg-rise" : "bg-primary"}
              `}
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            <div
              onMouseEnter={() => setOpenMore(true)}
              onMouseLeave={() => setOpenMore(false)}
              className={`
                absolute z-50 right-0 min-w-[180px] h-auto bg-white text-black shadow-lg
                transition-all duration-200 ease-in-out
                ${ openMore ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none" }
              `}
            >
              {hiddenMenu.map((menu, idx) => (
                <MenuItem
                  key={idx}
                  menu={menu}
                  rounded={``}
                  isMoreMenu={true}
                />
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

const MenuItem = ({ menu, rounded, isMoreMenu = false }) => {
  const [open, setOpen] = useState(false);

  // kalau ada submenu → dropdown
  if (menu.submenu && menu.submenu.length > 0) {
    return (
      <div className="relative group">
        {/* Trigger */}
        <button
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className={`
            px-3 py-2 w-full justify-center items-center hover:bg-rise text-nowrap
            transition-all duration-200 ease-in-out
            ${ open ? "bg-rise text-white" : isMoreMenu ? "bg-white" : "bg-primary" } ${rounded}
          `}
        >
          <span className="text-sm text-left">{menu.name}</span>
        </button>

        {/* Dropdown Items */}
        <ul
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className={`
            absolute z-50 min-w-[180px] h-auto bg-white text-black shadow-lg
            transition-all duration-200 ease-in-out
            ${ open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none" }
            ${ isMoreMenu ? "top-0 right-45" : "left-0" }
          `}
        >
          {menu.submenu.map((sub, idx) => (
            <li key={idx} className="relative">
              <SubMenuItem menu={sub} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // kalau tidak ada submenu → link biasa
  return (
    <Link
      to={menu.url}
      className={`block px-3 py-2 bg-primary hover:bg-rise text-white text-nowrap transition-all duration-200 ease-in-out ${rounded}`}
    >
      <span className="text-sm"> {menu.name} </span>
    </Link>
  );
};

const SubMenuItem = ({ menu }) => {
  const [open, setOpen] = useState(false);

  // kalau ada submenu → dropdown
  if (menu.submenu && menu.submenu.length > 0) {
    return (
      <div className="relative group">
        {/* Trigger */}
        <button
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className={`w-full text-left px-3 py-2 hover:bg-gray-200 flex items-center justify-between gap-2`}
        >
          {menu.name}
          <FontAwesomeIcon icon={faChevronRight} size="xs"
            className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          />
        </button>

        {/* Dropdown Items */}
        <ul
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className={`
            absolute left-full top-0 mt-0 min-w-[180px] bg-white text-black shadow-lg z-50
            transition-all duration-200 ease-in-out
            ${ open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none" }
          `}
        >
          {menu.submenu.map((sub, idx) => (
            <li key={idx} className="relative">
              <SubMenuItem menu={sub} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // kalau tidak ada submenu → link biasa
  return (
    <Link to={menu.url} className="block px-3 py-2 hover:bg-gray-200">
      {menu.name}
    </Link>
  );
};

export default RecursiveMenu;
