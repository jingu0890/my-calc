
const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.button');

let hasDecimal = false;
let firstOperand = null;
let operator = null;
let secondOperand = null;
let lastSecondOperand = null;
let waitingForSecondOperand = false;
let justCalculated = false;

// 천 단위 쉼표 표시
function formatNumber(num) {
  if (num === 'Error') return num;
  const [int, decimal] = num.toString().split('.');
  const formattedInt = parseInt(int, 10).toLocaleString();
  return decimal ? `${formattedInt}.${decimal}` : formattedInt;
}

// 쉼표 제거
function parseDisplayNumber(displayText) {
  return displayText.replace(/,/g, '');
}

// 화면 표시
function updateDisplay(value) {
  display.textContent = formatNumber(value);
}

// 계산 함수
function calculate(first, operator, second) {
  first = parseFloat(first);
  second = parseFloat(second);
  switch (operator) {
    case '+': return first + second;
    case '-': return first - second;
    case '*': return first * second;
    case '/': return second !== 0 ? first / second : 'Error';
    default: return second;
  }
}

// 버튼 이벤트 처리
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;
    let currentDisplay = parseDisplayNumber(display.textContent);

    // 숫자/소수점 처리
    if (button.classList.contains('number')) {
      if (waitingForSecondOperand || justCalculated) {
        currentDisplay = value === '.' ? '0.' : value;
        waitingForSecondOperand = false;
        justCalculated = false;
        hasDecimal = value === '.';
      } else {
        if (value === '.' && !hasDecimal) {
          currentDisplay += '.';
          hasDecimal = true;
        } else if (value !== '.' && !(value === '0' && currentDisplay === '0')) {
          currentDisplay = currentDisplay === '0' ? value : currentDisplay + value;
        }
      }
      updateDisplay(currentDisplay);
    }

    // 연산자 처리
 if (button.classList.contains('operator') && value !== '=') {
  currentDisplay = parseDisplayNumber(display.textContent);

  if (operator && !waitingForSecondOperand && !justCalculated) {
    secondOperand = currentDisplay;
    const result = calculate(firstOperand, operator, secondOperand);
    updateDisplay(result);
    firstOperand = result;
  } else {
    firstOperand = currentDisplay;
  }

  operator = value; // value가 이제 '+', '-', '*', '/' 중 하나임
  waitingForSecondOperand = true;
  justCalculated = false;
  hasDecimal = false;
}

    // = 처리
if (value === '=') {
  currentDisplay = parseDisplayNumber(display.textContent);

  if (firstOperand !== null && operator) {
    if (!justCalculated) {
      secondOperand = currentDisplay;
      lastSecondOperand = secondOperand;
    }

    if (lastSecondOperand !== null) {
      const result = calculate(firstOperand, operator, lastSecondOperand);
      updateDisplay(result);
      firstOperand = result;
      waitingForSecondOperand = true;
      justCalculated = true;
      hasDecimal = display.textContent.includes('.');
    }
  }
}

    // C: 초기화
    if (value === 'C') {
      updateDisplay('0');
      firstOperand = null;
      secondOperand = null;
      operator = null;
      lastSecondOperand = null;
      hasDecimal = false;
      waitingForSecondOperand = false;
      justCalculated = false;
    }

    // ±: 부호 전환
    if (value === '±') {
      if (currentDisplay !== '0') {
        currentDisplay = (parseFloat(currentDisplay) * -1).toString();
        updateDisplay(currentDisplay);
      }
    }

    // %: 백분율
    if (value === '%') {
      currentDisplay = (parseFloat(currentDisplay) / 100).toString();
      updateDisplay(currentDisplay);
      if (!operator) {
        firstOperand = currentDisplay;
      } else {
        secondOperand = currentDisplay;
      }
    }
  });
});
