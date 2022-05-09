import React from "react";

//form used to search reservations using phone number
export default function SearchForm({ 
    onSubmit, formData, setFormData 
}) {
  const changeHandler = ({ target }) => {
    setFormData({
      [target.name]: target.value,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="mobile_number"
      >
        Mobile Number:
      </label>
      <div>
        <input
          id="mobile_number"
          type="search"
          name="mobile_number"
          placeholder="Enter the customer's mobile number"
          onChange={changeHandler}
          value={formData.mobile_number}
          />
        <button type="submit" className="btn btn-primary" style={{margin: '10px'}}>
          Find
        </button>
      </div>
    </form>
  );
}