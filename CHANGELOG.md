# Changelog

## v0.8.0 — 2026-11-15

- Added the Windows installer and portable x64 package.
- Replaced prototype entry points with a dedicated Electron desktop client.
- Added school-URL onboarding and the school's own login window.
- Added Windows-user encryption for saved authorization and learning snapshots.
- Added account- and school-isolated caching, stale-while-refresh startup, bounded parallel reads, and forced refresh.
- Added course, assignment, calendar, notice, material, grade, quiz, and personal-notification views.
- Added submitted, draft, overdue, team, and unknown-state handling without treating read failures as empty data.
- Added current-term inference, manual course adjustment, and automatic/manual reset behavior.
- Added Moodle original-page handoff through the official short-lived autologin interface where supported.
- Added a single orange/neutral visual system, light/dark modes, local fonts, and the Syllo identity.
- Added fictional demo data, regression tests, documentation, release screenshots, and a continuous interaction recording.

### Known limits

- Full end-to-end validation currently covers XMUM; other Moodle sites may expose fewer services.
- External activities such as Turnitin or Mediasite may only provide an original-page link.
- Timetables that exist only inside attachments are not parsed.
- The Windows binaries are not code-signed and may trigger SmartScreen.
