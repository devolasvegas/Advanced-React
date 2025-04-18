import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text: string): string {
  return `
    <div style="border: 1px solid black; padding: 20px; font-family: sans-serif; line-height: 2; font-size: 20px;">
      <h2>Hello There!</h2>
      <p>${text}</p>
      <p>😘, The Team</p>
    </div>
  `;
}

export async function sendPasswordResetEmail(
  resettoken: string,
  to: string
): Promise<void> {
  // send user reset token email
  const info = await transport.sendMail({
    to,
    from: 'noreply@devondaviau.com',
    subject: 'Your Password Reset Token',
    html: makeANiceEmail(
      `Your Password Reset Token is here! \n\n <a href="${process.env.FRONTEND_URL}/reset?token=${resettoken}">Click Here to Reset</a>`
    ),
  });

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log('Password reset email sent successfully to:', to);
    console.log(
      `💌 Message Sent! Preview it at: ${getTestMessageUrl(info) as string}`
    );
  }
}
