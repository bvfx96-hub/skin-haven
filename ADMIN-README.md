# Skin Haven admin
Open http://localhost:3000/admin.html
Initial password: private-data/admin-login.txt (keep private; do not upload or share).

Features: saved appointment requests with internal notes/status, editable mobile banner, and Health Tips cards (add/edit/publish/unpublish). Card article URLs link to existing pages; this panel does not write full treatment articles or upload images. Use an existing /assets/... image path or an HTTPS image URL.
Status changes do not send patient confirmations; contact the patient separately.
Email notifications still need RESEND_API_KEY and APPOINTMENT_FROM.

Data is stored in private-data/store.json, with atomic writes. Back up the private-data directory securely. For hosting, use one Node process with persistent storage and HTTPS; do not deploy on ephemeral storage or run multiple instances against this JSON store. Sessions expire after 8 hours and on server restart. Credentials and patient data are not public web assets and are excluded from Git.

Run: node server.js
Tests: node test-admin.js (isolated temporary data; no live email sent).
