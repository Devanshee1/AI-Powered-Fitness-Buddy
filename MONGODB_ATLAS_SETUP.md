# MongoDB Atlas Setup Guide

This guide will help you connect your Fitness Buddy app to MongoDB Atlas (cloud database).

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create a Cluster

1. After logging in, click **"Create"** to create a new cluster
2. Choose **"FREE"** tier (M0 Sandbox)
3. Select your preferred cloud provider and region (choose one close to you)
4. Click **"Create Cluster"** (this may take 3-5 minutes)

## Step 3: Create a Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `fitnessuser`)
5. Click **"Autogenerate Secure Password"** and **COPY IT**
6. Under **"Database User Privileges"**, select **"Read and write to any database"**
7. Click **"Add User"**

**IMPORTANT:** Save this password! You'll need it in the next step.

## Step 4: Whitelist Your IP Address

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` to the whitelist
   - For production, you should restrict this to specific IPs
4. Click **"Confirm"**

## Step 5: Get Your Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Click **"Connect your application"**
4. Make sure **"Driver"** is set to **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

1. Open your `.env` file in the project root
2. Find the `MONGODB_URI` line
3. Replace the entire connection string with your MongoDB Atlas connection string
4. Replace `<username>` with your database username
5. Replace `<password>` with the password you copied earlier
6. Add the database name `/fitness-buddy` before the `?` in the URL

**Example:**
```env
MONGODB_URI=mongodb+srv://fitnessuser:MyP@ssw0rd123@cluster0.abc123.mongodb.net/fitness-buddy?retryWrites=true&w=majority
```

**Important Notes:**
- Make sure there are NO spaces in the connection string
- If your password contains special characters like `@`, `#`, `%`, etc., you need to URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `%` becomes `%25`
  - Use a [URL encoder tool](https://www.urlencoder.org/) if needed

## Step 7: Restart Your Server

After updating the `.env` file:

1. Stop your backend server (if running)
2. Start it again with `node server.js`
3. You should see: `✅ MongoDB Atlas Connected: cluster0-shard-00-00.xxxxx.mongodb.net`

## Step 8: Verify the Connection

When you start the server, check the console output:
- ✅ **Success:** You'll see "MongoDB Atlas Connected" with your cluster URL
- ❌ **Error:** You'll see "MongoDB Connection Error" - check your credentials

## Troubleshooting

### Error: "Authentication failed"
- Double-check your username and password
- Make sure special characters in password are URL-encoded

### Error: "Could not connect to any servers"
- Make sure you whitelisted your IP address (0.0.0.0/0 for development)
- Check your internet connection

### Error: "Invalid connection string"
- Make sure you added `/fitness-buddy` before the `?` in the URL
- Check for typos in the connection string

## Database Collections

Once connected, MongoDB Atlas will automatically create these collections:
- `users` - Stores user accounts and fitness profiles
- Collections for workout history, progress tracking, etc. (as you add features)

## Viewing Your Data

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"** on your cluster
3. Select the `fitness-buddy` database
4. You can view, edit, and delete data here

## Security Best Practices

For production:
1. **Never commit `.env` file** - it's already in `.gitignore`
2. **Use specific IP whitelist** instead of `0.0.0.0/0`
3. **Use strong, unique passwords** for database users
4. **Create separate users** for different access levels
5. **Enable encryption** in MongoDB Atlas settings

---

Need help? Check the [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
