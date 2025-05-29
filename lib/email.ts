import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

const sendVerificationEmail = async (email: string, token: string) => {
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`

    try {
        await resend.emails.send({
            from: "Aether <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email address",
            html: emailHtmlTemplate(confirmUrl)
        })
    } catch (error) {
        console.error("Failed to send verification email", error);
    }
}

export { sendVerificationEmail };

function emailHtmlTemplate(verifyUrl: string) {
    return `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>👋 Welcome to Your App!</h2>
      <p>Thanks for signing up. Please verify your email address to get started.</p>
      
      <a 
        href="${verifyUrl}"
        style="
          display: inline-block;
          background-color: #3b82f6;
          color: white;
          padding: 12px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin-top: 20px;
        "
      >
        ✅ Verify Email
      </a>

      <p style="margin-top: 30px; font-size: 14px; color: #555;">
        Or copy and paste this URL into your browser:<br />
        <span style="color: #3b82f6;">${verifyUrl}</span>
      </p>

      <p>
      This is an auto-generated mail. Please don't reply to this.
      </p>
    </div>
  `
}
