import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { fetchInventory, updateStock } from '../../services/inventoryService';
import Button from '../common/Button';
import Modal from '../common/Modal';
import StockUpdateForm from '../forms/StockUpdateForm';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const getInventory = async () => {
      try {
        setLoading(true);
        const response = await fetchInventory();
        setInventory(response.data);
      } catch (err) {
        setError('Failed to fetch inventory data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getInventory();
  }, []);

  const handleUpdateStock = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Product',
        accessor: 'productName',
      },
      {
        Header: 'SKU',
        accessor: 'sku',
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              value === 'In Stock'
                ? 'bg-green-100 text-green-800'
                : value === 'Low Stock'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button
              onClick={() => handleUpdateStock(row.original)}
              variant="primary"
              size="sm"
            >
              Update Stock
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: inventory,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const submitStockUpdate = async (data) => {
    try {
      await updateStock(selectedItem.id, data);
      // Refresh inventory data
      const response = await fetchInventory();
      setInventory(response.data);
      setShowModal(false);
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading inventory data...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">Inventory Management</h2>
          <Button variant="success">Add New Item</Button>
        </div>
        
        <div className="overflow-x-auto mt-6">
          <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' ▼'
                            : ' ▲'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-50">
                    {row.cells.map(cell => (
                      <td
                        {...cell.getCellProps()}
                        className="px-6 py-4 whitespace-nowrap border-b border-gray-200"
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="py-3 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              variant="outline"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex gap-x-2 items-center">
              <span className="text-sm text-gray-700">
                Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
                <span className="font-medium">{pageOptions.length}</span>
              </span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                }}
                className="text-sm border-gray-300 rounded"
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <nav className="flex items-center">
                <button
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                  className="px-2 py-1 text-sm font-medium text-gray-500 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  {'<<'}
                </button>
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className="px-2 py-1 mx-1 text-sm font-medium text-gray-500 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  {'<'}
                </button>
                <button
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className="px-2 py-1 mx-1 text-sm font-medium text-gray-500 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  {'>'}
                </button>
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                  className="px-2 py-1 text-sm font-medium text-gray-500 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  {'>>'}
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Update Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Update Stock Quantity"
      >
        {selectedItem && (
          <StockUpdateForm
            item={selectedItem}
            onSubmit={submitStockUpdate}
            onCancel={() => setShowModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Inventory;