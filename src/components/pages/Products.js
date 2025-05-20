import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Button from '../common/Button';
import Modal from '../common/Modal';
// ????
import API from '../../services/API';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' hoặc 'edit'

// ????
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState(null);

   // Lấy dữ liệu sản phẩm từ API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/products');
      console.log('Dữ liệu sản phẩm:', response.data);
      
      // Xác định trạng thái dựa trên stock_quantity và min_stock_level
      const processedProducts = response.data.map(product => ({
        ...product,
      // Nếu API trả về trường status, chúng ta vẫn giữ lại để tương thích với backend
      computed_status: determineStatus(product.stock_quantity, product.min_stock_level)
    }));

      setProducts(processedProducts);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
      setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh mục sản phẩm
  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  };

  // Load dữ liệu khi component được mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchTerm) {
        const response = await API.get(`/products/search`, {
          params: { keyword: searchTerm }
        });
        setProducts(response.data);
      } else {
        // Nếu không có từ khóa, lấy tất cả sản phẩm
        fetchProducts();
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error);
      setError('Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý lọc theo danh mục
  const handleCategoryFilter = async (categoryId) => {
    setCategoryFilter(categoryId);
    
    try {
      setLoading(true);
       if (categoryId) {
        const response = await API.get(`/products/categories/${categoryId}`);
        setProducts(response.data);
      } else {
        // Nếu không chọn danh mục, lấy tất cả sản phẩm
        fetchProducts();
      }
    } catch (error) {
      console.error('Lỗi khi lọc theo danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý lọc theo trạng thái
  const handleStatusFilter = async (status) => {
    try {
      setLoading(true);
      if (status) {
        const response = await API.get(`/products/status/${status}`);
        setProducts(response.data);
      } else {
        // Nếu không chọn trạng thái, lấy tất cả sản phẩm
        fetchProducts();
      }
    } catch (error) {
      console.error('Lỗi khi lọc theo trạng thái:', error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm sản phẩm mới
  const handleAddProduct = () => {
    setModalMode('add');
    setSelectedProduct({
      name: '',
      sku: '',
      category_id: '',
      selling_price: '',
      cost_price: '',
      description: '',
      supplier: '',
      stock_quantity: 0,
      status: 'active',
      unit_of_measure: 'Cái',
      min_stock_level: 10,
      max_stock_level: 100,
    });
    setShowModal(true);
  };

  // Chỉnh sửa sản phẩm
  const handleEditProduct = (product) => {
    // Chuyển đổi để đảm bảo trường selling_price/cost_price
    const mappedProduct = {
      ...product,
      selling_price: product.selling_price ,
      cost_price: product.cost_price
    };

    setModalMode('edit');
    setSelectedProduct(mappedProduct);
    setShowModal(true);
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (productId) => {
    // Thêm xác nhận xóa sản phẩm
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await API.delete(`/products/${productId}`);
        // Cập nhật lại danh sách sản phẩm
        fetchProducts();
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Xóa sản phẩm không thành công. Vui lòng thử lại.');
      }
    }
  };

  // Lưu sản phẩm (thêm mới hoặc cập nhật)
  const handleSaveProduct = async (formData) => {
    try {
    // Điều chỉnh dữ liệu để khớp với yêu cầu API backend
    const productData = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        category_id: formData.category_id,
        //selling_price/cost_price
        selling_price: parseFloat(formData.selling_price || 0),
        cost_price: parseFloat(formData.cost_price || 0),
        min_stock_level: parseInt(formData.min_stock_level || 0),
        max_stock_level: parseInt(formData.max_stock_level || 0),
        unit_of_measure: formData.unit_of_measure,
        supplier: formData.supplier
    };


      if (modalMode === 'add') {
        await API.post('/products', productData);
      } else {
        await API.put(`/products/${formData.product_id}`, productData);
      }
      
      setShowModal(false);
      fetchProducts(); // Cập nhật lại danh sách sản phẩm
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
      alert('Lưu sản phẩm không thành công. Vui lòng thử lại.');
    }
  };

  // Chuyển đổi trạng thái thành giá trị tương ứng cho UI
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'active': return 'Còn hàng';
      case 'outofstock': return 'Hết hàng';
      default: return status;
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'STT',
        Cell: ({ row }) => {
            return <span>{row.index + 1}</span>
        },
        width: 60,
      },
      {
        Header: 'Tên Sản phẩm',
        accessor: 'name',
        Cell: ({ row }) => (
          <div>
            <div className="text-sm font-medium text-gray-900">{row.original.name}</div>
            <div className="text-sm text-gray-500">SKU: {row.original.sku}</div>
          </div>
        )
      },
      {
        Header: 'Danh mục',
        accessor: 'category_name',
      },
      {
        Header: 'Giá bán',
        accessor: 'selling_price',
        Cell: ({ value }) => formatCurrency(value)
      },
      {
        Header: 'Giá vốn',
        accessor: 'cost_price',
        Cell: ({ value }) => formatCurrency(value)
      },
      {
        Header: 'Nhà cung cấp',
        accessor: 'supplier',
      },
      {
        Header: 'Trạng thái',
        accessor: 'status',
        Cell: ({ value }) => (
          <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {getStatusDisplay(value)}
        </span>
        )
      },
      {
        Header: 'Thao tác',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditProduct(row.original)}
              className="text-blue-600 hover:text-blue-900"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDeleteProduct(row.original.product_id)}
              className="text-red-600 hover:text-red-900"
            >
              <FaTrash />
            </button>
          </div>
        )
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
      data: products,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  if (loading) return <div className="text-center py-10">Đang tải dữ liệu sản phẩm...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Quản lý Sản phẩm</h2>
          <Button 
            onClick={handleAddProduct} 
            variant="primary"
            className="flex items-center"
          >
            <FaPlus className="mr-1" /> Thêm sản phẩm
          </Button>
        </div>
        
        {/* Bộ lọc */}
        <div className="my-4 flex flex-wrap gap-4">
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700">Tìm kiếm</label>
            <div className="mt-1 flex">
              <input 
                type="text" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                placeholder="Tên sản phẩm, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch}
                variant="secondary" 
                className="ml-2"
              >
                Tìm
              </Button>
            </div>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700">Danh mục</label>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => {
                  const status = e.target.value;
                  setStatusFilter(status);
                  handleStatusFilter(status);
                }}
            >
              <option value="">Tất cả</option>
              <option value="instock">Còn hàng</option>
              <option value="outofstock">Hết hàng</option>
            </select>
          </div>
        </div>
        
        {/* Bảng sản phẩm */}
        <div className="overflow-x-auto mt-6">
          <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
        <thead>
          {headerGroups.map(headerGroup => {
            const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...headerGroupProps}>
                {headerGroup.headers.map(column => {
                  const { key: headerKey, ...headerProps } = column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th
                      key={headerKey}
                      {...headerProps}
                      className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={column.width ? { width: column.width } : {}}
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
                  );
                })}
              </tr>
            );
          })}
        </thead>
            <tbody {...getTableBodyProps()}>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                    Không có sản phẩm nào
                  </td>
                </tr>
              ) : (
                page.map(row => {
                  prepareRow(row);
                  const { key, ...rowProps } = row.getRowProps();
                  return (
                    <tr key={key} {...rowProps} className="hover:bg-gray-50">
                      {row.cells.map(cell => {
                        const { key: cellKey, ...cellProps } = cell.getCellProps();
                        return (
                          <td
                            key={cellKey}
                            {...cellProps}
                            className="px-6 py-4 whitespace-nowrap border-b border-gray-200"
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Phân trang */}
        <div className="py-3 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              variant="outline"
            >
              Trước
            </Button>
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              variant="outline"
            >
              Sau
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex gap-x-2 items-center">
              <span className="text-sm text-gray-700">
                Trang <span className="font-medium">{pageIndex + 1}</span> / {pageOptions.length || 1}
              </span>
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

      {/* Modal thêm/sửa sản phẩm */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
      >
        {selectedProduct && (
          <form 
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProduct(selectedProduct);
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedProduct.name || ''}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedProduct.sku || ''}
                  onChange={(e) => setSelectedProduct({...selectedProduct, sku: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedProduct.category_id || ''}
                  onChange={(e) => setSelectedProduct({...selectedProduct, category_id: e.target.value})}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Giá bán (VNĐ)</label>
                <input 
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedProduct.selling_price || ''}
                  onChange={(e) => setSelectedProduct({...selectedProduct, selling_price: e.target.value})}
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Giá vốn (VNĐ)</label>
                <input 
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedProduct.cost_price || ''}
                  onChange={(e) => setSelectedProduct({...selectedProduct, cost_price: e.target.value})}
                  required
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nhà cung cấp</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedProduct.supplier || ''}
                onChange={(e) => setSelectedProduct({...selectedProduct, supplier: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mức tồn kho tối thiểu</label>
                <input 
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedProduct.min_stock_level || 0}
                  onChange={(e) => setSelectedProduct({...selectedProduct, min_stock_level: e.target.value})}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mức tồn kho tối đa</label>
                <input 
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedProduct.max_stock_level || 0}
                  onChange={(e) => setSelectedProduct({...selectedProduct, max_stock_level: e.target.value})}
                  min="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Đơn vị tính</label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedProduct.unit_of_measure || 'Cái'}
                  onChange={(e) => setSelectedProduct({...selectedProduct, unit_of_measure: e.target.value})}
                >
                  <option value="Cái">Cái</option>
                  <option value="Chiếc">Chiếc</option>
                  <option value="Hộp">Hộp</option>
                  <option value="Bộ">Bộ</option>
                  <option value="Kg">Kg</option>
                  <option value="Gói">Gói</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedProduct.status || 'active'}
                  onChange={(e) => setSelectedProduct({...selectedProduct, status: e.target.value})}
                >
                  <option value="active">Còn hàng</option>
                  <option value="outofstock">Hết hàng</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea 
                rows="3" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedProduct.description || ''}
                onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                {modalMode === 'add' ? 'Thêm sản phẩm' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};


export default Products;