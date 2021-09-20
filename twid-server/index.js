import express from 'express'
import {getSignatures, addSignature} from "./database.js";

const app = express();

app.use(express.json())

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/accounts/getSignatures', (req, res) => {
    getSignatures(req.query.handle).then((sig) => {
        console.log(sig);
        res.send(sig);
    })
});

app.post('/accounts/addSignature', (req, res) => {
    let signature = req.body;
    let twitterHandle = signature.disclosed[0][0].rawvalue;
    addSignature(twitterHandle, signature);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

