import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Provider, useSelector } from 'react-redux';
import store from './store';
import createDynamicTheme from './components/theme/theme';
const root = ReactDOM.createRoot(document.getElementById('root'));


const DynamicThemeProvider = ({ children }) => {
  const isOldie = useSelector((state) => state.oldie);
  const fontSizeMultiplier = isOldie ? 2 : 1;
  const theme = createDynamicTheme(fontSizeMultiplier);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

root.render(
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DynamicThemeProvider>
        <App />
      </DynamicThemeProvider>
    </LocalizationProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
