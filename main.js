const exchangeBtn = document.querySelector('.header__btn');
const loader = document.getElementById('loader');
const currencyExchanges = document.querySelectorAll('.currency__exchange');
const currencyImgs = document.querySelectorAll('.currency__img');
const currencyTotal = document.querySelector('.currency__total');
const currencyExchangeForm = document.querySelector('.form');
const currencyExchangeInp = document.querySelector('.form__inp');
const currencyExchangeSelect = document.querySelector('.form__select');

const imagesBlock = document.querySelector('.images-block');

const modal = document.getElementById('wrapper-modal'); // получаем блок модальное окно
const overlay = document.getElementById('overlay'); // получаем действие по overlay, по клику отслеживаем событие
const btnClose = document.getElementById('btn-close'); // получаем конпку close

const shopGoods = document.querySelector('.shop__goods');

// Запрос курс валют
exchangeBtn.addEventListener('click', getCurrentExchangeRate);

function getCurrentExchangeRate() {
   toggleLoader();
   fetch('https://www.cbr-xml-daily.ru/daily_json.js')
      .then(valute => valute.json())
      .then(data => {
      let i = 5;
      // console.log(data.Valute);
      const interval = setInterval(() => {
         console.log(`До появления результата актуального курса валют осталось ${--i} секунд`);
         if (i < 1) {
            console.log(`Запрос успешно завершен`);
            clearInterval(interval);
            toggleLoader();
         }
      }, 1000);
      setTimeout(() => {
         currencyExchanges[0].innerText = `Курс: ${data.Valute.USD.Value}`;
         currencyExchanges[1].innerText = `Курс: ${data.Valute.EUR.Value}`;
         currencyExchanges[2].innerText = `Курс: 1`;
      }, i * 1000)
   })
}

//Loader (запрос курса валют)
const toggleLoader = () => {
   exchangeBtn.classList.toggle('hidden');
   loader.classList.toggle('hidden');
};

//Результат обмена{
currencyExchangeForm.addEventListener('submit', handleFormSubmit);

function serializeForm(formNode) {
   // console.log(formNode.elements);
   const { elements } = formNode
   Array.from(elements)
      .forEach((element) => {
         const { name, value } = element
         // console.log({ name, value })
      });
   console.log('выбранная валюта', elements[1].value);
   getCalcExchange(elements[0].value,  elements[1].value);
};

let total = 0;

function getCalcExchange(count, currency) {
   switch (currency) {
      case 'usd':
         total = count * currencyExchanges[0].innerText.split(' ').slice(1);
         break;
      case 'eur':
         total = count * currencyExchanges[1].innerText.split(' ').slice(1);
            break;
      default:
         total = count * currencyExchanges[2].innerText.split(' ').slice(1);
         break;
   }
   console.log('итог после конвертации', total);
   return total;
};

function handleFormSubmit(event) {
   event.preventDefault();
   console.log('Конвертация!');
   serializeForm(currencyExchangeForm);
   currencyTotal.insertAdjacentHTML("afterbegin", renderChangeMoney());
};

function renderChangeMoney() {
   currencyTotal.textContent = '';
   return `
            <h3>Результат обмена ${currencyExchangeSelect.value}</h3>
            <p>Вы меняли: ${currencyExchangeInp.value} ${currencyExchangeSelect.value}</p>
            <p>Вы получили: ${total.toFixed(2)} руб.</p>
         `
};

// Большая картинка
window.onload = function(){  //при загрузке всех тэгов страницы запускается функция
   let images = document.getElementsByClassName("currency__img");//массив картинок
   for(let i = 0; i < images.length; i++){
      images[i].onclick=showBigPicture;
   }
}

function showBigPicture(event){ //event - есть у любой функции, которая вызвана по событию
   currencyImgs.forEach(img => img.classList.remove('active-img'));
   imagesBlock.innerHTML="";
   let smallPicture = event.target;//кнопка по которой кликнули
   smallPicture.classList.toggle('active-img');
   let imageNameParts = smallPicture.id.split("_");
   let path = `img/big/${imageNameParts[1]}.png`;
   let bigPicture = document.createElement('img');
   bigPicture.src = path;
   imagesBlock.appendChild(bigPicture);
   bigPicture.onerror = getModalWindow;
}

//модальное окно
function getModalWindow() {
   modal.classList.add('active'); // добавляем класс active
}

function closeModal(){ //
   modal.classList.remove('active'); // закрытие модального окна
   imagesBlock.innerHTML="";
}

overlay.addEventListener('click', closeModal); // прослушиваем событие click и передаем событие функции, которая выполнит удаление класса active, по нажатию на overlay
btnClose.addEventListener('click', closeModal); // тоже самое но по нжатию на кнопку close

