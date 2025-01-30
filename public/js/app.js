async function fetchPCDetails(barcode) {
    try {
        // will be replaced with actual API call later
        console.log('Scanned barcode:', barcode);
        
        // For now, dummy data
        displayPCDetails({
            barcode: barcode,
            model: "Test PC",
            location: "Test Lab",
            status: "Active"
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPCDetails(pc) {
    const detailsDiv = document.getElementById('pc-details');
    detailsDiv.innerHTML = `
        <div class="result">
            <p><strong>Barcode:</strong> ${pc.barcode}</p>
            <p><strong>Model:</strong> ${pc.model}</p>
            <p><strong>Location:</strong> ${pc.location}</p>
            <p><strong>Status:</strong> ${pc.status}</p>
        </div>
    `;
}
