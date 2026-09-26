# Appointment email setup
Recipient: samnthasen@gmail.com (fixed on the server).
Use Node 20.6+ and a verified Resend sender.
Set RESEND_API_KEY and APPOINTMENT_FROM in the hosting environment, or copy .env.example to .env locally and run:
node --env-file=.env server.js
Never commit API keys. Do not enter a Gmail password in the website.
Without configuration, the form reports email unavailable and retains WhatsApp fallback.
An accepted email request is not a confirmed appointment. Sunday and 24-hour rules are checked on the server.
Deploy with a Node backend; static-only hosting cannot run the email endpoint.
Provider documentation: https://resend.com/docs/api-reference/emails/send-email
