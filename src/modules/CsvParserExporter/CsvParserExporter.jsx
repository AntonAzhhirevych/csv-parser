import React, { useState } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import './style.css'

const COLUMN_NAMES = Object.freeze({
    number: 'ID',
    aa: 'Top Left x',
    ba: 'Top Left y',
    ca: 'Top Left z',
    ab: 'Top Right x',
    bb: 'Top Right y',
    cb: 'Top Right z',
    ac: 'Bottom Right x',
    bc: 'Bottom Right y',
    cc: 'Bottom Right z',
    ad: 'Bottom Left x',
    bd: 'Bottom Left y',
    cd: 'Bottom Left z',
});


const CsvParserExporter = () => {
    const [parsedData, setParsedData] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    processFile(result.data);
                },
                error: (error) => {
                    console.error('Error parsing CSV file:', error);
                }
            });
        }
    };

    const processFile = (data) => {
        const result = [];

        data.forEach((line) => {
            const values = line[0].split('/');

            const number = parseInt(values[0]);
            const type = values[0].slice(-1);
            const x = values[1];
            const y = values[2];
            const z = values[3];

            let entry = result.find((item) => item.number === number);

            if (!entry) {
                entry = { number };
                result.push(entry);
            }

            entry[`a${type}`] = x;
            entry[`b${type}`] = y;
            entry[`c${type}`] = z;
        });

        const sortedResult = result.sort((a, b) => a.number - b.number);

        setParsedData(sortedResult);
    };

    const handleExportCSV = () => {
        // Map the data to use COLUMN_NAMES values as headers
        const csvData = parsedData.map(item => {
            return {
                [COLUMN_NAMES.number]: item.number,
                [COLUMN_NAMES.aa]: item.aa ?? "",
                [COLUMN_NAMES.ba]: item.ba ?? "",
                [COLUMN_NAMES.ca]: item.ca ?? "",
                [COLUMN_NAMES.ab]: item.ab ?? "",
                [COLUMN_NAMES.bb]: item.bb ?? "",
                [COLUMN_NAMES.cb]: item.cb ?? "",
                [COLUMN_NAMES.ac]: item.ac ?? "",
                [COLUMN_NAMES.bc]: item.bc ?? "",
                [COLUMN_NAMES.cc]: item.cc ?? "",
                [COLUMN_NAMES.ad]: item.ad ?? "",
                [COLUMN_NAMES.bd]: item.bd ?? "",
                [COLUMN_NAMES.cd]: item.cd ?? "",
            };
        });

        const csvContent = Papa.unparse(csvData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'output.csv');
    };

    const handleExportXLSX = () => {
        // Map the data to use COLUMN_NAMES values as headers
        const xlsxData = parsedData.map(item => {
            return {
                [COLUMN_NAMES.number]: item.number ?? "",
                [COLUMN_NAMES.aa]: item.aa ?? "",
                [COLUMN_NAMES.ba]: item.ba ?? "",
                [COLUMN_NAMES.ca]: item.ca ?? "",
                [COLUMN_NAMES.ab]: item.ab ?? "",
                [COLUMN_NAMES.bb]: item.bb ?? "",
                [COLUMN_NAMES.cb]: item.cb ?? "",
                [COLUMN_NAMES.ac]: item.ac ?? "",
                [COLUMN_NAMES.bc]: item.bc ?? "",
                [COLUMN_NAMES.cc]: item.cc ?? "",
                [COLUMN_NAMES.ad]: item.ad ?? "",
                [COLUMN_NAMES.bd]: item.bd ?? "",
                [COLUMN_NAMES.cd]: item.cd ?? "",
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(xlsxData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const workbookArray = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([workbookArray], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(blob, 'output.xlsx');
    };

    return (
        <div className="file-export-container">
            <input type="file" accept=".csv" onChange={handleFileUpload}/>
           <div className="file-export-buttons">
            <button onClick={handleExportCSV} disabled={!parsedData.length}>
                Export as CSV
            </button>
            <button onClick={handleExportXLSX} disabled={!parsedData.length}>
                Export as XLSX
            </button>
           </div>
        </div>
    );
};

export default CsvParserExporter;
