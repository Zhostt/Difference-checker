import compareObjects from '../src/index.js';

const file1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};

const file2 = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

const expectedBasic = `{
 - follow: false
   host: hexlet.io
 - proxy: 123.234.53.22
 - timeout: 50
 + timeout: 20
 + verbose: true
}`;

const expectedOneEmpty = `{
 - follow: false
 - host: hexlet.io
 - proxy: 123.234.53.22
 - timeout: 50
}`;

test('basic obj compare', () => {
  expect(compareObjects(file1, file2)).toEqual(expectedBasic);
});

test('empty obj compare', () => {
  expect(compareObjects({}, {})).toEqual('{}');
});

test('one empty compare', () => {
  expect(compareObjects(file1, {})).toEqual(expectedOneEmpty);
});
