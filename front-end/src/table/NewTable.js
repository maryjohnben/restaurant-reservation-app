import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import TableForm from "./TableForm";
import ErrorAlert from "../layout/ErrorAlert";

//component that uses table form to create new tables in the app. Customers are seated in these table.
export default function NewTable() {
  const initial = {
    table_name: "",
    capacity: 0,
  };
  const [formData, setFormData] = useState({ ...initial });
  const [submitted, setSubmitted] = useState(false);
  const [tablesErrors, setTablesErrors] = useState(null);
  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const cancelHandler = () => {
    history.goBack();
  };

  useEffect(() => {
    if (submitted) {
      const ac = new AbortController();
      async function create() {
        setTablesErrors(false);
        try {
          const response = await createTable(formData, ac.signal);
          history.push(`/dashboard`);
          return response;
        } catch (error) {
          setTablesErrors(error);
        }
      }
      create();
      return () => ac.abort();
    }
  }, [submitted, history, formData]);

  return (
    <>
      <ErrorAlert error={tablesErrors} />
      <TableForm
        formData={formData}
        setFormData={setFormData}
        submitHandler={submitHandler}
        cancelHandler={cancelHandler}
      />
    </>
  );
}
