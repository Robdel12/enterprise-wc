// This is a global array of resizable target components.
// Any elements that end up here will have their `refresh()` methods called
// whenever the resizeObserver is triggered.
let resizeTargets = [];

/**
 * This mixin provides access to a global ResizeObserver instance used by all IDS Components,
 * and is responsible for setting up a local MutationObserver instance for this component that
 * automatically triggers a `refresh()` method if one is available.
 *
 * NOTE: When using this mixin, it's still required for you to implement
 * `ResizeObserver.connect()/disconnect()` and `MutationObserver.connect()/disconnect()`
 * when connecting/disconnecting a component.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsResizeMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  /**
   * Builds the global IDS object
   * @private
   * @returns {void}
   */
  checkForIDS() {
    // @ts-ignore
    if (!window.Ids) {
      // @ts-ignore
      window.Ids = {};
    }
  }

  /**
   * This method needs to run
   * @returns {void}
   */
  setupResize() {
    this.checkForIDS();

    // Build the global instance of it doesn't exist.
    // The global resize handler will attempt to run a `refresh` method
    // if it finds one on any registered component.
    // @ts-ignore
    if (!window.Ids.resizeObserver && typeof ResizeObserver !== 'undefined') {
      /* istanbul ignore next */
      // @ts-ignore
      window.Ids.resizeObserver = new ResizeObserver(() => {
        resizeTargets.forEach((e) => {
          if (typeof e.refresh === 'function') {
            e.refresh();
          }
        });
      });
    }

    // Connect the `ro` property to the global instance
    /* istanbul ignore next */
    if (!this.ro) {
      // @ts-ignore
      this.ro = window.Ids.resizeObserver;
    }

    // Check the global resize targets array and add this component if it's not already there.
    /* istanbul ignore next */
    if (!resizeTargets.includes(this)) {
      resizeTargets.push(this);
    }
  }

  /**
   * Disconnects this component from the Global Resize handler
   * @returns {void}
   */
  disconnectResize() {
    /* istanbul ignore next */
    if (this.ro) {
      resizeTargets = resizeTargets.filter((e) => !this.isEqualNode(e));
      delete this.ro;
    }
  }

  /**
   * Detects whether or not this component should be checking for resize.
   * @returns {boolean} whether or not this component should currently listen
   * for Resize instructions.
   */
  shouldResize() {
    // @ts-ignore
    return typeof ResizeObserver !== 'undefined' && this.ro instanceof ResizeObserver;
  }

  /**
   * Detects the target element to be watched by the ResizeObserver.  In most cases, this will
   * simply be a parent node, but with nested WebComponents, occasionally `parentNode` is a
   * ShadowRoot, which is incompatible with ResizeObserver.  This method simply finds a
   * proper "observable" node.
   * @returns {HTMLElement} which should be watched by the ResizeObserver
   */
  resizeDetectionTarget() {
    let target = this.parentNode;
    if (target instanceof ShadowRoot) {
      target = target.host;
    }
    return target;
  }

  /**
   * Sets up a MutationObserver that will fire an IDS Component's `refresh()`
   * method when it needs to update.
   * @returns {void}
   */
  setupDetectMutations() {
    this.checkForIDS();

    /* istanbul ignore next */
    if (!this.mo && typeof MutationObserver !== 'undefined') {
      /** @type {any} */
      this.mo = new MutationObserver((/** @type {any} */ mutation) => {
        switch (mutation.type) {
        case 'childList':
          break;
        default: // 'attributes'
          if (typeof this.refresh === 'function') {
            this.refresh();
          }
        }
      });
    }

    /* istanbul ignore next */
    if (!this.mutationTargets) {
      this.mutationTargets = [];
    }
    /* istanbul ignore next */
    if (!this.mutationTargets.includes(this)) {
      this.mutationTargets.push(this);
    }
  }

  /**
   * @returns {void}
   */
  disconnectDetectMutations() {
    /* istanbul ignore next */
    if (this.mo) {
      this.mutationTargets = [];
      delete this.mo;
    }
  }

  /**
   * Detects whether or not this component should be watching for DOM Mutations.
   * @returns {boolean} whether or not this component should currently listen
   * for Resize instructions.
   */
  shouldDetectMutations() {
    return typeof MutationObserver !== 'undefined' && this.mo instanceof MutationObserver;
  }
};

export { IdsResizeMixin };
