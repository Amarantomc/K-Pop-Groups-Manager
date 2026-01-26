/* eslint-disable @typescript-eslint/no-explicit-any */
import './popuList.css'
import React, { useState } from 'react'
import ModalCreate from '../modal/ModalCreate';
import Modal from '../modal/Modal';
import type { Field } from '../../config/formSource';
import type { FieldConstraint } from '../../config/modalConstraints';

interface PopuListProps{
  charts : any[],
  onDelete? : (id : number) => void;
  onEditSave? : (updatedRow : any) => void;
  onCreateSave? : (newRow : any) => void;
  createEntity? : string;
  createFields? : Field[];
  showCreateButton : boolean;
  onFieldChange? : (fieldName: string, value: any) => void;
  constraints? : Record<string, FieldConstraint>;
}
const PopuList : React.FC<PopuListProps>  = ({charts = [],onDelete,onEditSave,onCreateSave,createEntity,createFields,onFieldChange,constraints,showCreateButton}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [selectedChart,setSelectedChart] = useState<any|null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(2025)

    // Abrir modal de edición con datos del usuario seleccionado
  const handleEdit = (row: any) => {
    setEditingRow(row);
    setEditModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, row: any) => {
    e.stopPropagation(); // Evita que se active el onClick de la tarjeta
    handleEdit(row);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Evita que se active el onClick de la tarjeta
    if (onDelete) {
      onDelete(id);
    }
  };

    // Abrir modal de creación
  const handleCreateOpen = () => {
    setCreateModalOpen(true);
  };

  // Guardar nuevo registro en creación
  const handleCreateSave = (data: any) => {
    if (onCreateSave) {
      onCreateSave(data);
    }
    handleCreateClose();
  };
    // Guardar cambios en edición
  const handleEditSave = (data: any) => {
    if (onEditSave && editingRow) {
      onEditSave({ ...editingRow, ...data });
    }
    handleEditClose();
  };
   // Cerrar modal de creación
  const handleCreateClose = () => {
    setCreateModalOpen(false);
  };
    // Cerrar modal de edición
  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditingRow(null);
  };
    const getSongs = (chart: any) => Array.isArray(chart?.songs) ? chart.songs : [];
    const getFilteredSongs = () => {
    if (!selectedChart) return []
    return selectedChart.songs.filter((song) => song.year === selectedYear)
  }
  const getAvailableYears = () => {
    if (!selectedChart) return []
    const years = [...new Set(selectedChart.songs.map((song) => song.year))]
    return years.sort((a, b) => b - a)
  }
    return (
      <>
    <div className="popularity-charts-container">
      <div className="charts-header">
        <h2>Listas de Popularidad</h2>
                {showCreateButton && (
            <button 
              className="add-button" 
              onClick={handleCreateOpen}
            >
              + Nueva Lista
            </button>
          )}
      </div>
      <div className="charts-grid">
        {charts.map((chart) => (
          <div key={chart.id} className="chart-card" onClick={() => {setSelectedChart(chart);
            // Obtener años disponibles
            const years = chart.songs 
              ? [...new Set(chart.songs.map((song) => song.year))].sort((a, b) => b - a)
              : [];
            
            // Establecer el año más reciente si hay años disponibles
            setSelectedYear(years.length > 0 ? years[0] : null);
          } }>
              <div className="chart-actions">
                <button 
                  className="viewButton"
                  onClick={(e) => handleEditClick(e,chart)}
                  title="Editar lista"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" 
                    fill="currentColor"/>
                  </svg>
                </button>
                <button 
                  className="deleteButton"
                  onClick={(e) => handleDelete(e, chart.id)}
                  title="Eliminar lista"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" 
                    fill="currentColor"/>
                  </svg>
                </button>
              </div>
            <h3 className="chart-name">{chart.name}</h3>
            <p className="chart-description">{chart.description}</p>
            <div className="chart-preview">{getSongs(chart).length > 0
    ? `Top: ${getSongs(chart)[0].title}`
    : 'Sin canciones registradas'}</div>           
          </div>
        ))}
      </div>

      {selectedChart && (
        <div className="chart-modal-overlay" onClick={() => setSelectedChart(null)}>
          <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="chart-modal-header">
              <div>
                <h2 className="chart-modal-title">
                  {selectedChart.name}
                </h2>
                <p className="chart-modal-subtitle">{selectedChart.description}</p>
              </div>
              <div className="chart-modal-actions">
                <div className="year-filter-container">
                  <label htmlFor="year-filter" className="year-filter-label">
                    Año:
                  </label>
                  <select
                    id="year-filter"
                    className="year-filter-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {getAvailableYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <ExportButton onExport={handleExport} /> */}
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
                    <th className="chart-th">Posición</th>
                    <th className="chart-th">Canción</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredSongs().map((song) => (
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
           {/* Modal para crear nuevo registro */}
      <ModalCreate
        isOpen={createModalOpen}
        onClose={handleCreateClose}
        title="Crear nuevo registro"
        createEntity={createEntity}
        createFields={createFields}
        onFieldChange={onFieldChange}
        onSave={handleCreateSave}
      />

      {/* Modal para editar registro */}
      <Modal
        isOpen={editModalOpen}
        onClose={handleEditClose}
        title="Editar registro"
        data={editingRow || {}}
        constraints={constraints || {}}
        onSave={handleEditSave}
      />
      </>
    )
}
export default PopuList