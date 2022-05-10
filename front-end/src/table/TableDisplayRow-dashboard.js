import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { deleteOccupancy } from "../utils/api";

export default function TableDisplayRow(
    {table},
) {
const history = useHistory()

    const handleFinish = async (table_id) => {
        console.log(table_id)
        const ac = new AbortController();
        const result = window.confirm(
            "Is this table ready to seat new guests? This cannot be undone."
        );
        if (result) {
            history.go(0);
            const response = await deleteOccupancy(table_id, ac.signal);
            return response
        }
        return() => ac.abort()
      };

    return (
        <tr key={table.table_id}>
      <td>{table.table_id}</td>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={`${table.table_id}`}>{table.occupied === false? 'Free': 'Occupied'}
      </td>
      {(table.occupied === true &&
      <td>  <button
      type="button"
      className="btn btn-secondary"
      data-table-id-finish={table.table_id}
      onClick={() => handleFinish(table.table_id)}
    >
      Finish
    </button>
    </td>)}
        </tr>
    )
}