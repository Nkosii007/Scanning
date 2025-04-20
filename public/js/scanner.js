let html5QrcodeScanner;
let lastScannedLocation = "";

function initializeScanner() {
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_39
        ]
    };

    html5QrcodeScanner = new Html5QrcodeScanner("reader", config);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

document.getElementById('startButton').addEventListener('click', initializeScanner);

function onScanSuccess(decodedText, decodedResult) {
    html5QrcodeScanner.clear();
    html5QrcodeScanner = null;

    if (decodedText.startsWith("FAI:")) {
        const locationPart = decodedText.split("|")[0].replace("FAI:", "").trim();
        window.lastScannedLocation = locationPart;

        const locationDisplay = document.getElementById('current-location-display');
        if (locationDisplay) {
            locationDisplay.textContent = `📍 Current Location: ${window.lastScannedLocation}`;
        }

        alert(`Location set to: ${window.lastScannedLocation}`);
    } else {
        if (!window.lastScannedLocation || window.lastScannedLocation.trim() === "") {
            alert("⚠️ Please scan a location QR code before scanning asset tags.");
            return;
        }

        fetchPCDetails(decodedText);
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
