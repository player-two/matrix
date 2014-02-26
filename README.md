# Matrix Math library in JS

This is another personal exercise in library creation that may be useful for an upcoming project.

The library stores each matrix as a one-dimensional array for simplicity, so the size of the matrix is handled as metadata.

Some general notes:
 * Many of the variables are named following the convention of how matrix math is "usually" taught.
 * A matrix has size m by n, where m is the number of rows, and n is the number of columns.
 * Each entry of a matrix, a, is located at row i and column j.
 * Columns and rows have one-based indices (the top-left element is at i=1, j=1).

## Core

#### create(arr, m, n)

Create a new matrix from a source array with m rows and n columns. The new matrix is returned.

```javascript
var matrix = Matrix.create([1, 2, 3, 4, 5, 6, 7, 8], 2, 4);
/*
 1 2 3 4
 5 6 7 8
*/

matrix.m;   // returns 2
matrix.n;   // returns 4

/*
Some extra indenting can make the resultant matrix more clear.
var matrix = Matrix.create([
    1, 2, 3, 4,
    5, 6, 7, 8
], 2, 4);
*/
```

#### clone()

Clones a matrix. This method should be used before calling function that mutates the matrix if the orinal matrix is needed later.

#### forEach(fn)

Loop through all the entries of the matrix. The callback function, fn, has the this keyword bound to the matrix object and is invoked as fn(a<sub>i,j</sub>, i, j, k), where k is the index of the array for the current matrix entry.

The array index is provided for performance. When looping through large matrices, the cost of repeatedly caluclating k from i and j, which is done in the getEntry() and setEntry() methods, can take around 10x longer. Instead, use an assignment to the array.

```javascript
// Let's increment each entry of the matrix.

// Use this:
matrix.forEach(function(a, i, j, k) {
    this.arr[k] = a++;
});

// As opposed to this:
matrix.forEach(function(a, i, j, k) {
    this.setEntry(i, j, this.getEntry(i, j)++);
});
```

The getEntry() and setEntry() methods are more geared toward single-use cases where k is unknown.

#### getEntry(i, j)

Retrieve the value of the entry at row i and column j, a<sub>i,j</sub>.

#### isEqual(matrix)

Returns a boolean indicating the equality of the two matrices. Matrices are equal if
 1. they have the same number of rows and columns - m<sub>A</sub> === m<sub>B</sub> && n<sub>A</sub> === n<sub>B</sub>
 2. each entry is equal - a<sub>i,j</sub> === b<sub>i,j</sub>

#### setEntry(i, j, val)

Set the value of the entry at row i and column j, a<sub>i,j</sub> = val.

#### sub(offsetI, offsetJ, newM, newN)

Extract a submatrix from the source matrix. The submatrix is returned.

```javascript
var sub = matrix.sub(1, 2, 1, 3);
/*
 1 2 3 4
 5 6 7 8

   to

 2 3 4
*/
```

#### toString()

Returns a string with the contents of the matrix. The string is formatted with linebreaks (\n) and spaces to be more readable.


## Binary Operations

All matrices undergoing binary operations are expected to be binary matrices. That is, all their entries are equal to zero or one. Also, the operand argument must be a matrix object.

#### and(operand)

Compute the logical AND of the matrix and the operand. A new binary matrix is returned.

#### match(operand)

Search for the source matrix for submatrices equal to the operand matrix. Returns a new matrix with a one everywhere a match was found.
 * Matches are indexed by the top-left entry, a<sub>1,1</sub>.
 * The returned matrix has size m<sub>A</sub>-m<sub>B</sub>+1 by n<sub>A</sub>-n<sub>B</sub>+1.

```javascript
var bin1 = Matrix.create([
    0, 0, 1, 0,
    0, 1, 0, 0, 
    1, 0, 0, 1,
    0, 0, 0, 1
], 4, 4),
    bin2 = Matrix.create([
    0, 0,
    0, 1
], 2, 2);

bin1.match(bin2); /* returns the matrix
    1 0 0
    0 0 1
    0 0 0
*/
```

#### or(operand)

Compute the logical OR of the matrix and the operand. A new binary matrix is returned.


## Arithmetic Operations

#### multiply(operand)

Given a m by n matrix A and a n by p matrix B, multiply A and B and return the new m by p matrix.

#### multiplyScalar(scalar)

Multiply each entry of the matrix by the scalar, scalar*A. This method **mutates** the matrix and then returns it.

#### transpose()

Compute the transpose of the matrix, A<sup>T</sup>. This method **mutates** the matrix and then returns it.

