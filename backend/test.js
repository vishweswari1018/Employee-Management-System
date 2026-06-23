const mongoose = require('mongoose');
require('dotenv').config();
const Leave = require('./models/Leave');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const leaves = await Leave.find();
  console.log("All Leaves:", leaves.map(l => ({id: l._id, status: l.status, from: l.fromDate, to: l.toDate})));
  
  const notRejected = await Leave.find({ status: { $ne: "Rejected" } });
  console.log("Not Rejected:", notRejected.map(l => ({id: l._id, status: l.status, from: l.fromDate, to: l.toDate})));
  
  process.exit(0);
});
