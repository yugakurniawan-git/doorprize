import {
  faChevronLeft,
  faChevronRight,
  faSearch,
  faSortAlphaAsc,
  faSortAlphaDesc,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, createContext, useContext, useRef } from "react";
import { DarkModeContext } from "../../context/DarkMode";

// Context untuk state TableCard
const TableContext = createContext(null);
export const useTable = () => useContext(TableContext);

function TableCard({
  title,
  action,
  children,
  response,
  params,
  setParams,
  usePagination = true,
  bodyScroll = true,
  showSearch = true,
}) {
  const {isDarkMode} = useContext(DarkModeContext);

  const formSearchRef = useRef(null);
  return (
    <TableContext.Provider value={{ params, setParams, response, bodyScroll }}>
      <div className={`w-full rounded-lg relative shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        {/* Header */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-between items-center px-6 py-4">
          <div className="w-full sm:w-1/2 text-center sm:text-start">
            <h1 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-slate-600"} mb-3 sm:mb-0`}>
              {title}
            </h1>
          </div>
          <div className="w-full sm:w-1/2 flex flex-col sm:flex-row items-center sm:justify-end gap-2">
            {showSearch && (
              <form
                ref={formSearchRef}
                className="relative mb-0 w-full sm:w-auto"
                onSubmit={(event) => {
                  event.preventDefault();
                  setParams({ ...params, q: event.target.q.value });
                }}
              >
                <input
                  type="search"
                  name="q"
                  placeholder="Search"
                  defaultValue={params.q}
                  className={`
                    h-8 border-1 border-gray-300 w-full text-sm ps-8 py-2 rounded
                    transition duration-200 ease-in-out ring-gray-300 focus:ring-0 focus:outline-none focus:ring-gray-300
                    ${isDarkMode ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-gray-600" : "bg-white text-slate-600 placeholder-slate-400"}
                  `}
                />
                <button
                  type="submit"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                {params.q && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
                    onClick={() => {
                      formSearchRef.current.reset();
                      setParams((prev) => {
                        const { q, ...rest } = prev;
                        return { ...rest };
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </form>
            )}

            {action}
          </div>
        </div>

        {/* Table Content */}
        <div
          className={`w-full ${
            bodyScroll ? "overflow-auto h-[70vh]" : "overflow-x-auto"
          }`}
        >
          {children}
        </div>

        {/* Pagination */}
        {usePagination && <TableCard.Pagination />}
      </div>
    </TableContext.Provider>
  );
}

/* ======================
   Sub Components
====================== */

TableCard.Table = ({ children, className }) => (
  <table className={`w-full text-sm ${className ?? ""}`}>{children}</table>
);

TableCard.Thead = ({ children, className }) => {
  const { bodyScroll } = useTable();
  return (
    <thead
      className={`bg-primary text-white ${className ?? ""} ${
        bodyScroll ? "sticky top-0 z-10" : ""
      }`}
    >
      {children}
    </thead>
  );
};

TableCard.Tbody = ({ children, className }) => (
  <tbody className={`divide-y ${className ?? ""}`}>{children}</tbody>
);

TableCard.Tfoot = ({ children, className }) => (
  <tfoot className={`${className ?? ""}`}>{children}</tfoot>
);

TableCard.Tr = ({ children, className, ...props }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <tr
      className={`border-0 ${isDarkMode ? "odd:bg-gray-700 hover:bg-gray-600" : "odd:bg-gray-100 hover:bg-gray-200"}  ${className ?? ""}`}
      {...props}
    >
      {children}
    </tr>
  );
};

TableCard.Th = ({ children, className, sortBy, ...props }) => {
  const { params, setParams } = useTable();

  return (
    <th
      className={`py-2 px-3 ${className ?? ""} ${
        sortBy && "hover:text-rise cursor-pointer"
      } ${params?.sort_type && sortBy === params.sort_by && "text-rise"}`}
      {...props}
      onClick={() => {
        if (sortBy) {
          setParams({
            ...params,
            sort_by: sortBy,
            sort_type: params?.sort_type === "asc" ? "desc" : "asc",
          });
        }
      }}
    >
      {params?.sort_type && sortBy === params.sort_by && (
        <FontAwesomeIcon
          icon={params.sort_type === "asc" ? faSortAlphaAsc : faSortAlphaDesc}
        />
      )}{" "}
      {children}
    </th>
  );
};

TableCard.Td = ({ children, className, ...props }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <td className={`py-2 px-3 ${isDarkMode ? "text-white" : "text-slate-600"} ${className ?? ""}`} {...props}>
      {children}
    </td>
  );
};

TableCard.Loading = ({ totalColumns, height = "h-4" }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (Array.from({ length: 10 }).map((_, index) => (
    <TableCard.Tr key={index} className={"animate-pulse"}>
      {Array.from({ length: totalColumns }).map((_, index) => (
        <TableCard.Td key={index}>
          <div className={`${height} ${isDarkMode ? "bg-gray-600" : "bg-gray-200"} rounded`}>&nbsp;</div>
        </TableCard.Td>
      ))}
    </TableCard.Tr>
  )));
};

TableCard.Empty = ({ totalColumns }) => (
  <TableCard.Tr>
    <TableCard.Td
      colSpan={totalColumns}
      className="py-2 px-0 whitespace-nowrap text-center"
    >
      <p className="text-center text-gray-400">No data found</p>
    </TableCard.Td>
  </TableCard.Tr>
);

TableCard.Pagination = ({}) => {
  const { params, setParams, response } = useTable();
  const [page, setPage] = useState([]);
  useEffect(() => {
    let newPage = [];
    if (Object.keys(response).length > 0) {
      for (let index = 1; index <= response.last_page; index++) {
        newPage[index] = index;
      }
      setPage(newPage);
    }
  }, [response]);

  return (
    Object.keys(response).length > 0 && (
      <div className="w-full flex flex-row items-center justify-between py-3 px-6 bg-primary text-white rounded-bl-lg rounded-br-lg">
        {/* Rows per page */}
        <div
          className="text-sm flex items-center"
          data-tooltip-id="tooltip"
          data-tooltip-content="Rows per page"
        >
          <span>Data:</span>
          <select
            className="ms-2 border-0 text-sm rounded transition duration-200 ease-in-out ring-0 ring-gray-300 focus:ring-1 focus:outline-none focus:ring-gray-300 cursor-pointer"
            onChange={(e) => {
              setParams((prev) => ({ ...prev, per_page: e.target.value, page: 1 }));
            }}
            value={params.per_page}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="-1">All</option>
          </select>
        </div>

        {/* Info */}
        <div className="items-center text-sm hidden sm:flex">
          {response.from ?? 0} - {response.to ?? 0} of {response.total ?? 0}
        </div>

        {/* Page navigation */}
        <div className="flex flex-row items-center gap-2 text-sm">
          <span>Page:</span>
          <input
            type="number"
            min={1}
            max={response.last_page}
            className="border-0 text-sm rounded text-center transition duration-200 ease-in-out ring-0 ring-gray-300 focus:ring-1 focus:outline-none focus:ring-gray-300 cursor-pointer [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={response.current_page}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (val < 1) val = 1;
              if (val > response.last_page) val = response.last_page;
              setParams((prev) => ({ ...prev, page: val }));
            }}
          />
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Previous Page"
            className="text-slate-500 hover:text-slate-700 cursor-pointer"
            onClick={() => {
              if (response.current_page === 1) return;
              setParams((prev) => ({ ...prev, page: response.current_page - 1 }));
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-white" />
          </button>
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Next Page"
            className="text-slate-500 hover:text-slate-700 cursor-pointer"
            onClick={() => {
              if (response.current_page === response.last_page) return;
              setParams((prev) => ({ ...prev, page: response.current_page + 1 }));
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-white" />
          </button>
        </div>
      </div>
    )
  );
};

export default TableCard;
