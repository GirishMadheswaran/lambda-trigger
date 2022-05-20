exports.handler = async (event) => {
  event.Records.forEach((record) => {
    console.log("Event Name: %s", record.eventName);
    console.log("S3 Request: %j", record.s3);
  });
};
