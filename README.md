# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/model/ — папка с моделями
- src/components/view/ — папка с отображениями

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта
Проект "Веб-ларек" - это интернет-магазин с товарами для веб-разработчиков с возможностями:
- просмотра каталога товаров;
- просмотра подробного описания товаров;
- оформления заказа товаров.

## Архитектура
Проект реализует архитектурный паттерн Model - View - Presenter (MVP):
- Модель - компоненты приложения, отвечающие за работы с данными (хранит данные, предоставление к ним доступ, валидирует их, делает запросы к API, 
    уведомляет Презентер об изменение данных). 
- Отображение - компоненты приложения, отвечающие за графического интерфейс и взаимодействует с Презентером в части пользовательских событий. 
- Презентер - компонент приложения, выступающий посредником между Моделью и Отображением (реализует бизнес-логику приложения, генерирует события для Модели и 
    Отображения).

[View] <------> [Presenter] <------> [Model]

### Описание типов и классов
#### Типы данных
- PayMethod - описание методов оплаты
- Category - виды категорий
- IItem - описывает свойства товара
- IItemList - список товаров
- IBasket - описывает свойства корзины
- IOrderForm - описывает формы заказа
- IOrder - описывает свойства заказа
- IOrderSuccess - успешный ответ от API
- FormErrors - описывает ошибки формы
- IWebStoreApi - описывает методы работы с API

#### Классы (компоненты)
#### Базовый код
- EventEmitter. Класс, реализующий коммуникация между Моделями и Отображениями (брокер событий). Позволяет подписываться на события, вызывать их и отписываться от них.
- Api. Базовый класс, реализующий методы взаимодействия с сервером. Родительский класс для WebStoreApi.

##### Модель (Model)
- AppModel. Класс описывает страницу, хранит информацию о каталоге товаров, заказе. Основная бизнес-логика приложения.
    - Поля:
        - _catalog: массив товаров
	    - _basket: ссылка на корзину
	    - _orderInfo: данные заказа (способ платежа, контактные данные, адрес)
		- _formErrors: ошибки форма
    - Методы:
        - setCatalog(catalog: IItem[]): void; (заполняет каталог товаров)
        - getItemFromCatalog(id: string): IItem | undefined (получить товар из каталога)
        - get order(): IOrder (возвращает заказ для API)
        - setOrderField(field: keyof IOrderForm, value: string) (заполняет поля заказа)
        - setContactsField(field: keyof IOrderForm, value: string) (заполняет поля заказа)
        - validateOrder(): boolean (валидация заказа)
        - validateContacts(): boolean (валидация заказа)
        - getItemsBasket(): string[] (получить ID товаров из корзины)
        - addToBasket(item: IItem): void (добавить товар в корзину)
        - removeFromBasket(id: string): void (удалить товар из корзины)
        - resetAll(): void (сброс корзины, заказа)

- WebStoreApi. Класс для работы с API сервера, отправляет заказ, получает каталог товаров или товар по идентификатору. Наследуется от класса Api.
    - Поля:
        - baseUrl: string; (общий URL запросов)
        - cdnUrl: string; (URL для картинок)
    - Методы:
        - getItemList(): Promise< IItemList >; (отправляет запрос на сервер для получение каталога товаров)
	    - getItem(id: string): Promise< IItem >; (отправляет запрос на сервер для получения товара по идентификатору)
	    - makeOrder(order: IOrder): Promise< IOrderSuccess >; (отправляет запрос на сервер для создание заказа)

#### Отображение (View)
- View. Абстрактный класс для всех компонентов отображения, наследуются всеми классами отображения приложения. Предоставляет базовые методы:  установить текст, изображение; показать/скрыть/деактивировать HTML-элемент, переключить класс, отрисовать элемент на странице. 
    - Поля:
        - container: HTMLElement (корневой элемент)
    - Методы:
        - toggleClass(element: HTMLElement, className: string, force?: boolean): void (переключает класс)
        - setText(element: HTMLElement, value: unknown): void (устанавливает текст)
        - setDisabled(element: HTMLElement, state: boolean): void (деактивирует элемент)
        - setHidden(element: HTMLElement): void (скрыть элемент)
        - setVisible(element: HTMLElement); void (показать элемент)
        - setImage(element: HTMLImageElement, src: string, alt?: string); void (установить картинку)
        - render(data?: Partial< T >): HTMLElement (отрисовать элемент)

- MainPageView. Класс для отрисовки главной страницы приложения (каталога товаров, счетчика в корзине и кнопки открытия корзины).
    - Поля:
        - _pageLock: HTMLElement; (корневой контейнер страницы)
        - _catalog: HTMLElement; (контейнер каталога)
        - _basket: HTMLElement; (элемент корзины)
        - _counter: HTMLElement; (элемент счетчика корзины)
    - Методы:
        - set catalog(items: HTMLElement[]); void; (получает элементы карточек товара)
        - set counter(value; number): void; (обновляет счетчик корзины)
        - set lock(value: boolean): void; (блокирует главную страницу)

