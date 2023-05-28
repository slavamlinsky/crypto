require('dotenv').config();
const nodeMailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },

      // отправка писем работает только по HTTPS (если есть SSL сертификат)

      // host: 'mail.speaking.odessa.ua',
      // port: 587,
      // secure: false,
      // auth: {
      //     user: 'admin@speaking.odessa.ua',
      //     pass: 'zv4jcoELFk'
      // }

      // host: "smtp.ethereal.email",
      // port: 587,
      // auth: {
      //   user: "cortney.berge@ethereal.email",
      //   pass: "nDb4eW4tNHunu1Z7yU",
      // }
    });
  }
  async sendMail(to, data) {
    await this.transporter.sendMail({
      from: `"Crypto.Courses"`,
      to,
      subject: "Актуальный курс BTC_UAH",
      text: "",
      html: `
                <div style="padding: 15px; background: linear-gradient(45deg, #e3ffe7 0%, #d9e7ff 100%); font-family: Candara;">Курс:${data}
                </div>
                `,
    });
  }
}

module.exports = new MailService();

