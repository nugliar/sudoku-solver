const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('POST /api/solve puzzle with valid puzzle string', (done) => {
    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    const solution = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';

    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: puzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.notProperty(res.body, 'error');
        assert.property(res.body, 'solution');
        assert.equal(res.body.solution, solution);
        done();
      })
  });

  test('POST /api/solve puzzle with missing puzzle string', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.notProperty(res.body, 'solution');
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field missing');
        done();
      })
  });

  test('POST /api/solve puzzle with invalid characters', (done) => {
    const puzzle = 'Az.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';

    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: puzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.notProperty(res.body, 'solution');
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      })
  });

  test('POST /api/solve puzzle with incorrect length', (done) => {
    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46';

    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: puzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.notProperty(res.body, 'solution');
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      })
  });

  test('POST /api/solve puzzle that cannot be solved', (done) => {
    const puzzle = '55555572.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';

    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: puzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.notProperty(res.body, 'solution');
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      })
  });

  test('POST /api/check with all fields', (done) => {
    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    const coordinate = 'A2';
    const value = '6';

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.notProperty(res.body, 'error');
        assert.notProperty(res.body, 'conflict');
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, true);
        done();
      })
  });

  test('POST /api/check with single placement conflict', (done) => {
    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    const coordinate = 'A2';
    const value = '1';

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.notProperty(res.body, 'error');
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.lengthOf(res.body.conflict, 1);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, false);
        done();
      })
  });

  test('POST /api/check with multiple placement conflict', (done) => {
    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    const coordinate = 'A2';
    const value = '2';

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.notProperty(res.body, 'error');
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.lengthOf(res.body.conflict, 2);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, false);
        done();
      })
  });

  test('POST /api/check with all placement conflict', (done) => {
    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    const coordinate = 'C1';
    const value = '5';

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.notProperty(res.body, 'error');
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.lengthOf(res.body.conflict, 3);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, false);
        done();
      })
  });

  test('POST /api/check with missing required fields', (done) => {
    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.property(res.body, 'error');
        assert.notProperty(res.body, 'valid');
        assert.notProperty(res.body, 'conflict');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      })
  });

  test('POST /api/check puzzle with invalid characters', (done) => {
    const puzzle = 'Z..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    const coordinate = 'A1';
    const value = '5';

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.property(res.body, 'error');
        assert.notProperty(res.body, 'valid');
        assert.notProperty(res.body, 'conflict');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      })
  });

  test('POST /api/check puzzle with incorrect length', (done) => {
    const puzzle = '7.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    const coordinate = 'A1';
    const value = '5';

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.property(res.body, 'error');
        assert.notProperty(res.body, 'valid');
        assert.notProperty(res.body, 'conflict');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      })
  });

  test('POST /api/check puzzle with invalid coordinate', (done) => {
    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    const coordinate = 'A10';
    const value = '5';

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.property(res.body, 'error');
        assert.notProperty(res.body, 'valid');
        assert.notProperty(res.body, 'conflict');
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      })
  });

  test('POST /api/check puzzle with invalid value', (done) => {
    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    const coordinate = 'A1';
    const value = '10';

    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isOk(res.body);
        assert.property(res.body, 'error');
        assert.notProperty(res.body, 'valid');
        assert.notProperty(res.body, 'conflict');
        assert.equal(res.body.error, 'Invalid value');
        done();
      })
  });
});
