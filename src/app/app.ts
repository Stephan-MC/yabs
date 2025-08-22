import { Component, inject, linkedSignal, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Carousel } from "./common/components/carousel/carousel";
import { NgClass, ViewportScroller } from "@angular/common";
import { Thumbnail } from "./common/components/thumbnail/thumbnail";

@Component({
	selector: "app-root",
	imports: [NgClass, RouterOutlet, Carousel, Thumbnail],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("yabs");
	viewportScroller = inject(ViewportScroller);

	groups = signal(
		Array.from({ length: 4 }).map((_, i) => ({
			name: `Group ${i + 1}`,
			items: Array.from({ length: 17 }).map((_, j) => ({
				url: `/images/party${j + 1}.jpeg`,
				alt: `Party ${j + 1}`,
			})),
		})),
	);

	items = linkedSignal(() => this.groups()[0].items);
}
