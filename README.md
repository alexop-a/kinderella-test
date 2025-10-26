# Simple Node.js App

A simple Node.js web application built with Express.js for testing deployment to web servers.

## Features

- ✅ Express.js web server
- ✅ Static file serving
- ✅ REST API endpoints
- ✅ Health check endpoint
- ✅ Responsive HTML interface
- ✅ Ready for deployment

## Requirements

- Node.js 24.10.0 (specified in package.json)
- npm (comes with Node.js)

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

3. **Visit the application:**
   - Open your browser and go to `http://localhost:3000`

## Available Endpoints

- `/` - Main homepage with app interface
- `/api/status` - JSON API endpoint returning app status
- `/health` - Simple health check endpoint

## Deployment Instructions

### Option 1: Traditional Web Hosting (Heroku, Railway, etc.)

1. **Prepare your files:**
   - Ensure all files are in your project directory
   - Make sure `package.json` includes all dependencies

2. **Deploy to hosting platform:**
   - Most platforms will automatically detect the Node.js app
   - The app will start using the `npm start` command
   - Platforms will set the `PORT` environment variable automatically

### Option 2: VPS/Server Deployment

1. **Upload files to your server:**
   ```bash
   scp -r * user@your-server.com:/path/to/your/app/
   ```

2. **SSH into your server and navigate to the app directory:**
   ```bash
   ssh user@your-server.com
   cd /path/to/your/app/
   ```

3. **Install Node.js 24.10.0 (if not already installed):**
   ```bash
   # Using Node Version Manager (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 24.10.0
   nvm use 24.10.0
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start the application:**
   ```bash
   # For development/testing
   npm start
   
   # For production (with process manager)
   npm install -g pm2
   pm2 start app.js --name "simple-nodejs-app"
   ```

6. **Configure reverse proxy (optional but recommended):**
   If using Nginx, add this to your site configuration:
   ```nginx
   location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_cache_bypass $http_upgrade;
   }
   ```

### Option 3: Docker Deployment

1. **Create a Dockerfile:**
   ```dockerfile
   FROM node:24.10.0-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run:**
   ```bash
   docker build -t simple-nodejs-app .
   docker run -p 3000:3000 simple-nodejs-app
   ```

## Environment Variables

- `PORT` - Port number (default: 3000)

## Testing the Deployment

After deployment, test these URLs:
- `http://your-domain.com/` - Main page
- `http://your-domain.com/api/status` - API endpoint
- `http://your-domain.com/health` - Health check

## Troubleshooting

1. **Port issues:** Make sure your hosting platform supports the port or set the `PORT` environment variable
2. **Node version:** Ensure Node.js 24.10.0 is available on your server
3. **Dependencies:** Run `npm install` to ensure all dependencies are installed
4. **Logs:** Check application logs for any error messages

## File Structure

```
simple-nodejs-app/
├── app.js          # Main server file
├── index.html      # Homepage template
├── package.json    # Project configuration
└── README.md       # This file
```

## License

MIT