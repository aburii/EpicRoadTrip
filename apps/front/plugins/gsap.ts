import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(TextPlugin);
});
