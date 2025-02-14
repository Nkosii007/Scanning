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
        <p><strong>Barcode:</strong> ${pc.barcode}</p>
        <label><strong>Model:</strong> <input type="text" value="" class="model-input" placeholder="Enter item model"></label>
        <label><strong>Location:</strong> <input type="text" value="" class="location-input" placeholder="Enter item location"></label>
        <label><strong>Status:</strong> <input type="text" value="" class="status-input" placeholder="Enter item status"></label>
    </div>
`;

    detailsDiv.appendChild(newDetails);
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

document.getElementById('assignButton').addEventListener('click', function() {  // Only ONE event listener
    const technicianName = document.getElementById('technicianName').value;
    const technicianStaffNumber = document.getElementById('technicianStaffNumber').value;
    const technicianEmail = document.getElementById('technicianEmail').value;

    if (technicianName.trim() === "" || technicianEmail.trim() === "" || technicianStaffNumber.trim() === "") {
        alert("Please fill in all the fields");
        return;
    }

    // Disable the Assign button
    this.disabled = true; 

    // Update scannedItems with input values
    const itemContainers = document.querySelectorAll('.item-container');
    itemContainers.forEach(container => {
        const index = container.dataset.index;
        const modelInput = container.querySelector('.model-input');
        const locationInput = container.querySelector('.location-input');
        const statusInput = container.querySelector('.status-input');

        scannedItems[index].model = modelInput.value;
        scannedItems[index].location = locationInput.value;
        scannedItems[index].status = statusInput.value;
    });
 
    console.log("Technician Name:", technicianName);
    console.log("Technician Email:", technicianEmail);
    console.log("Intake items", scannedItems); // Log before sending

    fetch('https://scanningbackend-2.onrender.com/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ technicianName, technicianStaffNumber, technicianEmail, scannedItems })
    })
  .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                alert("Error sending intake details: " + err.error); // More specific error message
                this.disabled = false; // Re-enable the button
                throw new Error(err.error)
            });
        }
        return response.json();
    })
  .then(data => {
        console.log('Success:', data.message);
        scannedItems =[]; // Clear the array
        itemIndex = 0;
        document.getElementById('pc-details').innerHTML = "";
        document.getElementById('result').classList.add('d-none');
        alert("Intake details sent to technician");

        // Clear the form fields
        document.getElementById('technicianName').value = "";
        document.getElementById('technicianStaffNumber').value = "";
        document.getElementById('technicianEmail').value = "";

        this.disabled = false; // Re-enable on success

        // Close the modal after successful response
        const technicianModalEl = document.getElementById('technicianModal');
        const technicianModal = bootstrap.Modal.getInstance(technicianModalEl);
        technicianModal.hide();
    })
  .catch(error => {
        console.error('Error:', error);
        
    });
});