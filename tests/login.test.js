const { add } = require('./../math_test');

// 'describe' används för att gruppera relaterade tester
describe('Testar matte-funktioner', () => {
  // 'test' (eller 'it') är själva testfallet
  test('ska ...', () => {
    const resultat = add(2, 3);
    expect(resultat).toBe(5);
  });

  test('en till matte test', () => {
    const resultat = add(0, 0);
    expect(resultat).toBe(0);
  });
  
});