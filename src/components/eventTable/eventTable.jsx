import { useState } from 'react'
import data from '../../data/events.json'
import './EventTable.css'

const EventTable = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const currentEvents = data.slice(startIndex, endIndex)

  return (
    <div className="event-table-card">

      <div className="event-table-header">
        <div>
          <h3>Security Events</h3>
          <p>Recent security events detected by the system</p>
        </div>
      </div>

      <div className="event-table-wrapper">
        <table className="event-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Timestamp</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Event Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Risk Score</th>
            </tr>
          </thead>

          <tbody>
            {currentEvents.map((event) => (
              <tr key={event.id}>
                <td>{event.id}</td>

                <td>
                  {new Date(event.timestamp).toLocaleString()}
                </td>

                <td>{event.source}</td>

                <td>{event.destination}</td>

                <td>{event.eventType}</td>

                <td>
                  <span
                    className={`severity-badge ${event.severity.toLowerCase()}`}
                  >
                    {event.severity}
                  </span>
                </td>

                <td>
                  <span
                    className={`status-badge ${event.status.toLowerCase()}`}
                  >
                    {event.status}
                  </span>
                </td>

                <td>{event.riskScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">

        <button
          className="pagination-arrow"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        <button
          className={currentPage === 1 ? 'active' : ''}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>

        {currentPage > 3 && <span>...</span>}

        {currentPage > 2 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>
            {currentPage - 1}
          </button>
        )}

        {currentPage !== 1 && currentPage !== totalPages && (
          <button className="active">
            {currentPage}
          </button>
        )}

        {currentPage < totalPages - 1 && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>
            {currentPage + 1}
          </button>
        )}

        {currentPage < totalPages - 2 && <span>...</span>}

        {totalPages > 1 && (
          <button
            className={currentPage === totalPages ? 'active' : ''}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </button>
        )}

        <button
          className="pagination-arrow"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>

        <span className="page-info">
          {currentPage} of {totalPages}
        </span>

        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value))
            setCurrentPage(1)
          }}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>

      </div>
    </div>
  )
}

export default EventTable