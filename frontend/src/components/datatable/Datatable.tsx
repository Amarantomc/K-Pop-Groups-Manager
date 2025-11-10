import { DataGrid, type GridColDef , type GridRowsProp } from '@mui/x-data-grid';
import React from 'react';
import {Modal, Box, TextField, Typography } from '@mui/material';
import {Button} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import "../../styles/datatable.css";
import { useState } from 'react';

interface DataTableProps {
  columns : GridColDef[];
  rows? : GridRowsProp;
  pagesize? : number;
  checkboxSelection? : boolean;
  onDelete? : (id : number) => void;
  onEditSave? : (updatedRow : any) => void;
  showEditButton? : boolean
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const DataTable : React.FC<DataTableProps> = ({columns , rows , pagesize = 5 , checkboxSelection = true , onDelete, onEditSave , showEditButton = true}) => {
  const paginationModel = { page: 0, pageSize: pagesize };

   const [openModal, setOpenModal] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);

  //Abrir modal con datos del usuario seleccionado
  const handleEdit = (row: any) => {
    setEditingRow(row);
    setOpenModal(true);
  };

  // Cerrar modal
  const handleClose = () => {
    setOpenModal(false);
    setEditingRow(null);
  };

  // Guardar cambios
  const handleSave = () => {
    if (onEditSave && editingRow) {
      onEditSave(editingRow);
    }
    handleClose();
  };

  // Actualizar campos del modal
  const handleFieldChange = (field: string, value: string) => {
    setEditingRow((prev: any) => ({ ...prev, [field]: value }));
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
        <div className="datatable">
        <DataGrid
            rows={rows}
            columns={columns.concat(actionColumn)}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection = {checkboxSelection}
            sx={{ border: 0 }}
        />
        </div>

           {/* Modal para editar */}
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Editar registro
          </Typography>

          {editingRow && (
            <>
              {Object.keys(editingRow).map((key) => {
                if (key === 'id' || key === 'action') return null;
                return (
                  <TextField
                    key={key}
                    label={key}
                    fullWidth
                    margin="normal"
                    value={editingRow[key] ?? ''}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  />
                );
              })}

              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button onClick={handleClose} sx={{ mr: 1 }}>
                  Cancelar
                </Button>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Guardar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
        </>
  );
}

export default DataTable;