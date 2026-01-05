# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML test site for mabl (automated testing tool). The repository contains various HTML test pages demonstrating different UI patterns commonly used in web testing scenarios.

## Development Setup

### Dev Container (Recommended)
The project uses VS Code Dev Containers with nginx:alpine to serve static files.

```bash
# Start dev container (via VS Code or Docker Compose)
docker-compose -f .devcontainer/docker-compose.yml up
```

Access the site at: http://localhost:8083

### Direct File Access
HTML files can also be opened directly in a browser or served with any static file server.

## Project Structure

- `/index.html` - Main landing page (Japanese)
- `/001/` - Image display and download test
- `/002/` - Table rendering test (5x5)
- `/003/` - OTP input fields test (6-digit with auto-focus)
- `/004/` - File upload with localStorage persistence
- `/005/` - Basic authentication UI test page
- `/006/` - Multiple text input fields test

## Test Scenarios

Each numbered directory contains a standalone test page targeting specific UI interactions:
- Image handling (download triggers)
- Table data verification
- Multi-field OTP input with paste support
- File upload and content display
- Form input fields
