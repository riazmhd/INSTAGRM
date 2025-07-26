# 🚀 GitHub Actions Setup Guide - Step by Step

## Step 1: Create GitHub Repository

1. **Go to GitHub.com** and sign in
2. **Click "New repository"** (green button)
3. **Name it**: `dubai-instagram-tracker`
4. **Make it Public** (required for free GitHub Actions)
5. **Click "Create repository"**

## Step 2: Upload Files to Repository

Upload these files from your project:

### Required Files:
- `worker.py` (main script)
- `requirements.txt` (dependencies)
- `.github/workflows/instagram-check.yml` (GitHub Actions workflow)
- `README.md` (documentation)

### Optional Files:
- `.env.example` (environment variables example)

### How to Upload:
1. **Click "uploading an existing file"** on your new repo page
2. **Drag and drop** all the files
3. **Commit changes** with message: "Initial commit - Instagram tracker"

## Step 3: Set Up Environment Variables (Optional)

Only needed if you want Notion or webhook integration:

1. **Go to your repository**
2. **Click "Settings" tab**
3. **Click "Secrets and variables" → "Actions"**
4. **Click "New repository secret"**

Add these secrets (one by one):

### For Notion Integration:
- **Name**: `NOTION_API_KEY`
- **Value**: `secret_your_notion_api_key_here`

- **Name**: `NOTION_DATABASE_ID` 
- **Value**: `your_database_id_here`

### For Webhook Notifications:
- **Name**: `WEBHOOK_URL`
- **Value**: `https://your-webhook-endpoint.com/instagram-updates`

## Step 4: Test the Workflow

1. **Go to "Actions" tab** in your repository
2. **Click "Daily Instagram Check"** workflow
3. **Click "Run workflow"** button (to test immediately)
4. **Click green "Run workflow"** button
5. **Wait 2-3 minutes** and refresh the page

## Step 5: View Results

1. **Click on the running workflow**
2. **Click "check-instagram"** job
3. **Expand steps** to see the output
4. **Look for**:
   - ✅ Companies that posted
   - ❌ Companies that didn't post
   - ⚠️ Any errors

## Step 6: Automatic Daily Runs

**That's it!** The workflow will now run automatically every day at 8:00 AM UTC.

## 📊 What You'll See in Logs:

```
🚀 Starting Instagram check at 2024-01-15 08:00:00
================================================================================
🔍 Checking Deca Properties (@deca.properties)...
✅ Deca Properties (@deca.properties) posted on 2024-01-15 06:30:00
   📎 https://www.instagram.com/p/ABC123/

🔍 Checking HS Property (@hs_property)...
❌ HS Property (@hs_property) has NOT posted in the last 24h
   📅 Last post: 2024-01-14 10:15:00

================================================================================
📊 SUMMARY - Check completed at 2024-01-15 08:05:00
✅ Posted in 24h: 12
❌ No posts in 24h: 10
⚠️ Errors: 0
================================================================================
```

## 🔧 Troubleshooting

### If workflow fails:
1. **Check the logs** in Actions tab
2. **Common issues**:
   - Private Instagram accounts (can't check)
   - Rate limiting (script includes delays)
   - Invalid environment variables

### To modify schedule:
1. **Edit** `.github/workflows/instagram-check.yml`
2. **Change** `cron: '0 8 * * *'` to your preferred time
3. **Commit changes**

### Time zones:
- GitHub Actions uses UTC time
- `'0 8 * * *'` = 8:00 AM UTC
- For different times: [crontab.guru](https://crontab.guru)

## 💰 Cost: 100% FREE

- **GitHub Actions**: 2,000 minutes/month free
- **This script**: Uses ~5 minutes/day = 150 minutes/month
- **You have**: 13x more than needed!

## 🎉 You're Done!

Your Instagram tracker is now running automatically every day for FREE! Check the Actions tab anytime to see the latest results.