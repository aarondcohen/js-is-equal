const { isEqual } = require('');

describe('.isEqual', function() {
	const subject = isEqual;

	const some_symbol = Symbol(1);
	class SomeClass {
		get [0]() { return 2 }
		get [1]() { return 3 }
	}

	//value vs container
	const test_cases = [
		['array - empty', () => [], true],
		['array - non-empty', () => [2, 3], true],
		['boolean - false', () => false, true],
		['boolean - true', () => true, true],
		['class - definition', () => (class {}), false],
		['class - instance', () => new SomeClass, true],
		['function', () => () => {}, false],
		['map - empty', () => new Map(), true],
		['map - non-empty', () => new Map([[0, 2], [1, 3]]), true],
		['nan', () => NaN, true],
		['null', () => null, true],
		['object - empty', () => ({}), true],
		['object - flat properties', () => ({ 0: 2, 1: 3 }), true],
		['object - nested properties', () => ({ 0: 2, 1: { a: 3 } }), true],
		['object - symbol properties', () => ({ 0: 2, [some_symbol]: 3 }), true],
		['regex - empty', () => new RegExp(), true],
		['regex - flagged', () => new RegExp('', 'g'), true],
		['regex - non-empty', () => /23/, true],
		['set - empty', () => new Set(), true],
		['set - non-empty', () => new Set([2, 3]), true],
		['string - empty', () => '', true],
		['symbol', () => Symbol('sym'), false],
		['typed array - empty', () => new Uint8Array(), true],
		['typed array - non-empty', () => Uint8Array.of(2, 3), true],
		['typed array - other empty', () => new Int8Array(), true],
		['typed array - other non-empty', () => Int8Array.of(2, 3), true],
		['undefined', () => {}, true],
		//['object - cyclic properties', () => { let a = {}; a.a=a; return a }), true],
	];

	test_cases.forEach(test_case) => {
		const [label, valueFn, is_copyable] = test_case;

		context(`for ${label}`, function() {
			it(`is equal to itself`, function() {
				const value = valueFn();
				expect(subject(value, value)).to.be.true;
			});

			if (is_copyable) {
				it(`is equal to a copy`, function() {
					expect(subject(valueFn(), valueFn())).to.be.true;
				});
			} else {
				it(`is unequal to a copy`, function() {
					expect(subject(valueFn(), valueFn())).to.be.false;
				});
			}

			it('is unequal to all other values', function() {
				test_cases
					.filter((other_case) => other_case !== test_case)
					.forEach(([other_label, otherValueFn]) =>
						expect(subject(valueFn(), otherValueFn()), other_label).to.be.false
					);
			});
		});
	});
});
