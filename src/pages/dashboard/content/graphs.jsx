import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineGraph = ({ events }) => {
  const [timeRange, setTimeRange] = useState("7d");

  /*
   * Use the latest event as the reference point.
   * This makes the graph work correctly with your sample JSON data.
   */
  const referenceTime = useMemo(() => {
    if (!events || events.length === 0) {
      return new Date();
    }

    return new Date(
      Math.max(...events.map((event) => new Date(event.timestamp).getTime()))
    );
  }, [events]);

  const chartData = useMemo(() => {
    if (!events || events.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const ranges = {
      "24h": {
        milliseconds: 24 * 60 * 60 * 1000,
        bucket: "hour",
      },

      "7d": {
        milliseconds: 7 * 24 * 60 * 60 * 1000,
        bucket: "day",
      },

      "30d": {
        milliseconds: 30 * 24 * 60 * 60 * 1000,
        bucket: "day",
      },
    };

    const selectedRange = ranges[timeRange];

    const startTime =
      referenceTime.getTime() - selectedRange.milliseconds;

    const filteredEvents = events.filter((event) => {
      const eventTime = new Date(event.timestamp).getTime();

      return (
        eventTime >= startTime &&
        eventTime <= referenceTime.getTime()
      );
    });

    /*
     * Create buckets.
     * 24 hours -> one point per hour
     * 7/30 days -> one point per day
     */
    const buckets = {};

    if (selectedRange.bucket === "hour") {
      for (let i = 0; i < 24; i++) {
        const bucketTime =
          new Date(startTime + i * 60 * 60 * 1000);

        bucketTime.setMinutes(0, 0, 0);

        const key = bucketTime.toISOString();

        buckets[key] = {
          label: bucketTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          count: 0,
        };
      }
    } else {
      const numberOfDays = timeRange === "7d" ? 7 : 30;

      for (let i = 0; i <= numberOfDays; i++) {
        const bucketTime = new Date(
          startTime + i * 24 * 60 * 60 * 1000
        );

        bucketTime.setHours(0, 0, 0, 0);

        const key = bucketTime.toISOString();

        buckets[key] = {
          label: bucketTime.toLocaleDateString([], {
            month: "short",
            day: "numeric",
          }),
          count: 0,
        };
      }
    }

    /*
     * Put every event into its appropriate bucket.
     */
    filteredEvents.forEach((event) => {
      const eventDate = new Date(event.timestamp);

      let bucketDate = new Date(eventDate);

      if (selectedRange.bucket === "hour") {
        bucketDate.setMinutes(0, 0, 0);
      } else {
        bucketDate.setHours(0, 0, 0, 0);
      }

      const key = bucketDate.toISOString();

      if (buckets[key]) {
        buckets[key].count += 1;
      }
    });

    const sortedBuckets = Object.values(buckets);

    return {
      labels: sortedBuckets.map((bucket) => bucket.label),

      datasets: [
        {
          label: "Security Events",
          data: sortedBuckets.map((bucket) => bucket.count),

          borderColor: "#6366F1",

          backgroundColor: "rgba(99, 102, 241, 0.15)",

          borderWidth: 2,

          pointRadius: 0,

          pointHoverRadius: 5,

          fill: true,

          tension: 0.4,
        },
      ],
    };
  }, [events, timeRange, referenceTime]);

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: "index",
    },

    scales: {
      x: {
        grid: {
          color: "rgba(28, 35, 64, 0.08)",
        },

        ticks: {
          color: "#56607E",

          font: {
            family: "Inter",
            size: 11,
          },

          maxTicksLimit:
            timeRange === "24h"
              ? 8
              : timeRange === "7d"
              ? 7
              : 10,
        },

        border: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        grid: {
          color: "rgba(28, 35, 64, 0.08)",
        },

        ticks: {
          color: "#56607E",

          precision: 0,

          font: {
            family: "Inter",
            size: 11,
          },
        },

        border: {
          display: false,
        },
      },
    },

    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: false,
      },

      tooltip: {
        backgroundColor: "rgba(28, 35, 64, 0.92)",

        titleColor: "#FFFFFF",

        bodyColor: "#FFFFFF",

        padding: 10,

        displayColors: false,

        callbacks: {
          label: (context) =>
            `Security Events: ${context.parsed.y}`,
        },
      },
    },
  };

const graphStyle = {
  height: "18rem",
  width: "90%",
  margin: "0 auto",
    padding: "clamp(10px, 2vw, 24px)",
  boxSizing: "border-box",
};

  return (
    <div className="line-graph-container">

      <div className="line-graph-header">

        <div>
          <h3>Security Events Over Time</h3>

          <p>
            Number of detected security events
          </p>
        </div>

        <div className="time-filter">

          <button
            className={timeRange === "24h" ? "active" : ""}
            onClick={() => setTimeRange("24h")}
          >
            Last 24 Hours
          </button>

          <button
            className={timeRange === "7d" ? "active" : ""}
            onClick={() => setTimeRange("7d")}
          >
            Last 7 Days
          </button>

          <button
            className={timeRange === "30d" ? "active" : ""}
            onClick={() => setTimeRange("30d")}
          >
            Last 30 Days
          </button>

        </div>

      </div>

      <div style={graphStyle}>
        <Line
          data={chartData}
          options={options}
        />
      </div>


      <button
        type="button"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        cisai
      </button>

    </div>
  );
};

export default LineGraph;