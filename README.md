# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

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
- IOrder - описывает свойства заказа
- IOrderSuccess - успешный ответ от API
- IApiError - описывает ошибку API 
- IWebStoreApi - описывает методы работы с API
- AppEvents - перечисление событий приложения

#### Классы (компоненты)
#### Базовый код
- EventEmitter. Класс, реализующий коммуникация между Моделями и Отображениями (брокер событий). Позволяет подписываться на события, вызывать их и отписываться от них.
- Api. Базовый класс, реализующий методы взаимодействия с сервером. Родительский класс для WebStoreApi.

##### Модель (Model)
- ItemModel. Класс описывает товар (хранит данные товаре, предоставляет доступ к его свойствам, возвращает данные о товаре).
    - Поля:
        - id: string; (идентификатор товара)
	    - description: string; (описание товара)
	    - image: string; (ссылка на фото товара)
	    - title: string; (наименование товара)
	    - category: Category; (категория товара)
	    - price: number | null; (цена товара)
    - Методы:
        - getItem(id: string): IItem; (возвращает информацию о товаре)

- BasketModel. Класс хранит информацию о корзине, добавляет/удаляет товар, считает итоговую сумму.
    - Поля:
        - items: IItems[]; (массив товаров)
        - total: number; (итоговая стоимость всех товаров в корзине)
    - Методы:
        - add(item: IItem): void; (добавляет товар в корзину)
        - remove(id: string): void; (удаляет товар из корзины)
        - clear(): void; (очищает корзину)
        - getBasket(): IBasket; (возвращает корзину с товарами)
        - getItemsBasket(): string[];  (возвращает идентификаторы товаров в корзине для заказа)

- OrderModel. Класс хранит информацию о заказе, делает проверку заказа, подсчитывает итоговую сумму заказа, отправляет данные на сервер.
    - Поля:
        - payment: PayMethod; (метод оплаты заказа)
	    - email: string; (электронная почта)
	    - phone: string; (телефон)
	    - address: string; (адрес)
	    - totalPrice: number | null; (стоимость заказа)
	    - items: string[]; (идентификаторы товаров в заказе)
        - step: number; (шаг заказа)
    - Методы:
        - setPayMethod(method: PayMethod): void; (установить метод оплаты заказа)
        - setEmail(email: string); void; (установить почту)
        - setAddress(address: string): void; (установить адрес)
        - setTotalPrice(price: number | null): void (установить цену)
        - submit(): Promise< IOrderSuccess >; (отправляет заказ)
        - clear(): void; (очистить заказ)

- WebStoreApi. Класс для работы с API сервера, отправляет заказ, получает каталог товаров или товар по идентификатору. Наследуется от класса Api.
    - Поля:
        - baseUrl: string; (общий URL запросов)
    - Методы:
        - getItemList(): Promise< IItemList >; (отправляет запрос на сервер для получение каталога товаров)
	    - getItem(id: string): Promise< IItem >; (отправляет запрос на сервер для получения товара по идентификатору)
	    - makeOrder(order: IOrder): Promise< IOrderSuccess >; (отправляет запрос на сервер для создание заказа)

#### Отображение (View)
- View. Абстрактный класс для всех компонентов отображения, наследуются всеми классами отображения приложения. Предоставляет базовые методы:  установить текст, изображение; показать/скрыть/деактивировать HTML-элемент, переключить класс, отрисовать элемент на странице. 
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
        - container: HTMLElement; (корневой контейнер страницы)
        - catalog: HTMLElement; (контейнер каталога)
        - basket: HTMLElement; (элемент корзины)
        - counter: HTMLElement; (элемент счетчика корзины)
    - Методы:
        - setCatalog(items: HTMLElement[]); void; (получает элементы карточек товара)
        - setCounter(value; number): void; (обновляет счетчик корзины)

