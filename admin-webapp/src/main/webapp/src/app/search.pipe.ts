import {Pipe, PipeTransform, Injectable} from "@angular/core";

@Pipe({
  name: 'search',
  pure: true
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], search: string, on:any): any[] {
    search = search || '';
    let searchCharacters = search.toLowerCase().split('').filter(character => !/\s/.test(character));
    return items.filter((item: any) => {

      let itemText = '';
      if (on == null) {
        itemText = item;
      } else if (on instanceof Array) {
        itemText = on.reduce((text, property) => text + item[property], '');
      } else if (on instanceof Function) {
        itemText = on(item);
      } else if (typeof on === 'string') {
        itemText = item[on];
      }
      itemText = itemText.toLowerCase();

      let previousIndex = -1;
      for (let i = 0; i < searchCharacters.length; i++) {
        let searchCharacter = searchCharacters[i];
        let index = itemText.indexOf(searchCharacter, previousIndex);
        if (index == -1) {
          return false;
        }
        previousIndex = index;
      }
      return true;
    });
  }
}
