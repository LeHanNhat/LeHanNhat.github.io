import React, { useEffect, useState } from "react";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Delete from "../../component/action/Delete";
import SortTable from "../../component/table/SortTable";
import { Switch } from "@mui/material";
import Paging from "../../component/table/Paging";
import { getProductByPage } from "../../component/services/productService";
import "../product/ProductManagement.css";
import { useRef } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedProduct, setselectedProduct] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setDetailModal] = useState(false);
  const [checkStatus, setCheckStatus] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [listOfSizes, setListOfSizes] = useState([]);
  const [listOfColors, setListOfColors] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("No file chosen");
  const [originalFile, setOriginalFile] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("No file chosen");
  const fileInputRef = useRef(null);
  let formData = new FormData();
  console.log(selectedFileName);


  const colors = ["blue", "red", "yellow", "white", "black"]
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const handlePickSizeAndColor = (choose, setList) => {
    setList((list) => {
      const existPick = list.includes(choose);
      if (!existPick) {
        return [...list, choose]
      }
      return list.filter((c) => c !== choose);
    });
  }

  const handleSort = (sortedArray) => {
    setProducts(sortedArray);
  };
  const fetchProductByPage = async () => {
    const result = await getProductByPage(page, 10);
    if (totalPages === 0) {
      setTotalPages(result.totalPages);
    }
    setProducts(result.data);
  }
  useEffect(() => { setTotalPages(totalPages) }, [totalPages])
  useEffect(() => {
    fetchProductByPage();
  }, [page])
  const productColumns = [
    { key: "id", label: "No." },
    { key: "image", label: "Image" },
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    // { key: "sale", label: "Sale" },
    { key: "rating", label: "Rating" },
  ];
  const handleChangeStaus = () => {
    setCheckStatus(!checkStatus);
  }
  useEffect(() => {
    fetchProductByPage();
    const fetchBrand = async () => {
      const response = await axios.get("/api/service/brands");

      setBrand(response.data);
    };
    const fetchCategory = async () => {
      const response = await axios.get("/api/service/categories");
      setCategory(response.data);
    };
    const fetchSub = async () => {
      const response = await axios.get("/api/service/subcategories");
      setSubcategories(response.data);
    };
    fetchBrand();
    fetchCategory();
    fetchSub();
  }, [loading]);
  const openDetailModal = async () => {
    setDetailModal(true);
    try {
      const response = await axios.get(
        `/api/service/products/${selectedProduct.id}`
      );
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };
  const closeDetailModal = () => setDetailModal(false);
  const openAddModal = () => {
    // setselectedProduct(prevProduct => ({
    //   ...prevProduct,
    //   image: null
    // }));
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = () => {
    setShowEditModal(true);
    setListOfSizes(selectedProduct.sizes || []);
    setListOfColors(selectedProduct.colors || []);

    // Store the original file and file name
    if (selectedProduct.image) {
      const imagePath = selectedProduct.image;
      const fileName = imagePath.split('/').pop(); // Get last part of path
      setSelectedFileName(fileName || "No file chosen");
      setOriginalFileName(fileName || "No file chosen");
    } else {
      setSelectedFileName("No file chosen");
      setOriginalFileName("No file chosen");
    }
    setOriginalFile(file); // Store the original file
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    // Reset to the original file and file name
    setFile(originalFile);
    setSelectedFileName(originalFileName);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handlePage = (numberOfPage) => {
    setPage(numberOfPage)
  }
  const closeDeleteModal = () => setShowDeleteModal(false);
  const addFile = (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setFile(newFile);
      setSelectedFileName(newFile.name); // Store the file name
      const imageUrl = URL.createObjectURL(newFile);
      setselectedProduct(prevProduct => ({
        ...prevProduct,
        image: imageUrl
      }));
    }
  };

  const handleAddproduct = async (e) => {
    e.preventDefault();
    const newproduct = {
      brandId: e.target.brandId.value,
      categoryId: e.target.categoryId.value,
      name: e.target.name.value,
      image: e.target.image.value,
      price: e.target.price.value,
      sale: true,
      rating: e.target.rating.value,
      subcategoryId: e.target.subcategory.value,
      sizes: listOfSizes,
      colors: listOfColors
    };

    console.log("newnew", newproduct);


    const product = new Blob([JSON.stringify(newproduct)], {
      type: "application/json",
    });
    formData.append("product", product);
    // Only append file if a file exists
    if (file) {
      formData.append("file", file);
    }
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      const response = await axios.post("/api/service/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      if (response.data) {
        toast.success("Product is added successfully!");
      }
      setLoading(true);
      closeAddModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditproduct = async (e) => {
    e.preventDefault();
    const updateproduct = {
      ...selectedProduct,
      brandId: e.target.brandId.value,
      categoryId: e.target.categoryId.value,
      name: e.target.name.value,
      image: e.target.image.value,
      price: e.target.price.value,
      sale: true,
      rating: e.target.rating.value,
      subcategoryId: e.target.subcategory.value,
      sizes: listOfSizes,
      colors: listOfColors
    };
    console.log("send", updateproduct);

    const editProduct = new Blob([JSON.stringify(updateproduct)], {
      type: "application/json",
    });
    formData.append("product", editProduct);
    if (file) {
      formData.append("file", file);
    }
    try {
      const response = await axios.put(
        `/api/service/products/${selectedProduct.id}`, formData
      );
      if (response.data) {
        console.log("check update", response.data);
        setProducts(
          products.map((emp) =>
            emp.id === selectedProduct.id
              ? (response.data) : (emp)
          )
        );
        toast.success("Product is edited successfully!");
        closeEditModal();
      }

    } catch (error) {
      console.log(error);
    }
  };
  const handleProductSelect = (product) => {
    setselectedProduct(product);
  };

  const handleDeleteproduct = async () => {
    try {
      const response = await axios.delete(
        `/api/service/products/${selectedProduct.id}`
      );
      toast.success("Product is deleted successfully!");
      console.log("after delete", response.data);
    } catch (error) {
      console.log(error);
    }
    setProducts(products.filter((emp) => emp.id !== selectedProduct.id));
    closeDeleteModal();
  };

  return (
    <div className="container-xl">
      <div className="table-responsive">
        <ToastContainer />
        <h1 style={{ textAlign: "center", marginBottom: "12px" }}>
          Product Management
        </h1>
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6"></div>
              <div
                className="col-sm-6"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div class="input-group">
                  <input
                    type="search"
                    class="form-control rounded"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="search-addon"
                  />
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-mdb-ripple-init
                  >
                    <i class="fas fa-search"></i>
                  </button>
                </div>
                <div
                  class="input-group"
                  style={{
                    width: "340px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <button
                    onClick={openAddModal}
                    type="button"
                    class="btn btn-primary btn-sm"
                  >
                    <i className="material-icons">&#xE147;</i> <span>Add</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal()}
                    type="button"
                    class="btn btn-danger btn-sm"
                    style={{ marginLeft: "10px" }}
                  >
                    <i className="material-icons">&#xE15C;</i>{" "}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <SortTable
            products={products}
            onSort={handleSort}
            columns={productColumns}
            openDetailModal={openDetailModal}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            onProductSelect={handleProductSelect}
          />
        </div>
        {totalPages > 0 ? (<Paging handlePage={handlePage} totalPages={totalPages} selectedPage={page} />) : (<p>Loading...</p>)}
      </div>

      {showAddModal && (
        <div
          className="modal fade show "
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add Product
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={closeAddModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddproduct}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="name"
                      name="name"
                      className="form-control"
                      id="name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input
                      onChange={addFile}
                      type="file"
                      name="image"
                      className="form-control"
                      id="image"
                      required
                    />
                    {selectedProduct.image && (
                      <div style={{ width: "80px" }}>
                        {" "}
                        <img
                          style={{ maxWidth: "100%" }}
                          src={selectedProduct.image}
                          alt=""
                        />
                      </div>
                    )}

                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      type="text"
                      name="price"
                      className="form-control"
                      id="price"
                      required
                    />
                  </div>
                  {/* <div className="form-group">
                    <label htmlFor="sale">Sale</label>
                    <Switch value={checkStatus} name="sale" onChange={handleChangeStaus}/>
                  </div> */}
                  <div className="form-group">
                    <label htmlFor="rating">Rating</label>
                    <input
                      type="text"
                      name="rating"
                      className="form-control"
                      id="rating"
                      required
                    />
                  </div>
                  {/* <div className="form-group">
                    <label htmlFor="stockQuantity">Stock Quantity</label>
                    <input
                      type="text"
                      name="stockQuantity"
                      className="form-control"
                      id="stockQuantity"
                      required
                    />
                  </div> */}
                  <div className="form-group">
                    <label htmlFor="brandId">Brand</label>
                    {brand && (
                      <select
                        class="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        name="brandId"
                      >
                        <option selected value="">
                          Choose Brand
                        </option>
                        {brand.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="categoryId">Category</label>
                    {category && (
                      <select
                        class="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        name="categoryId"
                        onChange={(e) => {
                          setselectedProduct({
                            ...selectedProduct,
                            categoryId: e.target.value,
                          });
                        }}
                        value={selectedProduct.categoryId}
                      >
                        {" "}
                        <option selected value="">
                          Choose Category
                        </option>
                        {category.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="subcategory">Subcategory</label>
                    {subcategories && (
                      <select
                        className="form-select"
                        aria-label="Disabled select example"
                        disabled={!selectedProduct.categoryId}
                        name="subcategory"
                      >
                        <option selected value="">
                          Choose Subcategory
                        </option>
                        {subcategories.map((item, index) => {
                          if (
                            item.categoryId.toString() ===
                            selectedProduct.categoryId
                          ) {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          }
                        })}
                      </select>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="sizeIds">Size</label>
                    <div class="size-options">
                      {sizes &&
                        sizes.map((item, index) => (
                          <label class="size-option" >
                            <input type="checkbox" name="size" value={item} onChange={() => handlePickSizeAndColor(item, setListOfSizes)} />
                            <span style={{
                              backgroundColor: listOfSizes.includes(item) ? "black" : "white",
                              color: listOfSizes.includes(item) ? "white" : "black",
                            }}>{item}</span>
                          </label>

                        ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="sizeIds">Color</label>
                    <div class="size-options">
                      {colors &&
                        colors.map((item) => (
                          <label class="size-option">
                            <input type="checkbox" style={{ color: item }} name="color" value={item} onChange={() => handlePickSizeAndColor(item, setListOfColors)} />
                            <div className="colorPicker" style={{
                              backgroundColor: item,
                              border: listOfColors.includes(item) ? "3px solid green" : ""
                            }}></div>
                          </label>

                        ))}
                    </div>
                  </div>
                  {/* colorIds:e.target.colorIds.value */}
                  <div
                    className="d-flex justify-content-between"
                    style={{ marginTop: "20px" }}
                  >
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeAddModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && (
        <div
          class="modal show bd-example-modal-lg"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myLargeModalLabel"
        >
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <table
                cellPadding={10}
                border={1}
                className="modalDetail table table-bordered "
              >
                <tr>
                  {/* <th>ID</th> */}
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Rating</th>
                  {/* <th>Sale</th> */}
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Subcategory</th>

                  <th></th>
                </tr>
                <tr>
                  {/* <td>{selectedProduct.id}</td> */}
                  <td>{selectedProduct.name}</td>
                  <td>
                    <div style={{ width: "80px" }}>
                      {" "}
                      <img
                        style={{ maxWidth: "100%" }}
                        src={selectedProduct.image}
                        alt=""
                      />
                    </div>
                  </td>
                  <td>{selectedProduct.price}</td>
                  <td>{selectedProduct.rating}</td>
                  {/* <td><img src={<Check/>} alt="" style={{ maxWidth: "100%", height: "100%", borderRadius: "50%" }} /></td> */}
                  <td>{selectedProduct.stockQuantity}</td>
                  <td>{category && category.map((cat) => {
                    if (cat.id === selectedProduct.categoryId) {
                      return cat.name;
                    }
                  })}</td>
                  <td>{subcategories && subcategories.map((sub) => {
                    if (sub.id === selectedProduct.subcategoryId) {
                      return sub.name;
                    }
                  })}</td>
                  <td></td>

                  <td>
                    <button
                      onClick={closeDetailModal}
                      class="btn btn-danger btn-sm rounded-0"
                      type="button"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete"
                    >
                      X
                    </button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div
          className="modal fade show "
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={closeEditModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditproduct}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="name"
                      name="name"
                      className="form-control"
                      id="name"
                      defaultValue={selectedProduct.name}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={selectedFileName}
                        readOnly
                        onClick={() => fileInputRef.current.click()}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                        >
                          Browse
                        </button>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="custom-file-input"
                      id="image"
                      name="image"
                      onChange={addFile}
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                    />
                    {/* Image preview */}
                    {selectedProduct.image && (
                      <div style={{ width: "80px", marginTop: "10px" }}>
                        <img
                          style={{ maxWidth: "100%" }}
                          src={selectedProduct.image}
                          alt="Selected"
                        />
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      type="text"
                      name="price"
                      className="form-control"
                      id="price"
                      defaultValue={selectedProduct.price}
                      required
                    />
                  </div>
                  {/* <div className="form-group">
                    <label htmlFor="sale">Sale</label>
                    <input
                      type="text"
                      name="sale"
                      className="form-control"
                      id="sale"
                      defaultValue={selectedProduct.sale}
                      required
                    />
                  </div> */}
                  <div className="form-group">
                    <label htmlFor="rating">Rating</label>
                    <input
                      type="text"
                      name="rating"
                      className="form-control"
                      id="rating"
                      defaultValue={selectedProduct.rating}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="brandId">Brand</label>
                    {brand && (
                      <select
                        className="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        name="brandId"
                        value={selectedProduct.brandId}
                        onChange={(e) => {
                          setselectedProduct({
                            ...selectedProduct,
                            brandId: e.target.value,
                          });
                        }}
                      >
                        {brand.map((item, index) => {
                          if (item.id === selectedProduct.brandId) {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          }
                          return (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="brandId">Category</label>
                    {category && (
                      <select
                        className="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        name="categoryId"
                        value={selectedProduct.categoryId}
                        onClick={(e) => {
                          setselectedProduct({
                            ...selectedProduct,
                            categoryId: e.target.value,
                          });
                        }}
                        onChange={(e) => {
                          setselectedProduct({
                            ...selectedProduct,
                            categoryId: e.target.value,
                          });
                        }}
                      >
                        {category.map((item, index) => {
                          if (item.id === selectedProduct.categoryId) {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          }
                          return (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="subcategory">Subcategory</label>
                    {subcategories && (
                      <select
                        className="form-select"
                        aria-label="Disabled select example"
                        disabled={!selectedProduct.categoryId}
                        name="subcategory"
                        value={selectedProduct.subcategoryId || ""}
                        onChange={(e) => {
                          setselectedProduct({
                            ...selectedProduct,
                            subcategoryId: e.target.value,
                          });
                        }}
                      >
                        {/* {subcategories.map((item, index) => {
                          if (item.id === selectedProduct.categoryId) {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          }
                          return (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })} */}
                        {subcategories
                          .filter(
                            (item) =>
                              item.categoryId.toString() ===
                              selectedProduct.categoryId
                          )
                          .map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="sizeIds">Size</label>
                    <div class="size-options">
                      {sizes &&
                        sizes.map((item, index) => (
                          <label class="size-option" >
                            <input type="checkbox" name="size" value={item} onChange={() => handlePickSizeAndColor(item, setListOfSizes)} />
                            <span style={{
                              backgroundColor: listOfSizes.includes(item) ? "black" : "white",
                              color: listOfSizes.includes(item) ? "white" : "black",
                            }}>{item}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="sizeIds">Color</label>
                    <div class="size-options">
                      {colors &&
                        colors.map((item, index) => (
                          <label class="size-option">
                            <input type="checkbox" style={{ color: item }} name="color" value={item} onChange={() => handlePickSizeAndColor(item, setListOfColors)} />
                            <div className="colorPicker" style={{
                              backgroundColor: item,
                              border: listOfColors.includes(item) ? "3px solid green" : ""
                            }}></div>
                          </label>
                        ))}
                    </div>
                  </div>

                  <div
                    className="d-flex justify-content-between"
                    style={{ marginTop: "20px" }}
                  >
                    <button type="submit" className="btn btn-primary">
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeEditModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <Delete
          closeDeleteModal={closeDeleteModal}
          selectedProduct={selectedProduct}
          handleDeleteproduct={handleDeleteproduct}
          table={"product"}
        />
      )}
    </div>
  );
};

export default ProductManagement;
