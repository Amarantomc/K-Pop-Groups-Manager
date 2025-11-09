import type { GridColDef } from "@mui/x-data-grid";

export const agencyColumns : GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 90},
    {field: 'name', headerName: 'Nombre', width: 150},
    {field: 'location',sortable: false, headerName: 'Ubicación', width: 150},
    {field: 'founded', headerName: 'Año de Fundación', width: 250},
]

export const apprenticeColumns : GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 90},
    {field: 'fullname', headerName: 'Nombre Completo', width: 150},
    {field: 'age', headerName: 'Edad', width: 90},
    {field: 'birthday', headerName: 'Fecha de Nacimiento', width: 250},
    {field: 'agencyName', headerName: 'Agencia', width: 150},
    {field: 'status', headerName: 'Estado', width: 120},
    {field: 'trainingLevel', headerName: 'Nivel de Entrenamiento', width: 180},
]

export const userColumns : GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 90},
    {field: 'username', headerName: 'Nombre de Usuario', width: 150},
    {field: 'email', headerName: 'Correo Electrónico', width: 200},
    {field: 'password', headerName: 'Contraseña', width: 150},
    {field: 'role', headerName: 'Rol', width: 120},
]