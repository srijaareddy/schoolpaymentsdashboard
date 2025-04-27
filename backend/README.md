# School Payments Backend

A RESTful API backend for the School Payments & Dashboard application.

## Features

- RESTful API endpoints for transaction management
- MongoDB database integration
- Swagger API documentation
- Pagination and filtering support
- Webhook support for payment status updates

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Swagger UI
- CORS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/school
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

## API Endpoints

### Transactions

- `GET /api/transactions` - Get all transactions with pagination and filters
- `GET /api/transactions/school/:school_id` - Get transactions by school ID
- `GET /api/transactions/check-status/:custom_order_id` - Check transaction status
- `POST /api/webhook/transaction-status` - Webhook for transaction status updates
- `POST /api/transactions/manual-update` - Manually update transaction status

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string

## Error Handling

The API includes global error handling middleware that returns appropriate error responses.

## License

MIT 