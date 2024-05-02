import React from 'react';
import ReactDOM from 'react-dom/client';

import FakeDataGenerator from "./users";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
      <FakeDataGenerator/>
);