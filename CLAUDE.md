# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Discord bot that monitors Twitch streams and sends live notifications to a Discord channel. The bot uses the Twitch Helix API to check stream status every 60 seconds and posts rich embeds when a streamer goes live. The project uses ES modules (type: "module" in package.json).

## Development Commands

- `npm install` - Install dependencies
- `npm start` - Start the bot in production mode
- `npm run dev` - Start the bot with file watching for development
- `npm run deploy` - Deploy to Railway (requires Railway CLI)
- `npm test` - No tests configured yet (returns error)

## Architecture

The bot is currently a single-file application (`src/index.js`) with a modular directory structure ready for expansion:

### Core Application Flow
1. **Authentication**: Bot obtains Twitch OAuth token using client credentials flow
2. **Monitoring**: Interval-based polling of Twitch Helix API (`/streams` endpoint) every 60 seconds
3. **State Management**: In-memory `isLive` boolean prevents duplicate notifications
4. **Notifications**: Rich Discord embeds sent to configured channel when stream status changes

### Key Components
- **Twitch Integration**: Uses `axios` for HTTP requests to Twitch API with automatic token refresh on 401 errors
- **Discord Integration**: Uses `discord.js` v14 with minimal intents (Guilds, GuildMessages, MessageContent)
- **Error Handling**: Global handlers for unhandled rejections and Discord client errors
- **Test Mode**: Built-in test notification system activated via `TEST_MODE` environment variable
- **Health Check Server**: HTTP server on configurable port for Railway monitoring and health checks
- **Graceful Shutdown**: SIGTERM handling for clean deployments and restarts

### Directory Structure (Ready for Expansion)
- `src/commands/` - Future Discord slash commands
- `src/events/` - Future Discord event handlers  
- `src/services/` - Future API service modules
- `src/utils/` - Future utility functions
- `src/models/` - Future data models
- `config/` - Configuration files
- `logs/` - Log output directory

## Environment Variables

Required environment variables (see `.env.example`):
- `DISCORD_TOKEN` - Discord bot token
- `DISCORD_CHANNEL_ID` - Target channel for stream alerts
- `TWITCH_CLIENT_ID` - Twitch application client ID
- `TWITCH_CLIENT_SECRET` - Twitch application client secret  
- `TWITCH_USERNAME` - Username to monitor for stream status

Optional environment variables:
- `TEST_MODE` - Set to `true` to send a test notification on startup instead of monitoring (default: `false`)
- `PORT` - Port for health check server (default: `3000`, Railway sets this automatically)

## Deployment

### Railway.app Deployment
The project is configured for Railway deployment with:
- `Procfile` - Defines web process type for Railway
- `railway.toml` - Railway deployment configuration with restart policies
- `nixpacks.toml` - Nixpacks build configuration for Node.js
- Health check endpoint at `/health` for Railway monitoring

### Railway Environment Setup
1. Set all required environment variables in Railway dashboard
2. Railway automatically provides `PORT` environment variable
3. Deploy using `railway up` or connect GitHub repository for auto-deployments

## Key Constants

- `CHECK_INTERVAL`: 60000ms (60 seconds) - Stream status polling frequency
- `PORT`: 3000 (default) - Health check server port
- Twitch embed color: `#9146FF` (Twitch purple)
- Thumbnail size: `320x180` pixels