- ItemView. Класс для отображения карточки товара в разных видах (галерея, превью, корзина).
    - Поля:
        - container: HTMLElement; (контейнер карточки товара)
        - id: string; (идентификатор товара)
	    - description: HTMLElement; (элемент описание товара)
	    - image: HTMLElement; (элемент ссылка на фото товара)
	    - title: HTMLElement; (элемент наименование товара)
	    - category: HTMLElement; (элемент категории товара)
	    - price: HTMLElement; (элемент цена товара)
        - button: HTMLButtonElement (элемент кнопки добавить/удалить)
    - Методы:
        - setId(value: string): void; (устанавливает идентификатор)
        - setTitle(value: string): void; (устанавливает название)
        - setImage(value: string): void; (устанавливает изображение)
        - setDescription(value: string): void; (устанавливает описание)
        - setCategory(value: Category): void; (устанавливает категорию)
        - setPrice(value: number | null): void; (устанавливает цену)
        - setButtonText(value: string): void; (устанавливает текст кнопки)

- ModalView. Базовый класс для отображения HTML-элементов в модальном окне.
    - Поля: 
        - container: HTMLElement; (контейнер окна)
        - content: HTMLElement; (контейнер содержимого)
        - button: HTMLButtonElement; (кнопка закрытия окна)
    - Методы:
        - openModal(): void; (открытие модального окна)
        - closeModal(): void; (закрытие модального окна)
        - setContent(element: HTMLElement): void; (устанавливает содержимое модального окна)

- BasketView. Класс для отрисовки корзины. Показывает список товаров и итоговую сумму.
    - Поля:
        - container: HTMLElement; (контейнер корзины)
        - items: HTMLElement; (контейнер товаров в корзине)
	    - totalPrice: HTMLElement; (контейнер итоговой цены)
        - button: HTMLButtonElement; (кнопка оформления заказа)
    - Методы:
        - setItems(elements: HTMLElement[]): void; (устанавливает список товаров в корзине)
        - setTotalPrice(totalPrice: number): void; (отображает сумму товаров)
        - setButtonActive(active: boolean): void; (активирует/деактивирует кнопку)

- FormView. Базовый класс для отображения форм ввода. Реализует общую функциональность форм.
    - Поля:
       - container: HTMLFormElement; (контейнер формы)
       - button: HTMLButtonElement; (кнопка отправки формы - submit)
       - error: HTMLElement; (контейнер отображения ошибок валидации)
    - Методы:
        - setButtonActive(active: boolean): void; (управляет активацией/деактивацией кнопки отправки формы)
        - setError(error: string): void; (отображает ошибки валидации)
        - render(data?: Partial< T >): HTMLElement (отрисовать форму)

- OrderFormView. Родительский класс - FormView. Отрисовывает первую форма ввода при формировании заказа (выбор способа оплаты и ввод адреса).
    - Поля:
        - paymentOnline: HTMLButtonElement; (элемент кнопки оплаты онлайн)
        - paymentOffline: HTMLButtonElement; (элемент кнопки оплаты оффлайн)
	    - address: HTMLInputElement; (элемент поля адрес)
	- Методы:
        - setPayment(method: PayMethod): void (устанавливает способ оплаты)
        - setAddress(address: string): void (отображает адрес)
        - validate(): boolean; (проверяет валидность полей форм)

- ContactFormView.  Родительский класс - FormView. Отображает вторую форму ввода при формировании заказа (ввод почты и телефона).
    - Поля:
        - email: HTMLInputElement; (элемент поля электронная почта)
	    - phone: HTMLInputElement; (элемент поля телефон)
	 - Методы:
        - setEmail(email: string): void; (устанавливает почту)
        - setPhone(phone: string): void; (отображает телефон)
        - validate(): boolean; (проверяет валидность полей форм)  

- SuccessFormView. Родительский класс - FormView. Показывает форму успешной отправка заказа.
    - Поля:
        - totalPrice: HTMLElement;
    - Методы:
        - setTotalPrice(price: number): void; (отображает итоговую сумму)
    

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
- 'order:step' - переключение шага оформления заказа,
- 'order:submit' - завершить заказ,
- 'order:success' - заказ оформлен успешно,
- 'order:error' - ошибка при оформление заказа,
- 'modal:open' - открытие модального окна,
- 'modal:close' - закрытие модального окна.

