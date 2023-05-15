var currentTableIndex = 0;
var tables = document.getElementsByTagName('table');
var selectedTable = null;

function tableToCSV(table) {
    var csv = [];
    var rows = table.rows;

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].cells;

        for (var j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }

        csv.push(row.join(","));
    }

    return csv.join("\n");
}

function highlightTable(index) {
    if (index < tables.length) {
        if (selectedTable != null) {
            selectedTable.style.border = ''; // Remove highlight from previous table
        }
        selectedTable = tables[index];
        selectedTable.style.border = '5px solid black'; // Highlight selected table
        var rows = selectedTable.rows.length;
        var cells = selectedTable.getElementsByTagName('td').length;
        var columns = selectedTable.rows[0] ? selectedTable.rows[0].cells.length : 0;
        chrome.runtime.sendMessage({action: "updateTableInfo", data: {rows: rows, cells: cells, columns: columns}});
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "highlightTable") {
        highlightTable(currentTableIndex++);
    } else if (request.action == "downloadTable") {
        // If a table is selected, export it as CSV
        if (selectedTable != null) {
            var csv = tableToCSV(selectedTable);

            var csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            var link = document.createElement('a');
            link.setAttribute('href', csvContent);
            link.setAttribute('download', 'table_data.csv');
            document.body.appendChild(link); // Required for Firefox
            link.click();
            document.body.removeChild(link); // Clean up after yourself
        }
    }
});

