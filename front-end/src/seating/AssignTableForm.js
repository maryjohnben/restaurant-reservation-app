import React from "react";

export default function AssignTableForm({
  setFormData,
  submitHandler,
  cancelHandler,
  tables,
}) {

const handleChange = (event) => {
    const value = event.target.value;
    setFormData({[event.target.name]: value})
}
const allTables = tables.map((table)=> (
    <option value={table.table_id} key={table.table_id}>{table.table_name} - {table.capacity}</option>
))

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="table_id">
        Seat At:
      </label>
      <select
        id="table_id"
        name="table_id"
        onChange={handleChange}
        required={true}
        className="form-control bg-white text-back"
      >
        <option value>Select a Table</option>
        {allTables}
      </select>
      <div>
        <button type="cancel" className="btn btn-secondary" onClick={cancelHandler}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ margin: "10px" }}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
