'use client'
import React, { useState } from 'react';
import { RiPencilFill, RiDeleteBinFill } from 'react-icons/ri';
import formatNumberWithDot from '@/utils/formatNumber';

interface TableProps<T> {
  columns: String[];
  data: T[];
  ud?: boolean;
  handleUpdateClick?: (row: T) => void;
  handleDeleteClick?: (row: T) => void; // Add delete handler prop
}

const Table = <T extends Record<string, any>>(props: TableProps<T>) => {
  const { columns, data, ud, handleUpdateClick, handleDeleteClick } = props;
  const [currentPage, setCurrentPage] = useState(1);

  // Function to handle delete action
  const handleDelete = (row: T) => {
    if (handleDeleteClick) {
      handleDeleteClick(row);
    }
  };
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        {/* Column */}
        <thead className="bg-primary text-white">
          <tr>
            {columns.map((column) => (
              <th
                key={Object.keys(column)[0]}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase"
              >
                {column.replaceAll("_", " ")}
              </th>
            ))}
            {ud && <th className="px-6 py-3 text-left text-xs font-medium uppercase">Action</th>}
          </tr>
        </thead>
        {/* Rows */}
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  className="px-6 py-4"
                >
                  {Object.keys(column)[0].toLowerCase().includes('harga') || Object.keys(column)[0].toLowerCase().includes('total_price') ? `Rp${formatNumberWithDot(row[Object.keys(column)[0]])}` : (
                    Object.keys(column)[0].toLowerCase() === 'payment_proof' && typeof row[Object.keys(column)[0]] === 'string' ? (
                      <img src={JSON.parse(row[Object.keys(column)[0]]).url} alt="Lapangan" className="w-20 h-20 max-w-full" />
                    ) : (
                      row[Object.keys(column)[0]]
                    )
                  )}
                </td>
              ))}
              {ud && (
                <td className="px-6 py-12 whitespace-nowrap flex gap-4 justify-center">
                  {handleUpdateClick && (
                    <RiPencilFill
                      className="cursor-pointer text-blue-500 hover:text-blue-700"
                      onClick={() => handleUpdateClick(row)}
                    />
                  )}
                  <RiDeleteBinFill
                    className="cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(row)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buttons */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mr-2 text-primary rounded-md"
        >
          Previous
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-primary text-white' : 'border-2 border-primary text-primary'
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 ml-2 text-primary rounded-md"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Table;
