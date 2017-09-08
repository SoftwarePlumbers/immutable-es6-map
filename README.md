# ![Software Plumbers](http://docs.softwareplumbers.com/common/img/SquareIdent-160.png) Immutable Map

Immutable map object maximally compatible with (and backed by) an ES6 Map

## Summary

```javascript
const TEST_DATA = ;

let map1 = new ImmutableMap([ 
	[ 'foo', 'bar' ], 
	[ 'dinkum', 'thinkum' ], 
	[ 'wyoming', 'knot' ], 
	[ 'dick', 'seaton' ] 
]);

// chain update operations
let map2 = map1.set('hercules', 'morse').delete('dinkum').set('dick','grayson');

// map1 is unchanged

```

The map API is the same as for the ES6 map with two notable exceptions; the clear() method is missing and the delete(key) operation returns a copy of the map (with item removed) rather than a true/false indicator of whether the remove was susccessful. The set operation also returns a copy of the map operated on (with the update applied) rather than a reference to the original map.

For the latest API documentation see [The Software Plumbers Site](http://docs.softwareplumbers.com/immutable-es6-map/master)
