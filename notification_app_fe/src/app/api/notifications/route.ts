import { NextResponse } from 'next/server';
import axios from 'axios';

const NOTIFICATIONS_URL = 'http://20.207.122.201/evaluation-service/notifications';

export async function GET() {
  try {
    const response = await axios.get(NOTIFICATIONS_URL, {
      headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Route Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch from test server' },
      { status: error.response?.status || 500 }
    );
  }
}
