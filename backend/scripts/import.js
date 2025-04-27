const mongoose = require('mongoose');
require('dotenv').config();
const { importExcelData } = require('../utils/importData');
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await importExcelData('./mock/Mock_Data.xlsx', Student);
    await importExcelData('./mock/Mock_Data.xlsx', Transaction);
    console.log('Data imported successfully!');
    process.exit();
  });
