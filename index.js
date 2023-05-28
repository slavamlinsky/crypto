require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const fetch = require("node-fetch");
const nodeMailer = require("nodemailer");

const PORT = process.env.PORT || 5000;

const transporter = nodeMailer.createTransport({ 
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "cortney.berge@ethereal.email",
      pass: "nDb4eW4tNHunu1Z7yU",
    }
});

const app = express();
app.use(cors());
app.use(express.json());

// @GET /rate Завантажимо актуальний курс BTC_UAH по API з сервера api.exchangerate.host
app.get("/api/rate", (req, res) => {
  let kurs;

  let url =
    "https://api.exchangerate.host/latest?base=BTC&symbols=UAH&amount=1";
  let settings = { method: "Get" };

  try {
    fetch(url, settings)
      .then((res) => res.json())
      .then((json) => {
        kurs = {
          date: new Date(),
          pair: "BTC_UAH",
          kurs: json.rates.UAH,
          status: "success",
        };
        res.send(kurs);
      });
  } catch (e) {
    return res.status(400).json({ message: "Error during getting course" });
  }
});
// @GET /rate/:coin Завантажимо актуальний курс *любої валюти EUR,USD,CAD,JPY,UAH,...* по BTC по API з сервера api.exchangerate.host
app.get("/api/rate/:coin", (req, res) => {
  console.log(req.params.coin);
  let coin = req.params.coin.toUpperCase();
  let kurs;
  let url =
    "https://api.exchangerate.host/latest?base=BTC&symbols=" +
    coin +
    "&amount=1";
  let settings = { method: "Get" };

  try {
    fetch(url, settings)
      .then((res) => res.json())
      .then((json) => {
        //console.log(json.base);
        kurs = {
          date: new Date(),
          pair: `BTC_${coin}`,
          kurs: json.rates[coin],
          status: "success",
        };
        res.send(kurs);
      });
  } catch (e) {
    return res.status(400).json({ message: "Error during getting course" });
  }
});

// @POST /subscribe Додаємо нового підписника (email адресу) в текстовий файл (з перевіркою дублювання та валідацією)
app.post("/api/subscribe", (req, res) => {
  try {
    const { email } = req.body;
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //eslint-disable-line

    if (email && reg.test(email)) {
      // Читаем текстовый файл с email адресами в массив (каждая строка - новый элемент)
      let result = fs.readFileSync("subscribers.txt", "utf-8");
      let array = fs
        .readFileSync("subscribers.txt", "utf-8")
        .toString()
        .replace(/\r\n/g, "\n")
        .split("\n");

      if (!array.includes(email.toString())) {
        // Записываем новый email адрес в конец существующего файла
        if (array.length !== 0) {
          fs.writeFileSync("subscribers.txt", result + "\n" + email);
        } else {
          fs.writeFileSync("subscribers.txt", email);
        }
        return res.json({
          message: "Subscription completed successfully",
        });
      } else {
        return res.status(409).json({ message: "Email already exists" });
      }
    } else {
      return res.status(400).json({ message: "Incorrect Email" });
    }
  } catch (e) {
    return res.status(400).json({ message: "Error during subscription" });
  }
});

// @POST /sendEmails Відправляємо всім підписникам email Листа з поточним курсом пари BTC_UAH
app.post("/api/sendEmails", async (req, res) => {
  let actual;
  let url =
    "https://api.exchangerate.host/latest?base=BTC&symbols=UAH&amount=1";
  let settings = { method: "Get" };

  try {
    // спочатку отримаємо актуальний курс (для відправки підписникам)
    fetch(url, settings)
      .then((res) => res.json())
      .then((json) => {
        actual = json.rates.UAH;
        // Читаємо файл з підписниками і кожному відправляємо листа
        var array = fs.readFileSync("subscribers.txt").toString().split("\n");
        for (let i in array) {
          transporter.sendMail({
            from: `"Crypto.Courses"`,
            to: array[i],
            subject: "Актуальний курс BTC_UAH",
            text: "",
            html: `
                        <div style="padding: 15px; font-size:1.5em; background: linear-gradient(45deg, #e3ffe7 0%, #d9e7ff 100%); font-family: "Helvetica Neue", Helvetica, Candara;">
                        Курс BTC_UAH: <strong>${actual}<span style="font-size:.875em;">грн за 1 BitCoin</span></strong><br/><br/><span style="font-size:.5em;">${Date()}</span>
                        <br/><br/>Слава Україні! Смерть ворогам!<br/><br/>
                        <span style="font-size:.75em;"><a target='_blank' href='https://u24.gov.ua/uk'>Вірь в Україну та підтримуй ЗСУ разом з United24</a></span><br/></div>
                        `,
          });
        }
        return res.json({
          message: "All emails were successfully sent",
        });
      });
  } catch (e) {
    return res.status(400).json({ message: "Error during getting course" });
  }
});

const server = app.listen(PORT, () => {
  console.log("Server is listening on localhost:" + PORT);
});
