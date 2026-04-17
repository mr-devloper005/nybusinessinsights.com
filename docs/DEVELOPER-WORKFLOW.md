# Developer Workflow

This is the required workflow for all site work.

## Branch Structure

- `main` = production
- `dev` = staging / integration
- `feature/*` = your work branch

## Important Rules

1. Never work directly on `main`
2. Never work directly on `dev`
3. Always create your work branch from `dev`
4. Always create a Pull Request into `dev`
5. Do not create feature PRs directly into `main`
6. `main` is only updated through `dev -> main`
7. Only work on assigned UI / theme / content changes unless specifically told otherwise
8. Do not change deployment, Docker, GitHub Actions, nginx, middleware, SEO logic, or core task logic without approval

---

# Full Step-by-Step Workflow

## 1. Clone the repo
Do this only once when setting up the project locally.

```bash
git clone git@github.com:mr-devloper005/site-base-template.git
cd site-base-template
```

If the repo is already cloned, skip this step.

---

## 2. Always start from `dev`
Before starting any new task, switch to `dev` and pull the latest code.

```bash
git checkout dev
git pull origin dev
```

This ensures you are starting from the latest shared branch.

---

## 3. Create a new feature branch
Create a new branch from `dev`.

Branch naming format:
- `feature/site-name-task`
- `feature/meivera-homepage-ui`
- `feature/welldanet-navbar-update`

Example:

```bash
git checkout -b feature/meivera-homepage-ui
```

Now all your changes must happen on this branch only.

---

## 4. Make your changes
Do your assigned work on this branch.

Examples:
- homepage UI updates
- theme/color changes
- navbar/footer styling
- card layout changes
- content/branding changes

Do not switch back to `dev` or `main` while working.

---

## 5. Check changed files
Before committing, check what changed.

```bash
git status
```

Optional:
```bash
git diff
```

---

## 6. Add your changes
If all changes are correct:

```bash
git add .
```

If you want to add specific files only:

```bash
git add path/to/file
```

---

## 7. Commit your changes
Use a clear commit message.

Example:

```bash
git commit -m "Update Meivera homepage UI"
```

More examples:
```bash
git commit -m "Refine navbar layout for Meivera"
git commit -m "Update card styling on article pages"
git commit -m "Remove dummy homepage copy"
```

---

## 8. Push your feature branch
First check your current branch:

```bash
git branch --show-current
```

Then push it:

```bash
git push -u origin feature/meivera-homepage-ui
```

Or directly:

```bash
git push -u origin $(git branch --show-current)
```

This uploads your branch to GitHub.

---

# Pull Request Workflow

## 9. Create Pull Request to `dev`
After pushing your branch:

1. Open the GitHub repository
2. Go to `Pull requests`
3. Click `New pull request`
4. Set:

- `base` = `dev`
- `compare` = your feature branch

Example:

```text
base: dev
compare: feature/meivera-homepage-ui
```

5. Click `Create pull request`

## Important
Do **not** create a feature PR directly into `main`.

Correct:
```text
feature/... -> dev
```

Wrong:
```text
feature/... -> main
```

---

## 10. Pull Request title and description
Use a clear PR title.

Example:
```text
Update Meivera homepage UI
```

Use this PR description format:

```text
What changed:
- updated homepage hero section
- changed button styling
- refined card spacing

Files changed:
- src/app/page.tsx
- src/components/home/hero-section.tsx
- src/components/shared/navbar.tsx

Notes:
- UI only
- no logic changed
```
---

## 11. Wait for review
Once PR is created:
- wait for review
- do not merge unless approved
- do not push directly to `dev`

---

# If review changes are requested

## 12. Stay on the same branch
Do not create a new branch for PR fixes.

```bash
git checkout feature/meivera-homepage-ui
```

## 13. Make requested fixes
Update the code.

## 14. Commit fixes
```bash
git add .
git commit -m "Apply PR review changes"
```

## 15. Push again
```bash
git push
```

Your existing PR will update automatically.

---

# Starting a new task after finishing one

## 16. Return to `dev`
When your previous work is done and merged:

```bash
git checkout dev
git pull origin dev
```

## 17. Create a fresh new branch
Do not reuse old feature branches for unrelated work.

```bash
git checkout -b feature/new-task-name
```

---

# Full Example

```bash
git checkout dev
git pull origin dev
git checkout -b feature/meivera-homepage-ui

# make changes

git status
git add .
git commit -m "Update Meivera homepage UI"
git push -u origin feature/meivera-homepage-ui
```

Then on GitHub:

1. Open repository
2. Open `Pull requests`
3. Click `New pull request`
4. Set:
   - `base` = `dev`
   - `compare` = `feature/meivera-homepage-ui`
5. Click `Create pull request`

---

# Production Merge Flow

## Developer flow ends at `dev`
Your work flow is:

```text
dev -> feature branch -> work -> push -> PR to dev
```

## Production flow is separate
After testing, admin handles:

```text
dev -> main
```

You should not directly move feature work into `main`.

---

# Quick Command Reference

## Start new task
```bash
git checkout dev
git pull origin dev
git checkout -b feature/task-name
```

## Commit work
```bash
git add .
git commit -m "Describe your changes"
```

## Push work
```bash
git push -u origin $(git branch --show-current)
```

## Check current branch
```bash
git branch --show-current
```

## Check changed files
```bash
git status
```

---

# Never Do This

Do not do any of the following:

```text
work directly on main
work directly on dev
push directly to main
push directly to dev
create feature PR into main
reuse old feature branches for unrelated work
```

---

# Final Summary

## Correct workflow
```text
git checkout dev
git pull origin dev
git checkout -b feature/your-task-name
# make changes
git add .
git commit -m "Your change message"
git push -u origin your-branch-name
# create PR: feature branch -> dev
```

## Merge path
```text
feature/... -> dev -> main
```
