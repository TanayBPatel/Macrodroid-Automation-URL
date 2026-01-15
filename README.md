# Year Progress Tracker

A Node.js application that generates a dynamic year progress calendar image, similar to a habit tracker.

## Features

- 📅 Visual calendar showing all 12 months
- ⚪ White dots for completed days
- 🟠 Orange dot for the current day
- ⚫ Gray dots for remaining days
- 📊 Shows days left and percentage completed
- 🖼️ Generates PNG image at `/photo` endpoint

## Installation

```bash
npm install
```

## Usage

Start the server:
```bash
npm start
```

Or use development mode with auto-restart:
```bash
npm run dev
```

## Endpoints

- `GET /` - View the calendar in a web page
- `GET /photo` - Get the calendar as a PNG image (1080x2340)

## How it works

The application:
1. Calculates the current date and year progress
2. Generates a canvas-based image with all 12 months
3. Colors each day dot based on whether it's past, present, or future
4. Displays remaining days and completion percentage
5. Serves the image at the `/photo` endpoint

The image updates automatically based on the server's current date.
