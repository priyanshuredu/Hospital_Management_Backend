const generateOTPWithExpiry = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10); // Add 10 minutes
  
  return {
    otp: otp,
    expiresAt: expiry
  };
};

module.exports = generateOTPWithExpiry;