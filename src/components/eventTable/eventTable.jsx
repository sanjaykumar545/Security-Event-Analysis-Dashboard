import { useMemo, useState } from 'react'
import data from '../../data/events.json'
import './eventTable.css'

const EventTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const [search, setSearch] = useState('')

    const [severityFilter, setSeverityFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    const [sortBy, setSortBy] = useState('none')

    const [selectedEvent, setSelectedEvent] = useState(null)


    const processedEvents = useMemo(() => {
        let result = [...data]

        if (search.trim()) {
            const searchValue = search.toLowerCase()

            result = result.filter((event) =>
                event.id.toLowerCase().includes(searchValue) ||
                event.source.toLowerCase().includes(searchValue) ||
                event.destination.toLowerCase().includes(searchValue) ||
                event.eventType.toLowerCase().includes(searchValue)
            )
        }


        if (severityFilter !== 'all') {
            result = result.filter(
                (event) => event.severity === severityFilter
            )
        }

        if (statusFilter !== 'all') {
            result = result.filter(
                (event) => event.status === statusFilter
            )
        }

        if (sortBy === 'risk-high') {
            result.sort((a, b) => b.riskScore - a.riskScore)
        }

        if (sortBy === 'risk-low') {
            result.sort((a, b) => a.riskScore - b.riskScore)
        }

        if (sortBy === 'newest') {
            result.sort(
                (a, b) =>
                    new Date(b.timestamp) - new Date(a.timestamp)
            )
        }

        if (sortBy === 'oldest') {
            result.sort(
                (a, b) =>
                    new Date(a.timestamp) - new Date(b.timestamp)
            )
        }

        return result
    }, [search, severityFilter, statusFilter, sortBy])


    const totalPages = Math.ceil(
        processedEvents.length / itemsPerPage
    )

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    const currentEvents = processedEvents.slice(
        startIndex,
        endIndex
    )


    const resetPage = () => {
        setCurrentPage(1)
    }

    return (
        <div className="event-table-card">

            {/* HEADER */}
            <div className="event-table-header">

                <div>
                    <h3>Security Events</h3>
                    <p>
                        Recent security events detected by the system
                    </p>
                </div>


                <div className="event-table-controls">

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                resetPage()
                            }}
                        />
                    </div>

                    <select
                        value={severityFilter}
                        onChange={(e) => {
                            setSeverityFilter(e.target.value)
                            resetPage()
                        }}
                    >
                        <option value="all">All Severity</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value)
                            resetPage()
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="Open">Open</option>
                        <option value="Investigating">
                            Investigating
                        </option>
                        <option value="Progress">Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value)
                            resetPage()
                        }}
                    >
                        <option value="none">Sort By</option>
                        <option value="risk-high">
                            Risk Score: High → Low
                        </option>
                        <option value="risk-low">
                            Risk Score: Low → High
                        </option>
                        <option value="newest">
                            Newest First
                        </option>
                        <option value="oldest">
                            Oldest First
                        </option>
                    </select>

                </div>
            </div>

            {/* TABLE */}
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

                        {currentEvents.length > 0 ? (

                            currentEvents.map((event) => (

                                <tr key={event.id}
                                    onClick={() => setSelectedEvent(event)}
                                >

                                    <td>{event.id}</td>

                                    <td>
                                        {new Date(
                                            event.timestamp
                                        ).toLocaleString()}
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

                            ))

                        ) : (

                            <tr>
                                <td
                                    colSpan="8"
                                    className="no-results"
                                >
                                    No security events found
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {/* PAGINATION */}
            <div className="pagination">

                <button
                    className="pagination-arrow"
                    onClick={() =>
                        setCurrentPage(currentPage - 1)
                    }
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
                    <button
                        onClick={() =>
                            setCurrentPage(currentPage - 1)
                        }
                    >
                        {currentPage - 1}
                    </button>
                )}

                {currentPage !== 1 &&
                    currentPage !== totalPages && (
                        <button className="active">
                            {currentPage}
                        </button>
                    )}

                {currentPage < totalPages - 1 && (
                    <button
                        onClick={() =>
                            setCurrentPage(currentPage + 1)
                        }
                    >
                        {currentPage + 1}
                    </button>
                )}

                {currentPage < totalPages - 2 && (
                    <span>...</span>
                )}

                {totalPages > 1 && (
                    <button
                        className={
                            currentPage === totalPages
                                ? 'active'
                                : ''
                        }
                        onClick={() =>
                            setCurrentPage(totalPages)
                        }
                    >
                        {totalPages}
                    </button>
                )}

                <button
                    className="pagination-arrow"
                    onClick={() =>
                        setCurrentPage(currentPage + 1)
                    }
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

