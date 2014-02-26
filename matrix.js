module.exports = Matrix = {

    // Add two matrices, optionally mutating the original matrix.
    add:function(operand, mutate) {
        this.isEqualSize(operand, true);
        return this.clone().forEach(function(a, i, j, k) {
            this.arr[k] = a + operand.arr[k];
        });
    },

    // Compute the logical AND of two matrices.
    and:function(operand) {
        this.isEqualSize(operand, true);
        return this.clone().forEach(function(a, i, j, k) {
            this.arr[k] = (a === 1 && operand.arr[k] === 1) ? 1 : 0;
        });
    },

    // Create a clone of a matrix.
    // Prevents passing by reference of a matrix.
    clone:function() {
        return Matrix.create(this.arr.slice(), this.m, this.n);
    },

    // Create a matrix with m rows and n columns from a source array.
    create:function(arr, m, n) {
        if(arr.length !== m * n)
            throw new Error('Source array has an invalid size.');

        var self = Object.create(this);
        Object.defineProperties(self, {
            arr:{
                writable:true,
                value:arr
            },
            m:{
                writable:true,
                value:m
            },
            n:{
                writable:true,
                value:n
            }
        });
        return self;
    },

    // Loop through each entry of the matrix.
    forEach:function(fn) {
        var i = 1, j = 1;
        for(var k = 0; k < this.arr.length; k++) {
            fn.call(this, this.arr[k], i, j, k);

            if(j++ === this.n) {
                i++;
                j = 1;
            };
        };
        return this;
    },

    // Retrieve the value of the entry at the specified row i and column j.
    getEntry:function(i, j) {
        var k = (i-1) * this.n + (j-1);
        if(k >= this.arr.length)
            throw new Error('Attempted to get entry outside the matrix.');

        return this.arr[k];
    },

    // Check if two matrices are equal.
    isEqual:function(matrix) {
        if(this.m !== matrix.m || this.n !== matrix.n)
            return false;

        for(var k = 0; k < this.arr.length; k++)
            if(this.arr[k] !== matrix.arr[k])
                return false;

        return true;
    },

    // Check if two matrices have equal size.
    // If throwError is true, the function throws an error rather than returning a boolean.
    // throwError defauls to false
    isEqualSize:function(operand, throwError) {
        var bool = (this.m !== operand.m || this.n !== operand.n);
        if(!bool && (typeof throwError === 'boolean' && throwError))
            throw new Error('Operand matrix has invalid size.');

        return bool;
    },

    match:function(operand) {
        if(!(this.m >= operand.m && this.n >= operand.n))
            throw new Error('Source matrix must be at least the size of the operand matrix.');

        var i = 1,
            j = 1,
            newM = this.m - operand.m + 1,
            newN = this.n - operand.n + 1,
            matrix = Matrix.create(new Array(newM*newN), newM, newN);

        for(var k = 0, klen = newM*newN; k < klen; k++) {
            matrix.arr[k] = this.sub(i, j, operand.m, operand.n).isEqual(operand) ? 1 : 0;

            if(j++ === newN) {
                i++;
                j = 1;
            };
        };
        return matrix;
    },

    multiply:function(operand) {
    },

    multiplyScalar:function(scalar) {
        return this.forEach(function(a, i, j, k) {
            this.arr[k] = a * scalar;
        });
    },

    // Compute the logical OR of two matrices.
    or:function(operand) {
        this.isEqualSize(operand, true);
        return this.clone().forEach(function(a, i, j) {
            this.setEntry(i, j, (a === 1 || operand.getEntry(i, j) === 1) ? 1 : 0);
        });
    },

    // Set the value of the entry at the specified row i and column j to val.
    setEntry:function(i, j, a) {
        var k = (i-1) * this.n + (j-1);
        if(k >= this.arr.length)
            throw new Error('Attempted to set entry outside the matrix.');

        this.arr[k] = a;
    },

    // Extract a submatrix from the source matrix.
    sub:function(offsetI, offsetJ, newM, newN) {
        if(offsetI + newM - 1 > this.m || offsetJ + newN - 1 > this.n)
            throw new Error('Submatrix bounds are outside the source matrix.');

        var sub = [];
        this.forEach(function(a, i, j, k) {
            if((offsetI <= i && i < offsetI + newM) && (offsetJ <= j && j < offsetJ + newN))
                sub.push(this.arr[k]);
        });
        return Matrix.create(sub, newM, newN);
    },

    // Print the contents of the matrix in a human-readable format.
    toString:function() {
        var k = this.arr.length,
            str = '';
        while(k--) {
            str = ' ' + this.arr[k] + str;
            if(k % this.n === 0 && k !== 0)
                str = '\n' + str;
        };
        return str;
    },

    // Transpose the matrix.
    transpose:function() {
        var arr = new Array(this.arr.length);
        this.forEach(function(a, i, j, k) {
            arr[(j-1) * this.m + (i-1)] = a;
        });
        this.arr = arr;
        this.m = this.n;
        this.n = this.arr.length / this.m;
        return this;
    }

};
