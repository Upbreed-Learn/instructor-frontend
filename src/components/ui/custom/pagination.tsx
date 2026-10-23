import type { Dispatch, SetStateAction } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../pagination';
import { cn } from '@/lib/utils';

const PaginationSection = (props: {
  currentPage: number;
  totalPages?: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  const { currentPage, totalPages = 0, setCurrentPage } = props;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show page 1, 2, 3
    for (let i = 1; i <= 3; i++) {
      if (i <= totalPages) {
        pageNumbers.push(i);
      }
    }

    // Always show the last 3 pages
    for (let i = totalPages - 2; i <= totalPages; i++) {
      if (i > 3 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // One page (or none): no pagination at all.
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (<PaginationItem>
          <PaginationPrevious
            onClick={handlePreviousPage}
            className={cn(
              'cursor-pointer',
              currentPage === 1 && 'cursor-not-allowed opacity-50',
            )}
          />
        </PaginationItem>)}
        <span className="flex items-center gap-2 md:gap-4">
          {pageNumbers.map((page, index) => {
            return (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={e => {
                    e.preventDefault();
                    handlePageChange(page as number);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        </span>
        {currentPage < totalPages && (<PaginationItem>
          <PaginationNext
            onClick={handleNextPage}
            className={cn(
              'cursor-pointer',
              currentPage === totalPages && 'cursor-not-allowed opacity-50',
            )}
          />
        </PaginationItem>)}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;
