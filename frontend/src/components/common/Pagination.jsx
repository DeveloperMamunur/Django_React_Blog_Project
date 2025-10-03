import { ArrowLeft, ArrowRight } from "lucide-react";
import Button  from "./Button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; 

    // Helper: push a page button
    const pushPage = (page) => {
      pages.push(
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded ${
            page === currentPage ? "bg-blue-500 text-white font-semibold" : "bg-white hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      );
    };

    // First page
    pushPage(1);

    // Ellipsis before middle pages
    if (currentPage - delta > 2) {
      pages.push(<span key="start-ellipsis">...</span>);
    }

    // Middle pages
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pushPage(i);
    }

    // Ellipsis after middle pages
    if (currentPage + delta < totalPages - 1) {
      pages.push(<span key="end-ellipsis">...</span>);
    }

    // Last page
    if (totalPages > 1) pushPage(totalPages);

    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-6 gap-2">
      {/* Prev Button */}
      <Button
        variant="secondary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex"
      >
        <ArrowLeft className="w-4" /> Prev
      </Button>

      {/* Page Numbers */}
      {getPageNumbers()}

      {/* Next Button */}
      <Button
        variant="secondary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex"
      >
        Next <ArrowRight className="w-4" />
      </Button>
    </div>
  );
}
