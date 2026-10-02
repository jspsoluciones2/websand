/**
 * Social media links (TikTok, Instagram, Facebook, YouTube).
 * Reads URLs from CONFIG.SOCIAL_URLS and populates every element
 * with [data-red-social]. While a URL is missing, the icon stays
 * visible but disabled (no navigation) with a "Próximamente" hint.
 */
import { CONFIG } from './config.js';

const NOMBRES = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
};

export function initRedesSociales() {
  const enlaces = document.querySelectorAll('[data-red-social]');
  if (!enlaces.length) return;

  enlaces.forEach((enlace) => {
    const red = enlace.dataset.redSocial;
    const url = CONFIG.SOCIAL_URLS[red];

    if (url) {
      enlace.href = url;
      enlace.target = '_blank';
      enlace.rel = 'noopener';
      enlace.setAttribute('aria-label', NOMBRES[red] || red);
      enlace.title = NOMBRES[red] || red;
    } else {
      enlace.setAttribute('aria-disabled', 'true');
      enlace.title = 'Próximamente';
      enlace.setAttribute('aria-label', `${NOMBRES[red] || red} — próximamente`);
      enlace.addEventListener('click', (e) => e.preventDefault());
    }
  });
}
