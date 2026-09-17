// Laravel resolves the deployment subdirectory and optional ASSET_URL.
const imageBase = typeof document !== 'undefined'
    ? document.querySelector('meta[name="app-image-base"]')?.content
    : null;
const base = (imageBase || '/images').replace(/\/$/, '');

export const PADEL_BACKGROUND = `${base}/padel_hero.png`;
export const PADEL_LOGO = `${base}/logo.png`;
