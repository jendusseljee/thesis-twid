import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));


// Use JSON file for storage. This is good enough for the PoC, since the method of storage does not fall within the scope of the research.
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Get all the signatures belonging to the username.
export async function getSignatures(username) {
    await db.read();

    if (db.data === null) db.data = {
        signatures: {}
    };

    return db.data.signatures[username] ?? 'none';
}

// Add a signature to a username.
export async function addSignature (username, signature) {
    await db.read();

    if (db.data === null) db.data = {
        signatures: {}
    }

    if (db.data.signatures[username] === undefined) db.data.signatures[username] = [];

    db.data.signatures[username].push(signature);

    await db.write();
}