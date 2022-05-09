import React from "react";
import TableDisplayRow from "./TableDisplayRow-dashboard";

export default function TableDisplay({
    tables,
}) {
        // console.log(reservations)
        const rows = tables.map((table)=> (
            <TableDisplayRow
            table={table}
            key={table.table_id}
            />
        ));
    // console.log(rows)
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
      <tbody>
          {rows}
      </tbody>
    </table>
        )
    }