/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataGrid, type GridColDef , type GridRowsProp } from '@mui/x-data-grid';
import React from 'react';
import {Button} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import "./datatable.css";
import { useState } from 'react';
import type { FieldConstraint } from '../../config/modalConstraints';
import {esES} from "@mui/x-data-grid/locales"
import Modal from '../modal/Modal';
import ModalCreate from '../modal/ModalCreate';
import type { Field } from '../../config/formSource';

interface DataTableProps {
  columns : GridColDef[];
  rows? : GridRowsProp;
  pagesize? : number;
  checkboxSelection? : boolean;
  onDelete? : (id : number) => void;
  onEditSave? : (updatedRow : any) => void;
  onCreateSave? : (newRow : any) => void;
  showEditButton? : boolean,
  constraints? : Record<string, FieldConstraint>;
  createEntity? : string;
  createFields? : Field[];
  onFieldChange? : (fieldName: string, value: any) => void;
  showCreateButton? : boolean;
  userRole?: string;
}


const DataTable : React.FC<DataTableProps> = ({columns , rows , pagesize = 5 , checkboxSelection = false , onDelete, onEditSave, onCreateSave , showEditButton = true , constraints, createEntity, createFields, onFieldChange, showCreateButton=true, userRole}) => {
  const paginationModel = { page: 0, pageSize: pagesize };

   const [editModalOpen, setEditModalOpen] = useState(false);
   const [createModalOpen, setCreateModalOpen] = useState(false);
   const [editingRow, setEditingRow] = useState<any>(null);

  // Abrir modal de edición con datos del usuario seleccionado
  const handleEdit = (row: any) => {
    setEditingRow(row);
    setEditModalOpen(true);
  };

  // Abrir modal de creación
  const handleCreateOpen = () => {
    setCreateModalOpen(true);
  };

  // Cerrar modal de edición
  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditingRow(null);
  };

  // Cerrar modal de creación
  const handleCreateClose = () => {
    setCreateModalOpen(false);
  };

  // Guardar cambios en edición
  const handleEditSave = (data: any) => {
    if (onEditSave && editingRow) {
      onEditSave({ ...editingRow, ...data });
    }
    handleEditClose();
  };

  // Guardar nuevo registro en creación
  const handleCreateSave = (data: any) => {
    if (onCreateSave) {
      onCreateSave(data);
    }
    handleCreateClose();
  };
  const actionColumn : GridColDef[] = [
    {field: 'action', headerName: 'Acciones', width: 200, renderCell: (params) => {
      return (
        <div className='cellAction'>
            {showEditButton && (<Button startIcon = {<EditIcon/>}className='viewButton' onClick={() => handleEdit(params.row)}>Editar</Button>)}
            <Button startIcon={<DeleteIcon/>} className='deleteButton' onClick={() => {onDelete && onDelete(params.row.id)}}>Eliminar</Button>
        </div>

        
      )
    }}
  ]

  return (
        <>
        {showCreateButton &&
        (<div className='datatable-header'>
            <button className='add-button' onClick={handleCreateOpen}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Agregar
            </button>
        </div>)}
        <div className="datatable">
        <DataGrid
            rows={rows || []}
            columns={userRole === 'admin' ? columns.concat(actionColumn) : columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection = {checkboxSelection}
            disableRowSelectionOnClick
            sx={{ border: 0 }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        />
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
  );
}

export default DataTable;