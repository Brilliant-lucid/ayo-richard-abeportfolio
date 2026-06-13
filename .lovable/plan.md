## Goal
Send an email to **Abeayo6@gmail.com** every time someone submits the contact form, while still saving the message to the admin inbox.

## How it works
1. Set up Lovable's built-in email infrastructure (verified sender subdomain — no third-party account or API key needed from you).
2. Create a branded "New contact message" email template that includes the sender's name, email, subject, and message.
3. Update the contact form's submit handler so that after saving the message to the database, it also queues an email notification to Abeayo6@gmail.com.
4. Existing admin inbox at `/admin/messages` keeps working as a backup record.

## What you'll need to do
- Click "Set up email domain" when prompted, and follow the short DNS setup (one-time, ~5 min). Notifications start arriving as soon as DNS verifies.

## Out of scope
- SMS/WhatsApp notifications (can be added later via Twilio if you want).
- Reply-from-email functionality — the notification will show the visitor's email so you can reply directly from Gmail.

Reply "approve" to build it.