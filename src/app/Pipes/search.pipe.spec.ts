// import { SearchPipe } from './search.pipe';

// describe('SearchPipe', () => {
//   it('create an instance', () => {
//     const pipe = new SearchPipe();
//       expect(pipe).toBeTruthy();
//   });
// });



import { SearchPipe } from './search.pipe';


describe('SearchPipe', () => {
  it('create an instance', () => {
  // @ts-ignore
    const pipe = new SearchPipe();
    expect(pipe).toBeTruthy();
  });
});

