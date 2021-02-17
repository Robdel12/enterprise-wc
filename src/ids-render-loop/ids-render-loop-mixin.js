import { IdsRenderLoop, IdsRenderLoopItem } from './ids-render-loop';

// Stores the global RenderLoop instance.
/** @type {any} */
let rl = null;
const IdsRenderLoopMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  /**
   * Provides access to a global `requestAnimationFrame` loop, configured to run a queue of
   * callback methods on each tick.
   * @returns {any} link to the global RenderLoop instance
   */
  get rl() {
    if (!rl) {
      rl = new IdsRenderLoop();
    }
    return rl;
  }
};

export { IdsRenderLoopMixin, IdsRenderLoopItem };
