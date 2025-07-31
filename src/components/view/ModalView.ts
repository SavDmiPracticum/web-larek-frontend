import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { View } from '../base/View';

interface IModalView {
	contentView: HTMLElement;
}
export class ModalView extends View<IModalView> {
	protected _contentView: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._contentView = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._contentView.addEventListener('click', (event: Event) =>
			event.stopPropagation()
		);
	}

	set contentView(value: HTMLElement) {
		this._contentView.replaceChildren(value);
	}

	close() {
		this.toggleClass(this.container, 'modal_active', false);
		this._contentView.replaceChildren();
		this.events.emit('modal:close');
	}

	open() {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

	render(data?: Partial<IModalView>): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
