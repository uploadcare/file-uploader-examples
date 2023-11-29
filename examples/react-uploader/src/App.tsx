import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Layout from './Layout/Layout';

import FormView from './FormView/FormView';
import MinimalView from './MinimalView/MinimalView';
import RegularView from './RegularView/RegularView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/form"
              replace
            />
          }
        />

        <Route path="/*" element={<Layout/>}>
          <Route
            path="form"
            element={<FormView/>}
          />

          <Route
            path="minimal"
            element={<MinimalView/>}
          />

          <Route
            path="regular"
            element={<RegularView/>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
