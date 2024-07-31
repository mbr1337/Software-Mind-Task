import './App.scss';
import { Container, Fade } from '@mui/material';
import Form from './components/Form';
import Footer from './components/Footer';

function App() {
  return (
    <Fade in={true} timeout={1500}>
      <Container maxWidth={false} disableGutters>
        <Form />
        <Footer />
      </Container>
    </Fade>

  );
}

export default App;
