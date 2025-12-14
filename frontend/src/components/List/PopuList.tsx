/* eslint-disable @typescript-eslint/no-explicit-any */
import './popuList.css'
import ExportButton from '../exportButton/ExportButton'
import React, { useState } from 'react'
interface PopuListProps{
  charts : any[],
}
const PopuList : React.FC<PopuListProps>  = ({charts = []}) => {
  const [selectedChart,setSelectedChart] = useState<any|null>(null)
    return (
        <div className="popularity-charts-container">
      <div className="charts-grid">
        {charts.map((chart) => (
          <div key={chart.id} className="chart-card" onClick={() => setSelectedChart(chart)}>
            {/* <div className="chart-icon">{chart.icon}</div> */}
            <h3 className="chart-name">{chart.name}</h3>
            <div className="chart-preview">
              Top: {chart.songs[0].title}
            </div>
          </div>
        ))}
      </div>

      {selectedChart && (
        <div className="chart-modal-overlay" onClick={() => setSelectedChart(null)}>
          <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="chart-modal-header">
              <div>
                <h2 className="chart-modal-title">
                  {selectedChart.icon} {selectedChart.name}
                </h2>
                <p className="chart-modal-subtitle">{selectedChart.description}</p>
              </div>
              <div className="chart-modal-actions">
                <ExportButton onExport={() => console.log("Exportando")} />
                <button className="chart-modal-close" onClick={() => setSelectedChart(null)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="chart-table-container">
              <table className="chart-table">
                <thead>
                  <tr>
                    <th className="chart-th">Pos.</th>
                    <th className="chart-th">Canción</th>
                  </tr>
                </thead>
                <tbody>
                  {[...selectedChart.songs].sort((a,b) => a.position - b.position).map((song) => (
                    <tr key={song.position} className="chart-row">
                      <td className="chart-td chart-position">{song.position}</td>
                      <td className="chart-td chart-song-title">{song.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
    )
}
export default PopuList