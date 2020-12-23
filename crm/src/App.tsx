import * as React from 'react';
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./lib/MainRouter";

const App = () => (
  <BrowserRouter>
    <MainRouter />
  </BrowserRouter>
);
export default App;
