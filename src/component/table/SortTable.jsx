import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TableHeader from '../table/TableHeader';
import { Switch } from '@mui/material';
import OrderDetail from '../order/OrderDetails';

const SortTable = ({
  products,
  onSort,
  columns,
  openDetailModal,
  openEditModal,
  openDeleteModal,
  onProductSelect,
  tableName,
  openEnableModal,
  orderStatus,
  handleDetail,
  open,
  orderDetails,
  headCells,
  handleEdit,
  productByStock,
  setLoading

}) => {
  const [sort, setSort] = useState({ key: null, direction: 'ascending' });
  const [category, setCategory] = useState([]);
  const [productStatus, setProductStatus] = useState({});

  const tableNeedSwitch = ["user", "user_disable"];
  console.log("gg",productByStock);
  

 



  useEffect(() => {
    const fetchCategory = async () => {
      const response = await axios.get('/api/service/categories');
      console.log('category', response.data);
      setCategory(response.data);
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const initialStatus = products.reduce((acc, product) => {
      acc[product.id] = true;
      return acc;
    }, {});
    setProductStatus(initialStatus);
  }, [products]);



  const handleSwitchChange = (id) => {
    setProductStatus((prevStatus) => ({
      ...prevStatus,
      [id]: !prevStatus[id],
    }));
    if (openEnableModal) {
      openEnableModal(id);
    }
  };

  const sortData = (key) => {
    let direction = 'ascending';

    if (sort.key === key && sort.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedArray = [...products].sort((a, b) => {
      let valueA, valueB;
      if (key === 'categoryName') {
        const categoryA = category.find((item) => item.id === a.categoryId);
        const categoryB = category.find((item) => item.id === b.categoryId);
        valueA = categoryA ? categoryA.name : '';
        valueB = categoryB ? categoryB.name : '';
      } else {
        valueA = a[key];
        valueB = b[key];
      }

      if (valueA < valueB) return direction === 'ascending' ? -1 : 1;
      if (valueA > valueB) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setSort({ key, direction });
    onSort(sortedArray);
  };

  const handleRowClick = (product) => {
    onProductSelect(product);
  };


  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table table-striped table-hover">
        <TableHeader
          columns={columns}
          sortData={sortData}
          activeSortKey={sort.key}
          sortOrder={sort.direction}
        />
        <tbody>
          {products.map((product, index) => (
            <tr key={index} onClick={() => handleRowClick(product)}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.key === 'image' ? (
                    product.image ? (
                      <img
                        src={product.image}
                        alt="Product"
                        style={{ width: '100px', height: 'auto' }}
                      />
                    ) : (
                      <span>No image</span>
                    )
                  ) : column.key === 'logo' ? (
                    product.logo ? (
                      <div style={{ width: "80px" }}> <img
                        src={product.logo}
                        alt="Product"
                        style={{ width: '100px', height: 'auto' }}
                      /></div>
                    ) : (
                      <span>No image</span>
                    )
                  ) : column.key === 'id' ? (
                    index + 1
                  ) : column.key === 'price' ? (
                    <p>{product.price}$</p>
                  ) : column.key === 'categoryName' ? (
                    category &&
                    (() => {
                      const foundCategory = category.find(
                        (item) =>
                          product.categoryId.toString() ===
                          item.id.toString()
                      );
                      return foundCategory
                        ? foundCategory.name
                        : 'Uncategorized';
                    })()
                  ) : column.key === 'totalPrice' ? (
                    `${product.totalPrice.toFixed(2)}$`
                  ): column.key === 'percentage' ? (
                    `${product[column.key]}%`
                  )
                   : (
                    product[column.key]
                  )}
                </td>
              ))}
              <td>
                {tableName !== "order" && tableName!=="stock" && tableName!=="review"? (<ul className="list-inline m-0 d-flex justify-content-end">
                  {tableNeedSwitch.includes(tableName) && <li className="list-inline-item">
                    <Switch
                      checked={tableName === "user_disable" ? false : true}
                      onChange={() => handleSwitchChange(product.id)}
                    />
                  </li>}
                    {tableName !== "discount" &&(
                        <li className="list-inline-item" onClick={openDetailModal}>
                        <button
                          className="btn btn-primary btn-sm rounded-0"
                          type="button"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="View"
                        >
                          <i className="fa fa-table"></i>
                        </button>
                      </li>
                    )}
                  <li className="list-inline-item" onClick={openEditModal}>
                    <button
                      className="btn btn-success btn-sm rounded-0"
                      type="button"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Edit"
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                  </li>
                  {tableName !== 'user' && (
                    <li className="list-inline-item" onClick={openDeleteModal}>
                      <button
                        className="btn btn-danger btn-sm rounded-0"
                        type="button"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </li>
                  )}
                </ul>) : (
                  (tableName === "order" || tableName==="stock" || tableName==="review")  && (
                    <ul style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 0, paddingLeft: 0 }}>

                      <li className="list-inline-item" onClick={() => handleDetail()}>
                        <button
                          className="btn btn-primary"
                          type="button"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Pending"
                        >
                          <span><a  style={{ margin: "0", fontSize: "15px", fontWeight: "500" }}>View</a></span>
                        </button>
                      </li>
                    </ul>
                  )
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {open && <OrderDetail productId={productByStock}setLoading={setLoading} edit={openEditModal} open={open} handleDetail={handleDetail} orderDetails={orderDetails} headCells={headCells} tableName={tableName} handleEdit={handleEdit} selectedStock={productByStock} />}
    </div>

  );
};

export default SortTable;

