import React from "react";

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