# Changelog

## v0.8.1 — 2026-11-24

- Fixed Moodle original pages asking for the school login again after a restart: the web session from the school login window is reused first, and when "remember login" is on its cookies now survive a restart (stored by Chromium for up to 12 hours).
- Respected Moodle's autologin rate limit (one key per user about every 6 minutes) instead of silently failing; the original-page window now says when to retry or to choose "Update web login".
- Stopped treating an external SSO page as a signed-in Moodle page, and stopped reporting web login as ready after a failed restoration.
- Signing out or switching accounts now clears that school's web cookies and session state.
- Added web-session regression tests to CI and made the manual-schedule UI test use the currently displayed week.
- Original-page restoration after restart still awaits end-to-end confirmation with a real XMUM account.

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

- Real-account validation currently covers XMUM data sync; other Moodle sites may expose fewer services.
- External activities such as Turnitin or Mediasite may only provide an original-page link.
- Timetables that exist only inside attachments are not parsed.
- The Windows binaries are not code-signed and may trigger SmartScreen.
