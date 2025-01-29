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
    
    // Show result
    document.getElementById('result').classList.remove('d-none');
    
    // Fetch PC details (will implement this in app.js)
    fetchPCDetails(decodedText);
}

function onScanFailure(error) {
     console.warn(`Code scan error = ${error}`);
}