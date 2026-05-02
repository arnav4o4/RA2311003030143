import axios from 'axios';
import dotenv from 'dotenv';
import { Log } from '../logging_middleware/dist/index.js';

dotenv.config({ path: '../.env' });

const NOTIFICATIONS_URL = 'http://20.207.122.201/evaluation-service/notifications';

const WEIGHTS = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};

async function fetchAndSort() {
    try {
        await Log('backend', 'info', 'service', 'Fetching notifications for Priority Inbox');
        
        const response = await axios.get(NOTIFICATIONS_URL, {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });

        const notifications = response.data.notifications;
        if (!notifications) {
            console.log('No notifications found.');
            return;
        }

        await Log('backend', 'info', 'service', `Successfully fetched ${notifications.length} notifications`);

        // Sort: Weight (desc), then Timestamp (desc)
        const sorted = notifications.sort((a, b) => {
            const weightA = WEIGHTS[a.Type] || 0;
            const weightB = WEIGHTS[b.Type] || 0;

            if (weightB !== weightA) {
                return weightB - weightA;
            }

            // Same weight, compare timestamp
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        });

        const top10 = sorted.slice(0, 10);
        console.log('--- Priority Inbox (Top 10) ---');
        console.table(top10.map(n => ({
            Type: n.Type,
            Message: n.Message,
            Timestamp: n.Timestamp
        })));

        await Log('backend', 'info', 'controller', 'Displayed top 10 notifications');

    } catch (error) {
        await Log('backend', 'error', 'service', `Failed to fetch notifications: ${error.message}`);
        console.error('Error:', error.message);
    }
}

fetchAndSort();
