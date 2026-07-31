# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Skild TanStack Start application. Changes include: adding `PostHogProvider` to the root route with a Vite reverse-proxy setup, a Clerk-aware `PostHogIdentify` component that calls `posthog.identify` / `posthog.reset` on auth state changes, and client-side event captures for all key user actions across the homepage and skill cards.

| Event name | Description | File |
|---|---|---|
| `skill_install_command_copied` | User copies a skill's install command from the SkillCard clipboard button. | `src/components/SkillCard.tsx` |
| `skill_opened` | User clicks the Open button on a SkillCard to navigate to the skill detail page. | `src/components/SkillCard.tsx` |
| `browse_registry_clicked` | User clicks the Browse Registry CTA on the home page hero section. | `src/routes/index.tsx` |
| `publish_skill_clicked` | User clicks the Publish Skill CTA on the home page hero section. | `src/routes/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/213724/dashboard/786737)
- [Skill install commands copied](https://eu.posthog.com/project/213724/insights/UR7dR9gR)
- [Skill opens](https://eu.posthog.com/project/213724/insights/J1iwV86a)
- [Homepage CTAs trend](https://eu.posthog.com/project/213724/insights/446BB5zp)
- [Daily active users](https://eu.posthog.com/project/213724/insights/dXrjss3J)
- [Registry discovery to install funnel](https://eu.posthog.com/project/213724/insights/iMUjRF7H)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the PostHog env var names (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `PostHogIdentify` component re-identifies on every mount where `isSignedIn` is true, so returning sessions are covered, but verify this holds after a page refresh.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
