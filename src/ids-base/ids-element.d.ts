// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import mix from './ids-mixin';
import { props } from './ids-constants';

export class IdsElement extends HTMLElement {
  /** The main container in the shadowRoot */
  container: HTMLElement;

  /** The web component's name' */
  prototype: IdsElement;

  /** The web component's name' */
  name: string;

  /** The web component call back when a property is changed */
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void;

  /** The web component call back when a element is removed from the DOM */
  disconnectedCallback(): void;

  /** Generate and render a template in the shadow DOM */
  render(): IdsElement;

  /** Append the style sheet internally */
  appendStyles(): void;

  /** Remove all events attached via any event mixin */
  detachAllEvents(): void;

  /** Remove all keyboard attachments via any keyboard mixin */
  detachAllKeyboard(): void;
}

export {
  customElement,
  version,
  scss
} from './ids-decorators';

export {
  props,
  mix
};
