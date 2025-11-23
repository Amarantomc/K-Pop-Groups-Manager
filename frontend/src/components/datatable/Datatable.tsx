/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataGrid, type GridColDef , type GridRowsProp } from '@mui/x-data-grid';
import React from 'react';
import {Modal, Box, TextField, Typography ,FormControl,InputLabel,Select,MenuItem,FormHelperText} from '@mui/material';
import {Button} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import "../../styles/datatable.css";
import { useState } from 'react';
import type { FieldConstraint } from '../../modalConstraints';
import {esES} from "@mui/x-data-grid/locales"

interface DataTableProps {
  columns : GridColDef[];
  rows? : GridRowsProp;
  pagesize? : number;
  checkboxSelection? : boolean;
  onDelete? : (id : number) => void;
  onEditSave? : (updatedRow : any) => void;
  showEditButton? : boolean,
  constraints? : Record<string, FieldConstraint>;
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

const DataTable : React.FC<DataTableProps> = ({columns , rows , pagesize = 5 , checkboxSelection = false , onDelete, onEditSave , showEditButton = true , constraints}) => {
  const paginationModel = { page: 0, pageSize: pagesize };

   const [openModal, setOpenModal] = useState(false);
   const [editingRow, setEditingRow] = useState<any>(null);
   const [errors, setErrors] = useState<Record<string, string>>({});

  //Abrir modal con datos del usuario seleccionado
  const handleEdit = (row: any) => {
    setEditingRow(row);
    setErrors({})
    setOpenModal(true);
  };

  // Cerrar modal
  const handleClose = () => {
    setOpenModal(false);
    setEditingRow(null);
    setErrors({});
  };

  const validate = () : boolean => {
    if (!editingRow)return false;

    const newErrors: Record<string, string> = {};
    Object.keys(editingRow).forEach((key) => {
      const rule = constraints?.[key];
      if(!rule || !rule.editable) return;

      const value = editingRow[key];
      if(rule.validate){
        const errorMessage = rule.validate(value);
        if(errorMessage) newErrors[key] = errorMessage;
      }
    })
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Guardar cambios
  const handleSave = () => {
    if(!validate())return;
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
            rows={rows || []}
            columns={columns.concat(actionColumn)}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection = {checkboxSelection}
            disableRowSelectionOnClick
            sx={{ border: 0 }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
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
                const rule = constraints?.[key];
                if(!rule?.editable) return null;
                if (key === 'id' || key === 'action') return null;
                
                const value = editingRow[key] ?? "";
                const errorMessage = errors[key] || "";

                if (rule.type === "select") {
                return (
                  <FormControl
                    fullWidth
                    margin="normal"
                    key={key}
                    error={!!errorMessage}
                  >
                    <InputLabel>{rule.label}</InputLabel>
                    <Select
                      value={value}
                      label={rule.label}
                      onChange={(e) =>

                        handleFieldChange(key, e.target.value)
                      }
                      disabled={!rule.editable}
                    >
                      {rule.options?.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                    {errorMessage && (
                      <FormHelperText>{errorMessage}</FormHelperText>
                    )}
                  </FormControl>
                );
              }

                return (
                  <TextField
                    key={key}
                    label={rule.label || key}
                    fullWidth
                    margin="normal"
                    type={
                      // rule.type === "number"
                      //   ? "number"
                      rule.type === "date"
                          ? "date"
                        :"text"
                    }
                    value={editingRow[key] ?? ''}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    error={!!errors[key]}
                    helperText={errors[key]}
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