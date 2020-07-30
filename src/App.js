import React from 'react';
import logo from './logo.svg';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, history } from './redux/store'
import Routes from './router'
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#418832',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#555A5C',
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <Provider store={store}>
            <Routes history={history} />
          </Provider>
        </BrowserRouter>
      </SnackbarProvider>

    </ThemeProvider>
  );
}

export default App;
