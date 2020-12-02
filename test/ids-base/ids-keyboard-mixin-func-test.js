/**
 * @jest-environment jsdom
 */
import { IdsKeyboardMixin } from '../../src/ids-base/ids-keyboard-mixin';
import IdsTag from '../../src/ids-tag/ids-tag';

let elem;

describe('IdsKeyboardMixin Tests', () => {
  beforeEach(async () => {
    elem = new IdsTag();
    document.body.appendChild(elem);
    elem.keyboard = new IdsKeyboardMixin();
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can watch for single hot keys', () => {
    const mockHandler = jest.fn();
    elem.keyboard.listen('Enter', elem, mockHandler);

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    elem.dispatchEvent(event);

    expect(mockHandler.mock.calls.length).toBe(1);
  });

  it('can will not fire if not watching', () => {
    const mockHandler = jest.fn();
    elem.keyboard.listen('Enter', elem, mockHandler);

    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    elem.dispatchEvent(event);

    expect(mockHandler.mock.calls.length).toBe(0);
  });

  it('can watch for multiple hot keys in the same event', () => {
    const mockHandler = jest.fn();
    elem.keyboard.listen(['Delete', 'Backpace'], elem, mockHandler);

    const event1 = new KeyboardEvent('keydown', { key: 'Delete' });
    elem.dispatchEvent(event1);

    const event2 = new KeyboardEvent('keydown', { key: 'Backpace' });
    elem.dispatchEvent(event2);

    expect(mockHandler.mock.calls.length).toBe(2);
  });

  it('can watch for pressed keys', () => {
    const mockHandler = jest.fn(() => elem.keyboard.pressedKeys);
    elem.keyboard.listen('Delete', elem, mockHandler);

    const event1 = new KeyboardEvent('keydown', { key: 'Delete' });
    elem.dispatchEvent(event1);

    expect(mockHandler.mock.results[0].value.size).toEqual(1);
    expect(mockHandler.mock.results[0].value.get('Delete')).toEqual(true);
  });

  it('can release unpressed keys', () => {
    const mockHandler = jest.fn();
    elem.keyboard.listen('', elem, mockHandler);

    const event1 = new KeyboardEvent('keydown', { key: 'Delete' });
    elem.dispatchEvent(event1);
    expect(elem.keyboard.pressedKeys.size).toEqual(1);
    expect(elem.keyboard.pressedKeys.get('Delete')).toEqual(true);

    const event2 = new KeyboardEvent('keyup', { key: 'Delete' });
    elem.dispatchEvent(event2);

    expect(elem.keyboard.pressedKeys.size).toEqual(0);
    expect(elem.keyboard.pressedKeys.get('Delete')).toEqual(undefined);
  });

  it('can destroy', () => {
    const mockHandler = jest.fn();
    elem.keyboard.listen(['Delete', 'Backpace'], elem, mockHandler);
    expect(elem.keyboard.keyDownHandler).toBeTruthy();
    expect(elem.keyboard.keyUpHandler).toBeTruthy();

    elem.keyboard.destroy();

    expect(elem.keyboard.keyDownHandler).toBeFalsy();
    expect(elem.keyboard.keyUpHandler).toBeFalsy();
  });

  it('can skip destroy if not setup', () => {
    expect(elem.keyboard.element).toBeFalsy();

    elem.keyboard.destroy();

    expect(elem.keyboard.element).toBeFalsy();
  });
});