const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Enable Cross-Origin Resource Sharing

const app = express();
const port = 3001; 

app.use(cors()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'manqobankosi007@gmail.com',  // email address
        pass: 'oefpvcveitwptinc'       // email password
    }
});

app.post('/send-email', (req, res) => {
    const { technicianName,technicianStaffNumber, technicianEmail, scannedItems } = req.body;

    // Correctly format the scanned items for the email
    const itemsList = scannedItems.map(item => `
        <li>
            <strong>Barcode:</strong> ${item.barcode}<br>
            <strong>Model:</strong> ${item.model}<br>
            <strong>Location:</strong> ${item.location}<br>
            <strong>Status:</strong> ${item.status}
        </li>`).join('');

    // Email options
    const mailOptions = {
        from: 'manqobankosi007@gmail.com',
        to: technicianEmail,
        subject: 'Asset Intake Details',
        html: `
            <p>Dear ${technicianName},</p>
            <p><strong>Staff Number:</strong> ${technicianStaffNumber}</p>
            <p>Here are the details of the asset intake:</p>
            <ul>
                ${itemsList}  </ul>
            <p>Please verify the intake.</p>
        `
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email' }); // Send error response
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Email sent successfully' }); // Send success response
            // After successful email, save to the database

        }
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});