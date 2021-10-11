class SudokuSolver {

  validate(puzzleString) {
    const puz = puzzleString;

    if (!puz) {
      throw new Error('invalid puzzle');
    }
    if (!(typeof puz === 'string' || puz instanceof String)) {
      throw new Error('invalid puzzle');
    }
    if (puz.length !== 81) {
      throw new Error('Expected puzzle to be 81 characters long');
    }
    if (puz.match(/[0-9.]/g).length !== 81) {
      throw new Error('Invalid characters in puzzle');
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const r = row.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
    const c = Number(column) - 1;
    const start = 9 * r;

    if (puzzleString[9 * r + c] != '.') {
      return puzzleString[9 * r + c] == value;
    }

    for (let i = start; i < start + 9; i++) {
      if (puzzleString[i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const r = row.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
    const c = Number(column) - 1;

    if (puzzleString[9 * r + c] != '.') {
      return puzzleString[9 * r + c] == value;
    }

    for (let i = c; i < 81; i += 9) {
      if (puzzleString[i] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const r = row.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
    const c = Number(column) - 1;
    const regionRow = parseInt(r / 3) * 3;
    const regionCol = parseInt(c / 3) * 3;

    if (puzzleString[9 * r + c] != '.') {
      return puzzleString[9 * r + c] == value;
    }

    for (let i = regionRow; i < regionRow + 3; i++) {
      for (let j = regionCol; j < regionCol + 3; j++) {
        if (puzzleString[9 * i + j] == value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {

    try {
      this.validate(puzzleString);
    } catch(e) {
      return null;
    }

    const isValid = (puzzle, idx, val) => {
      const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      const r = rowLabels[parseInt(idx / 9)];
      const c = (idx % 9 + 1).toString();
      const v = val.toString();

      const bool1 = this.checkRowPlacement(puzzle, r, c, v);
      const bool2 = this.checkColPlacement(puzzle, r, c, v);
      const bool3 = this.checkRegionPlacement(puzzle, r, c, v);

      return bool1 && bool2 && bool3;
    };

    const bruteForce = (puzzle, idx) => {
      let curPuzzle;
      let solution;

      if (idx >= 81) {
        return puzzle;
      }
      for (let val = 1; val <= 9; val++) {
        if (isValid(puzzle, idx, val)) {
          curPuzzle = puzzle.substring(0, idx) + val + puzzle.substring(idx+1);
          if ((solution = bruteForce(curPuzzle, idx + 1)) != null) {
            return solution;
          } else {
            curPuzzle = puzzle.slice();
          }
        }
      }
      return null;
    }

    return bruteForce(puzzleString, 0);
  }
}

module.exports = SudokuSolver;
