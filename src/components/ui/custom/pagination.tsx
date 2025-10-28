import type { Dispatch, SetStateAction } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../pagination';
// import { cn } from '@/lib/utils';

const PaginationSection = (props: {
  currentPage: number;
  totalPages?: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  const { currentPage, totalPages = 10, setCurrentPage } = props;
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

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
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
                  //   className={cn(
                  //     'h-[2.125rem] w-[2.375rem] rounded-lg border-none text-sm leading-[100%] font-medium text-[#535862] hover:bg-[#151515] hover:text-[#FAFAFF] md:size-12 md:text-lg',
                  //     currentPage === page &&
                  //       'border-none text-[#FAFAFF] md:bg-[#151515]',
                  //   )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        </span>
        {/* <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;
