let html5QrcodeScanner;

document.getElementById('startButton').addEventListener('click', function() {
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