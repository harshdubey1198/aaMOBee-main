import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, } from "reactstrap";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const CategoryModal = ({ isOpen, toggle, formValues, setFormValues, editMode, selectedCategoryId, setSelectedCategoryId, parentCategories, refetchCategories, role, selectedFirmId, }) => {
  const [loading, setLoading] = useState(false);
  const createdBy = JSON.parse(localStorage.getItem("authUser")).response._id;
    // console.log("hi modal category : ",selectedFirmId)
   const authuser = JSON.parse(localStorage.getItem("authUser")).response;

    const blockIfDemo = (actionName) => {
      if (authuser?.isDemo) {
        setLoading(false);
        toast.error(`Demo accounts cannot create a new ${actionName}`);
        return true; 
      }
      return false; 
    };
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (blockIfDemo("product category")) return;
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formValues,
      createdBy,
      parentId: formValues.parentId || null,
    };

    if (role === "client_admin") {
      payload.firmId = selectedFirmId;
    }

    try {
      if (editMode && selectedCategoryId) {
        const response = await axiosInstance.put(
          `${process.env.REACT_APP_URL}/category/update-category/${selectedCategoryId}`,
          payload
        );
        toast.success(response.message);
      } else {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_URL}/category/create-category/${createdBy}`,
          payload
        );
        toast.success(response.message);
      }

      if (refetchCategories) {
        refetchCategories();
      }

      // Reset modal state
      setFormValues({ categoryName: "", description: "", parentId: "" });
      setSelectedCategoryId && setSelectedCategoryId(null);
      toggle();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {editMode ? "Edit Category" : "Add Category"}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              type="text"
              id="categoryName"
              name="categoryName"
              placeholder="Enter category name"
              value={formValues.categoryName}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <Input
              type="textarea"
              id="description"
              name="description"
              placeholder="Enter description"
              value={formValues.description}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="parentId">Parent Category</Label>
            <Input
              type="select"
              id="parentId"
              name="parentId"
              value={formValues.parentId}
              onChange={handleChange}
            >
              <option value="">Select Parent Category (Optional)</option>
              {parentCategories.map((parent) => (
                <option key={parent._id} value={parent._id}>
                  {parent.categoryName}
                </option>
              ))}
            </Input>
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading
            ? editMode
              ? "Updating..."
              : "Adding..."
            : editMode
            ? "Update Category"
            : "Add Category"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CategoryModal;