//Добавление товаров в корзину
//каталог товаров
let cardsList = [
   {id: "01", cardImg: "img/shop/1.jpg", cardTitle: "SMILE-1", cardText: "Good day-1", cardPRice: "42"},
   {id: "02", cardImg: "img/shop/2.jpg", cardTitle: "SMILE-2", cardText: "Good day-2", cardPRice: "500"},
   {id: "03", cardImg: "img/shop/3.jpg", cardTitle: "SMILE-3", cardText: "Good day-3", cardPRice: "1"},
   {id: "04", cardImg: "img/shop/4.jpg", cardTitle: "SMILE-4", cardText: "Good day-4", cardPRice: "50"},
   {id: "05", cardImg: "img/shop/5.jpg", cardTitle: "SMILE-5", cardText: "Good day-5", cardPRice: "599"},
   {id: "06", cardImg: "img/shop/6.jpg", cardTitle: "SMILE-6", cardText: "Good day-6", cardPRice: "52"},
];

//отрисовка каталога товаров
function createCard(card) {
    return `
        <li class="card" data-id="${card.id}">
            <img src="${card.cardImg}" alt="image" class="card__img">
            <div class="card__content">    
                <h3 class="card__title uppercase">${card.cardTitle}</h3>
                <p class="card__text">${card.cardText}</p>
                <span class="card__price">$${card.cardPRice}</span>
                <button class="card__btn form__btn" data-cart="${card.id}">Добавить в корзину</button>
            </div>
        </li>
            `
};

const templates = cardsList.map(card => createCard(card));
const html = templates.join(' ');
const cards = document.querySelector('.cards');
shopGoods.insertAdjacentElement("afterbegin", cards);
cards.innerHTML = html;

const cartList = document.querySelector('.cart-block');
const cardBlock = document.querySelectorAll('.card');

// Устанавливаем обработчик события на каждую кнопку
for(let i = 0; i < cardBlock.length; i++){
    addEvent(cardBlock[i].querySelector('.card__btn'), 'click', addCardToCart);
}

// Функция кроссбраузерной установка обработчика событий
function addEvent(elem, type, handler) {
    elem.attachEvent = function (s, param2) {
    }
    if(elem.addEventListener) {
      elem.addEventListener(type, handler, false);
    } else {
      elem.attachEvent(`on${type}`, function() { handler.call(elem); });
    }
    return false;
};

// Записываем данные в LocalStorage
function setCartData(obj){
    localStorage.setItem('cart', JSON.stringify(obj));
    return false;
};

// Получаем данные из LocalStorage
function getCartData(){
    return JSON.parse(localStorage.getItem('cart'));
};

// Добавляем товар в корзину
function addCardToCart(e) {
    this.disabled = true; // блокируем кнопку на время операции с корзиной
    let cartData = getCartData() || {};
    let parentBox = this.parentNode.parentNode; // карточка кнопки "Добавить в корзину"
    let cardId = parentBox.getAttribute('data-id'); // ID товара
    let cardTitle = parentBox.querySelector('.card__title').innerHTML; // название товара
    let cardPrice = parentBox.querySelector('.card__price').innerHTML; // стоимость товара

    if (cartData.hasOwnProperty(cardId)) { // если такой товар уже в корзине, то добавляем +1 к его количеству
        cartData[cardId][2] += 1;
    } else { // если товара в корзине еще нет, то добавляем в объект
        cartData[cardId] = [cardTitle, cardPrice, 1];
    }
    // Обновляем данные в LocalStorage
    if(!setCartData(cartData)){
        this.disabled = false; // разблокируем кнопку после обновления LS
        cartList.innerHTML = 'Товар добавлен в корзину.';
        setTimeout(function(){
            cartList.innerHTML = 'Продолжить покупки...';
        }, 1000);
    }
    return false;
}; 

//Итоговая сумма товаров в корзине
function getTotalCount(cartData) {
    let totalCount = 0;
    for (let key of Object.values(cartData)) {
        totalCount += key[1].split('').slice(1).join('') * key[2];
    };
    return totalCount;
};

// Открываем корзину со списком добавленных товаров
function openCart(e){
    let cartData = getCartData(); // вытаскиваем все данные корзины
    let totalItems = '';
    // если что-то в корзине уже есть, начинаем формировать данные для вывода
    if(cartData !== null){
        totalItems = `
            <table class="shopping_list">
            <tr>
                <th>Наименование</th>
                <th>Цена</th>
                <th>Кол-во</th>
            </tr>
        `;
        for(let items in cartData) {
            totalItems += '<tr>';
            for(let i = 0; i < cartData[items].length; i++) {
                totalItems += `<td>${cartData[items][i]}</td>`;
            }
            totalItems += '</tr>';
        }
        totalItems += `
            <tr>
                <td><b>Итог</b></td>
                <td><b>${getTotalCount(cartData)}</b></td>
            </tr>
        `;
        totalItems += '</table>';
        cartList.innerHTML = totalItems;
    } else {
      // если в корзине пусто, показываем сообщение
        cartList.innerHTML = 'В корзине ничего нет!';
    }
    return false;
};

//Открыть корзину
addEvent(document.getElementById('checkout'), 'click', openCart);

//Очистить корзину
addEvent(document.getElementById('clear_cart'), 'click', function(e){
    localStorage.removeItem('cart');
    cartList.innerHTML = 'Товары удалены.';
});