import { SUPPORTED_IDES, type IDE } from "./ide-deeplink.js";

const SETTINGS_KEY = "kitlens:settings";

class Settings {
	ide = $state<IDE>("vscode");

	constructor() {
		if (typeof window !== "undefined") {
			try {
				const saved = localStorage.getItem(SETTINGS_KEY);
				if (saved) {
					const data = JSON.parse(saved);
					if (data.ide && data.ide in SUPPORTED_IDES) {
						this.ide = data.ide as IDE;
					}
				}
			} catch {
				// Ignore localStorage access failures
			}
		}
	}

	setIde(ide: IDE) {
		this.ide = ide;
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ide: this.ide }));
			} catch {
				// Ignore localStorage access failures
			}
		}
	}

	get currentIdeConfig() {
		return SUPPORTED_IDES[this.ide] ?? SUPPORTED_IDES.vscode;
	}
}

export const settings = new Settings();
