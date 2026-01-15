import { useEffect, useState } from 'react';
import './YearProgress.css';

const YearProgress = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update every day at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow - now;

    const timeout = setTimeout(() => {
      setCurrentDate(new Date());
      // Set up daily interval
      const interval = setInterval(() => {
        setCurrentDate(new Date());
      }, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const getYearData = () => {
    const year = currentDate.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
    
    // Check if leap year
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const totalDays = isLeapYear ? 366 : 365;
    const daysLeft = totalDays - dayOfYear;
    const percentComplete = Math.round((dayOfYear / totalDays) * 100);

    return { dayOfYear, daysLeft, percentComplete, totalDays, year };
  };

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const months = [
      { name: 'Jan', days: 31 },
      { name: 'Feb', days: (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 29 : 28 },
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
    const { dayOfYear } = getYearData();

    return months.map((month) => {
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
      return { ...month, days: monthDays };
    });
  };

  const { daysLeft, percentComplete } = getYearData();
  const monthsData = getMonthData();

  return (
    <div className="year-progress-container" id="year-progress">
      <div className="calendar-grid">
        {monthsData.map((month, monthIndex) => (
          <div key={monthIndex} className="month-container">
            <div className="month-name">{month.name}</div>
            <div className="days-grid">
              {month.days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`day-dot ${day.status}`}
                  title={`${month.name} ${day.day}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="stats">
        <span className="days-left">{daysLeft}d left</span>
        <span className="separator"> · </span>
        <span className="percent">{percentComplete}%</span>
      </div>
    </div>
  );
};

export default YearProgress;
