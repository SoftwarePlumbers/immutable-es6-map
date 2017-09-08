const ImmutableMap = require( '../src/map');
const expect = require('chai').expect;
const debug = require('debug')('immutable-es6-map~tests');

function withDebug(a) { debug(a); return a; }

const TEST_DATA = [ [ 'foo', 'bar' ], [ 'dinkum', 'thinkum'], ['wyoming','knot'], ['dick','seaton'] ];


describe('ImmutableMap', () => {

    it('supports basic map fuctions', () => {
       	let map = new ImmutableMap(TEST_DATA);
        expect(Array.from(map.entries())).to.deep.equal(TEST_DATA);
        expect(Array.from(map.values())).to.deep.equal(TEST_DATA.map(([k,v])=>v));
        expect(Array.from(map.keys())).to.deep.equal(TEST_DATA.map(([k,v])=>k));
        TEST_DATA.forEach(([k,v])=>expect(map.get(k)).to.equal(v));
        TEST_DATA.forEach(([k,v])=>expect(map.has(k)).to.be.true);
        expect(map.get('slartibartfast')).to.be.undefined;
        expect(map.has('slartibartfast')).to.be.false;
        let res = [];
        map.forEach(v=>res.push(v));
        expect(res).to.have.members(TEST_DATA.map(([k,v])=>v));
        let count = 0;
        for (entry of map) {
        	count++;
        }
        expect(count).to.equal(4);
    });

    it('supports immutable set', () => {
    	let map1 = new ImmutableMap(TEST_DATA);
    	let map2 = map1.set('dinkum','cobber');
    	expect(map1.get('dinkum')).to.equal('thinkum');
    	expect(map2.get('dinkum')).to.equal('cobber');
    });

    it('supports immutable delete', () => {
    	let map1 = new ImmutableMap(TEST_DATA);
    	let map2 = map1.delete('dinkum');
    	expect(map1.get('dinkum')).to.equal('thinkum');
    	expect(map2.get('dinkum')).to.be.undefined;
    });

    it('supports operation chain', () => {
    	let map1 = new ImmutableMap(TEST_DATA);
    	let map2 = map1.set('hercules', 'morse').delete('dinkum').set('dick','grayson');
        expect(Array.from(map1.entries())).to.deep.equal(TEST_DATA);
    	expect(map2.get('dinkum')).to.be.undefined;
    	expect(map2.get('hercules')).to.equal('morse');
    	expect(map2.get('dick')).to.equal('grayson');
    });

    it('does not build intermediate maps in chain', () => {
    	let map1 = new ImmutableMap(TEST_DATA);
    	let map2 = map1.set('hercules', 'morse');
    	let map3 = map2.delete('dinkum');
    	let map4 = map3.set('dick','grayson');
        expect(Array.from(map1.entries())).to.deep.equal(TEST_DATA);
    	expect(map4.get('dinkum')).to.be.undefined;
    	expect(map4.get('hercules')).to.equal('morse');
    	expect(map4.get('dick')).to.equal('grayson');
    	expect(map2._data).to.be.undefined;
    	expect(map3._data).to.be.undefined;
    });
});