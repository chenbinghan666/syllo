# Syllo privacy notes

Syllo is a local Windows client for a user's existing Moodle account. It has no Syllo account system, advertising SDK, analytics telemetry, or Syllo cloud sync in v0.8.0.

## What stays on the computer

- School URL and non-secret connection metadata.
- Moodle authorization returned after the school's own login flow.
- A learning snapshot containing courses, activities, assignments, notices, grades, and related metadata accessible to the signed-in account.
- Interface preferences and course-term overrides.

Saved authorization and learning snapshots are encrypted for the current Windows user and separated by school and account. Application data is stored under `%APPDATA%\Syllo`, not inside the portable folder.

## What Syllo does not do

- It does not save the Moodle password. Credentials are entered only in the school's login page.
- It does not submit assignments, answer quizzes, edit grades, or bypass school access controls.
- It does not send learning data to a Syllo-operated server.
- It does not add analytics or advertising trackers.

## Opening the original Moodle page

When supported by the school, Syllo asks Moodle for a short-lived, single-use web login key and opens the original activity page. The long-lived token is not added to the shared page URL. The school can restrict or disable this function.

## Removing local data

Disconnecting an account removes that connection's saved authorization and learning cache. Uninstalling the application does not automatically remove `%APPDATA%\Syllo`; delete that folder after closing Syllo if a complete local removal is required.

## Reporting problems safely

Before sharing a screenshot or log, remove names, student numbers, email addresses, course members, grades, tokens, cookies, private URLs, and local paths. Do not attach the `%APPDATA%\Syllo` folder to a public issue.
