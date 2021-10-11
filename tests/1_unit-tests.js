const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

const randomString = () => {
  let array = [];

  for (let idx = 0; idx < 81; idx++) {
    if (Math.random() >= 0.7) {
      array.push(String.fromCharCode(49 + parseInt(8 * Math.random())));
    } else {
      array.push('.');
    }
  }
  return array.join('');
}

suite('UnitTests', () => {
  test('Valid puzzle string', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

    try {
      solver.validate(puzzle)
    } catch(e) {
      assert.fail(e.message);
    }
    assert.equal(solver.solve(puzzle), solution);
  });

  test('Invalid characters in puzzle string', () => {
    const puzzle = 'A.9..5.1.85.4....BC32......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    let error;

    try {
      solver.validate(puzzle)
    } catch(e) {
      error = e;
    } finally {
      assert.equal(error.message, 'Invalid characters in puzzle');
    }
  })
});
