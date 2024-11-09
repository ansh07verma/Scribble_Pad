// Sample data for categories and locations
const categories = ["Sports & Fitness", "Clothing", "Beauty & Personal Care"];
const locations = ["Pali", "Darbhanga", "Kottayam", "Madhyamgram", "Moradabad"];

// Show suggestions for category or location
function showSuggestions(type) {
    const input = document.getElementById(type).value.toLowerCase();
    const suggestionsDiv = document.getElementById(`${type}-suggestions`);

    let suggestions = [];
    if (type === 'category') {
        suggestions = categories.filter(category => category.toLowerCase().startsWith(input));
    } else if (type === 'location') {
        suggestions = locations.filter(location => location.toLowerCase().startsWith(input));
    }

    suggestionsDiv.innerHTML = '';
    suggestions.forEach(suggestion => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.textContent = suggestion;
        suggestionDiv.classList.add('suggestion-item');
        suggestionDiv.onclick = () => {
            document.getElementById(type).value = suggestion;
            suggestionsDiv.innerHTML = ''; // Clear suggestions after selection
        };
        suggestionsDiv.appendChild(suggestionDiv);
    });
}

// Fetch customer data based on selected category and location
async function fetchCustomerData() {
    const category = document.getElementById('category').value.trim();
    const location = document.getElementById('location').value.trim();

    if (!category || !location) {
        document.getElementById('customerResults').textContent = "Please enter both a category and location.";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/customers?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch customer data.");
        }

        const customers = await response.json();
        displayCustomers(customers);
    } catch (error) {
        document.getElementById('customerResults').textContent = error.message;
    }
}

// Display matching customers
function displayCustomers(customers) {
    const resultsDiv = document.getElementById('customerResults');
    resultsDiv.innerHTML = '';

    if (customers.length === 0) {
        resultsDiv.textContent = "No customers found for the entered category and location.";
        return;
    }

    customers.forEach(customer => {
        const customerInfo = document.createElement('div');
        customerInfo.className = 'customer-info';
        customerInfo.innerHTML = `
            <p><strong>Name:</strong> ${customer.name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone Number:</strong> ${customer.phone}</p>
            <p><strong>Instagram ID:</strong> ${customer.instagramId}</p>
            <hr>
        `;
        resultsDiv.appendChild(customerInfo);
    });
}
