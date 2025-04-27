const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/transactions', transactionController.getAllTransactions);

/**
 * @swagger
 * /api/transactions/school/{school_id}:
 *   get:
 *     summary: Get transactions by school
 *     parameters:
 *       - in: path
 *         name: school_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions by school
 */
router.get('/transactions/school/:school_id', transactionController.getTransactionsBySchool);

/**
 * @swagger
 * /api/transactions/check-status/{custom_order_id}:
 *   get:
 *     summary: Check status of transaction
 *     parameters:
 *       - in: path
 *         name: custom_order_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction status
 */
router.get('/transactions/check-status/:custom_order_id', transactionController.checkTransactionStatus);

/**
 * @swagger
 * /api/transactions/counts:
 *   get:
 *     summary: Get transaction counts by status
 *     responses:
 *       200:
 *         description: Transaction counts
 */
router.get('/transactions/counts', transactionController.getTransactionCounts);

router.post('/webhook/transaction-status', transactionController.handleWebhook);
router.post('/transactions/manual-update', transactionController.manualUpdate);

module.exports = router;
