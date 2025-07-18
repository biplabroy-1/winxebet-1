import axios from "axios";
let data = JSON.stringify({
    "invoice_no": "ihbvrvhvbhuvr",
    "amount": "1",
    "paymentType": "bkash"
});

let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://merchant.durantopay.com/api/v2/ps/transaction/create',
    headers: {
        'Accept': 'application/json',
        'App-Key': 'ec7eb489-5dc1-4406-919b-418177e2931a22',
        'APP-Secret': '4368cef6-855b-46ae-8c42-2f86e77c401f22',
        'Content-Type': 'application/json'
    },
    data: data
};

axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
        console.log(error);
    });
