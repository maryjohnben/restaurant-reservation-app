import React from "react";

export default function InvalidDateTime({error}) {
    
    if(error.length > 0) {
    return (
        <div className="alert alert-danger">
        <p>Please fix the following errors:</p>
        {error.map((each, index) => (
          <div key={index}>
          <li>{each}</li>
          </div>
        ))}
      </div>
    )
        }
        return null;
}