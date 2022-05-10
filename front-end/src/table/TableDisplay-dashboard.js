import React from "react";
import TableDisplayRow from "./TableDisplayRow-dashboard";

//added data to table display row
export default function TableDisplay({ tables }) {
  const rows = tables.map((table) => (
    <TableDisplayRow table={table} key={table.table_id} />
  ));

  return (
    <table className="table">
      <thead className="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Table Name</th>
          <th scope="col">Capacity</th>
          <th scope="col">Free?</th>
          <th scope="col">Options</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
