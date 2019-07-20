import { isEmpty, isEqual, omitBy } from 'lodash';
import { diff } from 'ngx-bootstrap/chronos/moment/diff';

export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export function isNullOrBlank(value: string): boolean {
  return value == null || isBlank(value);
}

/**
 * Expands support from string and Array to type Object as well
 *
 * @param value The value to test
 */
export function isNullOrEmpty(value: any): boolean {
  return value == null || isEmpty(value);
}

/**
 * Removes all fields with null values from the containing object.
 * Example {a: undefined, b: null, c: false, d: 0, e: ''} -> {d: 0, e: ''}
 *
 * @param object The object to prune
 */
function removeNullAndFalseProperties(object: Object): Partial<Object> {
  return omitBy(object, (value, key) => value == null || <any>value === false);
}

/**
 * Tests for field by field equality recursively.
 * This method treats undefined, null and false the same as a field being absent.
 * This means that isEqual({a: undefined, b: null, c: false, d: 0, e: ''}, {d: 0, e: ''}) is true
 *
 * @param a
 * @param b
 */
export function deepEqualsIgnoringNullAndFalse(a: Object, b: Object): boolean {
  return isEqual(
    removeNullAndFalseProperties(a),
    removeNullAndFalseProperties(b)
  );
}

/**
 * Strips out HTML tags from the given string
 *
 * This is used to clean up message text that is normally displayed as HTML on the page
 * but needs to also be displayed in a CSV report or something that doesn't support HTML
 *
 * @param value The string to remove the HTML from
 */
export function removeHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

/**
 * True if both dates have the same year, month and day
 *
 * @param a The first date
 * @param b The second date
 */
export function equalDate(a: Date, b: Date): boolean {
  return (
    a === b ||
    (a != null &&
      b != null &&
      a.getDay() === b.getDay() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear())
  );
}

