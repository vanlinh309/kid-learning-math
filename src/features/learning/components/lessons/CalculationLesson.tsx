import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useAudioFeedback } from '../../hooks/useAudioFeedback';
import './CalculationLesson.css';

type Operator = '+' | '-';

const CalculationLesson = () => {
  const [leftNumber, setLeftNumber] = useState<string>('');
  const [rightNumber, setRightNumber] = useState<string>('');
  const [operator, setOperator] = useState<Operator>('+');
  const [showVisualResult, setShowVisualResult] = useState(false);
  const [showNumberResult, setShowNumberResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { playCorrectSound, playIncorrectSound } = useAudioFeedback();

  // Detect if device is mobile or tablet
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768); // Only phones (not tablets/iPads)
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Validate input to only allow numbers 1-9
  const handleNumberInput = (value: string, setter: (value: string) => void) => {
    if (value === '') {
      setter('');
      setShowVisualResult(false);
      setShowNumberResult(false);
      return;
    }
    
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 9) {
      setter(value);
      setShowVisualResult(false);
      setShowNumberResult(false);
    }
  };

  // Generate array of circles based on number
  const renderCircles = (count: number, isResult: boolean = false) => {
    return Array.from({ length: count }, (_, index) => (
      <div 
        key={index} 
        className={`red-circle ${isResult ? 'result-circle' : ''}`}
        style={isResult ? { '--circle-index': index } as React.CSSProperties : undefined}
        onClick={isResult ? undefined : undefined}
      >
        {isResult && <span className="circle-number">{index + 1}</span>}
      </div>
    ));
  };

  // Calculate the result
  const calculateResult = (): number => {
    const left = parseInt(leftNumber) || 0;
    const right = parseInt(rightNumber) || 0;
    
    if (operator === '+') {
      return left + right;
    } else {
      return Math.max(0, left - right); // Prevent negative results
    }
  };

  // Handle check button click - shows visual result first (or number on mobile)
  const handleCheck = () => {
    if (leftNumber && rightNumber) {
      const result = calculateResult();
      const correct = result >= 0; // Always positive for kids
      setIsCorrect(correct);
      
      if (isMobile) {
        // On mobile/tablet, show number result directly
        setShowVisualResult(false);
        setShowNumberResult(true);
        // Play sound immediately on mobile
        if (correct) {
          playCorrectSound();
        } else {
          playIncorrectSound();
        }
      } else {
        // On desktop, show visual result first
        setShowVisualResult(true);
        setShowNumberResult(false);
      }
    }
  };

  // Handle show number result button click
  const handleShowNumber = () => {
    setShowNumberResult(true);
    // Play sound effect when revealing the number
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  };

  const result = calculateResult();
  const leftCount = parseInt(leftNumber) || 0;
  const rightCount = parseInt(rightNumber) || 0;

  return (
    <Container className="calculation-lesson">
      <h2 className="lesson-title">Let's Learn to Calculate! 🧮</h2>
      
      {/* First Row: Input Controls */}
      <Row className="input-row mb-4">
        <Col xs={4} className="d-flex flex-column align-items-center">
          <label className="input-label">First Number</label>
          <Form.Control
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            max="9"
            value={leftNumber}
            onChange={(e) => handleNumberInput(e.target.value, setLeftNumber)}
            onFocus={() => setLeftNumber('')}
            className="number-input"
          />
        </Col>
        
        <Col xs={4} className="d-flex flex-column align-items-center">
          <label className="input-label">Operation</label>
          <div className="operator-buttons-group">
            <Button
              variant={operator === '+' ? 'success' : 'outline-light'}
              size="lg"
              onClick={() => {
                setOperator('+');
                setShowVisualResult(false);
                setShowNumberResult(false);
              }}
              className={`operator-button ${operator === '+' ? 'active' : ''}`}
            >
              <span className="operator-symbol">+</span>
            </Button>
            <Button
              variant={operator === '-' ? 'danger' : 'outline-light'}
              size="lg"
              onClick={() => {
                setOperator('-');
                setShowVisualResult(false);
                setShowNumberResult(false);
              }}
              className={`operator-button ${operator === '-' ? 'active' : ''}`}
            >
              <span className="operator-symbol">−</span>
            </Button>
          </div>
        </Col>
        
        <Col xs={4} className="d-flex flex-column align-items-center">
          <label className="input-label">Second Number</label>
          <Form.Control
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            max="9"
            value={rightNumber}
            onChange={(e) => handleNumberInput(e.target.value, setRightNumber)}
            onFocus={() => setRightNumber('')}
            className="number-input"
          />
        </Col>
      </Row>

      {/* Second Row: Visual Representation and Check Button */}
      <Row className="visual-row mb-4">
        <Col xs={4} className="circles-container">
          <div className="circles-block">
            {renderCircles(leftCount)}
          </div>
        </Col>
        
        <Col xs={4} className="d-flex align-items-center justify-content-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleCheck}
            disabled={!leftNumber || !rightNumber}
            className="check-button"
          >
            Check Answer ✓
          </Button>
        </Col>
        
        <Col xs={4} className="circles-container">
          <div className="circles-block">
            {renderCircles(rightCount)}
          </div>
        </Col>
      </Row>

      {/* Third Row: Visual Result Display (shown first on desktop only) */}
      {!isMobile && showVisualResult && (
        <Row className="result-row">
          <Col xs={12} className="circles-container">
            <div className="result-label">Count the circles! 🔢</div>
            <div className="circles-block result-circles">
              {renderCircles(result, true)}
            </div>
            {!showNumberResult && (
              <Button
                variant="success"
                size="lg"
                onClick={handleShowNumber}
                className="show-number-button mt-3"
              >
                Show Me The Number! 🎯
              </Button>
            )}
          </Col>
        </Row>
      )}

      {/* Fourth Row: Number Result Display */}
      {/* On Desktop: shown after clicking button. On Mobile: shown directly */}
      {((isMobile && showNumberResult) || (!isMobile && showVisualResult && showNumberResult)) && (
        <Row className="result-row number-result-row mt-3">
          <Col xs={12} className="d-flex flex-column align-items-center">
            <div className="result-label">The Answer Is:</div>
            <div className={`result-number ${isCorrect ? 'correct' : 'incorrect'}`}>
              {result}
            </div>
          </Col>
        </Row>
      )}

      {/* Feedback Message */}
      {/* On Desktop: shown after number reveal. On Mobile: shown with number */}
      {((isMobile && showNumberResult && isCorrect) || (!isMobile && showVisualResult && showNumberResult && isCorrect)) && (
        <div className="feedback-message success">
          🎉 Great job! {leftNumber} {operator} {rightNumber} = {result}
        </div>
      )}
    </Container>
  );
};

export default CalculationLesson;
