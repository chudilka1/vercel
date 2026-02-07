import type { VercelRequest, VercelResponse } from '@vercel/node';
import { StatusCodes } from 'http-status-codes';

interface PayloadData {
  data: string;
  timestamp: number;
}

interface QueryLogEntry {
  timestamp: number;
  payload: PayloadData;
  success: boolean;
}

interface Response {
  success: boolean;
  message: string;
  data?: PayloadData;
}

const MAX_LOGS = 500;

// In-memory storage (resets on cold starts)
let requestLogs: QueryLogEntry[] = [];

function sendResponse(res: VercelResponse, status: number, message: string, data?: PayloadData): void {
  const response: Response = {
    success: status < StatusCodes.BAD_REQUEST,
    message,
    ...(data && { data })
  };
  res.status(status).json(response);
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // GET - retrieve logs
  if (req.method === 'GET') {
    res.status(StatusCodes.OK).json({
      success: true,
      logs: requestLogs,
      count: requestLogs.length
    });
    return;
  }

  // DELETE - clear logs
  if (req.method === 'DELETE') {
    requestLogs = [];
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logs cleared successfully'
    });
    return;
  }

  // POST - receive webhook data
  if (req.method !== 'POST') {
    sendResponse(res, StatusCodes.METHOD_NOT_ALLOWED, 'Method not allowed');
    return;
  }

  const contentType = req.headers['content-type'] || '';
  if (!contentType.startsWith('application/json')) {
    sendResponse(res, StatusCodes.BAD_REQUEST, 'Content-Type must be application/json');
    return;
  }

  const payload = req.body as PayloadData;
  if (!payload || typeof payload.data !== 'string' || typeof payload.timestamp !== 'number') {
    sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid payload structure');
    return;
  }

  console.log(JSON.stringify(payload));

  // Store log entry
  const logEntry = { timestamp: Date.now(), payload, success: true };
  requestLogs.unshift(logEntry);
  
  if (requestLogs.length > MAX_LOGS) {
    requestLogs.splice(MAX_LOGS);
  }
  
  sendResponse(res, StatusCodes.OK, 'Payload received successfully', payload);
}
