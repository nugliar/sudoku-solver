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
  test('Valid puzzle string of 81 characters', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    try {
      solver.validate(puzzle)
    } catch(e) {
      assert.fail(e.message);
    }
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

  test('Invalid puzzle string that is not 81 characters in length', () => {
    const puzzle = '.....5.1.85.4......32......1...69.83.9.....6.62.71...9...';
    let error;

    try {
      solver.validate(puzzle)
    } catch(e) {
      error = e;
    } finally {
      assert.equal(error.message, 'Expected puzzle to be 81 characters long');
    }
  })

  test('Valid row placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    assert.isTrue(solver.checkRowPlacement(puzzle, 'A', '4', '6'));
  })

  test('Invalid row placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    assert.isNotTrue(solver.checkRowPlacement(puzzle, 'A', '4', '9'));
  })

  test('Valid column placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    assert.isTrue(solver.checkColPlacement(puzzle, 'A', '4', '5'));
  })

  test('Invalid column placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    assert.isNotTrue(solver.checkColPlacement(puzzle, 'A', '4', '4'));
  })

  test('Valid region placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    assert.isTrue(solver.checkRegionPlacement(puzzle, 'A', '4', '7'));
  })

  test('Invalid region placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    assert.isNotTrue(solver.checkRegionPlacement(puzzle, 'A', '4', '5'));
  })

  test('Valid puzzle string pass the solver', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const solution = solver.solve(puzzle);

    assert.isOk(solution);
  })

  test('Invalid puzzle string fail the solver', () => {
    const puzzle = '.Z9..5.1.85.4....2432......1...69.83.9.....6.62.71';
    const solution = solver.solve(puzzle);

    assert.isNotOk(solution);
  })

  test('Expected solution of valid incomplete puzzle', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const validSolution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
    const solution = solver.solve(puzzle);

    assert.isOk(solution);
    assert.equal(solution, validSolution);
  })
});
