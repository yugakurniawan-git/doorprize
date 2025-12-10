import React from "react";
import { Link, useLocation } from "react-router";

function TitleBreadcrumps({ title, breadcrumps }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="w-full h-auto flex flex-row justify-between items-center mb-4">
      <div>
        <p className="text-xl font-bold">{title}</p>
      </div>
      <div>
        <ol className="items-center space-x-2 hidden md:flex">
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return (
              <li key={routeTo} className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">/</span>
                {isLast ? (
                  <span className="text-gray-400 capitalize text-sm">
                    {name}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-gray-700 capitalize hover:text-blue-500 text-sm"
                  >
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default TitleBreadcrumps;
