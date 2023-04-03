FROM node:16

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

ENV MONGODB_USERNAME_CHATGPT_MVP=testing
ENV MONGODB_PASSWORD_CHATGPT_MVP=password
ENV MONGODB_URL_CHATGPT_MVP=mongoURL
ENV OPENAI_API_KEY=openaikey
ENV TWILIO_ACCOUNT_SID=twilioaccountsid
ENV TWILIO_AUTH_TOKEN=twilioauthtoken
ENV SEND_BLUE_API_KEY=hasdhasudhasuifh
ENV SEND_BLUE_SECRET=jaidjaisdjaisjd
ENV STRIPE_TEST_SECRET_KEY=jasdiadihasidhsaihd

RUN npm run build

CMD ["node", "build/app.js"]