import React from 'react';
import ReactDOM from 'react-dom/client';

import FakeDataGenerator from "./users";

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
      <FakeDataGenerator/>
);