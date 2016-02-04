// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    rowLooperFunction: function(x) {
      var row = this.get(x);

      return _.reduce(row, function(memo, value) {
        return memo + value;
      });

    },

    hasRowConflictAt: function(rowIndex) {
      var row = this.rowLooperFunction(rowIndex);
      console.log(row);
      if (row > 1) {
        return true; // fixme
      }
    },

    // test if any rows on this board contain conflicts
    //make some kind of reference to what the conflicts are
    //rather than the matrices themselves
    hasAnyRowConflicts: function() {
      var row1 = this.rowLooperFunction(0);
      var row2 = this.rowLooperFunction(1);
      var row3 = this.rowLooperFunction(2);
      var row4 = this.rowLooperFunction(3);

      if (row1 > 1 || row2 > 1 || row3 > 1 || row4 > 1) {
        return true;
      } 
        return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    columnLooperFunction: function(column) {
      var row1 = this.get(0);
      var row2 = this.get(1);
      var row3 = this.get(2);
      var row4 = this.get(3);
      //var rows = row1 + ',' + row2 + ',' + row3 + ',' + row4;
      var holder = [];

      var columnMaker = function(column) {
        holder.push(row1[column]);
        holder.push(row2[column]);
        holder.push(row3[column]);
        holder.push(row4[column]);
      }
      columnMaker(column);

      return _.reduce(holder, function(memo, value) {
        return memo + value;
      })
    },

    hasColConflictAt: function(colIndex) {
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var column1 = this.columnLooperFunction(0);
      var column2 = this.columnLooperFunction(1);
      var column3 = this.columnLooperFunction(2);
      var column4 = this.columnLooperFunction(3);

      if (column1 > 1 || column2 > 1 || column3 > 1 || column4 > 1 ) {
        return true;
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    majorDiagonalChecker: function() {
      //if we iterate over an array, to see diagonally we +1 to the index of the array
      var diagonalHolder = [];
      //lets look at them as rows
      var row1 = this.get(0);
      var row2 = this.get(1);
      var row3 = this.get(2);
      var row4 = this.get(3);

      var diagonal1 = [row3[0], row4[1]];
      var diagonal2 = [row2[0], row3[1], row4[2]];
      var diagonal3 = [row1[0], row2[1], row3[2], row4[3]];
      var diagonal4 = [row1[1], row2[2], row3[3]];
      var diagonal5 = [row1[2], row2[3]];

      diagonalHolder.push(_.reduce(diagonal1, function(memo, value) {
        return memo + value;
      }));
      diagonalHolder.push(_.reduce(diagonal2, function(memo, value) {
        return memo + value;
      }));
      diagonalHolder.push(_.reduce(diagonal3, function(memo, value) {
        return memo + value;
      }));
      diagonalHolder.push(_.reduce(diagonal4, function(memo, value) {
        return memo + value;
      }));
      diagonalHolder.push(_.reduce(diagonal5, function(memo, value) {
        return memo + value;
      }));

      return diagonalHolder;
    },

    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var holder = [];

      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var hasDiagonal = this.majorDiagonalChecker();
      for (var i = 0; i < hasDiagonal.length; i++) {
        if (hasDiagonal[i] > 1) {
          return true;
        }
      }

      return false; // fixme
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    minorDiagonalChecker: function() {
      var diagonalHolder = [];
      //lets look at them as rows
      var row1 = this.get(0);
      var row2 = this.get(1);
      var row3 = this.get(2);
      var row4 = this.get(3);

      var diagonal1 = [row1[1], row2[0]];
      var diagonal2 = [row1[2], row2[1], row3[0]]; 
      var diagonal3 = [row1[3], row2[2], row3[1], row4[0]];
      var diagonal4 = [row2[3], row3[2], row4[1]];
      var diagonal5 = [row3[3], row4[2]];

      diagonalHolder.push(_.reduce(diagonal1, function(memo, value) {
        return memo + value;
      }));
      diagonalHolder.push(_.reduce(diagonal2, function(memo, value) {
        return memo + value;
      }));
      diagonalHolder.push(_.reduce(diagonal3, function(memo, value) {
        return memo + value;
      }));
      diagonalHolder.push(_.reduce(diagonal4, function(memo, value) {
        return memo + value;
      }));
      diagonalHolder.push(_.reduce(diagonal5, function(memo, value) {
        return memo + value;
      }));
      
      return diagonalHolder;

    },

    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {

      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var hasDiagonal = this.minorDiagonalChecker();
      for (var i = 0; i < hasDiagonal.length; i++) {
        if (hasDiagonal[i] > 1) {
          return true;
        }
      }

      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
