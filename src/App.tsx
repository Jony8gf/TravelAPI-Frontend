import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Menu from './utils/Menu';
import rutas from './route-config'
import { claim } from 'auth/auth.model';
import AutenticationContext from 'auth/AutenticationContext';
import { obtenerClaims } from 'auth/manejadorJWT';
import { configurarInterceptor } from 'utils/interceptores';

configurarInterceptor();

function App() {

  const[claims, setClaims] = useState<claim[]>([]);

  useEffect(() => {
    setClaims(obtenerClaims());
  }, [])

  function actualizar(claims: claim[]){
    setClaims(claims);
  }

  function esAdmin() {
    return claims.findIndex(claim => claim.nombre === 'role' && claim.valor === 'admin') > -1
  }

  return (
    <>
      <BrowserRouter>
        <AutenticationContext.Provider value={{claims, actualizar}}>
          <Menu />
          <div className="container">
            <Switch>
              {rutas.map(ruta => 
              <Route key={ruta.path} path={ruta.path}
                exact={ruta.exact}>
                  {ruta.esAdmin && !esAdmin() ? 
                  <>
                    No tiene permiso para acceder a este componente
                  </> : <ruta.componente />}
                </Route>)}
            </Switch>
          </div>
        </AutenticationContext.Provider>
        
      </BrowserRouter>
    </>

  );
}

export default App;
