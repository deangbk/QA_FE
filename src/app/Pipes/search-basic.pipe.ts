import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchBasic'
})
export class SearchBasicPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
