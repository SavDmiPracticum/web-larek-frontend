import { MainPageView } from './components/view/MainPageView';
import { EventEmitter } from './components/base/events';
import { WebStoreApi } from './components/model/WebStoreApi';
import {
	ItemBasketView,
	ItemCatalogView,
	ItemPreviewView,
} from './components/view/ItemView';
import './scss/styles.scss';
import { AppEvents, IItem, IItemList } from './types';
import { settings, API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { BasketModel } from './components/model/BasketModel';
import { MainPageModel } from './components/model/MainPageModel';
import { ModalView } from './components/view/ModalView';
import { BasketView } from './components/view/BasketView';
import { OrderModel } from './components/model/OrderModel';

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new WebStoreApi(API_URL);
const events = new EventEmitter();

const mainPage = new MainPageModel(new BasketModel(), new OrderModel(), events);

const mainPageView = new MainPageView(document.body, events);
const modalView = new ModalView(modalContainer, events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);

api
	.getItemList()
	.then((items: IItemList) => mainPage.setCatalog(items.items))
	.catch((error) => console.error(error));

events.on(AppEvents.ITEMS_LOADED, () => {
	const itemGallery = mainPage.catalog.map((item) =>
		new ItemCatalogView(cloneTemplate(cardTemplate), events).render(item)
	);

	mainPageView.render({
		catalog: itemGallery,
		counter: mainPage.basket.getItemsCount(),
	});
});

events.on(AppEvents.ITEM_SELECT, (data: { id: string }) => {
	const item = mainPage.getItemFromCatalog(data.id);
	if (item) {
		const cardPreview = new ItemPreviewView(
			cloneTemplate(cardPreviewTemplate),
			events
		);
		mainPage.basket.getItemsBasket().includes(data.id)
			? (item.inBasket = true)
			: (item.inBasket = false);
		modalView.render({ contentView: cardPreview.render(item) });
	}
});

events.on(AppEvents.ITEM_ADD, (data: { id: string }) => {
	const item = mainPage.getItemFromCatalog(data.id);
	mainPage.basket.add(item);
});

events.on(AppEvents.BASKET_UPDATE, () => {
	const basket = mainPage.basket.getItems();
	basketView.basketList = basket.items.map((item: IItem, ind: number) => {
		const cardBasket = new ItemBasketView(
			cloneTemplate(cardBasketTemplate),
			events
		);
		cardBasket.index = ind + 1;
		cardBasket.id = item.id;
		cardBasket.title = item.title;
		cardBasket.price = item.price;
		return cardBasket.render();
	});
	basketView.totalPrice = basket.totalPrice;
	mainPageView.render({ counter: mainPage.basket.getItemsCount() });
});

events.on(AppEvents.ITEM_REMOVE, (data: { id: string }) => {
	mainPage.basket.remove(data.id);
});

events.on(AppEvents.BASKET_OPEN, () => {
	modalView.render({ contentView: basketView.render() });
});

events.on(AppEvents.ORDER_DELIVERY, () => {});

events.on(AppEvents.MODAL_OPEN, () => {
	mainPageView.render({ lock: true });
});

events.on(AppEvents.MODAL_CLOSE, () => {
	mainPageView.render({ lock: false });
});
