let scannedItems = []; // Initialize as an empty array
let itemIndex = 0;

// Fetch PC Details (Mocked for Now)
async function fetchPCDetails(barcode) {
    try {
        console.log('Scanned barcode:', barcode);

        const pc = {
            barcode: barcode,
            model: "Test PC",
            location: "Test Lab",
            status: "Active"
        };

        scannedItems.push(pc);
        displayPCDetails(pc, itemIndex);
        itemIndex++;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display PC Details
function displayPCDetails(pc, index) {
    const detailsDiv = document.getElementById('pc-details');
    const newDetails = document.createElement('div');
    newDetails.dataset.index = index;
    newDetails.classList.add('item-container');

    newDetails.innerHTML = `
    <div class="result">
        <span class="remove-icon">&minus;</span>
        <p><strong>Tag Number:</strong> ${pc.barcode}</p>

        <label><strong>Category:</strong>
            <select class="category-input">
                <option value="">Select Category</option>
                <option value="Computer">Computer</option>
                <option value="Furniture">Furniture</option>
                <option value="Equipment">Equipment</option>
            </select>
        </label>

        <label><strong>Sub Category:</strong>
            <select class="subcategory-input">
                <option value="">Select Subcategory</option>
            </select>
        </label>

        <label><strong>Description:</strong> <input type="text" class="description-input" placeholder="Enter item description"></label>
        <label><strong>Location:</strong> 
        <input type="text" class="location-input" value="${lastScannedLocation}" placeholder="Enter item location">
        </label>

        <label><strong>Condition:</strong>
            <select class="condition-input">
                <option value="">Select Condition</option>
                <option value="Working">Working</option>
                <option value="Not Working">Not Working</option>
            </select>
        </label>

        <label><strong>Current Date:</strong>
            <input type="text" class="current-date-input" value="${new Date().toISOString().split('T')[0]}" readonly>
        </label>

        <label><strong>Procurement Date:</strong> <input type="date" class="procurement-date-input"></label>
    </div>
    `;

    detailsDiv.appendChild(newDetails);

    // Update subcategories dynamically on category selection
    newDetails.querySelector('.category-input').addEventListener('change', function () {
        updateSubcategories(this);
    });

    // Remove item event
    newDetails.querySelector('.remove-icon').addEventListener('click', function () {
        removeItem(index);
    });
}

// Function to update subcategories dynamically
function updateSubcategories(categorySelect) {
    const subcategorySelect = categorySelect.closest('.result').querySelector('.subcategory-input');
    const selectedCategory = categorySelect.value;

    const subcategories = {
        "Computer": ["Laptop", "Monitor", "Tower", "Other"],
        "Furniture": ["Chair", "Table", "Desk", "Cupboard", "Other"],
        "Equipment": ["Other"]
    };

    subcategorySelect.innerHTML = subcategories[selectedCategory]
        ? subcategories[selectedCategory].map(sub => `<option value="${sub}">${sub}</option>`).join('')
        : '<option value="">Select Subcategory</option>';
}

// Remove item function
function removeItem(index) {
    // Remove from scannedItems array
    scannedItems = scannedItems.filter((_, i) => i !== index);

    // Remove only the specific item's DOM element
    document.querySelector(`.item-container[data-index="${index}"]`)?.remove();
}


// Refresh scanned items
function refreshScannedItems() {
    const detailsDiv = document.getElementById('pc-details');
    detailsDiv.innerHTML = "";
    scannedItems.forEach((item, i) => displayPCDetails(item, i));
}

// Show technician modal
document.getElementById('scan-complete').addEventListener('click', function () {
    const technicianModal = new bootstrap.Modal(document.getElementById('technicianModal'));
    technicianModal.show();
});

// Assign Button Click Event
document.addEventListener("click", function (event) {
    if (event.target && event.target.id === "assignButton") {
        handleAssignButtonClick(event.target);
    }
});

// Handle Assign Button Click
function handleAssignButtonClick(assignButton) {
    console.log("🚀 Assign button clicked!");

    if (assignButton.disabled) {
        console.warn("Assign button is already disabled, skipping...");
        return;
    }

    assignButton.disabled = true;

    const technicianName = document.getElementById('technicianName')?.value.trim();
    const technicianStaffNumber = document.getElementById('technicianStaffNumber')?.value.trim();
    const technicianEmail = document.getElementById('technicianEmail')?.value.trim();

    if (!technicianName || !technicianStaffNumber || !technicianEmail) {
        alert("Please fill in all the fields.");
        assignButton.disabled = false;
        return;
    }

    // Collect scanned items
    const collectedItems = scannedItems.map((item, i) => {
        const container = document.querySelector(`.item-container[data-index="${i}"]`);
        return {
            tagNumber: item.barcode,
            category: container?.querySelector('.category-input')?.value || "",
            subcategory: container?.querySelector('.subcategory-input')?.value || "",
            description: container?.querySelector('.description-input')?.value || "",
            location: container?.querySelector('.location-input')?.value || "",
            condition: container?.querySelector('.condition-input')?.value || "",
            currentDate: container?.querySelector('.current-date-input')?.value || "",
            procurementDate: container?.querySelector('.procurement-date-input')?.value || ""
        };
    });

    console.log("Sending Data:", { technicianName, technicianStaffNumber, technicianEmail, collectedItems });

    fetch('https://scanningbackend-2.onrender.com/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicianName, technicianStaffNumber, technicianEmail, scannedItems: collectedItems })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                alert("Error sending intake details: " + err.error);
                assignButton.disabled = false;
                throw new Error(err.error);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data.message);
        alert("Intake details sent to technician");

        // Clear form fields
        document.getElementById('pc-details').innerHTML = "";
        document.getElementById('result')?.classList.add('d-none');
        document.getElementById('technicianName').value = "";
        document.getElementById('technicianStaffNumber').value = "";
        document.getElementById('technicianEmail').value = "";

        // Reset data
        scannedItems = [];
        itemIndex = 0;
        
        assignButton.disabled = false;

        // Close modal
        const technicianModalEl = document.getElementById('technicianModal');
        if (technicianModalEl) {
            const technicianModal = bootstrap.Modal.getInstance(technicianModalEl);
            technicianModal?.hide();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred, please try again.");
        assignButton.disabled = false;
    });
}
