import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
// import NavBar from '../../components/navbar/Navbar';
import '../../styles/profile.css';
import Form from '../../components/form/Form';
import formFieldsByEntity from '../../formSource';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [showUserForm, setShowUserForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleSubmit = (data: FormData | Record<string, any>) => {
    // Envío mock — reemplazar por POST real cuando exista API
    if (data instanceof FormData) {
      const obj: Record<string, any> = {};
      data.forEach((v, k) => { obj[k] = v; });
      console.log('submit user', obj);
    } else {
      console.log('submit user', data);
    }
    setShowUserForm(false);
  };

  return (
    <div className="Profile-sidebar">
      <Sidebar />
      <div className="Profile-navbar">
        {/* <NavBar /> */}

        <div className="Profile-content">
          <div className='welcome-card'>
            <div className='welcome-text'>
              <h1>Perfil</h1>
              <p className='hint'>Información y ajustes de tu cuenta</p>
            </div>
          </div>

          {/* Mostrar datos del usuario logueado en tarjeta principal */}
          <div className="profile-container" style={{ marginTop: 12 }}>
            {user ? (
              <div className="profile-card">
                <div className="profile-top">
                  {/* Avatar: si el usuario tiene avatarUrl, mostrar imagen, si no, inicial */}
                  {/* Mostrar siempre una imagen: la del usuario si existe, o el placeholder */}
                  <img
                    src={user.avatarUrl ?? '/avatar-placeholder.svg'}
                    alt={user.name ?? 'Avatar'}
                    className="profile-avatar-img"
                  />

                  <div className="profile-meta">
                    <h2>{user.name ?? 'Usuario'}</h2>
                    <p className="meta-line"><strong>Email:</strong> {user.email ?? '-'}</p>
                    <p className="meta-line"><strong>Phone:</strong> {user.phone ?? '-'}</p>
                    <p className="meta-line"><strong>Address:</strong> {user.address ?? '-'}</p>
                    <p className="meta-line"><strong>Country:</strong> {user.country ?? '-'}</p>

                    <div className="profile-actions">
                      <button className="btn btn-primary" onClick={() => { setShowEditForm(true); setShowPasswordForm(false); setShowUserForm(false); }}>
                        Editar perfil
                      </button>
                      <button className="btn btn-primary" onClick={() => { setShowPasswordForm(true); setShowEditForm(false); setShowUserForm(false); }}>
                        Cambiar contraseña
                      </button>
                    </div>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-item">
                    <strong>ID</strong>
                    <span>{user.id ?? '-'}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Verificado</strong>
                    <span>{user.isVerified ? 'Sí' : 'No'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile-card">
                <p>No hay usuario autenticado</p>
              </div>
            )}
          </div>

          {/* Contenedor con los dos botones solicitados debajo del header/tarjeta */}
          <div className="profile-button-row" style={{ marginTop: 18 }}>
            <button className="primary-btn" onClick={() => { setShowUserForm(!showUserForm); setShowEditForm(false); setShowPasswordForm(false); }}>
              Añadir usuario
            </button>
          </div>

          {showUserForm && (
            <div className="Profile-form">
              <div className="form-center">
                <Form fields={formFieldsByEntity['user']} entity="Usuario" onSubmit={handleSubmit} />
              </div>
            </div>
          )}

          {/* Formulario de edición del perfil (prefill con datos del login) */}
          {showEditForm && user && (
            <div className="Profile-form">
              <div className="form-center">
                <Form
                  fields={formFieldsByEntity['user'].filter(f => f.name !== 'password')}
                  entity="Usuario"
                  mode="edit"
                  initialValues={{ username: user.name, email: user.email }}
                  submitLabel="Actualizar perfil"
                  onSubmit={(data) => {
                    // Mock update: convertir FormData a objeto
                    const payload: Record<string, any> = {};
                    if (data instanceof FormData) {
                      data.forEach((v, k) => { payload[k] = v; });
                    } else Object.assign(payload, data);
                    console.log('Actualizar perfil (mock):', payload);
                    setShowEditForm(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Formulario para cambiar contraseña */}
          {showPasswordForm && (
            <div className="Profile-form">
              <div className="form-center">
                <Form
                  fields={[
                    { id: 'currentPassword', name: 'currentPassword', label: 'Contraseña actual', type: 'password', required: true },
                    { id: 'newPassword', name: 'newPassword', label: 'Nueva contraseña', type: 'password', required: true, minLength: 6 },
                    { id: 'confirmPassword', name: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', required: true, minLength: 6 }
                  ]}
                  entity="Contraseña"
                  mode="edit"
                  submitLabel="Cambiar contraseña"
                  onSubmit={(data) => {
                    const payload: Record<string, any> = {};
                    if (data instanceof FormData) {
                      data.forEach((v, k) => { payload[k] = v; });
                    } else Object.assign(payload, data);
                    // Validación simple: nueva y confirm
                    if (payload.newPassword !== payload.confirmPassword) {
                      alert('La nueva contraseña y la confirmación no coinciden');
                      return;
                    }
                    console.log('Cambiar contraseña (mock):', payload);
                    setShowPasswordForm(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