export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class Utils {
  static equalSets(a: any[], b: any[]): boolean {
    return (
      a === b ||
      (a != null &&
        b != null &&
        a.length === b.length &&
        isEqual(a.concat().sort(), b.concat().sort()))
    );
  }

  static getPropertyValue(propertyPath: string, object: any): any {
    const parts = propertyPath.split('.');
    let property = object || this;

    for (let i = 0; i < parts.length; i++) {
      property = property[parts[i]];
    }
    return property;
  }

  static newGuid(): string {
    return uuid();
  }

  static polarEnumToBoolean(value: any): boolean {
    return value === 1;
  }

  static booleanToPolarEnum(value: any): string {
    if (value === true) {
      return '1';
    }
    if (value === false) {
      return '2';
    }
    return undefined;
  }

  /**
   * Checks to see if the string or array is <code>null</code>, <code>undefined</code> or empty.
   *
   * @deprecated
   *
   * @param {string | any[]} value
   * @returns {boolean}
   */
  static isNullOrEmpty(value: string | any[]): boolean {
    return Utils.isNullOrUndefined(value) || value.length === 0;
  }

  static isUndefined(value: any): boolean {
    return typeof value === 'undefined';
  }

  static isNullOrUndefined(value: any): boolean {
    return value == null;
  }

  /**
   * Calls the provided callback in the next frame
   *
   * @param {(...args: any[]) => void} callback the function to call
   * @param args the callback function's arguments
   * @returns {any} the timeout handle
   */
  static setImmediate(callback: (...args: any[]) => void, ...args: any[]): any {
    return setTimeout(callback, 0, ...args);
  }

  /**
   * Creates one object from many ngClass formatted strings or objects.
   * Expects arguments like: 'some-class another-class' or {'some-class': true, 'another-class': false}
   *
   * @param objectsOrStrings
   * @returns {any}
   */
  static toNgClass(...objectsOrStrings): any {
    const classes = {};
    if (!Utils.isNullOrEmpty(objectsOrStrings)) {
      objectsOrStrings.forEach(objectOrString => {
        Object.assign(classes, Utils.toNgClassObject(objectOrString));
      });
    }
    return classes;
  }

  /**
   * Takes a css class attribute formatted string and turns it into an object.
   * If it is already an object it will return that object.
   *
   * @param value the css class string or ngClass object
   * @returns {any} an ngClass object
   */
  static toNgClassObject(value: any): any {
    switch (typeof value) {
      case 'string':
        return value.split(/\s+/g).reduce((object, key) => {
          object[key] = true;
          return object;
        }, {});
      case 'object':
        return value;
    }
    throw new Error('unsupported ngClass argument');
  }

  /**
   * Rounds the provided number and formats it in CSS "{number}px" format
   *
   * @param {number} value the number to put in CSS pixel format
   * @returns {string} the provided number in CSS pixel format
   */
  static formatPixels(value: number): string {
    return `${Math.round(value)}px`;
  }

  /**
   * Gets the provided element's absolute page offset from the top.
   *
   * @param element a native element
   * @returns {number} the element's absolute page offset
   */
  static getAbsoluteOffsetTop(element: any): any {
    let y = 0;
    do {
      y += element.offsetTop || 0;
      element = element.offsetParent;
    } while (element);
    return y;
  }

  /**
   * Gets the provided element's absolute page offset.
   *
   * @param element a native element
   * @returns {{x: number, y: number}} the element's absolute page offset
   */
  static getAbsoluteOffset(element: any): any {
    let x = 0,
      y = 0;
    do {
      x += element.offsetLeft || 0;
      y += element.offsetTop || 0;
      element = element.offsetParent;
    } while (element);
    return { x: x, y: y };
  }

  /**
   * Gets the height of the input element
   *
   * @param {Element} element the element to get the height of
   * @returns {number} the input element's height
   */
  static getHeight(element: Element): number {
    const itemBounds = element.getBoundingClientRect();
    return itemBounds.bottom - itemBounds.top;
  }

  /**
   * True if the provided element is visible in the provided window
   *
   * @param {Element} element
   * @param {Window} window
   * @returns {boolean}
   */
  static inView(element: Element, window: Window): boolean {
    if (element == null || window == null) {
      return false;
    }
    const bounds = element.getBoundingClientRect();
    return (
      bounds.bottom > 0 &&
      bounds.right > 0 &&
      bounds.left <
        (window.innerWidth || document.documentElement.clientWidth) &&
      bounds.top < (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  /**
   * Takes a string or number and returns it's integer value
   *
   * @param stringOrNumber the input
   * @returns {number} the integer value of the string or number
   */
  static integerValueOf(stringOrNumber: any): number {
    switch (typeof stringOrNumber) {
      case 'string':
        return Number.parseInt(stringOrNumber);
      case 'number':
        return stringOrNumber;
    }
    return 0;
  }

  /**
   * Takes a string or boolean and returns it's boolean value
   *
   * @param stringOrBoolean the input
   * @returns {number} the boolean value of the string or boolean
   */
  static booleanValueOf(stringOrBoolean: any): boolean {
    switch (typeof stringOrBoolean) {
      case 'string':
        return Boolean(stringOrBoolean);
      case 'boolean':
        return stringOrBoolean;
    }
    return false;
  }

  /**
   * Returns true if the provided arrays are both defined and of equal length
   *
   * @param {any[]} a the first array
   * @param {any[]} b the second array
   * @returns {boolean} true if the provided arrays are both defined and of equal length
   */
  static hasEqualLength(a: any[], b: any[]) {
    return a != null && b != null && a.length === b.length;
  }

  /**
   * Given the name "My Name" this method will return "My Name (1)"
   * Given the name "My Name (1)" this method will return "My Name (2)"
   *
   * @param {string} name the name with an optional "(N)" to increment
   * @returns {string} the given name suffixed with "(N + 1)" or " (1)" if no "(N)" is provided
   */
  static appendOrIncrementFileNameSuffix(name: string): string {
    return name.replace(/((\((\d+)\)(\s)?)?$)/, (a: string) => {
      if (a === '') {
        return ` (1)`;
      }
      return `(${Number(a.replace(/[()]/g, '')) + 1})`;
    });
  }

  /**
   * Given a string "ThisString" this method will return "this-string"
   *
   * @param {string}
   * @returns {string} the lowercase string with every non-initial capitalized letter separated by a dash
   */
  static camelCaseToDash(str: string): string {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
  }
}

/**
 * Creates a string based on the provided parameters
 * This method assumes the parameters is a basic javascript object and contains only primitive types
 * This is useful when caching results based on request or route parameters
 *
 * @param parameters the object to create the key from
 * @returns {string} the key
 */
export function serializeURLParameters(parameters: any): string {
  return Object.entries(parameters)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => key + '=' + value) // TODO add explicit support for array values
    .join('&');
}

export function range(start: number, end: number): number[] {
  const values = [];
  for (let i = start; i <= end; i++) {
    values.push(i);
  }
  return values;
}

/**
 * Flattens a (potentially deeply nested) JSON object to a single-level shallow JSON object
 *
 * @param value potentially deeply nested JSON object
 * @returns A flattened JSON object containing key/value pairings
 */
export function flattenJsonObject(value: any): any {
  const toReturn = {};

  for (const property in value) {
    const propertyValue = value[property];

    if (typeof propertyValue === 'object') {
      if (propertyValue == null) {
        // coerce undefined to null
        toReturn[property] = null;
      } else if (
        Array.isArray(propertyValue) &&
        propertyValue.every(value => typeof value !== 'object')
      ) {
        // to avoid the .0 .1 .x index flattening of array values? this should only apply when there are no children
        toReturn[property] = propertyValue.join();
      } else {
        const flatObject = flattenJsonObject(propertyValue);
        for (const flatObjectProperty in flatObject) {
          toReturn[property + '.' + flatObjectProperty] =
            flatObject[flatObjectProperty];
        }
      }
    } else {
      toReturn[property] = propertyValue;
    }
  }
  return toReturn;
}

// https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects

export interface FlattenCustomizer {
  (result: any, value: any, property: string): boolean;
}

export interface UnflattenCustomizer {
  (value: any, property: string): any;
}

const nullFlattenCustomizer = () => false;
const nullUnflattenCustomizer = value => value;

function flattenRecurse(
  result: any,
  object: any,
  property: string,
  customizer: FlattenCustomizer
) {
  if (customizer(result, object, property)) {
    // customizer handled it
  } else if (Object(object) !== object) {
    // is primitive
    result[property] = object;
  } else if (Array.isArray(object)) {
    const length = object.length;
    if (length === 0) {
      result[property] = [];
    } else {
      for (let i = 0; i < length; i++) {
        flattenRecurse(
          result,
          object[i],
          property ? property + '.' + i : '' + i,
          customizer
        );
      }
    }
  } else {
    let isEmpty = true;
    for (let key in object) {
      isEmpty = false;
      flattenRecurse(
        result,
        object[key],
        property ? property + '.' + key : key,
        customizer
      );
    }
    if (isEmpty) {
      result[property] = {};
    }
  }
}

export function flatten(
  object: any,
  customizer: FlattenCustomizer = nullFlattenCustomizer
): any {
  const result = {};
  flattenRecurse(result, object, '', customizer);
  return result;
}

export function unflatten(
  object: any,
  customizer: UnflattenCustomizer = nullUnflattenCustomizer
): any {
  if (Object(object) !== object || Array.isArray(object)) {
    return object;
  }
  let result = {},
    currentObject,
    property,
    i,
    last,
    temporaryProperty;
  for (let key in object) {
    (currentObject = result), (property = ''), (last = 0);
    do {
      i = key.indexOf('.', last);
      temporaryProperty = key.substring(last, i !== -1 ? i : undefined);
      currentObject =
        currentObject[property] ||
        (currentObject[property] = !isNaN(parseInt(temporaryProperty))
          ? []
          : {});
      property = temporaryProperty;
      last = i + 1;
    } while (i >= 0);
    currentObject[property] = customizer(object[key], key);
  }
  return result[''];
}

export interface ValueDifference {
  left: any;
  right: any;
}

export interface Difference {
  left: { [key: string]: any };
  middle: { [key: string]: ValueDifference };
  right: { [key: string]: any };
}

/**
 * Produces the difference between two flat objects
 *
 * @param a The first or "left" object
 * @param b The second or "right" object
 */
export function difference(a: any, b: any): Difference {
  const difference = {
    left: {},
    middle: {},
    right: {}
  };
  for (let propertyA in a) {
    if (!a.hasOwnProperty(propertyA)) {
      continue;
    }
    const valueA = a[propertyA];
    if (b.hasOwnProperty(propertyA)) {
      const valueB = b[propertyA];
      if (valueA !== valueB) {
        difference.middle[propertyA] = {
          left: valueA,
          right: valueB
        };
      }
    } else {
      difference.left[propertyA] = valueA;
    }
  }
  for (let propertyB in b) {
    if (!b.hasOwnProperty(propertyB)) {
      continue;
    }
    if (!a.hasOwnProperty(propertyB)) {
      difference.right[propertyB] = b[propertyB];
    }
  }
  return difference;
}

function oneSidedDifference(a: any, b: any, side: 'left' | 'right'): any {
  const diff = difference(a, b);
  return Object.entries(diff.middle).reduce(
    (rightDifference, [key, { [side]: value }]) => {
      rightDifference[key] = value;
      return rightDifference;
    },
    { ...diff[side] }
  );
}

/**
 * Produces only the differences of the right with the left
 *
 * @param a The left
 * @param b The right
 */
export function rightDifference(a: any, b: any): any {
  return oneSidedDifference(a, b, 'right');
}
