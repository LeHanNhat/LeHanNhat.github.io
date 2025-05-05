import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import "../../section/product/ProductManagement.css";

const Add = ({ onProductAdded }) => {
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedProduct, setselectedProduct] = useState({});
  const addFile = (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/service/products");
      console.log("check product", response.data);
      setProducts(response.data);
    };
    const fetchBrand = async () => {
      const response = await axios.get("/api/service/brands");
      console.log("check brand", response.data);
      setBrand(response.data);
    };
    const fetchCategory = async () => {
      const response = await axios.get("/api/service/categories");
      console.log("check category", response.data);
      setCategory(response.data);
    };
    const fetchSub = async () => {
      const response = await axios.get("/api/service/subcategories");
      console.log("check sub", response.data);
      setSubcategories(response.data);
    };
    fetchData();
    fetchBrand();
    fetchCategory();
    fetchSub();
  }, []);
  const handleAddproduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const newproduct = {
      brandId: e.target.brandId.value,
      categoryId: e.target.categoryId.value,
      name: e.target.name.value,
      image: e.target.image.value,
      price: e.target.price.value,
      sale: e.target.sale.value,
      rating: e.target.rating.value,
      stockQuantity: e.target.stockQuantity.value,
      subcategoryId: e.target.subcategory.value,
    };

    const product = new Blob([JSON.stringify(newproduct)], {
      type: "application/json",
    });
    formData.append("product", product);

    // Only append file if a file exists
    if (file) {
      formData.append("file", file);
    }

    console.log(newproduct);

    try {
      const response = await axios.post("/api/service/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      if (response.data) {
        toast.success("Product is added successfully!");
        onProductAdded(response.data);
        // closeAddModal();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
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
                Add
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                // onClick={closeAddModal}
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
                <div className="form-group">
                  <label htmlFor="sale">Sale</label>
                  <input
                    type="text"
                    name="sale"
                    className="form-control"
                    id="sale"
                    required
                  />
                </div>
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
                <div className="form-group">
                  <label htmlFor="stockQuantity">Stock Quantity</label>
                  <input
                    type="text"
                    name="stockQuantity"
                    className="form-control"
                    id="stockQuantity"
                    required
                  />
                </div>
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
                    // onClick={closeAddModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Add;
