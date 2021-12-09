import express from 'express'
import {getSignatures, addSignature} from "./database.js";

const app = express();

app.use(express.json())

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello world!');
});

// The endpoint for retrieving the signatures that belong to an account. // TODO: Verify signatures before sending them. If a signature is not valid anymore, delete it or leave it up to the client to interpret?
app.get('/accounts/getSignatures', (req, res) => {
    getSignatures(req.query.handle).then((sig) => {
        res.send(sig);
    })
});

// The endpoint for adding a signature to an account. // TODO: Verify the signature before adding it.
app.post('/accounts/addSignature', (req, res) => {
    let signature = req.body;
    // For now, the raw value that is signed is the twitter handle.
    let twitterHandle = signature.disclosed[0][0].rawvalue;
    addSignature(twitterHandle, signature);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

