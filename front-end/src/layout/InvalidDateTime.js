import React from "react";

//generic function to alert of error message
export default function InvalidDateTime({ errors = [] }) {
  if (errors !== null)
    if (errors.length) {
      return (
        <div className="alert alert-danger">
          Error:
          {errors.map((error) => (
            <p key={error.message}>{error.message}</p>
          ))}
        </div>
      );
    }
  return null;
}
