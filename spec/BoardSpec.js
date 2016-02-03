describe("Board", function() {

  var capitalize = function(word) {
    return word[0].toUpperCase() + word.slice(1);
  };



var verifyConflictTypes = function(expectedConflicts, matrix){
  // The Board() constructor will accept a matrix and build that into a (Backbone) Board object (as defined in Board.js)
  var board = new Board(matrix);
  //map takes in elements and directions
  //conflictType is the value of each element htat is passed into map
  _.map('row col rooks majorDiagonal minorDiagonal queens'.split(' '), function(conflictType){
    //conflictDetected runs the board function and finds the correct board method based on the conflict type
    var conflictDetected = board['hasAny' + capitalize(conflictType) + 'Conflicts']();
    //conflictDetected runs the board function and finds the correct board method based on the conflict type
    var conflictDetectedAny = board['has' + capitalize(conflictType) + 'ConflictAt']();
    //checks to see if the value from Map is within the expectedConflicts that were passed in
    var conflictExpected = _(expectedConflicts).contains(conflictType);
    //message runs ternary where if conflictExpected evaluates to true, then returns should, else, should not
    var message = conflictExpected ? 'should' : 'should not';
    //('Should') find a (map value) and concatiates it to conflict and then runs the function that evaluates if the conflict detected is equal to the conflict expected
    it(message + " find a " + conflictType + " conflict", function() {
      expect(conflictDetected).to.be.equal(conflictExpected);
    });
    it(message + "find a " + conflictType + " conflict", function(){
      expect(conflictDetectedAny).to.be.equal(conflictExpected);
    });
  });
};

  describe("Empty board", function() {
    verifyConflictTypes([''], [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  describe("Board with row conflicts", function() {
    verifyConflictTypes(['row', 'rooks', 'queens'], [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  describe("Board with col conflicts", function() {
    verifyConflictTypes(['col', 'rooks', 'queens'], [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });
  
  describe("Board with easy major diagonal conflict", function() {
    verifyConflictTypes(['majorDiagonal', 'queens'], [
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 0]
    ]);
  });

  describe("Board with hard major diagonal conflict", function() {
    verifyConflictTypes(['majorDiagonal', 'queens'], [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [0, 1, 0, 0]
    ]);
  });
  
  describe("Board with easy minor diagonal conflict", function() {
    verifyConflictTypes(['minorDiagonal', 'queens'], [
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  describe("Board with hard minor diagonal conflict", function() {
    verifyConflictTypes(['minorDiagonal', 'queens'], [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 1, 0]
    ]);
  });
});
