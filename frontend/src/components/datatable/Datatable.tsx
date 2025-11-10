import { DataGrid, type GridColDef , type GridRowsProp } from '@mui/x-data-grid';
import React from 'react';
import {Button} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import "../../styles/datatable.css";

interface DataTableProps {
  columns : GridColDef[];
  rows? : GridRowsProp;
  pagesize? : number;
  checkboxSelection? : boolean;
  onDelete? : (id : number) => void;
}

const DataTable : React.FC<DataTableProps> = ({columns , rows , pagesize = 5 , checkboxSelection = true}) => {
  const paginationModel = { page: 0, pageSize: pagesize };

  const actionColumn : GridColDef[] = [
    {field: 'action', headerName: 'Acciones', width: 200, renderCell: () => {
      return (
        <div className='cellAction'>
            <Button startIcon = {<EditIcon/>}className='viewButton'>Editar</Button>
            <Button startIcon={<DeleteIcon/>} className='deleteButton'>Eliminar</Button>
        </div>
      )
    }}
  ]

  return (
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
  );
}

export default DataTable;