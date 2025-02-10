async function fetchPCDetails(barcode) {
    try {
      // will be replaced with actual API call later
      console.log('Scanned barcode:', barcode);
  
      // For now, dummy data
      const pc = {
        barcode: barcode,
        model: "Test PC",
        location: "Test Lab",
        status: "Active"
      };
  
      // Append the new information to the existing HTML
      const existingDetails = document.getElementById('pc-details');
      const newDetails = document.createElement('div');
      newDetails.innerHTML = `
        <div class="result">
          <p><strong>Barcode:</strong> ${pc.barcode}</p>
          <p><strong>Model:</strong> ${pc.model}</p>
          <p><strong>Location:</strong> ${pc.location}</p>
          <p><strong>Status:</strong> ${pc.status}</p>
        </div>
      `;
      existingDetails.appendChild(newDetails);
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







const addAsset = document.getElementById('add-button');
addAsset.onclick = () => {
   // Trigger the scanner again
   let html5QrcodeScanner;

addAsset.addEventListener('click', function() {
    if (!html5QrcodeScanner) {
        html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } }
        );
        
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }
});

function onScanSuccess(decodedText, decodedResult) {
    // Stop scanning
    html5QrcodeScanner.clear();
    html5QrcodeScanner = null;

     // Fetch PC details (will implement this in app.js)
     fetchPCDetails(decodedText);
    
    // Show result
    const existingDetails = document.getElementById('result').classList.remove('d-none');
    const newDetails = document.createElement('div');

    newDetails.innerHTML = `
    <div class="result">
      <p><strong>Barcode:</strong> ${decodedText}</p>
      <!-- Add other details here -->
    </div>
  `;
  existingDetails.appendChild(newDetails);
    
   
}

function onScanFailure(error) {
     console.warn(`Code scan error = ${error}`);
}
}