import instaloader
import schedule
import time
import os
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
from notion_client import Client

# Load environment variables
load_dotenv()

# Initialize Instaloader instance
L = instaloader.Instaloader()

# Dubai Real Estate Companies
INSTAGRAM_USERS = {
    "Deca Properties": "deca.properties",
    "HS Property": "hs_property",
    "Emaar Properties": "emaardubai",
    "DAMAC Properties": "damacofficial",
    "Nakheel Properties": "nakheelofficial",
    "Meraas": "meraas",
    "Sobha Realty": "sobharealty",
    "Ellington Properties": "ellingtonproperties",
    "Azizi Developments": "azizidevelopments",
    "Danube Properties": "danubeproperties",
    "Binghatti Developers": "binghatti",
    "11Prop": "11prop",
    "Metropolitan Premium": "metropolitan.realestate",
    "Fäm Properties": "famproperties",
    "Driven Properties": "drivenproperties",
    "haus & haus": "hausandhaus",
    "Allsopp & Allsopp": "allsoppandallsopp",
    "Betterhomes": "betterhomesuae",
    "Espace Real Estate": "espace.realestate",
    "Aqua Properties": "aqua.properties",
    "Azco Real Estate": "azcorealestate",
    "D&B Properties": "dandbproperties"
}

# Initialize Notion client if configured
notion = None
if os.getenv('NOTION_API_KEY') and os.getenv('NOTION_DATABASE_ID'):
    notion = Client(auth=os.getenv('NOTION_API_KEY'))

def send_webhook_notification(company, username, post_url=None, status="posted"):
    """Send webhook notification if configured"""
    webhook_url = os.getenv('WEBHOOK_URL')
    if not webhook_url:
        return
    
    try:
        payload = {
            "company": company,
            "username": username,
            "status": status,
            "post_url": post_url,
            "timestamp": datetime.now().isoformat(),
            "message": f"{'✅' if status == 'posted' else '❌'} {company} (@{username}) {'posted' if status == 'posted' else 'has NOT posted'} in the last 24h"
        }
        
        response = requests.post(webhook_url, json=payload, timeout=10)
        response.raise_for_status()
        print(f"📡 Webhook sent for {company}")
    except Exception as e:
        print(f"⚠️ Failed to send webhook for {company}: {str(e)}")

def update_notion_database(company, username, status, post_url=None, post_time=None):
    """Update Notion database if configured"""
    if not notion or not os.getenv('NOTION_DATABASE_ID'):
        return
    
    try:
        properties = {
            "Company": {"title": [{"text": {"content": company}}]},
            "Username": {"rich_text": [{"text": {"content": f"@{username}"}}]},
            "Status": {"select": {"name": "Posted 24h" if status == "posted" else "No Post 24h"}},
            "Last Checked": {"date": {"start": datetime.now().isoformat()}},
            "Profile URL": {"url": f"https://instagram.com/{username}"}
        }
        
        if post_url:
            properties["Last Post URL"] = {"url": post_url}
        
        if post_time:
            properties["Last Post Time"] = {"date": {"start": post_time.isoformat()}}
        
        notion.pages.create(
            parent={"database_id": os.getenv('NOTION_DATABASE_ID')},
            properties=properties
        )
        print(f"📝 Notion updated for {company}")
    except Exception as e:
        print(f"⚠️ Failed to update Notion for {company}: {str(e)}")

def check_instagram_posts():
    """Main function to check Instagram posts"""
    print(f"🚀 Starting Instagram check at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    # Time range setup (24 hours)
    now = datetime.now()
    since = now - timedelta(hours=24)
    
    results = {
        "posted": [],
        "no_post": [],
        "errors": []
    }
    
    for company, username in INSTAGRAM_USERS.items():
        try:
            print(f"🔍 Checking {company} (@{username})...")
            
            # Get profile
            profile = instaloader.Profile.from_username(L.context, username)
            
            # Get latest post
            posts = profile.get_posts()
            latest_post = next(posts, None)
            
            if latest_post:
                post_time = latest_post.date.replace(tzinfo=None)
                post_url = f"https://www.instagram.com/p/{latest_post.shortcode}/"
                
                if post_time >= since:
                    print(f"✅ {company} (@{username}) posted on {post_time.strftime('%Y-%m-%d %H:%M:%S')}")
                    print(f"   📎 {post_url}")
                    results["posted"].append((company, username, post_url, post_time))
                    
                    # Send notifications
                    send_webhook_notification(company, username, post_url, "posted")
                    update_notion_database(company, username, "posted", post_url, post_time)
                else:
                    print(f"❌ {company} (@{username}) has NOT posted in the last 24h")
                    print(f"   📅 Last post: {post_time.strftime('%Y-%m-%d %H:%M:%S')}")
                    results["no_post"].append((company, username, post_time))
                    
                    # Send notifications
                    send_webhook_notification(company, username, None, "no_post")
                    update_notion_database(company, username, "no_post", None, post_time)
            else:
                print(f"❌ {company} (@{username}) has no posts")
                results["no_post"].append((company, username, None))
                send_webhook_notification(company, username, None, "no_post")
                update_notion_database(company, username, "no_post")
                
        except Exception as e:
            print(f"⚠️ Error checking {company} (@{username}): {str(e)}")
            results["errors"].append((company, username, str(e)))
            send_webhook_notification(company, username, None, "error")
        
        # Small delay to avoid rate limiting
        time.sleep(2)
    
    # Print summary
    print("=" * 80)
    print(f"📊 SUMMARY - Check completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"✅ Posted in 24h: {len(results['posted'])}")
    print(f"❌ No posts in 24h: {len(results['no_post'])}")
    print(f"⚠️ Errors: {len(results['errors'])}")
    print("=" * 80)
    
    return results

def job():
    """Scheduled job function"""
    try:
        check_instagram_posts()
    except Exception as e:
        print(f"💥 Critical error in job execution: {str(e)}")

def main():
    """Main function to run the worker"""
    print("🤖 Dubai Real Estate Instagram Background Worker Starting...")
    print(f"⏰ Scheduled to run daily at 08:00 UTC")
    print(f"🔧 Notion configured: {'Yes' if notion else 'No'}")
    print(f"🔗 Webhook configured: {'Yes' if os.getenv('WEBHOOK_URL') else 'No'}")
    print("=" * 80)
    
    # Schedule the job to run daily at 8:00 AM UTC
    schedule.every().day.at("08:00").do(job)
    
    # Run once immediately for testing (optional)
    if os.getenv('RUN_IMMEDIATELY', 'false').lower() == 'true':
        print("🚀 Running immediate check for testing...")
        job()
    
    # Keep the script running
    print("⏳ Worker is running... Press Ctrl+C to stop")
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    main()