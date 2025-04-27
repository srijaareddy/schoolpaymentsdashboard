const Transaction = require('../models/Transaction');

exports.getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query.created_at = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const transactions = await Transaction.find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTransactions: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

exports.getTransactionsBySchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { start_date, end_date } = req.query;

    const query = { school_id };
    
    if (start_date && end_date) {
      query.created_at = {
        $gte: new Date(start_date),
        $lte: new Date(endDate)
      };
    }

    const transactions = await Transaction.find(query)
      .sort({ created_at: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching school transactions', error: error.message });
  }
};

exports.checkTransactionStatus = async (req, res) => {
  try {
    const { custom_order_id } = req.params;
    
    const transaction = await Transaction.findOne({ custom_order_id });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ status: transaction.status });
  } catch (error) {
    res.status(500).json({ message: 'Error checking transaction status', error: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const { order_info } = req.body;
    const { order_id, order_amount, transaction_amount, gateway, bank_reference } = order_info;

    const transaction = await Transaction.findOne({ collect_id: order_id });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = 'Success';
    transaction.transaction_amount = transaction_amount;
    transaction.bank_reference = bank_reference;
    
    await transaction.save();

    res.json({ message: 'Transaction status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction status', error: error.message });
  }
};

exports.manualUpdate = async (req, res) => {
  try {
    const { custom_order_id, new_status } = req.body;

    const transaction = await Transaction.findOne({ custom_order_id });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = new_status;
    await transaction.save();

    res.json({ message: 'Transaction status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction status', error: error.message });
  }
};

exports.getTransactionCounts = async (req, res) => {
  try {
    const total = await Transaction.countDocuments();
    const success = await Transaction.countDocuments({ status: 'Success' });
    const pending = await Transaction.countDocuments({ status: 'Pending' });
    const failed = await Transaction.countDocuments({ status: 'Failed' });

    res.json({
      total,
      success,
      pending,
      failed
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction counts', error: error.message });
  }
};
