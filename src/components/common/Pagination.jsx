import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onPreviousPage, 
  onNextPage,
  itemsPerPage,
  totalItems,
  showItemsInfo = true 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getItemsInfo = () => {
    if (!showItemsInfo || !totalItems) return null;
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return `Showing ${startItem}-${endItem} of ${totalItems} items`;
  };

  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      {/* Items Info */}
      {showItemsInfo && totalItems && (
        <div className="pagination-info">
          <span className="items-info">{getItemsInfo()}</span>
        </div>
      )}

      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          className={`pagination-btn prev-btn ${
            currentPage === 1 ? "disabled" : ""
          }`}
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          Previous
        </button>

        {/* Page Numbers */}
        <div className="page-numbers">
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              className={`pagination-btn page-btn ${
                currentPage === pageNum ? "active" : ""
              }`}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          className={`pagination-btn next-btn ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
