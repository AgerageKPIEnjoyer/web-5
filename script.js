document.addEventListener('DOMContentLoaded', function() {
  
  // (Всі допоміжні функції, які використовуються в кількох місцях
  // або є "загальними", ми визначаємо тут)

  // --- Функції для Cookies (для Завдання 3) ---
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

  // --- Функції для CSS Editor (для Завдання 5) ---

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
      
      if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = DYNAMIC_STYLE_TAG_ID;
          document.head.appendChild(styleTag);
      }
      
      const blockScope = '.block1, .block2, .block3, .block4, .block5, .block6, .block7';
      
      const cssString = styles.map(rule => {
          const scopedSelector = `${blockScope} ${rule.selector}`;
          return `${scopedSelector} { ${rule.property}: ${rule.value} !important; }`;
      }).join('\n');
      
      styleTag.innerHTML = cssString;
  }

  // --- Функція для безпечного обміну (для Завдання 1) ---

  /**
   * Безпечно міняє місцями всіх дочірніх елементів 
   * між двома батьківськими вузлами, зберігаючи слухачі подій.
   */
  function swapChildNodes(el1, el2) {
      // Створюємо "контейнери" для тимчасового зберігання
      const frag1 = document.createDocumentFragment();
      const frag2 = document.createDocumentFragment();

      // Переміщуємо всіх дітей з el1 у frag1
      while (el1.firstChild) {
          frag1.appendChild(el1.firstChild);
      }
      
      // Переміщуємо всіх дітей з el2 у frag2
      while (el2.firstChild) {
          frag2.appendChild(el2.firstChild);
      }

      // Вставляємо дітей назад, але у зворотньому порядку
      el1.appendChild(frag2);
      el2.appendChild(frag1);
  }  
  
  /**
   * ЗАВДАННЯ 1: Налаштовує кнопку для обміну блоків 2 і 5
   */
  function initTask1_SwapBlocks() {
      const swapButton = document.getElementById('swap-button');
      const block2 = document.querySelector('.block2');
      const block5 = document.querySelector('.block5');

      if (swapButton && block2 && block5) {
          swapButton.addEventListener('click', function() {   
              swapChildNodes(block2, block5); 
          });
      }
  }

  /**
   * ЗАВДАННЯ 2: Налаштовує калькулятор площі п'ятикутника
   */
  function initTask2_PentagonArea() {
      const sideInput = document.getElementById('pentagon-side');
      const pentagonColumn = document.getElementById('pentagon-column');

      if (!sideInput || !pentagonColumn) 
        return; // Ранній вихід

      function calculateAndDisplayArea() {
          if (!pentagonColumn) 
            return; 

          let side = parseFloat(sideInput.value);
          if (isNaN(side) || side < 0) 
              side = 0;

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

      sideInput.addEventListener('input', calculateAndDisplayArea);
      sideInput.addEventListener('change', function() {
          const side = parseFloat(sideInput.value);
          if (isNaN(side) || side < 0) {
              sideInput.value = 0;
              calculateAndDisplayArea();
          }
      });
      calculateAndDisplayArea(); // Початковий розрахунок
  }

  /**
   * ЗАВДАННЯ 3: Налаштовує логіку "перевертання" числа та Сookies
   */
  function initTask3_FlipNumberCookies() {
      const flipFormContainer = document.getElementById('flip-form-container');
      const flipButton = document.getElementById('flip-button');
      const numberInput = document.getElementById('number-to-flip');

      const savedFlippedNumber = getCookie('flippedNumber');

      if (savedFlippedNumber) {
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
          if (flipButton && numberInput) { 
              flipButton.addEventListener('click', function() {
                  const originalNumber = parseInt(numberInput.value, 10);
                  
                  if (isNaN(originalNumber) || originalNumber <= 0) {
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
                  location.reload(); // Ця вимога з ТЗ
              });
          }
      }
  }

  /**
   * ЗАВДАННЯ 4: Налаштовує зміну кольору рамок та localStorage
   */
  function initTask4_BorderColorStorage() {
      const allBlocks = document.querySelectorAll('.block'); 
      const savedBorderColor = localStorage.getItem('borderColor');

      // Логіка завантаження: застосовуємо збережений колір
      if (savedBorderColor) {
          const initialPicker = document.getElementById('border-color-picker');
          allBlocks.forEach(block => {
              block.style.borderColor = savedBorderColor;
          });
          if (initialPicker) {
              initialPicker.value = savedBorderColor;
          }
      }
      
      // Логіка події: використовуємо делегування
      document.addEventListener('click', function(event) {    
          if (event.target.id === 'apply-border-color') {       
              // Знаходимо інпут "наживо"
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
  }

  /**
   * ЗАВДАННЯ 5: Редактор CSS-інструкцій
   */
  function initTask5_CSSEditor() {
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

      // Показати/Сховати форму при кліку на блок-X
      if (blockX && cssEditorContainer) {
          blockX.addEventListener('click', function() {
              cssEditorContainer.classList.toggle('hidden');
          });    
      }

      // Логіка "Кнопки 1" (Застосувати)
      if (cssApplyButton && cssSelectorInput && cssPropertyInput && cssValueInput) {
          cssApplyButton.addEventListener('click', function() {
              const newRule = {
                  selector: cssSelectorInput.value.trim(),
                  property: cssPropertyInput.value.trim(),
                  value: cssValueInput.value.trim()
              };
              
              if (!newRule.selector || !newRule.property || !newRule.value) {
                  alert('Будь ласка, заповніть всі три поля (Селектор, Властивість, Значення).');
                  return;
              }
              
              let currentStyles = getSavedStyles();
              currentStyles.push(newRule);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(currentStyles));
              applyStyles(currentStyles);
              
              cssSelectorInput.value = '';
              cssPropertyInput.value = '';
              cssValueInput.value = '';
          });
      }

      // Логіка "Кнопки 2" (Видалити все)
      if (cssClearButton) {
          cssClearButton.addEventListener('click', function() {
              localStorage.removeItem(STORAGE_KEY);
              applyStyles([]); // Очищуємо стилі
              alert('Всі кастомні стилі було видалено.');
          });
      }
  }
  
  // Ініціалізація всіх завдань
  initTask1_SwapBlocks();
  initTask2_PentagonArea();
  initTask3_FlipNumberCookies();
  initTask4_BorderColorStorage();
  initTask5_CSSEditor();
});