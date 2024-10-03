// Function to format date to Vietnam time
const formatDateTime = () => {
  const date = new Date();
  const options = {
    timeZone: "Asia/Ho_Chi_Minh", // Set the time zone to Vietnam
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Intl.DateTimeFormat("vi-VN", options).format(date);
};

module.exports = formatDateTime;
