# StreamAlerts Bot

A Discord bot that monitors Twitch streams and sends live notifications to Discord channels. Built with Node.js, Discord.js v14, and the Twitch Helix API.

## Features

- **Real-time Stream Monitoring**: Checks stream status every 60 seconds using Twitch Helix API
- **Rich Discord Embeds**: Beautiful notifications with stream details, thumbnails, and viewer count
- **Duplicate Prevention**: Smart state management prevents spam notifications
- **Automatic Token Refresh**: Handles Twitch OAuth token expiration seamlessly
- **Test Mode**: Built-in testing system for development and debugging
- **Error Handling**: Comprehensive error handling for API failures and network issues

## Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- Discord bot token
- Twitch application credentials

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd StreamAlerts-RektyRowdyy
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CHANNEL_ID=your_alert_channel_id_here
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here
TWITCH_USERNAME=your_twitch_username_here
TEST_MODE=false
```

### Setup Instructions

#### Discord Bot Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application and bot
3. Copy the bot token to your `.env` file
4. Invite the bot to your server with permissions:
   - Send Messages
   - Embed Links
   - Use External Emojis
   - Mention Everyone (for @everyone notifications)

#### Twitch API Setup
1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Register a new application
3. Copy Client ID and Client Secret to your `.env` file
4. Set the Twitch username you want to monitor

#### Getting Discord Channel ID
1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click the channel where you want alerts
3. Select "Copy ID" and paste into `.env` file

### Usage

#### Production Mode
```bash
npm start
```

#### Development Mode (with file watching)
```bash
npm run dev
```

#### Test Mode
Set `TEST_MODE=true` in your `.env` file and run:
```bash
npm start
```

This will send a test notification to verify your setup is working correctly.

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | Yes | Your Discord bot token |
| `DISCORD_CHANNEL_ID` | Yes | Discord channel ID for notifications |
| `TWITCH_CLIENT_ID` | Yes | Twitch application client ID |
| `TWITCH_CLIENT_SECRET` | Yes | Twitch application client secret |
| `TWITCH_USERNAME` | Yes | Twitch username to monitor |
| `TEST_MODE` | No | Set to `true` for test notifications (default: `false`) |

### Constants

- **Check Interval**: 60 seconds (stream status polling frequency)
- **Embed Color**: `#9146FF` (Twitch purple)
- **Thumbnail Size**: 320x180 pixels

## Project Structure

```
StreamAlerts-RektyRowdyy/
├── src/
│   └── index.js           # Main bot application
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── CLAUDE.md             # Claude Code guidance
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

### Future Expansion Structure
The project is structured for easy expansion:
- `src/commands/` - Discord slash commands
- `src/events/` - Discord event handlers
- `src/services/` - API service modules
- `src/utils/` - Utility functions
- `src/models/` - Data models
- `config/` - Configuration files
- `logs/` - Log output directory

## How It Works

1. **Authentication**: Bot obtains Twitch OAuth token using client credentials flow
2. **Monitoring**: Polls Twitch Helix API `/streams` endpoint every 60 seconds
3. **State Management**: Tracks live status in memory to prevent duplicate notifications
4. **Notifications**: Sends rich Discord embeds when stream status changes to live

## Troubleshooting

### Common Issues

**Bot not responding**
- Verify Discord token is correct
- Check bot permissions in Discord server
- Ensure bot is online in Discord

**No stream notifications**
- Verify Twitch credentials are correct
- Check Twitch username spelling
- Confirm streamer is actually going live
- Check console for API errors

**Test mode not working**
- Set `TEST_MODE=true` in `.env` file
- Restart the bot
- Check Discord channel permissions

### Error Messages

- `❌ Error getting Twitch token` - Check Twitch client ID/secret
- `❌ Discord channel not found` - Verify channel ID is correct
- `🔄 Token expired, getting new token...` - Normal behavior, token auto-refreshes

## Dependencies

- **discord.js**: Discord API wrapper
- **axios**: HTTP client for API requests
- **dotenv**: Environment variable management
- **node-cron**: Task scheduling (ready for future features)

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ for the streaming community