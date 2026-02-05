import type { VercelRequest, VercelResponse } from '@vercel/node';
import { StatusCodes } from 'http-status-codes';

interface PayloadData {
  data: string;
  timestamp: number;
}

interface LogEntry {
  timestamp: number;
  payload: PayloadData;
  success: boolean;
}

interface Response {
  success: boolean;
  message: string;
  data?: PayloadData;
}

const requestLogs: LogEntry[] = [];
const MAX_LOGS = 500;

function sendResponse(res: VercelResponse, status: number, message: string, data?: PayloadData): void {
  const response: Response = {
    success: status < StatusCodes.BAD_REQUEST,
    message,
    ...(data && { data })
  };
  res.status(status).json(response);
}

export default function handler(req: VercelRequest, res: VercelResponse): void {
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
    requestLogs.length = 0;
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logs cleared successfully'
    });
    return;
  }

  // POST - receive webhook data
  if (req.method !== 'POST') {
    return sendResponse(res, StatusCodes.METHOD_NOT_ALLOWED, 'Method not allowed');
  }

  const contentType = req.headers['content-type'] || '';
  if (!contentType.startsWith('application/json')) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Content-Type must be application/json');
  }

  const payload = req.body as PayloadData;
  if (!payload || typeof payload.data !== 'string' || typeof payload.timestamp !== 'number') {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid payload structure');
  }

  console.log(JSON.stringify(payload));

  // Store log entry
  requestLogs.unshift({
    timestamp: Date.now(),
    payload,
    success: true
  });
  if (requestLogs.length > MAX_LOGS) {
    requestLogs.pop();
  }

  sendResponse(res, StatusCodes.OK, 'Payload received successfully', payload);
}
