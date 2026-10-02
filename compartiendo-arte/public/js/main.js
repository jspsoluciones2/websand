/**
 * Entry point — imports and initializes all site modules.
 * Every module guards itself if its markup is not present,
 * so this file is safe to use on both index.html and politicas.html.
 */
import { initIntro } from './intro.js';
import { initNavbar } from './navbar.js';
import { initScrollAnimations } from './scroll-anim.js';
import { initWidget } from './widget.js';
import { initGaleria } from './galeria.js';
import { initCertificados } from './certificados.js';
import { initHero3D } from './hero3d.js';
import { initRedesSociales } from './social.js';

document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initNavbar();
  initScrollAnimations();
  initWidget();
  initGaleria();
  initCertificados();
  initRedesSociales();
});

// 3D scene is heavy: initialize after the page is fully loaded.
window.addEventListener('load', () => {
  initHero3D();
});
