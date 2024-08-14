import { Link } from "@inertiajs/react";
import React from "react";

interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="lg:mb-2 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h3 className="text-title-sm font-semibold text-black dark:text-white">
        {pageName}
        <small className="text-xs"> (Note: input that have '*' are required.)</small>
      </h3>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Blotter /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
