# Moodle link onboarding and desktop feasibility

Checked 2026-11-14. Product scope remains courses, assignments and submission states, announcements/notifications, materials, grades, quizzes/exams and calendars. Calendar-only subscription is insufficient.

## Verified on XMUM

The unauthenticated, read-only `tool_mobile_get_public_config` request returned HTTP 200, `enablewebservices=1`, `enablemobilewebservice=1`, `typeoflogin=2` and an `admin/tool/mobile/launch.php` entry. The configuration identifies Xiamen University Malaysia Moodle. Reproduce with `python tools/check_moodle_site.py https://l.xmu.edu.my --output docs/xmum-public-capabilities.json`.

The logged-in user's calendar export page was also inspected. It offers event categories, time ranges, Get calendar URL and Export. No subscription secret was generated or saved. A calendar feed can supplement the product but cannot supply course contents, grades or submission status.

No mobile access token was issued or extracted during this investigation. Account-authenticated REST module access has not yet been verified. Public enablement must not be presented as successful account synchronization.

## Full-data route

Use the official mobile service, with the user's normal school login and authorization, rather than calendar import or HTML as the primary adapter. The school URL discovers capabilities and login method; it is not itself authorization. In the official Moodle source, login mode 2 means external-browser login. The launch flow creates or reuses a mobile service token and returns it through a client URL scheme. A desktop client must validate its one-time passport before accepting that response.

| Dashboard module | Candidate official read functions |
|---|---|
| Account and actual supported function list | `core_webservice_get_site_info` |
| Enrolled courses | `core_enrol_get_users_courses` |
| Course sections, modules and resource/file metadata | `core_course_get_contents` |
| Assignments and submission states | `mod_assign_get_assignments`, `mod_assign_get_submission_status` |
| Course announcements | `mod_forum_get_forums_by_courses`, `mod_forum_get_forum_discussions` |
| Grade items | `gradereport_user_get_grade_items` |
| Calendar and task deadlines | `core_calendar_get_calendar_events`, `core_calendar_get_calendar_upcoming_view` |
| Quizzes and attempts | `mod_quiz_get_quizzes_by_courses`, `mod_quiz_get_user_attempts` |

These functions exist in official Moodle source, not an authenticated inventory from XMUM. Obtain the site's actual function inventory after authorization, then fetch every required module with pagination, preserving missing/hidden status. Personal notifications require their own message/notification functions; announcements must not be relabeled as complete personal notifications. Third-party plugins (Turnitin, Mediasite etc.) need individual coverage checks. Schedules only present in attachments need a separate document-parsing feature. Nothing may claim to expose teacher-hidden content.

## Desktop route

Windows desktop is feasible. This machine has Edge WebView2 Runtime 157.0.4341.46. The current frontend is plain JavaScript/HTML/CSS and can be reused inside WebView2. A native .NET SDK is not currently installed; a build toolchain is still needed. No desktop executable has been built or launched by this investigation.

Proposed user flow: enter Moodle root URL → inspect public capabilities → open the normal school login in the external browser → authorize Syllo → validate callback → get account/function inventory → synchronize courses, assignments, resources, notices, grades and calendar → show the existing dashboard.

Keep tokens inside the local application's credential store; never put them in logs, frontend localStorage, shareable URLs or repository files. The official mobile token may permit more than reads; the client must call an explicit read-function allowlist and not claim that the server issued a read-only token. Use an isolated local UI, validate IPC origins, keep remote school pages away from native host privileges and do not disable browser security.

Required code changes: replace hardcoded school origin in parser/link validation with a verified connection profile; add mobile API adapter and API-to-dashboard normalization; implement external login callback and protected credentials; add paginated syncing, retry and per-module coverage reporting; package the native host. The existing browser extension remains a prototype, not the final link-onboarding architecture.

## Primary sources

- https://docs.moodle.org/503/en/Mobile_web_services
- https://docs.moodle.org/503/en/Calendar_export
- https://github.com/moodle/moodle/blob/MOODLE_405_STABLE/admin/tool/mobile/classes/api.php
- https://github.com/moodle/moodle/blob/MOODLE_405_STABLE/admin/tool/mobile/launch.php
- https://github.com/moodle/moodle/blob/MOODLE_405_STABLE/lib/db/services.php
- https://github.com/moodle/moodle/blob/MOODLE_405_STABLE/mod/assign/db/services.php
- https://github.com/moodle/moodle/blob/MOODLE_405_STABLE/mod/forum/db/services.php
- https://github.com/moodle/moodle/blob/MOODLE_405_STABLE/grade/report/user/db/services.php
- https://github.com/moodle/moodle/blob/MOODLE_405_STABLE/mod/quiz/db/services.php
- https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/overview-features-apis

## Implementation update: desktop v0.8.0

An Electron portable desktop prototype has now been packaged in releases/Syllo-Desktop-v0.8.0. The earlier no-executable statement describes the investigation stage, not current implementation. Onboarding, public capability check, isolated school browser-login window, callback passport validation, optional local encrypted token persistence, read API allowlist and dashboard normalization are implemented. Native launch and school login-page opening were observed. Account authentication and full live synchronization remain pending user login.

Unlike the proposed WebView2 host above, this runnable prototype uses verified official Electron 45.3.2 to reuse the existing frontend without installing a .NET SDK. It uses Moodle's browser-SSO entry in a dedicated isolated client window, not a browser extension. Original module URLs open isolated school windows sharing the login session. Adapter fixture tests cover assignment/team submission states, exact connected-school URLs, raw grades, announcement pagination, personal notifications and partial failures. These fixtures do not prove school-account end-to-end success.

### Live account validation

The user completed login in the desktop client's school window on 2026-11-14. The live dashboard displayed 19 enrolled courses, 492 material records and 389 combined announcement/personal-notification records. Counts include historical courses and do not establish complete third-party coverage. Assignment links rendered exact mod/assign/view.php activity IDs and announcement links rendered mod/forum/discuss.php discussion IDs. Fifteen browser UI fixtures passed, including connected-school original and detail URL preservation. Real native click-through verification was interrupted by concurrent user input and is still pending. Do not claim all three source-page categories have been opened successfully until observed.

## 2026-11-15 refresh

The client now uses account-isolated encrypted snapshots, cached-first startup, five-minute snapshot reuse, six-hour course-content response reuse, daily cover-image reuse and up to four concurrent module requests. Fresh submission statuses are fetched during sync; manual refresh bypasses response caching. Original course covers from the enrolled-course API are fetched by the native process without sending long-lived credentials to the renderer.

The missing homepage grades were caused by relying on the course total. The current homepage also displays published component grades and was visually verified against the actual account. Course names and covers, Moodle orange/neutral theme, uniform panel styles, removal of the avatar and Powered by Moodle credit were observed in the native app. The user refreshed the legacy browser authorization; after restarting, cached content and the updated authorization remained. Original web-page session restoration uses the official tool_mobile_get_autologin_key function with a private token, one-use short-lived key and same-origin redirect. Cross-restart original-page verification is pending the user's direct click because native automation did not reliably activate the link.
