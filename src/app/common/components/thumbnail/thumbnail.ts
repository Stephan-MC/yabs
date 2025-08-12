import { NgOptimizedImage } from "@angular/common";
import { Component, computed, HostBinding, inject, input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
	selector: "app-thumbnail",
	imports: [NgOptimizedImage],
	templateUrl: "./thumbnail.ng.html",
	styleUrl: "./thumbnail.css",
})
export class Thumbnail {
	private domSanitizer = inject(DomSanitizer);

	src = input.required<
		string,
		null | undefined | File | { url: string; alt: string } | string
	>({
		transform: (value) =>
			typeof value === "string"
				? value
				: value instanceof File
					? URL.createObjectURL(value)
					: typeof value === "undefined" || value === null
						? ""
						: value.url,
	});
	alt = input<string>();
	protected blob = computed(() => {
		return null;
	});

	priority = input<boolean>(false);

	@HostBinding("class.thumbnail")
	get defaultClass() {
		return true;
	}

	ngOnDestroy() {
		if (!!this.src() && this.src().startsWith("blob:")) {
			URL.revokeObjectURL(this.src() as string);
		}
	}
}
