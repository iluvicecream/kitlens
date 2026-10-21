export type IDE = 'vscode' | 'antigravity';

export interface IdeConfig {
	id: IDE;
	name: string;
	scheme: string;
}

export const SUPPORTED_IDES: Record<IDE, IdeConfig> = {
	vscode: {
		id: 'vscode',
		name: 'VS Code',
		scheme: 'vscode'
	},
	antigravity: {
		id: 'antigravity',
		name: 'Antigravity IDE',
		scheme: 'antigravity-ide'
	}
};

export interface DeeplinkOptions {
	filePath: string;
	line?: number | null;
	column?: number | null;
	projectRoot?: string | null;
}

/**
 * Generate a deeplink URL for VS Code.
 */
export function getVsCodeDeeplink({
	filePath,
	line,
	column,
	projectRoot
}: DeeplinkOptions): string {
	let path = filePath;
	if (!path.startsWith('/') && projectRoot) {
		path = `${projectRoot}/${path}`;
	}
	const fullPath = path.startsWith('/') ? path : '/' + path;
	let url = `vscode://file${fullPath}`;
	if (line != null) {
		url += `:${line}`;
		if (column != null) {
			url += `:${column}`;
		}
	}
	return url;
}

/**
 * Generate a deeplink URL for Antigravity IDE
 */
export function getAntigravityDeeplink({
	filePath,
	line,
	column,
	projectRoot
}: DeeplinkOptions): string {
	let path = filePath;
	if (!path.startsWith('/') && projectRoot) {
		path = `${projectRoot}/${path}`;
	}
	const fullPath = path.startsWith('/') ? path : '/' + path;
	let url = `antigravity-ide://file${fullPath}`;
	if (line != null) {
		url += `:${line}`;
		if (column != null) {
			url += `:${column}`;
		}
	}
	return url;
}

/**
 * Generate a deeplink URL for the specified IDE.
 */
export function getIdeDeeplink(ide: IDE, options: DeeplinkOptions): string {
	switch (ide) {
		case 'vscode':
			return getVsCodeDeeplink(options);
		case 'antigravity':
			return getAntigravityDeeplink(options);
		default:
			return getVsCodeDeeplink(options);
	}
}

/**
 * Open a file in the specified IDE via its deeplink.
 */
export function openInIde(ide: IDE, options: DeeplinkOptions): void {
	if (typeof window === 'undefined') return;
	const url = getIdeDeeplink(ide, options);
	if (url) {
		window.location.href = url;
	}
}

/**
 * Open a file in VS Code via its deeplink.
 */
export function openInVsCode(options: DeeplinkOptions): void {
	openInIde('vscode', options);
}

/**
 * Open a file in Antigravity via its deeplink.
 */
export function openInAntigravity(options: DeeplinkOptions): void {
	openInIde('antigravity', options);
}
