import React from "react";

//generic form that lets adding new tables possible.
export default function TableForm({
  formData,
  setFormData,
  submitHandler,
  cancelHandler,
}) {
  const handleChange = ({ target }) => {
    const value = target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  return (
    <div className="w-75 p-3">
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <h1>
            <span>New Table</span>
          </h1>
          <label htmlFor="table_name">Table Name</label>
          <input
            className="form-control"
            type="text"
            id="table_name"
            name="table_name"
            required={true}
            minLength={2}
            onChange={handleChange}
            value={formData.table_name}
          ></input>
        </div>
        <label htmlFor="capacity">Capacity</label>
        <input
          className="form-control"
          type="number"
          id="capacity"
          name="capacity"
          min={1}
          required={true}
          onChange={handleChange}
          value={formData.capacity}
        ></input>
        <button
          onClick={cancelHandler}
          type="cancel"
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ margin: "3px" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
