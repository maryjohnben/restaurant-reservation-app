import React from "react";

//generic function to alert of error message
export default function InvalidDateTime({ error = [] }) {
  console.log(error, 'input')
  if (error !== null)
    if (error.length) {
      return (
        <div className="alert alert-danger">
          Please fix these Errors:
          <p></p>
          {error.map((error, index) => (
            <p key={index}>- {error}</p>
          ))}
        </div>
      );
    }
    return null;
}
