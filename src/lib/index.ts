// Reexport your entry components here

import type { Plugin, ResolvedConfig } from 'vite';

const VIRTUAL_MODULE_ID = 'virtual:kitlens';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

export function kitlens(): Plugin {
    let root = '';

    return {
        name: 'kitlens',
        apply: 'serve',

        configResolved(config: ResolvedConfig) {
            root = config.root;
        },

        resolveId(id) {
            if (id === VIRTUAL_MODULE_ID) {
                return RESOLVED_VIRTUAL_MODULE_ID;
            }
        },

        load(id) {
            if (id === RESOLVED_VIRTUAL_MODULE_ID) {
                return `
			import { mount } from 'svelte';
			import Bar from '#lib/ui/bar.svelte';
			import { inspector } from '#lib/inspector.svelte.js';

			inspector.projectRoot = ${JSON.stringify(root)};

			if (typeof window !== 'undefined' && !document.getElementById('__kitlens-host')) {
				const host = document.createElement('div');
				host.id = '__kitlens-host';
				document.body.appendChild(host);
				mount(Bar, { target: host });
			}
		`;
            }
        },

        transform(code, id) {
            if (id.includes('@sveltejs/kit/src/runtime/client/entry.js') || id.includes('@sveltejs/kit/src/runtime/client/start.js')) {
                return {
                    code: `${code}\nimport '${VIRTUAL_MODULE_ID}';`,
                    map: null
                };
            }
        }
    }
}