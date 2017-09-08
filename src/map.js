
const debug = require('debug')('immutable-es6-map');

/** Abstract map provides most map functions.
 *
 * Map API is as close as possible to the vanilla ES6 Map object. However, the clear() function is omitted, 
 * as clearly (ba-dum-tsh) that method makes no sense on an immutable object. 'delete' is also modified to
 * return a copy of the original map (with element deleted) rather than 'true' or 'false' as provided in the
 * vanilla ES6 map. 
 *
 */
class AbstractMap {

	/** Get an iterator over map entries */
	entries() {
		debug('entries', this.data);
		return this.data.entries();
	}

	/** Execute a function for each mapped value
 	 * @param func {Function} function to execute
	 */
	forEach(func) {
		this.data.forEach(func);
	}

	/** Get the value for a given key
	*
	* @param key to look for
	* @returns mapped value, or undefined
	*/
	get(key) {
		return this.data.get(key);
	}

	/** Check to see if a given key is stored in the map
	*
	* @param key to look for
	* @returns true if map contains the given key
	*/
	has(key) {
		return this.data.has(key);
	}

	/** Get an iterator over mapped values */
	values() {
		return this.data.values();
	}

	/** Get an iterator over mapped keys */
	keys() {
		return this.data.keys();
	}

	/** Set a value for a key.
	*
	* A lazy copy is implemented; the map data will not actually be copied until an 
	* attempt is made to read it.
	*
	* @param key for value
	* @param value value to store for key
	* @returns a copy of this map with the new key/value mapping included
	*/
	set(key, value) {
		return new LazyMap(() => this.builder().set(key,value));
	}

	/** Remove the value stored for a key.
	*
	* A lazy copy is implemented; the map data will not actually be copied until an 
	* attempt is made to read it.
	*
	* @param key to remove
	* @returns a copy of this map with the specified key/value mapping removed
	*/
	delete(key) {
		return new LazyMap(() => { let copy = this.builder(); copy.delete(key); return copy; });
	}

	/** Get an iterator over key/value pairs
	*/
	[Symbol.iterator]() {
		return this.data[Symbol.iterator]();
	}
}

/** Immutable Map extends AbstractMap to wrap an ES6 mutable map
 */
class ImmutableMap extends AbstractMap {

	/** Constructor
	*
	* If a map is passed in, simply wraps that map (so the resulting immutable map is basically
	* just a view on the parameter map). Otherwise, parameter is assumed to be an iterable over
	* key/value pairs (i.e. [[k,v]...])
	*
	* @param data Iterable over key/value pairs, Map, nothing (defauts to empty map)
	*/
	constructor(data = new Map()) {
		debug('ImmutableMap.constructor', data);
		super();

		if (data instanceof Map) 
			this.data = data;
		else 
			this.data = new Map(data);
	}

	/** Builder creates a mutable map as a copy of this map.
	*
	* Builder is invoked by the set and delete operations of AbstractMap to create a mutable map for update.
	*/
	builder() { return new Map(this.data); }
}

/** LazyMap implemnents an lazily constructed mutable map.
*
*/
class LazyMap extends AbstractMap {

	/** Constructor
	*
	* @param builder {Function} a function that builds a mutuable map to back this immutable map.
	*/
	constructor(builder) {
		super();
		this.builder = builder;
	}

	/** Accessor to get underlying map data
	*
	* if builder has not already been invoked, invoke it and cache the result. 
	*
	* @return the cached result of invoking builder.
	*/
	get data() {
		if (!this._data) { 
			this._data = this.builder();
			this.builder = () => new Map(this._data); 
		}
		return this._data; 
	}
}

module.exports = ImmutableMap;