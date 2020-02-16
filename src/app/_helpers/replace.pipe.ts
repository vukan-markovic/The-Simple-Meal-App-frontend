import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'removeQuotes' })
export class RemoveQuotes implements PipeTransform {
  transform(value: string): string {
    let result: string = value.replace(/\"/g, '');
    // reassign result in a switch-block
    return result;
  }
}