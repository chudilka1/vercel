# Webhook Logger

Simple Vercel serverless endpoint that receives POST requests with JSON payloads and provides a web UI to view logged requests.

## Storage

**In-memory storage only** - simple and fast:
- ✅ Fast and reliable
- ✅ No external dependencies
- ⚠️ Resets on cold starts (~15min inactivity) or deployments
- ⚠️ Each serverless instance has its own memory
- 📊 **Max 500 logs** (oldest deleted when limit reached)

Perfect for active testing and development. For persistent storage across restarts, consider using a database.

## Web UI

Visit **`/`** to view the request logger dashboard:
- 📊 Real-time display of incoming webhook requests
- 🔄 Auto-refresh toggle (1 second intervals)
- 🗑️ Clear all logs button
- 📥 Download logs as JSON file

**Production UI:** https://post-endpoint-green.vercel.app

## API Endpoint

### `/api/webhook`

**POST** - Receive webhook data
```bash
curl -X POST 'https://post-endpoint-green.vercel.app/api/webhook' \
  -H "Content-Type: application/json" \
  -d '{"data": "message:Hello World", "timestamp": 1707062400}'
```

Response:
```json
{
  "success": true,
  "message": "Payload received successfully",
  "data": {
    "data": "message:Hello World",
    "timestamp": 1707062400
  }
}
```

**GET** - Retrieve all logged requests
```bash
curl 'https://post-endpoint-green.vercel.app/api/webhook'
```

Response:
```json
{
  "success": true,
  "logs": [
    {
      "timestamp": 1770296683291,
      "payload": { "data": "message:test", "timestamp": 1707062400 },
      "success": true
    }
  ],
  "count": 1
}
```

**DELETE** - Clear logs
```bash
curl -X DELETE 'https://post-endpoint-green.vercel.app/api/webhook'
```

Response:
```json
{
  "success": true,
  "message": "Logs cleared successfully"
}
```

## Local Development

```bash
# Install dependencies
npm install

# Start local server
vercel dev
```

Endpoint: `http://localhost:3000/api/webhook`

**Test:**
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"data": "message:test", "timestamp": 1675890123}'
```

## Deployment

```bash
vercel login
vercel --prod
```

Production URL: `https://your-project.vercel.app/api/webhook`

## Monitoring

```bash
vercel logs your-project.vercel.app
```

Dashboard: https://vercel.com/dashboard

## Files

- `api/webhook.ts` - Serverless function handling POST/GET/DELETE
- `public/index.html` - Web UI for viewing logs
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `vercel.json` - Deployment config (optional)

## Platform Limits

- Request/Response Body: **4.5MB**
- Function Timeout: **10s** (Hobby), **60s** (Pro)
- Memory: **1024MB**

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 Not Found | Ensure endpoint is `/api/webhook` not `/webhook` |
| Type errors | Run `npm run type-check` |
| Deploy fails | Check `vercel logs` |
| Logs disappeared | Cold start or different instance - normal serverless behavior |
