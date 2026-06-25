# Deploy your shared AI Human Quality Tracker (free, ~15-20 min)

This puts the tracker online at a real web link, with a shared database so your
whole team sees the same live data, protected by one team password.

You will use two free services:
- **GitHub** - holds the project files.
- **Vercel** - runs the website + database.

You do not need to write any code. It is all clicking and pasting.

---

## Part A - Put the project on GitHub (no software to install)

1. Go to https://github.com and **Sign up** (free) or log in.
2. Click the **+** in the top-right, then **New repository**.
3. Name it `qa-tracker`. Leave it **Private**. Click **Create repository**.
4. On the next page, click the link **"uploading an existing file"**
   (under "…or upload an existing file").
5. Open the `qa-shared` folder on your computer. Select **all** of these and
   drag them onto the GitHub upload area:
   - `index.html`
   - `package.json`
   - `.gitignore`
   - the `api` folder
   - the `lib` folder
   (Do **not** upload a `node_modules` folder if one exists.)
6. Click **Commit changes**. Your files are now on GitHub.

---

## Part B - Create the project on Vercel

1. Go to https://vercel.com and click **Sign Up**.
   Choose **"Continue with GitHub"** so the two connect automatically.
2. On your Vercel dashboard, click **Add New… → Project**.
3. Find `qa-tracker` in the list and click **Import**.
4. Leave all settings as-is (Framework Preset = **Other**). Click **Deploy**.
5. Wait about a minute. It will say **"Congratulations"** and show a link like
   `https://qa-tracker-xxxx.vercel.app`. The page will show an error for now -
   that's expected, we still need the database and password (next parts).

---

## Part C - Add the free database (Upstash Redis)

1. In your project on Vercel, click the **Storage** tab.
2. Click **Create Database** (or **Connect Store**), then choose
   **Upstash → Redis** (in the Marketplace list). Accept the free plan.
3. When asked, **connect it to your `qa-tracker` project** and the
   **Production** environment. Click **Connect** / **Create**.
   - This automatically adds the database connection settings to your project.
     You do not need to copy anything.

---

## Part D - Set the team password

1. In your project, go to **Settings → Environment Variables**.
2. Add a new variable:
   - **Key:** `APP_PASSWORD`
   - **Value:** the team password you want everyone to use (pick something
     not easy to guess, e.g. `Phonely-QA-2026!`).
   - Environment: leave **all** checked (Production, Preview, Development).
3. Click **Save**.

---

## Part E - Redeploy so the new settings take effect

1. Go to the **Deployments** tab.
2. Click the **"…"** menu on the most recent deployment → **Redeploy** →
   confirm **Redeploy**.
3. Wait ~1 minute. Open your `https://qa-tracker-xxxx.vercel.app` link.
4. You should see the **password screen**. Enter your team password → you're in!

---

## Share with your team

- Send teammates the link **and** the team password.
- Everyone who enters the password sees and edits the same live data.
- Use **Settings → Export CSV / Backup JSON** any time for backups.

## Changing the password later
Settings → Environment Variables → edit `APP_PASSWORD` → Save → Redeploy
(Part E). Everyone signs in again with the new password.

## Tips
- Want a nicer link? Vercel → Settings → Domains lets you rename or add a
  custom domain.
- Free Hobby tier is plenty for a 4-10 person QA team.
