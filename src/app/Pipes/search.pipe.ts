import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchText: string = '', answered: boolean | null = false): any[] {
   
    if (!items) return [];
    //if (!searchText) return items;
    console.log("test:"+answered);
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      // Filter based on the 'answered' value
      const answeredFilter = (
        (answered == true && it.a_text !== null) ||
        (answered == false && it.a_text === null) ||
        (answered == null)
      );
    
      // Filter based on the search text
      const searchTextFilter = Object.values(it).some(val => {
        if (val != null){
          if (typeof val === 'object') {
            return Object.values(val).some(subVal => 
              String(subVal).toLowerCase().includes(searchText)
            );
          }
          return String(val).toLowerCase().includes(searchText);
        }
        return false;
      });
    
      // Return true if the item passes both filters
      return answeredFilter && searchTextFilter;
    });
  }
}


//     return items.filter(it => {
//  // Filter based on the 'answered' value

//  //answered='true';
//  if (String(answered) === 'true' && (it.a_text!==null )) {
//   return true;
// }
// if (String(answered) === 'false' && (it.a_text===null )) {

//   return true;
// }
// if (String(answered) === '' || String(answered) === 'null' || String(answered) === 'undefined'){ 
//   return true;
// }
// return false;




// // Filter based on the search text


  
//       return Object.values(it).some(val => {
//         if (val != null){
//         if (typeof val === 'object') {
//           return Object.values(val).some(subVal => 
//             String(subVal).toLowerCase().includes(searchText)
//           );
//         }
//       }
//         return String(val).toLowerCase().includes(searchText);
//       });
    
//     });
//   }
// }

//     return items.filter(it => {
//       return Object.values(it).some(val =>
//         String(val).toLowerCase().includes(searchText)
//        // String(val).toLowerCase().replace(/_/g, ' ').includes(searchText.replace(/_/g, ' '))
//       );
//     });
//   }
// }