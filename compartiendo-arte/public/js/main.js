/**
 * Punto de entrada — importa e inicializa todos los módulos del sitio.
 * Cada módulo se autoprotege si su marcado no está presente,
 * así que este archivo sirve tanto para index.html como para politicas.html.
 */
import { initNavbar } from './navbar.js';
import { initReveal } from './reveal.js';
import { initSlider } from './slider.js';
import { initWidget } from './widget.js';
import { initGaleria } from './galeria.js';
import { initCertificados } from './certificados.js';
import { initRedesSociales } from './social.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initSlider();
  initWidget();
  initGaleria();
  initCertificados();
  initRedesSociales();
});