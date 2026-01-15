import express from 'express';
import sharp from 'sharp';

const app = express();
const PORT = 3000;

// Helper function to get days in a month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper function to get the starting day of week for a month
function getStartingDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

// Generate SVG calendar
function generateCalendarSVG() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  
  // Calculate days passed and remaining
  const startOfYear = new Date(currentYear, 0, 1);
  const daysPassed = Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
  const totalDays = isLeapYear ? 366 : 365;
  const daysLeft = totalDays - daysPassed;
  const percentage = Math.round((daysPassed / totalDays) * 100);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dotRadius = 10;
  const dotSpacing = 38;
  const monthStartY = 800;
  const monthSpacingY = 340;
  
  const cols = 3;
  const rows = 4;

  let svgContent = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const monthIndex = row * cols + col;
      if (monthIndex >= 12) break;

      const monthX = 180 + col * 360;
      const monthY = monthStartY + row * monthSpacingY;

      // Month name
      svgContent.push(`<text x="${monthX - 50}" y="${monthY - 40}" fill="#666666" font-size="28" font-family="Arial">${months[monthIndex]}</text>`);

      const daysInMonth = getDaysInMonth(currentYear, monthIndex);
      const startDay = getStartingDayOfWeek(currentYear, monthIndex);

      let dayCounter = 1;
      for (let week = 0; week < 6; week++) {
        if (dayCounter > daysInMonth) break;
        
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
          if (week === 0 && dayOfWeek < startDay) {
            continue;
          }
          if (dayCounter > daysInMonth) break;

          const dotX = monthX + dayOfWeek * dotSpacing - 120;
          const dotY = monthY + week * dotSpacing;

          let dotColor;
          if (monthIndex < currentMonth) {
            dotColor = '#ffffff';
          } else if (monthIndex === currentMonth) {
            if (dayCounter < currentDay) {
              dotColor = '#ffffff';
            } else if (dayCounter === currentDay) {
              dotColor = '#ff6b35';
            } else {
              dotColor = '#333333';
            }
          } else {
            dotColor = '#333333';
          }

          svgContent.push(`<circle cx="${dotX}" cy="${dotY}" r="${dotRadius}" fill="${dotColor}"/>`);
          dayCounter++;
        }
      }
    }
  }

  // Stats at bottom
  const statsY = 2200;
  svgContent.push(`<text x="540" y="${statsY}" fill="#ff6b35" font-size="48" font-weight="bold" font-family="Arial" text-anchor="middle">${daysLeft}d left</text>`);
  svgContent.push(`<text x="700" y="${statsY}" fill="#666666" font-size="48" font-family="Arial">·</text>`);
  svgContent.push(`<text x="780" y="${statsY}" fill="#666666" font-size="48" font-family="Arial">${percentage}%</text>`);

  const svg = `
    <svg width="1080" height="2340" xmlns="http://www.w3.org/2000/svg">
      <rect width="1080" height="2340" fill="#1a1a1a"/>
      ${svgContent.join('\n      ')}
    </svg>
  `;

  return svg;
}

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Year Progress Tracker</title>
      <style>
        body {
          margin: 0;
          padding: 20px;
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }
        .container {
          text-align: center;
        }
        img {
          max-width: 90%;
          height: auto;
          border-radius: 10px;
        }
        h1 {
          color: #fff;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Year Progress Tracker</h1>
        <img src="/photo" alt="Year Progress Calendar">
      </div>
    </body>
    </html>
  `);
});

app.get('/photo', async (req, res) => {
  try {
    const svg = generateCalendarSVG();
    const imageBuffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();
    
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'no-cache');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).send('Error generating image');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Photo endpoint: http://localhost:${PORT}/photo`);
});
