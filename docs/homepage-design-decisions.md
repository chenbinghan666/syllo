# Homepage design — 2026-11-15

User brief: main area for semester courses and grades; right narrow assignment list; course announcements instead of the subsequently removed timeline. Navigation follows the supplied rounded-pill reference; retain Moodle colors. Use iOS-like corners and improve interaction motion.

## Skill comparison

- UI UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill — GitHub API reported 149,635 stars at lookup. Already globally installed. Queried for student dashboard design; the generated landing-page pattern and blue palette were a poor fit and were rejected. A focused responsive-layout query supplied useful no-horizontal-overflow guidance.
- Impeccable: https://github.com/pbakaus/impeccable — GitHub API reported 110,368 stars at lookup. Installed the official `.agents/skills/impeccable` package into this project's `.agents/skills/impeccable`, preserving the existing global installation. Applied its Operate-mode layout and craft guidance with an independent read-only layout review.

Skill outputs are design guidance, not separate autonomous designers. The user's references and subsequent color/radius corrections take precedence. New project skill discovery is available on the next turn; its instructions were also read and used directly in this turn.

## Chosen implementation

Keep course cards prominent and separate grades and course announcements beneath them. Use a narrow assignment aside with badge/actions above full-width titles. Use neutral surfaces, Moodle-orange selection, pill controls, 26px panel and 30px rail corners. Course and assignment cards share a persisted per-course pastel color, as explicitly requested. Use 360ms Web Animations movement and subtle blur, with constant opacity, and respect reduced motion. Native View Transitions were removed after preview-engine prepaint failures. Preserve exact school links and raw published grades; empty grades remain explicit.

Backups of the pre-edit source are in `.dev/backups/main-aside/`. No account credentials or school data were included in this design record.
