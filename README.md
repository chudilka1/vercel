# Webhook Endpoint

Vercel serverless endpoint that receives POST requests with JSON payloads from the `log_trigger_go` workflow.

## API Endpoint

**POST** `/api/webhook`

**Request:**
```json
{
  "data": "message:Hello World; timestamp:1707062400",
  "timestamp": 1707062400
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payload received successfully",
  "timestamp": 1770294172197,
  "data": {
    "data": "message:Hello World; timestamp:1707062400",
    "timestamp": 1707062400
  }
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
vercel logs --prod --follow
```

Dashboard: https://vercel.com/dashboard

## Files

- `api/webhook.ts` - Handler function
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
