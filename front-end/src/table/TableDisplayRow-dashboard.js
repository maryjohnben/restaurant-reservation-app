import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

export default function TableDisplayRow(
    {table},
) {
// const history = useHistory()
    // const handleCancel = async (id) => {
    //     const result = window.confirm(
    //         "Do you want to cancel this table? This cannot be undone."
    //     );
    //     if (result) {
    //       history.go();
    //       const abortController = new AbortController();
    //       return await deleteDeck(id, abortController.signal);
    //     }
    //   };
    return (
        <tr key={table.table_id}>
      <td>{table.table_id}</td>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td>{table.occupied}</td>
        </tr>
    )
}