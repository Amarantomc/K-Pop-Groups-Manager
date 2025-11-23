import type { GridColDef } from "@mui/x-data-grid";

export const agencyColumns : GridColDef[] = [
    {field: 'name', headerName: 'Nombre', width: 150},
    {field: 'location',sortable: false, headerName: 'Ubicación', width: 150},
    {field: 'founded', headerName: 'Año de Fundación', width: 250},
]

export const apprenticeColumns : GridColDef[] = [
    {field: 'name', headerName: 'Nombre Completo', width: 150},
    {field: 'dateOfBirth', headerName: 'Fecha de Nacimiento', width: 250},
    {field: 'age', headerName: 'Edad', width: 90},
    // {field: 'agencyName', headerName: 'Agencia', width: 150},
    {field: 'trainingLv', headerName: 'Nivel de Entrenamiento', width: 180},
    {field: 'status', headerName: 'Estado', width: 120},
]

export const userColumns : GridColDef[] = [
    {field: 'username', headerName: 'Nombre de Usuario', width: 150},
    {field: 'email', headerName: 'Correo Electrónico', width: 200},
    // {field: 'password', headerName: 'Contraseña', width: 150},
    // {field: 'role', headerName: 'Rol', width: 120},
]