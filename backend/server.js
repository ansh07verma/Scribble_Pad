const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;

let customerData = [];

// Load CSV data into memory
fs.createReadStream('./data/indian_customer_profiles.csv')
  .pipe(csv())
  .on('data', (row) => {
    customerData.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

// API endpoint to get customers based on category and location
app.get('/customers', (req, res) => {
  const { category, location } = req.query;

  if (!category || !location) {
    return res.status(400).json({ message: 'Category and location are required.' });
  }

  // Filter customers based on category and location
  const filteredCustomers = customerData.filter(customer => 
    customer["Preferred Category of Product"] === category && customer.Location === location
  );

  // Map to only required fields
  const response = filteredCustomers.map(customer => ({
    name: customer.Name,
    email: customer.Email,
    phone: customer["Phone Number"],
    instagramId: customer["Instagram ID"]
  }));

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
