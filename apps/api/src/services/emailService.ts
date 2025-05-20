import { Resend } from "resend"
import config from "../config/config"

export interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

export class EmailService {
  private resend: Resend

  constructor() {
    this.resend = new Resend(config.email.resendApiKey)
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const { error } = await this.resend.emails.send({
        from: `${config.email.fromName} <${config.email.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      })

      if (error) {
        console.error("Failed to send email:", error)

        return false
      }

      return true
    } catch (error) {
      console.error("Failed to send email:", error)

      return false
    }
  }

  private getBaseTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email from ${config.email.fromName}</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333333;
            background-color: #f5f5f5;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          }
          .email-header {
            background-color: #4361ee;
            color: white;
            padding: 30px;
            text-align: center;
          }
          .email-body {
            padding: 30px;
            line-height: 1.6;
          }
          .email-footer {
            background-color: #f9f9f9;
            padding: 20px 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
            border-top: 1px solid #eeeeee;
          }
          .btn {
            display: inline-block;
            background-color: #4361ee;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            transition: background-color 0.2s;
          }
          .btn:hover {
            background-color: #3a56d4;
          }
          .link-display {
            margin-top: 15px;
            padding: 12px;
            background-color: #f5f5f5;
            border-radius: 4px;
            word-break: break-all;
            font-size: 14px;
            color: #666;
          }
          @media only screen and (max-width: 600px) {
            .email-header, .email-body, .email-footer {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <img src="${config.appUrl}/logo.png" alt="${config.email.fromName}" width="150" style="max-width: 100%;">
          </div>
          <div class="email-body">
            ${content}
          </div>
          <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} ${config.email.fromName}. All rights reserved.</p>
            <p>If you didn't request this email, please ignore it or contact support.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${config.appUrl}/api/auth/verify-email/${token}`

    const emailContent = `
      <h2>Verify Your Email Address</h2>
      <p>Thank you for signing up! To get started, please verify your email address.</p>
      
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="btn">Verify Email Address</a>
      </div>
      
      <p>If the button above doesn't work, copy and paste this link into your browser:</p>
      <div class="link-display">${verificationUrl}</div>
      
      <p style="margin-top: 25px;">This verification link will expire in 24 hours.</p>
    `

    const result = await this.sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      text: `Please verify your email address by clicking the following link: ${verificationUrl}\nThis link will expire in 24 hours.`,
      html: this.getBaseTemplate(emailContent),
    })

    if (result) {
      console.log("Email sent")
    }

    return result
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${config.appUrl}/api/auth/reset-password/${token}`

    const emailContent = `
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below to set a new password.</p>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </div>
      
      <p>If the button above doesn't work, copy and paste this link into your browser:</p>
      <div class="link-display">${resetUrl}</div>
      
      <p style="margin-top: 25px;">This reset link will expire in 24 hours.</p>
      <p><strong>Note:</strong> If you didn't request this password reset, you can safely ignore this email.</p>
    `

    return this.sendEmail({
      to: email,
      subject: "Reset Your Password",
      text: `You requested a password reset. Please click the following link to reset your password: ${resetUrl}\nThis link will expire in 24 hours.\nIf you didn't request a password reset, you can safely ignore this email.`,
      html: this.getBaseTemplate(emailContent),
    })
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const emailContent = `
      <h2>Welcome to ${config.email.fromName}!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for joining us! We're excited to have you on board.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${config.appUrl}/dashboard" class="btn">Go to Dashboard</a>
      </div>
      
      <p>Here are a few things you can do to get started:</p>
      <ul style="padding-left: 20px;">
        <li>Complete your profile</li>
        <li>Explore the dashboard</li>
        <li>Check out our documentation</li>
      </ul>
      
      <p>If you have any questions, feel free to reply to this email. Our support team is here to help!</p>
      <p>Best regards,<br>The ${config.email.fromName} Team</p>
    `

    return this.sendEmail({
      to: email,
      subject: `Welcome to ${config.email.fromName}!`,
      text: `Hello ${name},\n\nThank you for joining us! We're excited to have you on board.\n\nHere are a few things you can do to get started:\n- Complete your profile\n- Explore the dashboard\n- Check out our documentation\n\nIf you have any questions, feel free to reply to this email. Our support team is here to help!\n\nBest regards,\nThe ${config.email.fromName} Team`,
      html: this.getBaseTemplate(emailContent),
    })
  }
}

export const emailService = new EmailService()
