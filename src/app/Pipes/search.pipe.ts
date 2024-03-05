import { Pipe, PipeTransform } from '@angular/core';
import { QuestionsDisplayComponent } from '../questions-display/questions-display.component';

@Pipe({
  name: 'search'
})

export class SearchPipe implements PipeTransform {

    constructor(private component: QuestionsDisplayComponent) {}
  
    transform(items: any[], searchText: string = '',accountText:string[]=[], answered: boolean | null = false, filters: any = {}): any[] {
      if (!items) return [];
      searchText = searchText.toLowerCase();
      const filteredItems = items.filter(it => {
        // Filter based on the 'answered' value
        const answeredFilter = (
            (answered == true && it.a_text !== null) ||
            (answered == false && it.a_text === null) ||
            (answered == null)
        );
  
        // Filter based on the filters
        const filtersPassed = Object.keys(filters).every(key => {
            return !filters[key] || (it[key] != null && String(it[key]).toLowerCase() === filters[key]);
        });
  
        // Filter based on the search text
        const searchTextFilter = () => {
            return Object.values(it).some(val => {
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
        }
  
        const accountFilter = (accountTexts: string[]) => {
            if (accountText.length==0) {
                return true;
            }
           else if (it.account && it.account.id) {
                return accountTexts.some(accountText => 
                    String(it.account.id).toLowerCase().includes(accountText.toLowerCase())
                );
            }
            return false;
        }
  
        // Return true if the item passes all filters
        return answeredFilter && filtersPassed && searchTextFilter() && accountFilter(accountText);
      });
  
      // Update the component property with the number of items
      this.component.filteredQuestionsCount = filteredItems.length;
      this.component.filteredQuestions=filteredItems;
  
      return filteredItems;
    }
  }
// export class SearchPipe implements PipeTransform {

//     constructor(private component: QuestionsDisplayComponent) {}

//   transform(items: any[], searchText: string = '',accountText:string[]=[], answered: boolean | null = false, filters: any = {}): any[] {
//     if (!items) return [];
//     searchText = searchText.toLowerCase();
//     return items.filter(it => {
//         // Filter based on the 'answered' value
//         const answeredFilter = (
//             (answered == true && it.a_text !== null) ||
//             (answered == false && it.a_text === null) ||
//             (answered == null)
//         );

//         // Filter based on the filters
//         const filtersPassed = Object.keys(filters).every(key => {
//             return !filters[key] || (it[key] != null && String(it[key]).toLowerCase() === filters[key]);
//         });
     

//         // Filter based on the search text
//         const searchTextFilter = () => {
//             return Object.values(it).some(val => {
//                 if (val != null){
//                     if (typeof val === 'object') {
//                         return Object.values(val).some(subVal => 
//                             String(subVal).toLowerCase().includes(searchText)
//                         );
//                     }
//                     return String(val).toLowerCase().includes(searchText);
//                 }
//                 return false;
//             });
//         }

      
       
//         const accountFilter = (accountTexts: string[]) => {
//             if (accountText.length==0) {
//                 return true;
//             }
//            else if (it.account && it.account.id) {
//                 return accountTexts.some(accountText => 
//                     String(it.account.id).toLowerCase().includes(accountText.toLowerCase())
//                 );
//             }
//             return false;
//         }

//         // const filteredItems = items.filter(it => 
//         //     answeredFilter && filtersPassed && searchTextFilter() && accountFilter(accountText)
//         //   );
//       //  this.component.filteredQuestionsCount = filteredItems.length;
//         // Return true if the item passes all filters
//        // return answeredFilter && filtersPassed && searchTextFilter() && accountFilter(accountText);
//        const filteredItems =answeredFilter && filtersPassed && searchTextFilter() && accountFilter(accountText);
//        //this.component.filteredQuestionsCount = filteredItems.length;
//        return filteredItems;
//     });
// }
// }