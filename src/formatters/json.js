/* planned json format:
    "group1": {nested:
         {
            "baz": "bas",
            "foo": "bar",
            "nest": {
            "key": "value"
                    }
                }
            }
*/
// node structure = {key, status, depth, value1, value2}
// statuses: removed, added, equal, modified, stringified1, stringified2

const json = (compareTree) => JSON.stringify(compareTree);

export default json;
