# CMS and Image Assets

## CMS Content Shape

| Group | Editable content |
|---|---|
| `hero` | Eyebrow, title, description, emphasis, note, alignment |
| `assets` | Hero, case, profile, consultation, workshop, operations image URLs |
| `signals` | Credibility metrics |
| `services` | Services and example tags |
| `caseStudy` | Challenge, action, outcome, scope |
| `profile` | Name, heading, quote, biography, credentials |
| `faqs` | Consultation objections and answers |
| `finalCta` | Title, body, note, alignment |

Newlines are saved as `\n` and rendered by `Multiline` in `Home.tsx`. The hero newline and center alignment were verified through the CMS.

## Asset Fields

| Field | Role |
|---|---|
| `heroImageUrl` | Hero photo |
| `caseImageUrl` | Case-study graphic/photo |
| `profileImageUrl` | Profile photo |
| `consultationImageUrl` | Consultation visual-proof card |
| `workshopImageUrl` | Training visual-proof card |
| `operationsImageUrl` | Operations/team visual-proof card |

Current image URLs begin with `/manus-storage/`. Copy these assets to S3, R2, or a CDN before external deployment and update the CMS URLs. The live authoritative content is in `site_contents.contentJson`; export it with authorized database access before an external migration.
