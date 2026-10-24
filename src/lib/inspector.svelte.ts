import { settings } from "./settings.svelte.js";
import { getIdeDeeplink, openInIde } from "./ide-deeplink.js";

class Inspector {
	active = $state(false);
	hoveredTag = $state<string | null>(null);
	hoveredComponent = $state<string | null>(null);
	rect = $state<DOMRect | null>(null);
	componentRect = $state<DOMRect | null>(null);
	pointer = $state({ x: 0, y: 0 });
	selectedTag = $state<string | null>(null);
	selectedComponent = $state<string | null>(null);
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
		this.hoveredComponent = null;
		this.rect = null;
		this.componentRect = null;
	};

	closePopup = () => {
		this.selectedTag = null;
		this.selectedComponent = null;
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
		if (el.closest('#__kitlens-host')) return true;
		const root = el.getRootNode();
		return root instanceof ShadowRoot && root.host.id === '__kitlens-host';
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

		const meta = this.findSvelteMeta(target);
		const componentEntry = this.findComponentEntry(meta);
		if (componentEntry) {
			this.hoveredComponent = this.getComponentName(componentEntry, meta);
			this.componentRect = this.getComponentRect(target, componentEntry, meta);
		} else {
			this.hoveredComponent = null;
			this.componentRect = null;
		}
	};

	handleClick = (e: MouseEvent) => {
		if (!this.active) return;

		if (e.composedPath().some((node) => node instanceof Element && node.id === '__kitlens-host')) {
			return;
		}

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
		const componentEntry = this.findComponentEntry(meta);
		this.selectedComponent = componentEntry ? this.getComponentName(componentEntry, meta) : null;
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

	isKitRootComponentEntry = (entry: any): boolean => {
		if (!entry || entry.type !== 'component') return false;
		const file = typeof entry.file === 'string' ? entry.file.replaceAll('\\', '/') : '';
		return (
			file.includes('@sveltejs/kit') ||
			file.includes('.svelte-kit') ||
			file.endsWith('/root.svelte') ||
			file === 'root.svelte'
		);
	};

	isRouteFile = (filePath: string): boolean => {
		const normalized = filePath.replaceAll('\\', '/');
		return (
			normalized.includes('@sveltejs/kit') ||
			normalized.includes('.svelte-kit') ||
			normalized.endsWith('/root.svelte') ||
			normalized === 'root.svelte' ||
			/(^|\/)\+(page|layout|error)(@[^/]*)?\.svelte$/.test(normalized)
		);
	};

	findComponentEntry = (meta: any): any => {
		if (!meta) return null;

		let curr = meta.parent;
		while (curr) {
			if (curr.type === 'component') {
				if (this.isKitRootComponentEntry(curr)) {
					return null;
				}
				return curr;
			}
			curr = curr.parent;
		}

		const file = meta?.loc?.file ?? (typeof meta?.file === 'string' ? meta.file : null);
		if (typeof file === 'string' && file.endsWith('.svelte') && !this.isRouteFile(file)) {
			return { type: 'component', file };
		}

		return null;
	};

	getComponentName = (componentEntry: any, meta: any): string | null => {
		if (
			typeof componentEntry?.componentTag === 'string' &&
			componentEntry.componentTag &&
			componentEntry.componentTag !== 'svelte:component'
		) {
			return componentEntry.componentTag;
		}

		const file =
			meta?.loc?.file ??
			(typeof meta?.file === 'string' ? meta.file : null) ??
			(typeof componentEntry?.file === 'string' ? componentEntry.file : null);

		if (typeof file === 'string') {
			const base = file.replaceAll('\\', '/').split('/').pop() ?? '';
			return base.replace(/\.svelte$/, '') || null;
		}

		return null;
	};

	belongsToComponent = (el: Element, componentEntry: any, fallbackFile?: string | null): boolean => {
		const meta = (el as any).__svelte_meta;
		if (!meta) return false;

		let curr = meta.parent;
		while (curr) {
			if (curr === componentEntry) return true;
			curr = curr.parent;
		}

		if (!componentEntry?.componentTag && fallbackFile) {
			const elFile = meta?.loc?.file ?? (typeof meta?.file === 'string' ? meta.file : null);
			if (elFile && elFile === fallbackFile) return true;
		}

		return false;
	};

	getComponentRect = (target: Element, componentEntry: any, meta?: any): DOMRect => {
		let minTop = Infinity;
		let minLeft = Infinity;
		let maxRight = -Infinity;
		let maxBottom = -Infinity;

		const includeElement = (el: Element) => {
			const r = el.getBoundingClientRect();
			if (r.width === 0 && r.height === 0) return;
			if (r.top < minTop) minTop = r.top;
			if (r.left < minLeft) minLeft = r.left;
			if (r.right > maxRight) maxRight = r.right;
			if (r.bottom > maxBottom) maxBottom = r.bottom;
		};

		includeElement(target);

		const fallbackFile =
			meta?.loc?.file ?? (typeof meta?.file === 'string' ? meta.file : null);

		if (typeof document !== 'undefined' && document.body) {
			const elements = document.body.querySelectorAll('*');
			for (let i = 0; i < elements.length; i++) {
				const el = elements[i];
				if (this.isKitlensElement(el)) continue;
				if (this.belongsToComponent(el, componentEntry, fallbackFile)) {
					includeElement(el);
				}
			}
		}

		if (minTop === Infinity) {
			return target.getBoundingClientRect();
		}

		return new DOMRect(minLeft, minTop, maxRight - minLeft, maxBottom - minTop);
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
