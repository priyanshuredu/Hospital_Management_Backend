const nodemailer = require('nodemailer');
const Mail_Id = process.env.MAIL_ID;
const Mail_Pass = process.env.MAIL_PASS;

const transporter = nodemailer.createTransport({
    service:"gmail",
    port:465,
    auth:{
        user: Mail_Id,
        pass: Mail_Pass 
    },
    tls:{rejectUnauthorized: false}
})

const sendWelcomeEmail = async (email, username, password, userRole) => {
  // Role-based styling and messages
  const roleConfig = {
    admin: {
      icon: '👨‍⚕️',
      title: 'Administrator',
      greeting: 'Welcome to the Admin Dashboard!',
      color: '#1e3c72',
      secondaryColor: '#2a5298'
    },
    doctor: {
      icon: '👨‍⚕️',
      title: 'Medical Professional',
      greeting: 'Welcome to your Medical Dashboard!',
      color: '#0f2027',
      secondaryColor: '#203a43'
    },
    nurse: {
      icon: '👩‍⚕️',
      title: 'Nursing Staff',
      greeting: 'Welcome to the Nursing Portal!',
      color: '#2c3e50',
      secondaryColor: '#3498db'
    },
    staff: {
      icon: '🏥',
      title: 'Hospital Staff',
      greeting: 'Welcome to the Hospital Management System!',
      color: '#2193b0',
      secondaryColor: '#6dd5ed'
    },
    patient: {
      icon: '🤝',
      title: 'Patient Portal',
      greeting: 'Welcome to Patient Portal!',
      color: '#11998e',
      secondaryColor: '#38ef7d'
    }
  };

  const config = roleConfig[userRole] || roleConfig.staff;

  const mail = {
    from: '"Hospital Management System" <priyanshuredu12@gmail.com>',
    to: email,
    subject: `🏥 Welcome to Hospital Management System, ${username}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to HMS</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                
                <!-- Header Section with Gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, ${config.color} 0%, ${config.secondaryColor} 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">${config.icon} 🏥</div>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Hospital Management System</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">${config.title} Portal</p>
                  </td>
                </tr>

                <!-- Welcome Message -->
                <tr>
                  <td style="padding: 40px 30px 20px;">
                    <h2 style="color: #2c3e50; margin: 0 0 10px; font-size: 24px;">Hello ${username}! 👋</h2>
                    <p style="color: #555; line-height: 1.6; margin: 0 0 10px; font-size: 16px;">${config.greeting}</p>
                    <p style="color: #555; line-height: 1.6; margin: 0;">Your account has been successfully created in our Hospital Management System.</p>
                  </td>
                </tr>

                <!-- Login Credentials Card -->
                <tr>
                  <td style="padding: 0 30px;">
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; border-left: 4px solid ${config.secondaryColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                      <h3 style="margin: 0 0 15px; color: #2c3e50; font-size: 18px;">📋 Your Login Credentials</h3>
                      <div style="margin-bottom: 12px;">
                        <div style="display: inline-block; width: 80px; color: #666; font-weight: 600;">📧 Email:</div>
                        <div style="display: inline-block; color: #333; font-family: monospace;">${email}</div>
                      </div>
                      <div style="margin-bottom: 5px;">
                        <div style="display: inline-block; width: 80px; color: #666; font-weight: 600;">🔑 Password:</div>
                        <div style="display: inline-block; color: #e74c3c; font-family: monospace; font-weight: 600;">${password}</div>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Security Notice -->
                <tr>
                  <td style="padding: 20px 30px;">
                    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px;">
                      <div style="color: #856404; font-size: 14px; display: flex; align-items: center;">
                        <span style="font-size: 20px; margin-right: 10px;">⚠️</span>
                        <span><strong>Security Notice:</strong> Please change your password immediately after your first login for security purposes.</span>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Quick Tips Section -->
                <tr>
                  <td style="padding: 0 30px;">
                    <div style="background: #e8f4f8; border-radius: 12px; padding: 20px;">
                      <h3 style="margin: 0 0 15px; color: #1e3c72; font-size: 16px;">💡 Quick Tips</h3>
                      <div style="margin-bottom: 10px; display: flex; align-items: center;">
                        <span style="font-size: 18px; margin-right: 10px;">📱</span>
                        <span style="color: #555;">Access the system from any device with internet connection</span>
                      </div>
                      <div style="margin-bottom: 10px; display: flex; align-items: center;">
                        <span style="font-size: 18px; margin-right: 10px;">🔒</span>
                        <span style="color: #555;">Never share your password with anyone</span>
                      </div>
                      <div style="display: flex; align-items: center;">
                        <span style="font-size: 18px; margin-right: 10px;">🆘</span>
                        <span style="color: #555;">Contact IT support for technical assistance</span>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Action Buttons -->
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <a href="http://localhost:3000/login" style="display: inline-block; background: linear-gradient(135deg, ${config.color} 0%, ${config.secondaryColor} 100%); color: white; padding: 14px 35px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      🚀 Login to Dashboard
                    </a>
                    <a href="http://localhost:3000/reset-password" style="display: inline-block; background: #6c757d; color: white; padding: 14px 35px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      🔑 Reset Password
                    </a>
                  </td>
                </tr>

                <!-- Help & Support -->
                <tr>
                  <td style="padding: 20px 30px; background: #f8f9fa;">
                    <div style="text-align: center;">
                      <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                        📞 <strong>Need Help?</strong> Contact our support team
                      </p>
                      <p style="margin: 0; color: #999; font-size: 12px;">
                        📧 support@hospitalmanagement.com | 📞 +91 12345 67890 | 🕐 24/7 Available
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #2c3e50; padding: 20px; text-align: center;">
                    <div style="color: #95a5a6; font-size: 12px; line-height: 1.6;">
                      <p style="margin: 0 0 5px;">© 2024 Hospital Management System. All rights reserved.</p>
                      <p style="margin: 0;">
                        <a href="#" style="color: #95a5a6; text-decoration: none;">Privacy Policy</a> | 
                        <a href="#" style="color: #95a5a6; text-decoration: none;">Terms of Service</a>
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
  
  return await transporter.sendMail(mail);
};

const sendHospitalApprovalEmail = async (email, hospital_name, password) => {
  // Generate username from hospital name
  const username = hospital_name.toLowerCase().replace(/[^a-z0-9]/g, '_');

  const mail = {
    from: '"Hospital Management System" <priyanshuredu12@gmail.com>',
    to: email,
    subject: `✅ Hospital Approved - ${hospital_name} | Hospital Management System`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hospital Approved</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                
                <!-- Header Section with Gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">✅ 🏥</div>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Hospital Approved!</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Your registration has been successfully verified</p>
                  </td>
                </tr>

                <!-- Welcome Message -->
                <tr>
                  <td style="padding: 40px 30px 20px;">
                    <h2 style="color: #2c3e50; margin: 0 0 10px; font-size: 24px;">Dear Hospital Administrator,</h2>
                    <p style="color: #555; line-height: 1.6; margin: 0 0 10px; font-size: 16px;">Congratulations! Your hospital has been approved.</p>
                    <div style="background: #e8f5e9; border-radius: 10px; padding: 15px; margin: 15px 0;">
                      <p style="margin: 0; color: #2e7d32; font-size: 16px; font-weight: 600;">
                        🏥 Hospital Name: ${hospital_name}
                      </p>
                    </div>
                    <p style="color: #555; line-height: 1.6; margin: 0;">Your hospital has been officially approved and onboarded to our Hospital Management System. You can now access the admin dashboard to manage your hospital operations.</p>
                  </td>
                </tr>

                <!-- Login Credentials Card -->
                <tr>
                  <td style="padding: 0 30px;">
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; border-left: 4px solid #38ef7d; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                      <h3 style="margin: 0 0 15px; color: #2c3e50; font-size: 18px;">🔑 Your Admin Login Credentials</h3>
                      <div style="margin-bottom: 12px;">
                        <div style="display: inline-block; width: 80px; color: #666; font-weight: 600;">📧 Email:</div>
                        <div style="display: inline-block; color: #333; font-family: monospace; font-size: 14px;">${email}</div>
                      </div>
                      <div style="margin-bottom: 12px;">
                        <div style="display: inline-block; width: 80px; color: #666; font-weight: 600;">👤 Username:</div>
                        <div style="display: inline-block; color: #333; font-family: monospace; font-size: 14px;">${username}</div>
                      </div>
                      <div style="margin-bottom: 5px;">
                        <div style="display: inline-block; width: 80px; color: #666; font-weight: 600;">🔑 Password:</div>
                        <div style="display: inline-block; color: #e74c3c; font-family: monospace; font-weight: 600; font-size: 14px;">${password}</div>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- What's Next Section -->
                <tr>
                  <td style="padding: 20px 30px;">
                    <div style="background: #e3f2fd; border-radius: 12px; padding: 20px;">
                      <h3 style="margin: 0 0 15px; color: #1e3c72; font-size: 16px;">🚀 What's Next?</h3>
                      <div style="margin-bottom: 10px; display: flex; align-items: start;">
                        <span style="font-size: 18px; margin-right: 10px;">1️⃣</span>
                        <span style="color: #555;">Login to your admin dashboard using the credentials above</span>
                      </div>
                      <div style="margin-bottom: 10px; display: flex; align-items: start;">
                        <span style="font-size: 18px; margin-right: 10px;">2️⃣</span>
                        <span style="color: #555;">Complete your hospital profile with additional details</span>
                      </div>
                      <div style="margin-bottom: 10px; display: flex; align-items: start;">
                        <span style="font-size: 18px; margin-right: 10px;">3️⃣</span>
                        <span style="color: #555;">Add doctors, staff, and manage departments</span>
                      </div>
                      <div style="display: flex; align-items: start;">
                        <span style="font-size: 18px; margin-right: 10px;">4️⃣</span>
                        <span style="color: #555;">Start accepting patient appointments</span>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Security Notice -->
                <tr>
                  <td style="padding: 0 30px;">
                    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px;">
                      <div style="color: #856404; font-size: 14px; display: flex; align-items: center;">
                        <span style="font-size: 20px; margin-right: 10px;">⚠️</span>
                        <span><strong>Security Notice:</strong> Please change your password immediately after your first login for security purposes.</span>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Action Buttons -->
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <a href="http://localhost:3000/login" style="display: inline-block; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 14px 35px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      🚀 Login to Dashboard
                    </a>
                    <a href="http://localhost:3000/reset-password" style="display: inline-block; background: #6c757d; color: white; padding: 14px 35px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      🔑 Reset Password
                    </a>
                  </td>
                </tr>

                <!-- Features Overview -->
                <tr>
                  <td style="padding: 0 30px;">
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 20px;">
                      <h3 style="margin: 0 0 15px; color: #1e3c72; font-size: 16px;">✨ Features Now Available to You</h3>
                      <div style="margin-bottom: 8px; display: flex; align-items: center;">
                        <span style="font-size: 16px; margin-right: 10px;">📊</span>
                        <span style="color: #555;">Real-time analytics and reports</span>
                      </div>
                      <div style="margin-bottom: 8px; display: flex; align-items: center;">
                        <span style="font-size: 16px; margin-right: 10px;">👨‍⚕️</span>
                        <span style="color: #555;">Staff and doctor management</span>
                      </div>
                      <div style="margin-bottom: 8px; display: flex; align-items: center;">
                        <span style="font-size: 16px; margin-right: 10px;">💊</span>
                        <span style="color: #555;">Inventory and pharmacy management</span>
                      </div>
                      <div style="margin-bottom: 8px; display: flex; align-items: center;">
                        <span style="font-size: 16px; margin-right: 10px;">💰</span>
                        <span style="color: #555;">Billing and payment processing</span>
                      </div>
                      <div style="display: flex; align-items: center;">
                        <span style="font-size: 16px; margin-right: 10px;">📅</span>
                        <span style="color: #555;">Appointment scheduling system</span>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Help & Support -->
                <tr>
                  <td style="padding: 20px 30px; background: #f8f9fa;">
                    <div style="text-align: center;">
                      <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                        📞 <strong>Need Help?</strong> Contact our support team
                      </p>
                      <p style="margin: 0; color: #999; font-size: 12px;">
                        📧 support@hospitalmanagement.com | 📞 +91 12345 67890 | 🕐 24/7 Available
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #2c3e50; padding: 20px; text-align: center;">
                    <div style="color: #95a5a6; font-size: 12px; line-height: 1.6;">
                      <p style="margin: 0 0 5px;">© 2024 Hospital Management System. All rights reserved.</p>
                      <p style="margin: 0;">
                        <a href="#" style="color: #95a5a6; text-decoration: none;">Privacy Policy</a> | 
                        <a href="#" style="color: #95a5a6; text-decoration: none;">Terms of Service</a>
                      </p>
                    </div>
                  <tr>
                </tr>
            </table>
          </tr>
      </body>
      </html>
    `
  };
  
  return await transporter.sendMail(mail);
};

