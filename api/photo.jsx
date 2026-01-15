import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const width = parseInt(searchParams.get('width') || '1080');
    const height = parseInt(searchParams.get('height') || '2340');

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
    
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const totalDays = isLeapYear ? 366 : 365;
    const daysLeft = totalDays - dayOfYear;
    const percentComplete = Math.round((dayOfYear / totalDays) * 100);

    const months = [
      { name: 'Jan', days: 31 },
      { name: 'Feb', days: isLeapYear ? 29 : 28 },
      { name: 'Mar', days: 31 },
      { name: 'Apr', days: 30 },
      { name: 'May', days: 31 },
      { name: 'Jun', days: 30 },
      { name: 'Jul', days: 31 },
      { name: 'Aug', days: 31 },
      { name: 'Sep', days: 30 },
      { name: 'Oct', days: 31 },
      { name: 'Nov', days: 30 },
      { name: 'Dec', days: 31 }
    ];

    let dayCounter = 0;
    const monthsData = months.map((month) => {
      const monthDays = [];
      for (let i = 1; i <= month.days; i++) {
        dayCounter++;
        let status = 'future';
        if (dayCounter < dayOfYear) {
          status = 'past';
        } else if (dayCounter === dayOfYear) {
          status = 'current';
        }
        monthDays.push({ day: i, status });
      }
      return { name: month.name, days: monthDays };
    });

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            padding: '60px 40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '40px',
              justifyContent: 'center',
              maxWidth: '900px',
              marginBottom: '60px',
            }}
          >
            {monthsData.map((month, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    color: '#888',
                    fontSize: '20px',
                    fontWeight: '500',
                    marginBottom: '4px',
                  }}
                >
                  {month.name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    width: '186px',
                  }}
                >
                  {month.days.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor:
                          day.status === 'past'
                            ? '#4ade80'
                            : day.status === 'current'
                            ? '#60a5fa'
                            : '#333',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: '#888',
              fontSize: '28px',
            }}
          >
            <span style={{ color: '#fff', fontWeight: '600' }}>
              {daysLeft}d left
            </span>
            <span>·</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>
              {percentComplete}%
            </span>
          </div>
        </div>
      ),
      {
        width,
        height,
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': 'inline; filename="daily_wallpaper.png"',
        },
      }
    );
  } catch (error) {
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
}
