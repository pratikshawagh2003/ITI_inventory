import React, { useState, useEffect } from "react";
import "./DRV.css";

const DailyReceiptVoucher = () => {
  const [tableData, setTableData] = useState(() => {
    // Initialize the table with exactly 2 blank rows
    return Array(2).fill({
      serialDate: "",
      purchaseOrder: "",
      consignorAdvice: "",
      invoiceChallan: "",
      modeOfTransport: "",
      goodsCarrierNote: "",
      typeOfPackages: "",
      numberOfPackages: "",
      transportDetails: "",
      srNoInPO: "",
      description: "",
      quantity: "",
      binCard: "",
      stockLedger: "",
    });
  });

  const [headers, setHeaders] = useState([
    [
      "Serial Date",
      "Purchase Order No. & Date",
      "Consignor Advice No. & Date",
      "Invoice/Challan/Cash No. & Date",
      "Mode of Transport",
    ],
    [
      "Goods Carrier Note No. & Date",
      "Type of Packages",
      "No. of Packages",
      "Transport Details",
      "",
    ],
    [
      "Sr. No. of Item in P/O",
      "Full Description of Material",
      "Quantity Received (Undamaged Damaged)",
      "Bin Card No.",
      "Stock Ledger Folio",
    ],
  ]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("voucherData"));
    const savedHeaders = JSON.parse(localStorage.getItem("voucherHeaders"));

    if (savedData) {
      setTableData(savedData);
    }

    if (savedHeaders) {
      setHeaders(savedHeaders);
    }
  }, []);

  const handleTableChange = (e, index, field) => {
    const newData = [...tableData]; // Create a shallow copy of tableData
    newData[index][field] = e.target.value; // Update the specific field
    setTableData(newData); // Update state
    console.log("Updated tableData:", newData); // Log the updated state
  };

  const handlePrintTableData = () => {
    console.log("Current tableData:", tableData); // Log current tableData
  };

  // const handleHeaderChange = (e, rowIndex, colIndex) => {
  //   const updatedHeaders = [...headers];
  //   updatedHeaders[rowIndex][colIndex] = e.target.textContent;
  //   setHeaders(updatedHeaders);
  //   localStorage.setItem('voucherHeaders', JSON.stringify(updatedHeaders));
  // };

  const handleAddRow = () => {
    if (tableData.length < 10) {
      // Ensure no more than 2 rows are added
      setTableData([
        ...tableData,
        {
          serialDate: "",
          purchaseOrder: "",
          consignorAdvice: "",
          invoiceChallan: "",
          modeOfTransport: "",
          goodsCarrierNote: "",
          typeOfPackages: "",
          numberOfPackages: "",
          transportDetails: "",
          srNoInPO: "",
          description: "",
          quantity: "",
          binCard: "",
          stockLedger: "",
        },
      ]);
    }
  };

  const handleDeleteRow = () => {
    if (tableData.length > 0) {
      setTableData(tableData.slice(0, -1));
    }
  };

  const handleSave = () => {
    // Define the CSV headers based on the table's structure
    const csvHeaders = [
      [
        "Serial Date:",
        "Purchase Order No. & Date:",
        "",
        "Consignor Advice No. & Date:",
        "",
        "Invoice/Challan/Cash No. & Date:",
      ],
      [
        "Mode of Transport:",
        "",
        "Goods Carrier Note No. & Date:",
        "Type of Packages:",
        "",
        "No. of Packages:",
        "",
      ],
      [
        "Sr. No. of Item P/O:",
        "Full Description of Material:",
        "Quality Received:",
        "",
        "Bin Card No.:",
        "Stock Ledger Folio:",
      ],
      ["", "", "Damaged:", "Undamaged:", "", ""],
    ];

    // Flatten headers while ensuring proper alignment
    const flattenedHeaders = csvHeaders
      .map((row) => row.map((cell) => "${cell}").join(","))
      .join("\n");

    // Combine headers with data rows
    const csvData = [
      flattenedHeaders,
      ...tableData.map(
        (row) =>
          [
            row.serialDate,
            row.purchaseOrder,
            row.damagedQuantity,
            row.undamagedQuantity,
            row.invoiceChallan,
            row.modeOfTransport,
          ]
            .map((value) => "${value}") // Ensure each value is wrapped in quotes to handle commas inside data
            .join(",") // Join each row's values with commas
      ),
    ].join("\n"); // Join all rows with newlines

    // Create a Blob object with the CSV data
    const blob = new Blob([csvData], { type: "text/csv" });

    // Create a link element to download the file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "DRV.csv"; // File name
    link.click();
  };

  const handlePrint = () => {
    handlePrintTableData(); // Optional: for console log
    window.print();
  };

  return (
    <div className="voucher-container">
      <div className="voucher-header">
        <h1 class="title">Daily Receipt Voucher</h1>
      </div>
      <div className="print-area">
        <table className="voucher-table">
          <thead>
            <tr>
              <th
                contentEditable="true"
                suppressContentEditableWarning
                onInput={(e) => {
                  // Prevent erasing the default text and allow adding additional data
                  if (!e.target.innerText.includes("Serial Date")) {
                    e.target.innerText = "Serial Date";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Serial Date:
              </th>

              <th
                contentEditable="true"
                colSpan={2}
                suppressContentEditableWarning
                onInput={(e) => {
                  if (
                    !e.target.innerText.includes("Purchase Order No. & Date")
                  ) {
                    e.target.innerText = "Purchase Order No. & Date";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Purchase Order No. & Date:
              </th>
              <th
                contentEditable="true"
                colSpan={2}
                suppressContentEditableWarning
                onInput={(e) => {
                  if (
                    !e.target.innerText.includes("Consignor Advice No. & Date")
                  ) {
                    e.target.innerText = "Consignor Advice No. & Date";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Consignor Advice No. & Date:
              </th>

              <th
                contentEditable="true"
                suppressContentEditableWarning
                onInput={(e) => {
                  if (
                    !e.target.innerText.includes(
                      "Invoice/Challan/Cash No. & Date"
                    )
                  ) {
                    e.target.innerText = "Invoice/Challan/Cash No. & Date";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Invoice/Challan/Cash No. & Date:
              </th>
            </tr>
            <tr>
              <th
                contentEditable="true"
                suppressContentEditableWarning
                onInput={(e) => {
                  // Prevent erasing the default text and allow adding additional data
                  if (!e.target.innerText.includes("Mode of Transport")) {
                    e.target.innerText = "Mode of Transport";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Mode of Transport:
              </th>

              <th
                contentEditable="true"
                suppressContentEditableWarning
                onInput={(e) => {
                  if (
                    !e.target.innerText.includes(
                      "Goods Carrier Note No. & Date"
                    )
                  ) {
                    e.target.innerText = "Goods Carrier Note No. & Date";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Goods Carrier Note No. & Date:
              </th>

              <th
                contentEditable="true"
                colSpan={2}
                suppressContentEditableWarning
                onInput={(e) => {
                  if (!e.target.innerText.includes("Type of Packages")) {
                    e.target.innerText = "Type of Packages";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Type of Packages:
              </th>
              <th
                contentEditable="true"
                colSpan={2}
                suppressContentEditableWarning
                onInput={(e) => {
                  if (!e.target.innerText.includes("No. of Packages")) {
                    e.target.innerText = "No. of Packages";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                No. of Packages:
              </th>
            </tr>
            <tr>
              <th
                contentEditable="true"
                rowSpan={2}
                suppressContentEditableWarning
                onInput={(e) => {
                  if (!e.target.innerText.includes("Sr. No. of Item P/O")) {
                    e.target.innerText = "Sr. No. of Item P/O";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Sr. No. of Item P/O:
              </th>
              <th
                contentEditable="true"
                rowSpan={2}
                suppressContentEditableWarning
                onInput={(e) => {
                  if (
                    !e.target.innerText.includes("Full Description of Material")
                  ) {
                    e.target.innerText = "Full Description of Material";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Full Description of Material:
              </th>
              <th
                contentEditable="true"
                colSpan="2"
                suppressContentEditableWarning
                onInput={(e) => {
                  if (!e.target.innerText.includes("Quality")) {
                    e.target.innerText = "Quality Recieved ";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Quality Recieved:
              </th>
              <th
                contentEditable="true"
                rowSpan={2}
                suppressContentEditableWarning
                onInput={(e) => {
                  if (!e.target.innerText.includes("Bin Card No.")) {
                    e.target.innerText = "Bin Card No.";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Bin Card No.-
              </th>
              <th
                contentEditable="true"
                rowSpan={2}
                suppressContentEditableWarning
                onInput={(e) => {
                  if (!e.target.innerText.includes("Stock Ledger Folio")) {
                    e.target.innerText = "Stock Ledger Folio";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Stock Ledger Folio:
              </th>
            </tr>
            <tr>
              <th
                contentEditable="true"
                suppressContentEditableWarning
                onInput={(e) => {
                  if (!e.target.innerText.includes("Damaged")) {
                    e.target.innerText = "Damaged";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Damaged:
              </th>
              <th
                contentEditable="true"
                suppressContentEditableWarning
                onInput={(e) => {
                  if (!e.target.innerText.includes("Undamaged")) {
                    e.target.innerText = "Undamaged";
                  }
                }}
                style={{ backgroundColor: "#6c5ce7" }}
              >
                Undamaged:
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={row.serialDate}
                    onChange={(e) => handleTableChange(e, index, "serialDate")}
                    className="fancy-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.purchaseOrder}
                    onChange={(e) =>
                      handleTableChange(e, index, "purchaseOrder")
                    }
                    className="fancy-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.damagedQuantity}
                    onChange={(e) =>
                      handleTableChange(e, index, "damagedQuantity")
                    }
                    className="fancy-input"
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={row.undamagedQuantity}
                    onChange={(e) =>
                      handleTableChange(e, index, "undamagedQuantity")
                    }
                    className="fancy-input"
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={row.invoiceChallan}
                    onChange={(e) =>
                      handleTableChange(e, index, "invoiceChallan")
                    }
                    className="fancy-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.modeOfTransport}
                    onChange={(e) =>
                      handleTableChange(e, index, "modeOfTransport")
                    }
                    className="fancy-input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="footer">
          <p>
            Checked and found correct as per order. <br />
            Damage/Shortage/Excess Report No.
            <br />
            <br />
            <br />
            <br />
          </p>
          <div className="footer">
            <div className="footer-roles">
              <p>Asst. Store Keeper</p>
              <p>Store Supdt.</p>
              <p>Store Officer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="buttons-container">
        <button
          className="print-button"
          onClick={handlePrint}
          style={{ backgroundColor: "#6c5ce7", color: "white" }}
        >
          Print
        </button>
        <button
          className="save-button"
          onClick={handleSave}
          style={{
            backgroundColor: "#6c5ce7",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          className="add-row-button"
          onClick={handleAddRow}
          style={{ backgroundColor: "#6c5ce7", color: "white" }}
        >
          Add Row
        </button>
        <button
          className="delete-row-button"
          onClick={handleDeleteRow}
          style={{ backgroundColor: "#6c5ce7", color: "white" }}
        >
          Delete Row
        </button>
      </div>
    </div>
  );
};

export default DailyReceiptVoucher;
