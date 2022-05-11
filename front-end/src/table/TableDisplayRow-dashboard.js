import React from "react";
import { deleteOccupancy } from "../utils/api";

//form that showcases all the tables in the restaurant
export default function TableDisplayRow({
  table,
  loadDashboard,
  setTablesErrors,
}) {
  const handleFinish = async (table_id) => {
    const ac = new AbortController();
    const result = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (result) {
      try {
        const response = await deleteOccupancy(table_id, ac.signal);
        await loadDashboard();
        return response;
      } catch (error) {
        setTablesErrors(error);
      }
    }
    return () => ac.abort();
  };

  return (
    <tr>
      <td>{table.table_id}</td>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>
        {!table.reservation_id ? "Free" : "Occupied"}
      </td>
      {table.reservation_id && (
        <td>
          <button
            type="button"
            className="btn btn-secondary"
            data-table-id-finish={table.table_id}
            onClick={() => handleFinish(table.table_id)}
          >
            Finish
          </button>
        </td>
      )}
    </tr>
  );
}
