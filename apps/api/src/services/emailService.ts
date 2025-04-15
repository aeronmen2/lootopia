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

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${config.appUrl}/api/auth/verify-email/${token}`

    return this.sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      text: `Please verify your email address by clicking the following link: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
          <p style="margin: 20px 0;">
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    })
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${config.appUrl}/api/auth/reset-password/${token}`

    return this.sendEmail({
      to: email,
      subject: "Reset Your Password",
      text: `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>You requested a password reset. Please click the button below to set a new password:</p>
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    })
  }
}

export const emailService = new EmailService()
