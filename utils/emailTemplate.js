export const generateForgotPasswordEmailTemplate = (resetPasswordUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">

        <div style="background:#4f46e5; padding:20px; text-align:center; color:#fff;">
          <h2>Reset Your Password</h2>
        </div>

        <div style="padding:30px; color:#333;">
          <p>Hello 👋</p>

          <p>We received a request to reset your password.</p>

          <p>This link will expire in <b>15 minutes</b>.</p>

          <div style="text-align:center; margin:30px 0;">
            <a href="${resetPasswordUrl}"
               style="background:#4f46e5; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px;">
              Reset Password
            </a>
          </div>

          <p>If you did not request this, please ignore this email.</p>

          <p>Thanks,<br/><b>Your App Team</b></p>
        </div>

        <div style="background:#f1f1f1; text-align:center; padding:10px; font-size:12px;">
          © 2026 Your App. All rights reserved.
        </div>
        
            <p>${resetPasswordUrl}</p>
      </div>
    </div>
  `;
};



export function generateRequestAcceptedTemplate(supervisorName) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#10b981;">✅ Supervisor Request Accepted</h2>
      <p>Your supervisor request has been accepted by <strong>${supervisorName}</strong>.</p>
      <p>You can now start working on your project and upload files.</p>
    </div>
  `;
}

/**
 * Request Rejected Email
 */
export function generateRequestRejectedTemplate(supervisorName) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#ef4444;">❌ Supervisor Request Rejected</h2>
      <p>Your supervisor request has been rejected by <strong>${supervisorName}</strong>.</p>
      <p>You can try requesting another supervisor.</p>
    </div>
  `;
}
