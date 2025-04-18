let html5QrcodeScanner;
let lastScannedLocation = ""; // Shared location across files

function initializeScanner() {
    html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } }
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

document.getElementById('startButton').addEventListener('click', initializeScanner);

function onScanSuccess(decodedText, decodedResult) {
    html5QrcodeScanner.clear();
    html5QrcodeScanner = null;

    if (decodedText.startsWith("FAI:")) {
        // It's a location QR
        const locationPart = decodedText.split("|")[0].replace("FAI:", "").trim();
        window.lastScannedLocation = locationPart;  // <-- Global access

        // Optional: show location on screen
        const locationDisplay = document.getElementById('current-location-display');
        if (locationDisplay) {
            locationDisplay.textContent = `📍 Current Location: ${window.lastScannedLocation}`;
        }

        alert(`Location set to: ${window.lastScannedLocation}`);
    } else {
        // ❌ Block scanning if no location has been set
        if (!window.lastScannedLocation || window.lastScannedLocation.trim() === "") {
            alert("⚠️ Please scan a location QR code before scanning asset tags.");
            return;
        }
        
        // It's an asset tag
        fetchPCDetails(decodedText); // This will use lastScannedLocation in app.js
        document.getElementById('result').classList.remove('d-none');
    }
}

function onScanFailure(error) {
    console.warn(`Code scan error = ${error}`);
}

document.getElementById('add-button').addEventListener('click', function () {
    if (!html5QrcodeScanner) {
        initializeScanner();
    }
});
