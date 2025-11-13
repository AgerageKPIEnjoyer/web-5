// === Допоміжні функції для роботи з Cookies ===

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * === ВИПРАВЛЕНА ФУНКЦІЯ ВИДАЛЕННЯ ===
 * Це "класичний" і найнадійніший спосіб видалити cookie,
 * встановивши його термін дії на далеку минулу дату.
 */
function eraseCookie(name) {   
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}


// === ГОЛОВНИЙ СЛУХАЧ ЗАВАНТАЖЕННЯ СТОРІНКИ ===
// Весь код, що працює з HTML, має бути всередині тут
document.addEventListener('DOMContentLoaded', function() {

  // --- ЗАВДАННЯ 1: Поміняти місцями контент ---
  const swapButton = document.getElementById('swap-button');
  const block2 = document.querySelector('.block2');
  const block5 = document.querySelector('.block5');

  if (swapButton && block2 && block5) {
    swapButton.addEventListener('click', function() {   
      const tempContent = block2.innerHTML;    
      block2.innerHTML = block5.innerHTML;    
      block5.innerHTML = tempContent;
    });
  }

  // --- ЗАВДАННЯ 2: Калькулятор п'ятикутника ---
  const sideInput = document.getElementById('pentagon-side');
  const pentagonColumn = document.getElementById('pentagon-column');

  function calculateAndDisplayArea() {
      if (!pentagonColumn) return; 

      let side = parseFloat(sideInput.value);
      if (isNaN(side) || side < 0) {
          side = 0;
      }
      const area = (5 * Math.pow(side, 2)) / (4 * Math.tan(Math.PI / 5));     
      const resultText = `Area: ${area.toFixed(2)}`;    
      
      let outputDiv = pentagonColumn.querySelector('.output-area');
      if (!outputDiv) {
          outputDiv = document.createElement('div');
          outputDiv.className = 'output-area';
          pentagonColumn.appendChild(outputDiv); 
      }            
      outputDiv.textContent = resultText;
  }

  if (sideInput && pentagonColumn) {
    sideInput.addEventListener('input', calculateAndDisplayArea);
    sideInput.addEventListener('change', function() {
        const side = parseFloat(sideInput.value);
        if (isNaN(side) || side < 0) {
            sideInput.value = 0;
            calculateAndDisplayArea();
        }
    });
    calculateAndDisplayArea();
  }
  

  // --- ЗАВДАННЯ 3: "Перевертання" числа та Cookies ---
  
  const flipFormContainer = document.getElementById('flip-form-container');
  const flipButton = document.getElementById('flip-button');
  const numberInput = document.getElementById('number-to-flip');

  const savedFlippedNumber = getCookie('flippedNumber');

  if (savedFlippedNumber) {
    // === ФАЗА 2: Cookie ЗНАЙДЕНО ===
    
    if (flipFormContainer) {
      flipFormContainer.classList.add('hidden'); 
    }

    alert(
      `Знайдено збережене число: ${savedFlippedNumber}. \n` +
      `Натисніть "ОК", щоб видалити ці дані.`
    );
    
    // Тепер це спрацює
    eraseCookie('flippedNumber');
    
    alert('Cookies видалено.');
    
    location.reload();

  } else {
    // === ФАЗА 1: Cookie НЕ ЗНАЙДЕНО ===
    
    if (flipButton && numberInput) { 
      flipButton.addEventListener('click', function() {
        
        const originalNumber = parseInt(numberInput.value, 10);
        
        if (isNaN(originalNumber) || originalNumber < 0) {
          alert('Будь ласка, введіть коректне натуральне число.');
          return;
        }
        
        const flippedNumber = parseFloat(
          String(originalNumber).split('').reverse().join('')
        );
        
        alert(
          `Оригінальне число: ${originalNumber}\n` +
          `Перевернуте число: ${flippedNumber}`
        );
        
        setCookie('flippedNumber', flippedNumber, 7);
        location.reload();
        
      });
    }
  }
}); 