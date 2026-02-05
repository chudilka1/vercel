import type { VercelRequest, VercelResponse } from '@vercel/node';
import { StatusCodes } from 'http-status-codes';

interface PayloadData {
  data: string;
  timestamp: number;
}

interface Response {
  success: boolean;
  message: string;
  timestamp: number;
  data?: PayloadData;
}

function sendResponse(res: VercelResponse, status: number, message: string, data?: PayloadData): void {
  const response: Response = {
    success: status < StatusCodes.BAD_REQUEST,
    message,
    timestamp: Date.now(),
    ...(data && { data })
  };
  res.status(status).json(response);
}

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    return sendResponse(res, StatusCodes.METHOD_NOT_ALLOWED, 'Only POST method allowed');
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

  // TODO: Add processing logic here (store in DB, forward to service, etc.)

  sendResponse(res, StatusCodes.OK, 'Payload received successfully', payload);
}
