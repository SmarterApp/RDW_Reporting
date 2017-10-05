/**
 * Custom tree implementation
 */
export class Tree<T> {

  private _value: any;
  private _children: Tree<T>[] = [];

  constructor(value?: any){
    this._value = value;
  }

  /**
   * The value of this node
   *
   * @returns {any}
   */
  get value(): any {
    return this._value;
  }

  /**
   * All child nodes
   *
   * @returns {Tree<T>[]}
   */
  get children(): Tree<T>[] {
    return this._children;
  }

  /**
   * Gets an existing child matching the given matcher or
   * creates a new child node with the given value if the matcher does not match an existing child
   *
   * @param {(x: T) => boolean} matcher
   * @param {T} value
   * @returns {Tree<T>} the existing or new child
   */
  getOrCreate(matcher: (x:T) => boolean, value: T): Tree<T> {
    let existing = this.find(matcher);
    if (existing) {
      return existing;
    }
    return this.create(value);
  }

  /**
   * Creates and adds a child node with the given value
   *
   * @param {T} value
   * @returns {Tree<T>} the child node
   */
  create(value: T): Tree<T> {
    let child = new Tree<T>(value);
    this.add(child);
    return child;
  }

  /**
   * Sorts the tree in place with the given comparator
   *
   * @param {(a: T, b: T) => number} comparator
   * @returns {Tree<T>} the sorted tree (not a copy)
   */
  sort(comparator: (a: T, b: T) => number): Tree<T> {
    this._children.sort((a, b) => comparator(a.value, b.value));
    this._children.forEach(child => child.sort(comparator));
    return this;
  }

  /**
   * Finds the first child the provided matcher returns <code>true</code> for.
   *
   * @param {(x: T) => boolean} matcher the method used to find the desired child node
   * @returns {Tree<T>} the child node if found or undefined if not.
   */
  find(matcher: (child:T) => boolean): Tree<T> {
    return this._children.find((child) => matcher(child.value))
  }

  /**
   * Adds a child node
   *
   * @param {Tree<T>} tree the node to add
   */
  add(tree: Tree<T>): void {
    this._children.push(tree);
  }

}
