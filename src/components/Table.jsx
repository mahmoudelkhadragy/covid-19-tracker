import React from "react";
import numeral from "numeral";
import "./table.css";

function Table({ countries }) {
  return (
    <div className="table">
      <table>
        <thead>
          <tr className="table__head">
            <th>Country</th>
            <th>Cases</th>
          </tr>
        </thead>
        <tbody>
          {countries.map(({ country, cases }) => (
            <tr key={country}>
              <td>{country}</td>
              <td>
                <strong>{numeral(cases).format("0,0")}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
