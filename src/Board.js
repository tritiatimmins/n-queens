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

    hasRowConflictAt: function(rowIndex) {
      var rows = this.rows();
      var chosenRow = rows[rowIndex];
      return chosenRow;
    },

    // test if any rows on this board contain conflicts
    //make some kind of reference to what the conflicts are
    //rather than the matrices themselves
    hasAnyRowConflicts: function() {
      var rows = this.rows();
      var storageArray = [];

      for (var i = 0; i < rows.length; i++) {
        var singleValue = _.reduce(rows[i], function(accumulator, value) {
          return accumulator + value;
        });
        storageArray.push(singleValue);
      }

      for (var j = 0; j < storageArray.length; j++) {
        if (storageArray[j] > 1) {
          return true;
        }
      }
        return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    /*
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
    */

    hasColConflictAt: function(colIndex) {
      var rows = this.rows();
      var column = [];

      for (var i = 0; i < rows.length; i++) {
        column.push(rows[i][colIndex]);
      };
      
      // for (var j = 0; j < column.length; j++) {
      //   if (column[j] > 1) {
      //     return true;
      //   }
      // }
      //console.log(column);
      return column; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var rows = this.rows();
      var column = [];
      //making our columns
      for (var i = 0; i < rows.length; i++) {
        column.push(this.hasColConflictAt(i));
      };

        var colinStorage = [];

      for (var i = 0; i < column.length; i++) {
        var singleValue = _.reduce(column[i], function(accumulator, value) {
          return accumulator + value;
        });
        colinStorage.push(singleValue);
      }

      for (var j = 0; j < colinStorage.length; j++) {
        if (colinStorage[j] > 1) {
          return true;
        }
      }
        return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict

    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var holder = [];

      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
     
      var rows = this.rows();
      var valueStorage = [];
    var subroutine = function(board){
        // debugger;
      for (var i = 0; i < board.length - 1; i ++) {

        for(var j = 0; j < board[i].length - 1; j++) {
          if(board[i][j] === 1){
            console.log(board[i +1][j +1])
            //console.log('this is board[i]', board[i])
           // console.log('this is board[i+1]', board[i+1]);
            if(board[i +1][j +1] === 1) {
              return true;
            }// }else{ 
            //   // console.log(board[i + 2]);
            //   if(board[i +2][j+2]){
            //   return subroutine(board[i + 2][j + 2]);
              //  }
          }
        }
      }
            // return false;
      }
        return subroutine(rows);
    },
    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {

      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      
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
