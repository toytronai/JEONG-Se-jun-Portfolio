# JEONG Se-jun Portfolio Website

Static portfolio website for JEONG Se-jun, focused on AI healthcare, public data, gerontechnology, and product leadership.

## Files

- `index.html`: Main portfolio page
- `styles.css`: Responsive layout and visual system
- `script.js`: Mobile navigation, active section state, and project filtering
- `assets/hero-ai-healthcare.png`: Generated hero image
- `portfolio_Sejun_JEONG.md`: Source portfolio content

## Local Preview

Open `index.html` directly in a browser.

Optional local server:

```powershell
python -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

## Vercel Deployment

This is a dependency-free static site. In Vercel, import the project and use the default static deployment settings.

CLI deployment:

```powershell
npx.cmd --yes vercel@latest login
npx.cmd --yes vercel@latest deploy --prod --yes
```

If the CLI is already authenticated, the second command returns a public URL.

## GitHub Pages Deployment

Recommended repository name:

```text
jeong-se-jun-portfolio
```

With GitHub Desktop:

1. Open GitHub Desktop.
2. Go to `File` > `Add local repository`.
3. Select this folder: `C:\Users\jkl83\OneDrive\문서\photoP`.
4. If GitHub Desktop says it is not a repository, choose `create a repository`.
5. Commit all files.
6. Click `Publish repository`.
7. On GitHub.com, open the repository.
8. Go to `Settings` > `Pages`.
9. Under `Build and deployment`, choose `GitHub Actions`.
10. Open the `Actions` tab and wait until `Deploy static portfolio to GitHub Pages` finishes.

Expected public URL:

```text
https://J36-Ai-Editer.github.io/jeong-se-jun-portfolio/
```

If the repository name is `J36-Ai-Editer.github.io`, the URL becomes:

```text
https://J36-Ai-Editer.github.io/
```
