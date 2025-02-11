let html5QrcodeScanner;

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

    fetchPCDetails(decodedText);
    document.getElementById('result').classList.remove('d-none');
}

function onScanFailure(error) {
    console.warn(`Code scan error = ${error}`);
}

document.getElementById('add-button').addEventListener('click', function() {
    if (!html5QrcodeScanner) {
        initializeScanner();
    }
});