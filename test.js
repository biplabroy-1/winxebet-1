

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("App-Key", "ec7eb489-5dc1-4406-919b-418177e2931a22");
myHeaders.append("APP-Secret", "4368cef6-855b-46ae-8c42-2f86e77c401f22");
myHeaders.append("Accept", "application/json")
const raw = {
    invoice_no: "ihbvrvhvbhuvr",
    amount: "50",
    // currency: "BDT",
    paymentType: "bkash",
    // wallet_number: "01318042311"
};

const requestOptions = {
    method: "POST",
    headers: myHeaders,
    json: JSON.stringify(raw),
    redirect: "follow"
};

fetch("https://merchant.durantopay.com/api/v2/ps/transaction/create", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error(error));


const myHeaders1 = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("App-Key", "ec7eb489-5dc1-4406-919b-418177e2931a22");
myHeaders.append("APP-Secret", "4368cef6-855b-46ae-8c42-2f86e77c401f22");
myHeaders.append("Content-Type", "application/json");

const raw1 = {
    "invoice_no": "ihbvrvhvbhuvr",
    "amount": "1",
    "paymentType": "bkash"
};

const requestOptions1 = {
    method: "POST",
    headers: myHeaders1,
    body: raw1,
    redirect: "follow"
};

fetch("https://merchant.durantopay.com/api/v2/ps/transaction/create", requestOptions1)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));