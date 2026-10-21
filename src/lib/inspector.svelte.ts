import { settings } from "./settings.svelte.js";
import { getIdeDeeplink, openInIde } from "./ide-deeplink.js";

class Inspector {
	active = $state(false);
	hoveredTag = $state<string | null>(null);
	rect = $state<DOMRect | null>(null);
	pointer = $state({ x: 0, y: 0 });
	selectedTag = $state<string | null>(null);
	selectedFilePath = $state<string | null>(null);
	selectedLine = $state<number | null>(null);
	selectedColumn = $state<number | null>(null);
	projectRoot = $state<string | null>(null);
	popupPos = $state({ x: 0, y: 0 });

	toggle = () => {
		this.active = !this.active;
		if (!this.active) {
			this.reset();
			this.closePopup();
		}
	};

	reset = () => {
		this.hoveredTag = null;
		this.rect = null;
	};

	closePopup = () => {
		this.selectedTag = null;
		this.selectedFilePath = null;
		this.selectedLine = null;
		this.selectedColumn = null;
	};

	get displayFilePath(): string | null {
		if (!this.selectedFilePath) return null;
		if (this.projectRoot && this.selectedFilePath.startsWith(this.projectRoot)) {
			const rel = this.selectedFilePath.slice(this.projectRoot.length);
			return rel.startsWith('/') ? rel.slice(1) : rel;
		}
		return this.selectedFilePath;
	}

	get ideUrl(): string | null {
		if (!this.selectedFilePath) return null;
		return getIdeDeeplink(settings.ide, {
			filePath: this.selectedFilePath,
			line: this.selectedLine,
			column: this.selectedColumn,
			projectRoot: this.projectRoot
		});
	}

	get vscodeUrl(): string | null {
		return this.ideUrl;
	}

	openInIde = () => {
		if (this.selectedFilePath) {
			openInIde(settings.ide, {
				filePath: this.selectedFilePath,
				line: this.selectedLine,
				column: this.selectedColumn,
				projectRoot: this.projectRoot
			});
		}
	};

	openInVsCode = () => {
		this.openInIde();
	};

	isKitlensElement(el: Element | null): boolean {
		if (!el) return false;
		return Boolean(el.closest('#__kitlens-host'));
	}

	handlePointerMove = (e: PointerEvent) => {
		if (!this.active) return;

		this.pointer = { x: e.clientX, y: e.clientY };
		const target = document.elementFromPoint(e.clientX, e.clientY);

		if (
			!target ||
			this.isKitlensElement(target) ||
			target === document.documentElement ||
			target === document.body
		) {
			this.reset();
			return;
		}

		this.hoveredTag = this.prettyHoveredTag(target);
		this.rect = target.getBoundingClientRect();
	};

	handleClick = (e: MouseEvent) => {
		if (!this.active) return;

		const target =
			e.target instanceof Element ? e.target : document.elementFromPoint(e.clientX, e.clientY);

		if (
			!target ||
			this.isKitlensElement(target) ||
			target === document.documentElement ||
			target === document.body
		) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		this.selectedTag = this.prettyHoveredTag(target);
		this.popupPos = { x: e.clientX, y: e.clientY };

		const meta = this.findSvelteMeta(target);
		this.selectedFilePath = meta?.loc?.file ?? (typeof meta?.file === 'string' ? meta.file : null);
		this.selectedLine = meta?.loc?.line ?? null;
		this.selectedColumn = meta?.loc?.column ?? null;
	};

	findSvelteMeta = (target: Element): any => {
		let current: Element | null = target;
		while (current) {
			const meta = (current as any).__svelte_meta;
			if (meta) return meta;
			current = current.parentElement;
		}
		return null;
	};

	handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			if (this.selectedTag) {
				this.closePopup();
			} else if (this.active) {
				this.active = false;
				this.reset();
			}
		}
	};

	prettyHoveredTag = (target: Element) => {
		switch (target.tagName.toLowerCase()) {
			case 'a':
				return 'link';
			case 'p':
				return 'paragraph';
			case 'img':
				return 'image';
			default:
				return target.tagName.toLowerCase();
		}
	};
}

export const inspector = new Inspector();
