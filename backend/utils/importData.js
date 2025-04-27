const xlsx = require('xlsx');

async function importExcelData(filePath, model) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  await model.insertMany(data);
}

module.exports = { importExcelData };
