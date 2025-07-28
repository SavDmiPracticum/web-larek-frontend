import { MainPageView } from './components/view/MainPageView';
import { EventEmitter } from './components/base/events';
import { WebStoreApi } from './components/model/WebStoreApi';
import {
	ItemBasketView,
	ItemCatalogView,
	ItemPreviewView,
} from './components/view/ItemView';
import './scss/styles.scss';
import { IItem, IItemList, IOrderForm, IOrderSuccess } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { BasketModel } from './components/model/BasketModel';
import { MainPageModel } from './components/model/MainPageModel';
import { ModalView } from './components/view/ModalView';
import { BasketView } from './components/view/BasketView';
import {
	OrderViewAddress,
	OrderViewContacts,
} from './components/view/OrderView';
import { SuccessView } from './components/view/SuccessView';

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new WebStoreApi(API_URL, CDN_URL);
const events = new EventEmitter();

const mainPage = new MainPageModel(new BasketModel(), events);

const mainPageView = new MainPageView(document.body, events);
const modalView = new ModalView(modalContainer, events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderViewAddress = new OrderViewAddress(
	cloneTemplate(orderTemplate),
	events
);
const orderViewContacts = new OrderViewContacts(
	cloneTemplate(contactTemplate),
	events
);
const successView = new SuccessView(cloneTemplate(successTemplate), events);

api
	.getItemList()
	.then((items: IItemList) => mainPage.setCatalog(items.items))
	.catch((error) => console.error(error));

events.on('items:loaded', () => {
	const itemGallery = mainPage.catalog.map((item) =>
		new ItemCatalogView(cloneTemplate(cardTemplate), events).render(item)
	);

	mainPageView.render({
		catalog: itemGallery,
		counter: mainPage.basket.getItemsCount(),
	});
});

events.on('item:select', (data: { id: string }) => {
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

events.on('item:add', (data: { id: string }) => {
	const item = mainPage.getItemFromCatalog(data.id);
	mainPage.basket.add(item);
});

events.on('basket:update', () => {
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

events.on('item:remove', (data: { id: string }) => {
	mainPage.basket.remove(data.id);
});

events.on('basket:open', () => {
	modalView.render({ contentView: basketView.render() });
});

events.on('order:start', () => {
	modalView.render({
		contentView: orderViewAddress.render({ valid: false, errors: [] }),
	});
});

events.on(
	'order.address:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		mainPage.setOrderField(data.field, data.value);
	}
);

events.on(
	'order.payment:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		mainPage.setOrderField(data.field, data.value);
	}
);

events.on(
	'contacts.phone:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		mainPage.setContactsField(data.field, data.value);
	}
);

events.on(
	'contacts.email:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		mainPage.setContactsField(data.field, data.value);
	}
);

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address } = errors;
	orderViewAddress.valid = !address;
	orderViewAddress.errors = Object.values({ address })
		.filter((i) => !!i)
		.join('; ');

	orderViewContacts.valid = !email && !phone;
	orderViewContacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:ready', () => {
	orderViewAddress.valid = true;
});

events.on('order:submit', () => {
	modalView.render({
		contentView: orderViewContacts.render({ valid: false, errors: [] }),
	});
});

events.on('contacts:ready', () => {
	orderViewContacts.valid = true;
});

events.on('contacts:submit', () => {
	mainPage.setOrderPrice(mainPage.basket.totalPrice);
	mainPage.setOrderItems(mainPage.basket.getItemsBasket());
	api.makeOrder(mainPage.order).then((data: IOrderSuccess) => {
		successView.total = data.total;
		modalView.render({
			contentView: successView.render(),
		});
		orderViewAddress.reset();
		orderViewContacts.reset();
		mainPage.resetAll();
	});
});

events.on('success:close', () => {
	modalView.close();
});

events.on('modal:open', () => {
	mainPageView.render({ lock: true });
});

events.on('modal:close', () => {
	mainPageView.render({ lock: false });
});
