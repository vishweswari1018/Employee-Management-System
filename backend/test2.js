const mongoose = require('mongoose');
require('dotenv').config();
const Leave = require('./models/Leave');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const from = new Date('2026-06-23');
  const to = new Date('2026-06-25');
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);
  
  const existingLeaves = await Leave.find({ status: { $ne: "Rejected" } });
  
  const overlappingLeave = existingLeaves.find((leave) => {
    const oldFrom = new Date(leave.fromDate);
    const oldTo = new Date(leave.toDate);

    oldFrom.setHours(0, 0, 0, 0);
    oldTo.setHours(0, 0, 0, 0);

    return from <= oldTo && to >= oldFrom;
  });

  if (overlappingLeave) {
    const formattedFrom = new Date(overlappingLeave.fromDate).toISOString().split("T")[0];
    const formattedTo = new Date(overlappingLeave.toDate).toISOString().split("T")[0];
    console.log(`Overlaps with: ${overlappingLeave.status} leave (${formattedFrom} to ${formattedTo})`);
  } else {
    console.log("No overlap!");
  }
  
  process.exit(0);
});
