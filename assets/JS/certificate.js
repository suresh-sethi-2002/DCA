const SHEET_ID = "1rfbXxSSJ-RS4RWPGYVbNSWeBq6qxGXmA-rKTHI2_HHc";
const SHEET_NAME = "Sheet1";
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

function setStatus(message, className) {
    const resultDiv = document.getElementById("result");
    const status = document.createElement("div");
    status.className = className;
    status.textContent = message;
    resultDiv.replaceChildren(status);
}

function addResultRow(card, label, value) {
    const row = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    row.append(strong, document.createTextNode(value || "Not available"));
    card.appendChild(row);
}

async function verifyCertificate() {
    const certNo = document.getElementById("certificateNo").value.trim().toUpperCase();
    const resultDiv = document.getElementById("result");

    if (!certNo) {
        setStatus("Please enter a certificate number.", "not-found");
        return;
    }

    resultDiv.textContent = "Checking Certificate...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load certificate sheet");
        }

        const data = await response.json();
        const result = Array.isArray(data)
            ? data.find((item) => item.Certificate_No && item.Certificate_No.toUpperCase() === certNo)
            : null;

        if (!result) {
            setStatus("Certificate Not Found", "not-found");
            return;
        }

        const card = document.createElement("div");
        card.className = "result-card";

        const verified = document.createElement("div");
        verified.className = "verified";
        verified.textContent = "Certificate Verified Successfully";
        card.appendChild(verified);

        addResultRow(card, "Certificate Number", result.Certificate_No);
        addResultRow(card, "Student Name", result.Student_Name);
        addResultRow(card, "Address", result.Address);
        addResultRow(card, "Course", result.Course);
        addResultRow(card, "Issue Date", result.Issue_Date);
        addResultRow(card, "Status", result.Status);

        resultDiv.replaceChildren(card);
    } catch {
        setStatus("Unable To Load Google Sheet", "not-found");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const verifyButton = document.getElementById("verifyCertificateButton");

    if (verifyButton) {
        verifyButton.addEventListener("click", verifyCertificate);
    }
});