- ItemView. Базовый класс для отображения карточки товара в разных видах (галерея, превью, корзина).
    - Поля:
        - _title: HTMLElement; (элемент названия)
	    - _price: HTMLElement; (элемент цены)
	    - _id: string; (ID товара)
    - Методы:
        - set title(value: string); (установить название)
        - set price(value: number | null); (установить цену)
        - set id(value: string);  (установить ID)

- ItemCatalogView. Класс отображения товара в каталоге (галерея)
    - Поля:
        - _image: HTMLImageElement;  (элемент рисунок)
	    - _category: HTMLElement; (элемент категория)
	    - _categoryColor = <Record<string, string>> (словарь категорий и правил)
    - Методы:
        - set image(value: string); (установить рисунок и текст)
        - set category(value: string); (установить категорию)

- ItemPreviewView. Класс отображения товара в модальном окне (превью)
    - Поля:
        - _text: HTMLElement; (элемент описания)
	    - _buyButton: HTMLButtonElement; (элемент кнопки купить)
    - Методы:
        - set description(value: string); (устанавливает описание)
        - set inBasket(value: boolean); (меняет название кнопки)

- ItemBasketView. Класс отображения товара в корзине.
    - Поля:
        - _index: HTMLElement; (элемент нумерации)
	    - _deleteButton: HTMLButtonElement; (кнопка удалить товар из корзины)
    - Методы:
        - set index(value: number); (установить номер товара в корзине)

- ModalView. Базовый класс для отображения HTML-элементов в модальном окне.
    - Поля: 
        - _contentView: HTMLElement; (контейнер содержимого)
        - _closeButton: HTMLButtonElement; (кнопка закрытия окна)
    - Методы:
        - open(): void; (открытие модального окна)
        - close(): void; (закрытие модального окна)
        - render(data?: Partial< IModalView >): HTMLElement; (устанавливает содержимое модального окна)

- BasketView. Класс для отрисовки корзины. Показывает список товаров и итоговую сумму.
    - Поля:
        - _basketList: HTMLElement; (контейнер товаров в корзине)
	    - _totalPrice: HTMLElement; (контейнер итоговой цены)
        - _buyButton: HTMLButtonElement; (кнопка оформления заказа)
    - Методы:
        - set basketList(value: HTMLElement[]); (устанавливает список товаров в корзине)
        - setTotalPrice(totalPrice: number): void; (отображает сумму товаров)
        
- FormView. Базовый класс для отображения форм ввода. Реализует общую функциональность форм.
    - Поля:
       - _submit: HTMLButtonElement; (кнопка отправки формы - submit)
       - _errors: HTMLElement; (контейнер отображения ошибок валидации)
    - Методы:
        - onInputChange(field: keyof T, value: string); (обрабатывает события ввода в инпуты)
        - set valid(value: boolean); (активирует кнопку)
        - reset(): void; (сброс инпутов)
        - render(data?: Partial< T >): HTMLElement (отрисовать форму)

- OrderViewAddress. Родительский класс - FormView. Отрисовывает первую форма ввода при формировании заказа (выбор способа оплаты и ввод адреса).
    - Поля:
        - _cashButton: HTMLButtonElement; (элемент кнопки формы оплаты)
	    - _cardButton: HTMLButtonElement; (элемент кнопки формы оплаты)
	    - _address: HTMLInputElement; (инпут для адреса)
	- Методы:
        - set payment(value: PayMethod): void (устанавливает способ оплаты)
        - reset(): void (сброс формы)
        
- OrderViewContacts.  Родительский класс - FormView. Отображает вторую форму ввода при формировании заказа (ввод почты и телефона).
    - Поля:
        - _email: HTMLInputElement; (элемент поля электронная почта)
	    - _phone: HTMLInputElement; (элемент поля телефон)
	 - Методы:
        - setEmail(email: string): void; (устанавливает почту)
        - setPhone(phone: string): void; (отображает телефон)
       
- SuccessView. Родительский класс - FormView. Показывает форму успешной отправка заказа.
    - Поля:
        - _description: HTMLElement; (элемент описания)
	    - _button_close: HTMLButtonElement; (кнопка закрытия)
    - Методы:
        - setTotal(price: number): void; (отображает итоговую сумму)
    

#### Презентер (Presenter)
Реализуется в index.ts. Создает классы Моделей и Отображений, обрабатывает события (подписка) с использованием класса EventEmitter, вызывает методы Моделей и Отображений
при генерации событий.
Список событий приложения (тип Events)
- 'items:loaded' - загрузка приложения,
- 'item:select' - выбор/просмотр товара,
- 'item:add' - добавление товара в корзину,
- 'item:remove' - удаление товара из корзины,
- 'basket:open' - открытие корзины,
- 'basket:update' - обновление корзины,
- 'basket:close' - закрытие корзины,
- 'contact:submit' - переключение шага оформления заказа,
- 'order:start' - начинаем оформление заказа,
- 'order. * :change', 'contacts. * :change' - валидация заказа
- 'order:submit' - завершить ввод адреса,
- 'contacts:submit' - завершить ввод контактов,
- 'success:close' - заказ оформлен успешно,
- 'formErrors:change' - ошибка при оформление заказа,
- 'modal:open' - открытие модального окна,
- 'modal:close' - закрытие модального окна.

