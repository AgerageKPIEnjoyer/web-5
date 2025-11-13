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
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') 
        c = c.substring(1, c.length);

    if (c.indexOf(nameEQ) == 0) 
        return c.substring(nameEQ.length, c.length);

  }
  return null;
}

function eraseCookie(name) {   
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

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

  // --- ЗАВДАННЯ 4: Зміна кольору рамки блока ---

    const borderColorPicker = document.getElementById('border-color-picker');
    const allBlocks = document.querySelectorAll('.block'); 
    
    const savedBorderColor = localStorage.getItem('borderColor');

    if (savedBorderColor && borderColorPicker) {
        allBlocks.forEach(block => {
            block.style.borderColor = savedBorderColor;
        });
        borderColorPicker.value = savedBorderColor;
    }
    
    document.addEventListener('click', function(event) {    
    
        if (event.target.id === 'apply-border-color') { // Перевірка елементу, на який було здійснено клік       
        
            // borderColorPicker потрібно знаходити під час кліку
            const currentBorderColorPicker = document.getElementById('border-color-picker');

            if (currentBorderColorPicker) {
                const newColor = currentBorderColorPicker.value;
                
                allBlocks.forEach(block => {
                    block.style.borderColor = newColor;
                });
                
                localStorage.setItem('borderColor', newColor);
            }
        }
    });
        
// --- ЗАВДАННЯ 5: Задання css інструкцій ---
    const DYNAMIC_STYLE_TAG_ID = 'dynamic-user-styles';
    const STORAGE_KEY = 'userCustomStyles';

    /**
     * Отримує стилі з localStorage.
     * @returns {Array} - Масив об'єктів стилів.
     */
    function getSavedStyles() {
        const stylesJSON = localStorage.getItem(STORAGE_KEY);
        return stylesJSON ? JSON.parse(stylesJSON) : [];
    }

    /**
     * Застосовує масив стилів на сторінку, створюючи <style> тег.
     * @param {Array} styles - Масив об'єктів стилів.
     */
    function applyStyles(styles) {
        let styleTag = document.getElementById(DYNAMIC_STYLE_TAG_ID);
        
        // Якщо тег <style> ще не існує, створюємо його в <head>
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = DYNAMIC_STYLE_TAG_ID;
            document.head.appendChild(styleTag);
        }
        
        // Генеруємо CSS-правила, обмежуючи їх нашими блоками
        const blockScope = '.block1, .block2, .block3, .block4, .block5, .block6, .block7';
        
        const cssString = styles.map(rule => {
            // Напр.: .block1 h3, .block2 h3... { color: red !important; }
            const scopedSelector = `${blockScope} ${rule.selector}`;
            return `${scopedSelector} { ${rule.property}: ${rule.value} !important; }`;
        }).join('\n'); // Кожне правило з нового рядка
        
        styleTag.innerHTML = cssString;
    }  

    // Застосовуємо стилі, які вже могли бути збережені
    applyStyles(getSavedStyles());

    // Отримуємо елементи форми
    const blockX = document.querySelector('.blockX');
    const cssEditorContainer = document.getElementById('css-editor-container');

    const cssSelectorInput = document.getElementById('css-selector');
    const cssPropertyInput = document.getElementById('css-property');
    const cssValueInput = document.getElementById('css-value');
    const cssApplyButton = document.getElementById('css-apply-button');
    const cssClearButton = document.getElementById('css-clear-button');

    if (blockX && cssEditorContainer) {
  
        blockX.addEventListener('click', function() {
            // toggle() - це "перемикач". 
            // Якщо клас 'hidden' є - він його прибере (форма з'явиться).
            // Якщо класу 'hidden' немає - він його додасть (форма сховається).
            cssEditorContainer.classList.toggle('hidden');
        });    
    }

    // Логіка "Кнопки 1" (Застосувати)
    if (cssApplyButton && cssSelectorInput && cssPropertyInput && cssValueInput) {
    
        cssApplyButton.addEventListener('click', function() {
            // Збираємо дані з форми
            const newRule = {
                selector: cssSelectorInput.value.trim(),
                property: cssPropertyInput.value.trim(),
                value: cssValueInput.value.trim()
            };
            
            // Валідація (перевірка, що поля не пусті)
            if (!newRule.selector || !newRule.property || !newRule.value) {
                alert('Будь ласка, заповніть всі три поля (Селектор, Властивість, Значення).');
                return;
            }
            
            //  Отримуємо поточний масив стилів
            let currentStyles = getSavedStyles();
            
            // Додаємо нове правило
            currentStyles.push(newRule);
            
            // Зберігаємо оновлений масив в localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentStyles));
            
            // Застосовуємо оновлені стилі "наживо"
            applyStyles(currentStyles);
            
            // Очищуємо поля для зручності
            cssSelectorInput.value = '';
            cssPropertyInput.value = '';
            cssValueInput.value = '';
        });
    }

    //Логіка "Кнопки 2" (Видалити все)
    if (cssClearButton) {
        cssClearButton.addEventListener('click', function() {
            
            // Видаляємо дані з localStorage
            localStorage.removeItem(STORAGE_KEY);
            
            // Очищуємо стилі "наживо", передавши порожній масив
            // (Це призведе до styleTag.innerHTML = '')
            applyStyles([]);
            
            alert('Всі кастомні стилі було видалено.');
        });
    }
}); 