var Matrix = require('./matrix');

var passed = 0,
    tests = 0,
test = function(name, bool) {
    console.log('Running test '+name+'...', bool ? 'passed.' : 'failed.', '\n');
    if(bool)
        passed++;
    tests++;
};

var A = Matrix.create([0, 0, 0, 0, 1, 0, 0, 1, 0], 3, 3);

var B = A.sub(2, 2, 1, 2);
test('sub', B.isEqual(Matrix.create([1, 0], 1, 2)));

test('match', A.match(B).isEqual(Matrix.create([0, 0, 0, 1, 0, 1], 3, 2)));

test('scalar mult', A.multiplyScalar(3).isEqual(Matrix.create([0, 0, 0, 0, 3, 0, 0, 3, 0], 3, 3)));

test('square transpose', A.transpose().isEqual(Matrix.create([0, 0, 0, 0, 3, 3, 0, 0, 0], 3, 3)));

var C = Matrix.create([5, -1, 2, -8, 1, 7], 2, 3);
test('rect transpose', C.transpose().isEqual(Matrix.create([5, -8, -1, 1, 2, 7], 3, 2)));

console.log('Visual test:');
console.log(A.toString());

console.log('\nPassed '+passed+'/'+tests+' tests.\n');
