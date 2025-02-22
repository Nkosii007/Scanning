let scannedItems =[]; // Initialize as an empty array
let itemIndex = 0;

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
            <select class="category-input" onchange="updateSubcategories(this)">
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
        
        <label><strong>Location:</strong> <input type="text" class="location-input" placeholder="Enter item location"></label>
        
        <label><strong>Condition:</strong>
            <select class="condition-input">
                <option value="">Select Condition</option>
                <option value="Working">Working</option>
                <option value="Not Working">Not Working</option>
                <option value=""></option>
            </select>
        </label>

        <label><strong>Current Date:</strong>
            <input type="text" class="current-date-input" value="${new Date().toISOString().split('T')[0]}" readonly>
        </label>

        <label><strong>Procurement Date:</strong> <input type="date" class="procurement-date-input"></label>
    </div>
`;

detailsDiv.appendChild(newDetails);

// Event listener for category selection
const categorySelect = newDetails.querySelector('.category-input');
categorySelect.addEventListener('change', function() {
    updateSubcategories(this); // Call updateSubcategories when the category changes
});

// Function to update subcategories dynamically
function updateSubcategories(categorySelect) {
    const subcategorySelect = categorySelect.parentElement.nextElementSibling.querySelector('.subcategory-input');
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


document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-icon')) {
        const itemDiv = event.target.closest('.item-container');
        const indexToRemove = itemDiv.dataset.index;

        itemDiv.remove();
        scannedItems.splice(indexToRemove, 1);

        const detailsDiv = document.getElementById('pc-details');
        detailsDiv.innerHTML = "";
        for (let i = 0; i < scannedItems.length; i++) {
            displayPCDetails(scannedItems[i], i);
        }
    }
});

document.getElementById('scan-complete').addEventListener('click', function() {
    const technicianModal = new bootstrap.Modal(document.getElementById('technicianModal'));
    technicianModal.show();
});

document.addEventListener("DOMContentLoaded", function () {
    const assignButton = document.getElementById("assignButton");

    if (!assignButton) {
        console.error("Assign button not found!");
        return;
    }

    assignButton.addEventListener("click", function () {
        console.log("Assign button clicked!"); // Debugging log

        if (assignButton.disabled) {
            console.warn("Assign button is already disabled, skipping...");
            return;
        }

        assignButton.disabled = true; // Disable to prevent double submission

        const technicianName = document.getElementById('technicianName')?.value.trim();
        const technicianStaffNumber = document.getElementById('technicianStaffNumber')?.value.trim();
        const technicianEmail = document.getElementById('technicianEmail')?.value.trim();

        if (!technicianName || !technicianStaffNumber || !technicianEmail) {
            alert("Please fill in all the fields.");
            assignButton.disabled = false;
            return;
        }

        // Collect scanned items
        const scannedItems = [];
        document.querySelectorAll('.item-container').forEach((container, index) => {
            const tagNumberText = container.querySelector('p')?.textContent.trim() || "";
            const tagNumber = tagNumberText.replace('Tag Number:', '').trim();

            scannedItems.push({
                tagNumber: tagNumber,
                category: container.querySelector('.category-input')?.value || "",
                subcategory: container.querySelector('.subcategory-input')?.value || "",
                description: container.querySelector('.description-input')?.value || "",
                location: container.querySelector('.location-input')?.value || "",
                condition: container.querySelector('.condition-input')?.value || "",
                currentDate: container.querySelector('.current-date-input')?.value || "",
                procurementDate: container.querySelector('.procurement-date-input')?.value || ""
            });
        });

        console.log("Sending Data:", { technicianName, technicianStaffNumber, technicianEmail, scannedItems });

        fetch('https://scanningbackend-2.onrender.com/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ technicianName, technicianStaffNumber, technicianEmail, scannedItems })
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
            document.getElementById('result').classList.add('d-none');
            document.getElementById('technicianName').value = "";
            document.getElementById('technicianStaffNumber').value = "";
            document.getElementById('technicianEmail').value = "";

            assignButton.disabled = false; // Re-enable button

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
            assignButton.disabled = false; // Re-enable button
        });
    });
});
}