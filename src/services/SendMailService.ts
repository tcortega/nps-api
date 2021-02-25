import nodemailer, { Transporter } from "nodemailer";

class SendMailService {
  private client: Transporter;
  constructor() {
    nodemailer.createTestAccount().then((mail) => {
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: mail.user, // generated ethereal user
          pass: mail.pass, // generated ethereal password
        },
      });

      this.client = transporter;
    });
  }

  async execute(to: string, subject: string, body: string) {
    const message = await this.client.sendMail({
      to,
      subject,
      html: body,
      from: "NPS <noreply@nps.com.br>",
    });

    console.log("Message sent: %s", message.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();