{selectedEvent && (
    <div
        className="event-drawer-overlay"
        onClick={() => setSelectedEvent(null)}
    >
        <div
            className="event-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Event details"
            onClick={(e) => e.stopPropagation()}
        >
            {/* HEADER */}
            <div className="event-drawer-header">
                <div>
                    <h3>Event Details</h3>
                    <p>{selectedEvent.id}</p>
                </div>

                <button
                    className="drawer-close"
                    aria-label="Close"
                    onClick={() => setSelectedEvent(null)}
                >
                    &times;
                </button>
            </div>

            <div className="event-drawer-content">

                {/* FLOW: Source > Protocol > Destination > Event > Risk Score */}
                <div className="event-flow">
                    <div className="flow-node">
                        <small>Source</small>
                        {selectedEvent.source}
                    </div>

                    <span className="flow-arrow" />

                    <div className="flow-node">
                        <small>Protocol</small>
                        {selectedEvent.protocol}
                    </div>

                    <span className="flow-arrow" />

                    <div className="flow-node">
                        <small>Destination</small>
                        {selectedEvent.destination}
                    </div>

                    <span className="flow-arrow" />

                    <div className="flow-node">
                        <small>Event</small>
                        {selectedEvent.eventType}
                    </div>

                    <span className="flow-arrow" />

                    <div
                        className={`flow-node risk ${selectedEvent.severity.toLowerCase()}`}
                    >
                        <small>Risk Score</small>
                        {selectedEvent.riskScore}
                    </div>
                </div>

                {/* FULL DETAILS */}
                <div className="event-detail">
                    <span>Event ID</span>
                    <strong>{selectedEvent.id}</strong>
                </div>

                <div className="event-detail">
                    <span>Timestamp</span>
                    <strong>
                        {new Date(selectedEvent.timestamp).toLocaleString()}
                    </strong>
                </div>

                <div className="event-detail">
                    <span>Source</span>
                    <strong>{selectedEvent.source}</strong>
                </div>

                <div className="event-detail">
                    <span>Destination</span>
                    <strong>{selectedEvent.destination}</strong>
                </div>

                <div className="event-detail">
                    <span>Event Type</span>
                    <strong>{selectedEvent.eventType}</strong>
                </div>

                <div className="event-detail">
                    <span>Protocol</span>
                    <strong>{selectedEvent.protocol}</strong>
                </div>

                <div className="event-detail">
                    <span>Severity</span>
                    <span
                        className={`severity-badge ${selectedEvent.severity.toLowerCase()}`}
                    >
                        {selectedEvent.severity}
                    </span>
                </div>

                <div className="event-detail">
                    <span>Status</span>
                    <span
                        className={`status-badge ${selectedEvent.status.toLowerCase()}`}
                    >
                        {selectedEvent.status}
                    </span>
                </div>

                <div className="event-detail">
                    <span>Risk Score</span>
                    <strong>{selectedEvent.riskScore}</strong>
                </div>

                {/* Any additional fields in the JSON */}
                {Object.entries(selectedEvent)
                    .filter(
                        ([key]) =>
                            ![
                                'id',
                                'timestamp',
                                'source',
                                'destination',
                                'eventType',
                                'protocol',
                                'severity',
                                'status',
                                'riskScore',
                            ].includes(key)
                    )
                    .map(([key, value]) => (
                        <div className="event-detail" key={key}>
                            <span>
                                {key
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, (str) => str.toUpperCase())}
                            </span>

                            <strong>
                                {typeof value === 'object'
                                    ? JSON.stringify(value)
                                    : String(value)}
                            </strong>
                        </div>
                    ))}
            </div>
        </div>
    </div>
)}

        </div>
    )
}

export default EventTable