Mira el puerto donde runea el backend es el 3000
Las url empiezan siempre con /api
Entonces para el login es
/api/auth/login
Recibe email y contraseña
Y devuelve un jwt token y el user
@100162999468076 cambia eso en el código donde te haga falta para después probarlo xq todavía esos cambios no están en github y ahora mismo no puedo subirlos
La otra url de usuarios es
/api/user/
Crea un usuario
/api/user/id busca usuario x id


aprendices

/apprentice
/apprentice/ para crear aprendiz
/apprentice/:id para sacar aprendiz x id
/apprentice/:id pero put es para update aprendiz x id
/apprentice/:id pero delete es para delete aprendiz x id

Agencia

/agency es la principal
/agency/ para crear agencia post
/agency/ para listar agencias get
/agency/id para getAgencia x id
/agency/id para update put
/agency/id para delte agencia delete
/agency/search/agency_name para buscar x nombre
/agency/search/agency_address por direccion
/agency/search/agency_foundation por fundation