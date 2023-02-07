import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

import './App.css';
import Card from './components/UI/Card'
import illustration from './assets/undraw_adventure_4hum 1.svg'
import Quiz from './components/Quiz';

function App() {

  return (
    <Container fluid className="App">
      <Row className='centered'>
        <Col xs md={{span:8, offset:2}} lg={{span:6, offset:3}} xl={{span:4, offset:4}}>
          <header>
            <h1 className='title'>Country quiz</h1>
            <img src={illustration} alt='ill' className='ill'/>
          </header>
          <Card  >
            <Quiz />
          </Card>
        </Col>
      </Row>
    </Container>

    
  );
}

export default App;
