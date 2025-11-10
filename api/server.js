const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const cors = require('cors')

dotenv.config() // Load variables from .env

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Access variables via process.env
const PORT = process.env.PORT || 3000

const transporter = nodemailer.createTransport({
  host: process.env.RESEND_SMTP_HOST,
  port: process.env.RESEND_SMTP_PORT,
  auth: {
    user: process.env.RESEND_SMTP_USER,
    pass: process.env.RESEND_SMTP_PASS,
  },
})

app.post('/send-email', async (req, res) => {
  const { email, chartImage } = req.body

  const mailOptions = {
    from: 'Resend Test <onboarding@resend.dev>',
    to: email,
    subject: 'Your Chart Image',
    html: '<h1>Here is your chart!</h1>',
    attachments: [
      {
        filename: 'chart.png',
        content: chartImage.split('base64,')[1], // Remove the base64 prefix
        encoding: 'base64',
      },
    ],
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString())
    }
    res.status(200).send('Email sent: ' + info.response)
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
