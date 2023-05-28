## Crypto API for SoftWare Engineering School 3.0

Crypto Api for BTC subscribers (Genesis &amp; KMA)

Зробив на Node.Js (бо потрохи вже забуваю PHP) і часу було обмаль (лише в неділю почав) 

і Docker не встиг зробити (але там лише Node.Js) 
пишу зараз тестове завдання на вакансію на React + Formik (теж на завтра).

Зробив можливість дивитися курс не тільки у гривні (після /rate/ пишіть будь-яку валюту).

>  🔍 Base URL:  btc.speaking.odessa.ua/api

## How to check App functions  🚀

@GET [/rate](http://btc.speaking.odessa.ua/api/rate/)

@GET [/rate/usd](http://btc.speaking.odessa.ua/api/rate/usd)

@GET [/rate/eur](http://btc.speaking.odessa.ua/api/rate/eur)

@GET [/rate/chf](http://btc.speaking.odessa.ua/api/rate/chf)

@POST [/subscribe] 

@POST [/sendEmails] 


## В коді все с коментарями, але можу і сюди винести:

1. `@GET/rate` беремо курс BTC_UAH по API з сервера api.exchangerate.host
після завантаження - відправляємо користувачи.
2. `@GET/rate/:coin` Завантажимо актуальний курс *любої валюти EUR,USD,CAD,JPY,UAH,...* по BTC по API з сервера api.exchangerate.host
так само але ще і можна вказати до якої валюти курс біткойна цікавить
3. `@POST/subscribe` Додаємо нового підписника (email адресу) в текстовий файл (з перевіркою дублювання та валідацією)
приймаємо email адресу -> перевіряємо що це дійсно email (регулярний вираз) -> шукаємо такий в файлі -> якщо не знайшли додаємо в кінець (і додаємо \n - кінець строки)
4. `@POST/sendEmails` Відправляємо всім підписникам email Листа з поточним курсом пари BTC_UAH
в циклі читаємо підписників із нашого txt-файлу та за допомогою nodemailer - відправляємо кожному користувачу листа.
для перевірки відправки Email використав сервіс "ethereal.email". все працює :)
