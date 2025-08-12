import { isPlatformBrowser, NgClass } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	HostBinding,
	inject,
	input,
	PLATFORM_ID,
	signal,
} from "@angular/core";
import { Thumbnail } from "../thumbnail/thumbnail";

@Component({
	selector: "app-carousel",
	imports: [NgClass, Thumbnail],
	templateUrl: "./carousel.ng.html",
	styleUrl: "./carousel.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		"class.carousel": "true",
	},
})
export class Carousel {
	private _platformId = inject(PLATFORM_ID);
	private _intervalId!: number;

	items = input.required<
		Array<{ url: string; alt: string; index: number }>,
		Array<{ url: string; alt: string }>
	>({
		transform: (initalItems) =>
			initalItems.map((item, index) => ({ ...item, index })),
	});
	autoplay = input<boolean>(false);
	delay = input<number>(3000);
	loop = input<boolean>(true);

	currentIndex = signal(0);
	thumbails = computed(() =>
		this.items()
			.filter((item) => item.index > this.currentIndex())
			.concat(this.items().filter((item) => item.index <= this.currentIndex())),
	);
	showControls = input<boolean>(false);
	timing = input<string>("250ms ease");

	logItem = console.log;

	constructor() {
		effect(() => {
			// Clear Interval Whenever we receive new images
			if (this.items() && this._intervalId) clearInterval(this._intervalId);
		});

		effect(() => {
			if (this._intervalId) clearInterval(this._intervalId);

			if (isPlatformBrowser(this._platformId) && this.autoplay()) {
				this._intervalId = setInterval(() => {
					if (this.currentIndex() < this.items().length - 1) {
						this.currentIndex.set(this.currentIndex() + 1);
					} else {
						this.currentIndex.set(0);
					}
				}, this.delay());
			}
		});
	}

	ngOnDestroy() {
		if (this._intervalId) clearInterval(this._intervalId);
	}

	computeInterval() {
		if (this._intervalId) clearInterval(this._intervalId);

		if (isPlatformBrowser(this._platformId) && this.autoplay()) {
			this._intervalId = setInterval(() => {
				if (this.currentIndex() < this.items().length - 1) {
					this.currentIndex.set(this.currentIndex() + 1);
				} else {
					this.currentIndex.set(0);
				}
			}, this.delay());
		}
	}
}
