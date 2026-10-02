import data from '../../data/events.json'
// import Sidebar from './sidebar/sidebar'
import  LineGraph from './content/graphs'
import EventTable from '../../components/eventTable/eventTable'
import './dashboard.css'

const getEventSummary = (data) => {
  const totalEvents = data.length

  const criticalEvents = data.filter(
    event => event.severity === 'Critical'
  ).length

  const highSeverityEvents = data.filter(
    event => event.severity === 'High'
  ).length

  const openEvents = data.filter(
    event => event.status === 'Open'
  ).length

  const averageRiskScore =
    data.reduce((sum, event) => sum + event.riskScore, 0) / totalEvents

  return [
    {
      title: 'Total Events',
      value: totalEvents
    },
    {
      title: 'Critical Events',
      value: criticalEvents,
      percentage: ((criticalEvents / totalEvents) * 100).toFixed(1)
    },
    {
      title: 'High Severity Events',
      value: highSeverityEvents,
      percentage: ((highSeverityEvents / totalEvents) * 100).toFixed(1)
    },
    {
      title: 'Open Events',
      value: openEvents,
      percentage: ((openEvents / totalEvents) * 100).toFixed(1)
    },
    {
      title: 'Average Risk Score',
      value: averageRiskScore.toFixed(1)
    }
  ]
}

const Dashboard = () => {
  const summary = getEventSummary(data)

  return (
    <div className="dashboard-container">

        <div className="summary">

            <span className="summary_title">
            Dashboard Summary
            </span>

            <div className="summary-cards">
            {summary.map((item) => (
                <div className="summary-card" key={item.title}>

                <span>{item.title}</span>

                <h2>{item.value}</h2>

                {item.percentage && (
                    <p>{item.percentage}% of total</p>
                )}

                </div>
            ))}
            </div>

        </div>
        <div className="graph">
            <LineGraph events={data} />
        </div>
        <div className="table">
            <EventTable />
        </div>

    </div>
  )
}

export default Dashboard