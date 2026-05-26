const mongoose = require('mongoose');
require('dotenv').config();
const Node = require('./src/models/Node');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/axonflow').then(async () => {
    const nodes = await Node.find({}).sort({createdAt: -1}).limit(5);
    console.log(JSON.stringify(nodes.map(n => n.toJSON()), null, 2));
    process.exit(0);
}).catch(console.error);
