export class Utils {
  static getPropertyValue( propertyName, object ) {
    var parts = propertyName.split("."),
      length = parts.length,
      i,
      property = object || this;

    for (i = 0; i < length; i++) {
      property = property[ parts[ i ] ];
    }

    return property;
  }

  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static polarEnumToBoolean(value): boolean {
    return value === 1;
  }

  static isNullOrEmpty(value: string): boolean {
    return value === null || value.length === 0;
  }
}
