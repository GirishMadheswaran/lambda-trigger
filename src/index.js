exports.handler = async (event) => {
  event.Records.forEach((record) => {
    console.log("S3 Request: %j", record.s3);
    console.log("Event Name: %s", record.eventName);
  });
};
