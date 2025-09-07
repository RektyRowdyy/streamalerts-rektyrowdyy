import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_USERNAME = process.env.TWITCH_USERNAME; // Twitch username
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID; // Channel to send alerts
const CHECK_INTERVAL = 60000; // Check every 60 seconds
const TEST_MODE = process.env.TEST_MODE === 'true';

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Store stream status to avoid duplicate notifications
let isLive = false;
let twitchAccessToken = '';

// Get Twitch OAuth token
async function getTwitchToken() {
    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        });
        
        twitchAccessToken = response.data.access_token;
        console.log('✅ Twitch token obtained successfully');
    } catch (error) {
        console.error('❌ Error getting Twitch token:', error.response?.data || error.message);
    }
}

// Check if streamer is live
async function checkStreamStatus() {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/streams`, {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${twitchAccessToken}`
            },
            params: {
                user_login: TWITCH_USERNAME
            }
        });

        const streams = response.data.data;
        const currentlyLive = streams.length > 0;

        // If went from offline to live, send notification
        if (currentlyLive && !isLive) {
            const streamData = streams[0];
            await sendLiveNotification(streamData);
            isLive = true;
            console.log(`🔴 ${TWITCH_USERNAME} went live!`);
        } 
        // If went from live to offline
        else if (!currentlyLive && isLive) {
            isLive = false;
            console.log(`⚫ ${TWITCH_USERNAME} went offline`);
        }

    } catch (error) {
        console.error('❌ Error checking stream status:', error.response?.data || error.message);
        
        // If token expired, get a new one
        if (error.response?.status === 401) {
            console.log('🔄 Token expired, getting new token...');
            await getTwitchToken();
        }
    }
}

// Send test notification
async function sendTestNotification() {
    const testStreamData = {
        user_name: TWITCH_USERNAME || 'TestStreamer',
        title: 'This is a test stream notification! 🎮',
        game_name: 'Just Chatting',
        viewer_count: 0,
        thumbnail_url: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_{width}x{height}.jpg'
    };
    
    await sendLiveNotification(testStreamData);
    console.log('🧪 Test notification sent!');
}

// Send live notification to Discord
async function sendLiveNotification(streamData) {
    try {
        const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
        if (!channel) {
            console.error('❌ Discord channel not found');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`🔴 ${streamData.user_name} is now LIVE!`)
            .setDescription(streamData.title || 'No title set')
            .setColor('#9146FF') // Twitch purple
            .addFields(
                { name: '🎮 Game', value: streamData.game_name || 'No category', inline: true },
                { name: '👥 Viewers', value: streamData.viewer_count.toString(), inline: true }
            )
            .setThumbnail(streamData.thumbnail_url.replace('{width}x{height}', '320x180'))
            .setURL(`https://twitch.tv/${TWITCH_USERNAME}`)
            .setTimestamp()
            .setFooter({ text: 'Twitch Live Alert' });

        await channel.send({
            content: `@everyone ${streamData.user_name} is now live on Twitch!`,
            embeds: [embed]
        });

        console.log('✅ Live notification sent to Discord');
    } catch (error) {
        console.error('❌ Error sending Discord notification:', error);
    }
}

// Bot ready event
client.once('ready', async () => {
    console.log(`✅ Discord bot logged in as ${client.user.tag}`);
    
    if (TEST_MODE) {
        console.log('🧪 TEST MODE ENABLED - Sending test notification...');
        await sendTestNotification();
        console.log('🧪 Test complete! Set TEST_MODE=false to disable test mode.');
        return;
    }
    
    // Get initial Twitch token
    await getTwitchToken();
    
    // Start checking stream status
    setInterval(checkStreamStatus, CHECK_INTERVAL);
    console.log(`🔄 Started monitoring ${TWITCH_USERNAME} every ${CHECK_INTERVAL/1000} seconds`);
});

// Handle bot errors
client.on('error', error => {
    console.error('❌ Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('❌ Unhandled promise rejection:', error);
});

// Login to Discord
client.login(DISCORD_TOKEN);