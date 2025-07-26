# Dubai Real Estate Instagram Background Worker

A Python background worker that monitors Dubai real estate companies' Instagram accounts for new posts within the last 24 hours.

## Features

- ✅ Monitors 22+ Dubai real estate companies
- 📅 Checks for posts within the last 24 hours
- 🔄 Runs automatically daily at 8:00 AM UTC
- 📝 Optional Notion database integration
- 🔗 Optional webhook notifications
- 🚀 Designed for Render.com deployment

## Monitored Companies

- Deca Properties (@deca.properties)
- HS Property (@hs_property)
- Emaar Properties (@emaardubai)
- DAMAC Properties (@damacofficial)
- And 18+ more Dubai real estate companies...

## Deployment to Render.com

### Step 1: Prepare Your Repository

1. Create a new GitHub repository
2. Upload these files to your repository:
   - `worker.py` (main worker script)
   - `requirements.txt` (Python dependencies)
   - `render.yaml` (Render configuration)
   - `README.md` (this file)

### Step 2: Deploy to Render

1. **Sign up/Login to Render.com**
   - Go to [render.com](https://render.com)
   - Create an account or sign in

2. **Create New Background Worker**
   - Click "New +" button
   - Select "Background Worker"
   - Connect your GitHub repository

3. **Configure the Service**
   - **Name**: `instagram-tracker-worker`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python worker.py`

4. **Set Environment Variables** (Optional)
   - `NOTION_API_KEY`: Your Notion integration API key
   - `NOTION_DATABASE_ID`: Your Notion database ID
   - `WEBHOOK_URL`: URL to send webhook notifications
   - `RUN_IMMEDIATELY`: Set to "true" for immediate testing

5. **Deploy**
   - Click "Create Background Worker"
   - Render will automatically deploy your worker

### Step 3: Monitor Your Worker

- Check the Render dashboard for logs
- The worker runs daily at 8:00 AM UTC
- View real-time logs to see Instagram check results

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NOTION_API_KEY` | No | Notion integration API key for database updates |
| `NOTION_DATABASE_ID` | No | Notion database ID to store results |
| `WEBHOOK_URL` | No | URL to send POST notifications |
| `RUN_IMMEDIATELY` | No | Set to "true" to run check immediately on startup |

## Setting Up Notion Integration (Optional)

1. **Create Notion Integration**
   - Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Click "New integration"
   - Name it "Instagram Tracker"
   - Copy the API key

2. **Create Database**
   - Create a new Notion page with a database
   - Add these properties:
     - Company (Title)
     - Username (Text)
     - Status (Select: "Posted 24h", "No Post 24h")
     - Last Checked (Date)
     - Last Post Time (Date)
     - Profile URL (URL)
     - Last Post URL (URL)

3. **Share Database**
   - Click "Share" on your database page
   - Invite your integration
   - Copy the database ID from the URL

4. **Add Environment Variables**
   - In Render dashboard, add:
     - `NOTION_API_KEY`: Your integration API key
     - `NOTION_DATABASE_ID`: Your database ID

## Webhook Integration (Optional)

Set `WEBHOOK_URL` to receive POST notifications with this payload:

```json
{
  "company": "Emaar Properties",
  "username": "emaardubai",
  "status": "posted",
  "post_url": "https://instagram.com/p/ABC123/",
  "timestamp": "2024-01-15T08:30:00",
  "message": "✅ Emaar Properties (@emaardubai) posted in the last 24h"
}
```

## Pricing

### Render.com
- **Paid**: Background workers start at $7/month
- **Free Tier**: 750 hours/month (enough for this use case)

### Free Alternatives

#### 1. GitHub Actions (100% Free)
- **Cost**: Free (2,000 minutes/month)
- **Perfect for**: Daily scheduled tasks
- **Setup**: Add `.github/workflows/instagram-check.yml`

#### 2. Railway.com
- **Cost**: Free tier with $5 credit monthly
- **Good for**: Small background workers
- **Deployment**: Similar to Render

#### 3. Fly.io
- **Cost**: Free tier available
- **Resources**: 3 shared-cpu-1x VMs
- **Good for**: Lightweight workers

#### 4. PythonAnywhere (Scheduled Tasks)
- **Cost**: Free tier available
- **Perfect for**: Simple scheduled scripts
- **Limitation**: 1 scheduled task on free tier

## Troubleshooting

### Common Issues

1. **Rate Limiting**: The worker includes delays between requests
2. **Private Accounts**: Cannot check private Instagram accounts
3. **Instagram Changes**: May need updates if Instagram changes their API

### Logs

Check Render dashboard logs for:
- ✅ Successful checks
- ❌ Accounts with no posts
- ⚠️ Errors or rate limits

## Support

For issues with:
- **Render deployment**: Check Render documentation
- **Instagram access**: Ensure accounts are public
- **Notion integration**: Verify API key and database permissions

## License

This project is for educational and monitoring purposes. Respect Instagram's terms of service and rate limits.