const sendHospitalRejectionEmail = async (email, hospital_name) => {
  const mail = {
    from: '"Hospital Management System" <priyanshuredu12@gmail.com>',
    to: email,
    subject: `❌ Hospital Registration Update - ${hospital_name} | Hospital Management System`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hospital Registration Update</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                
                <!-- Header Section -->
                <tr>
                  <td style="background: linear-gradient(135deg, #c31432 0%, #240b36 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">❌ 🏥</div>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Registration Update</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Application Status: Not Approved</p>
                  </td>
                </tr>

                <!-- Message Body -->
                <tr>
                  <td style="padding: 40px 30px 20px;">
                    <h2 style="color: #2c3e50; margin: 0 0 10px; font-size: 24px;">Dear Applicant,</h2>
                    <div style="background: #ffebee; border-radius: 10px; padding: 15px; margin: 15px 0;">
                      <p style="margin: 0; color: #c62828; font-size: 16px; font-weight: 600;">
                        🏥 Hospital Name: ${hospital_name}
                      </p>
                      <p style="margin: 10px 0 0; color: #c62828; font-size: 14px;">
                        📅 Status: REJECTED
                      </p>
                    </div>
                    <p style="color: #555; line-height: 1.6; margin: 0 0 15px; font-size: 16px;">
                      We regret to inform you that your hospital registration application has been reviewed and cannot be approved at this time.
                    </p>
                  </td>
                </tr>
                  <td style="padding: 20px 30px;">
                    <div style="background: #e3f2fd; border-radius: 12px; padding: 20px;">
                      <h3 style="margin: 0 0 15px; color: #1e3c72; font-size: 16px;">📝 What You Can Do Next</h3>
                      <div style="margin-bottom: 10px; display: flex; align-items: start;">
                        <span style="font-size: 18px; margin-right: 10px;">1️⃣</span>
                        <span style="color: #555;">Review the rejection reason mentioned above</span>
                      </div>
                      <div style="margin-bottom: 10px; display: flex; align-items: start;">
                        <span style="font-size: 18px; margin-right: 10px;">2️⃣</span>
                        <span style="color: #555;">Make necessary corrections to your application</span>
                      </div>
                      <div style="margin-bottom: 10px; display: flex; align-items: start;">
                        <span style="font-size: 18px; margin-right: 10px;">3️⃣</span>
                        <span style="color: #555;">Ensure all documents are valid and up-to-date</span>
                      </div>
                      <div style="display: flex; align-items: start;">
                        <span style="font-size: 18px; margin-right: 10px;">4️⃣</span>
                        <span style="color: #555;">Submit a new application for reconsideration</span>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Reapplication Process -->
                <tr>
                  <td style="padding: 0 30px;">
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 20px;">
                      <h3 style="margin: 0 0 15px; color: #1e3c72; font-size: 16px;">🔄 Reapplication Process</h3>
                      <div style="margin-bottom: 8px; display: flex; align-items: center;">
                        <span style="font-size: 16px; margin-right: 10px;">✓</span>
                        <span style="color: #555;">Correct the issues identified in the rejection reason</span>
                      </div>
                      <div style="margin-bottom: 8px; display: flex; align-items: center;">
                        <span style="font-size: 16px; margin-right: 10px;">✓</span>
                        <span style="color: #555;">Gather all required supporting documents</span>
                      </div>
                      <div style="margin-bottom: 8px; display: flex; align-items: center;">
                        <span style="font-size: 16px; margin-right: 10px;">✓</span>
                        <span style="color: #555;">Fill out a fresh application form</span>
                      </div>
                      <div style="display: flex; align-items: center;">
                        <span style="font-size: 16px; margin-right: 10px;">✓</span>
                        <span style="color: #555;">Wait for the review process (3-5 business days)</span>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Contact Support -->
                <tr>
                  <td style="padding: 20px 30px;">
                    <div style="background: #fff3e0; border-radius: 12px; padding: 20px; text-align: center;">
                      <h3 style="margin: 0 0 10px; color: #e65100; font-size: 16px;">❓ Need Clarification?</h3>
                      <p style="margin: 0 0 15px; color: #555; font-size: 14px;">
                        If you believe this decision was made in error or need more details about the rejection, please contact our support team.
                      </p>
                      <div style="background: white; border-radius: 8px; padding: 10px;">
                        <p style="margin: 5px 0; color: #666; font-size: 13px;">
                          📧 appeals@hospitalmanagement.com
                        </p>
                        <p style="margin: 5px 0; color: #666; font-size: 13px;">
                          📞 +91 12345 67890 (Ext. 405)
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Action Buttons -->
                <tr>
                  <td style="padding: 20px 30px 30px; text-align: center;">
                    <a href="http://localhost:3000/hospital/register" style="display: inline-block; background: linear-gradient(135deg, #c31432 0%, #240b36 100%); color: white; padding: 14px 35px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      📝 Submit New Application
                    </a>
                    <a href="http://localhost:3000/contact-support" style="display: inline-block; background: #6c757d; color: white; padding: 14px 35px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      💬 Contact Support
                    </a>
                  </td>
                </tr>

                <!-- Help & Support -->
                <tr>
                  <td style="padding: 20px 30px; background: #f8f9fa;">
                    <div style="text-align: center;">
                      <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                        📞 <strong>Need Help?</strong> Contact our support team
                      </p>
                      <p style="margin: 0; color: #999; font-size: 12px;">
                        📧 support@hospitalmanagement.com | 📞 +91 12345 67890 | 🕐 24/7 Available
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #2c3e50; padding: 20px; text-align: center;">
                    <div style="color: #95a5a6; font-size: 12px; line-height: 1.6;">
                      <p style="margin: 0 0 5px;">© 2024 Hospital Management System. All rights reserved.</p>
                      <p style="margin: 0;">
                        <a href="#" style="color: #95a5a6; text-decoration: none;">Privacy Policy</a> | 
                        <a href="#" style="color: #95a5a6; text-decoration: none;">Terms of Service</a>
                      </p>
                    </div>
                  </td>
                </tr>
            </table>
          </tr>
      </body>
      </html>
    `
  };
  
  return await transporter.sendMail(mail);
};

module.exports = {sendWelcomeEmail ,sendHospitalApprovalEmail ,sendHospitalRejectionEmail}