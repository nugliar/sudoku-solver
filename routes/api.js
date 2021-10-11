'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      try {
        solver.validate(puzzle);

        if (!value.match(/^[0-9]$/g)) {
          throw new Error('invalid value');
        }
        if (!coordinate.match(/^[A-Ia-i][1-9]$/g)) {
          throw new Error('invalid coordinate');
        }
      } catch (e) {
        return res.json({ error: e.message });
      }

      const r = coordinate.slice(0, 1).toUpperCase();
      const c = coordinate.slice(1);

      const validBool = [
        solver.checkRowPlacement(puzzle, r, c, value),
        solver.checkColPlacement(puzzle, r, c, value),
        solver.checkRegionPlacement(puzzle, r, c, value)
      ];

      const conflict = ['row', 'column', 'region']
        .filter((_, idx) => !validBool[idx]);

      if (conflict.length) {
        res.json({
          valid: false,
          conflict: conflict
        });
      } else {
        res.json({
          valid: true
        });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {

      const puzzleString = req.body.puzzle;

      if (!puzzleString) {
        return res.json({ error: 'Required field missing'});
      }

      try {
        solver.validate(puzzleString)
      } catch (e) {
        return res.json({ error: e.message });
      }

      const solution = solver.solve(puzzleString);

      if (solution === null) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      res.json({ solution: solution });
    });
};
