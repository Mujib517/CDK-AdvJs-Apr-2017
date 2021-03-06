var products = [
	{id : 5, name : 'Pen', cost : 45, units : 20, category : 'stationary'},
	{id : 8, name : 'Len', cost : 40, units : 10, category : 'grocery'},
	{id : 2, name : 'Pencil', cost : 70, units : 50, category : 'stationary'},
	{id : 6, name : 'Rice', cost : 40, units : 60, category : 'grocery'},
	{id : 9, name : 'Marker', cost : 60, units : 90, category : 'stationary'},
	{id : 7, name : 'Hen', cost : 50, units : 40, category : 'live-stock'}
]

/*
sort
filter
any
all
groupBy
min
max
sum
aggregate
*/

function describe(title, fn){
	console.group(title);
	fn();
	console.groupEnd();
}

describe('Default List', function(){
	console.table(products);
});

describe('Sort', function(){

	describe("Default sort", function(){
		function sort(){
			for(var i = 0; i < products.length-1; i++)
				for(var j = i + 1; j < products.length; j++)
					if (products[i].id > products[j].id){
						var temp = products[i];
						products[i] = products[j];
						products[j] = temp;
					}
		}
		sort();
		console.table(products);
	});

	//work for both attrName & comparerFn

	function sort(list, comparer){
		var comparerFn = null;
		if (typeof comparer === 'string'){
			comparerFn = function(item1, item2){
				if (item1[comparer] > item2[comparer]) return 1;
				if (item1[comparer] < item2[comparer]) return -1;
				return 0;
			}
		} else if (typeof comparer === 'function'){
			comparerFn = comparer;
		} else {
			comparerFn = function(){ return 0; };
		}
		for(var i = 0; i < list.length-1; i++)
			for(var j = i + 1; j < list.length; j++)
				if (comparerFn(list[i], list[j]) > 0 ){
					var temp = list[i];
					list[i] = list[j];
					list[j] = temp;
				}
	}
	describe("Any list by any attribute", function(){
		/*function sort(list, attrName){
			for(var i = 0; i < list.length-1; i++)
				for(var j = i + 1; j < list.length; j++)
					if (list[i][attrName] > list[j][attrName]){
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
		}*/
		describe("Products by cost", function(){
			sort(products, "cost");
			console.table(products);
		});

		describe("Products by units", function(){
			sort(products, "units");
			console.table(products);
		})
	})

	describe("Any list by any comparison", function(){
		/*function sort(list, comparerFn){
			for(var i = 0; i < list.length-1; i++)
				for(var j = i + 1; j < list.length; j++)
					if (comparerFn(list[i], list[j]) > 0 ){
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
		}*/
		function getDescendingComparer(comparerFn){
			return function(){
				return comparerFn.apply(this, arguments) * -1;
			}
		}
		var productComparerByValue = function(p1, p2){
			var p1Value = p1.cost * p1.units,
				p2Value = p2.cost * p2.units;
			if (p1Value < p2Value) return -1;
			if (p1Value === p2Value) return 0;
			return 1;
		}
		describe("Products by value [cost * units] ", function(){
			sort(products, productComparerByValue);
			console.table(products);
		});
		describe("Products by value [cost * units] in descending", function(){
			
			/*var productComparerByValueDescending = function(p1, p2){
				return productComparerByValue(p1, p2) * -1;
			}*/

			var productComparerByValueDescending = getDescendingComparer(productComparerByValue);

			sort(products, productComparerByValueDescending);
			console.table(products);
		});
	});
	
});

describe("Filter", function(){
	describe('Default Filter [stationary products]', function(){
		function filterStationaryProducts(){
			var result = [];
			for(var i=0; i < products.length; i++)
				if (products[i].category === 'stationary')
					result.push(products[i]);
			return result;
		}
		var stationaryProducts = filterStationaryProducts();
		console.table(stationaryProducts);
	});

	describe("Any list by any criteria", function(){
		function filter(list, criteriaFn){
			var result = [];
			for(var i=0; i < list.length; i++)
				if (criteriaFn(list[i]))
					result.push(list[i]);
			return result;
		};

		function negate(criteriaFn){
			return function(){
				return !criteriaFn.apply(this, arguments);
			}	
		}

		describe("Filter products by category", function(){
			var stationaryProductCriteria = function(product){
				return product.category === 'stationary';
			};

			/*var nonStationaryProductCriteria = function(product){
				return !stationaryProductCriteria(product);
			};*/
			var nonStationaryProductCriteria = negate(stationaryProductCriteria);

			describe("All stationary products", function(){
				var stationaryProducts  = filter(products, stationaryProductCriteria);
				console.table(stationaryProducts);
			});
			describe('All NON stationary products', function(){
				var nonStaionaryProducts = filter(products, nonStationaryProductCriteria);
				console.table(nonStaionaryProducts);
			});
		});

		describe("Filter products by cost", function(){
			var costlyProductCriteria = function(product){
				return product.cost > 50;
			};
			/*var affordableProductCriteria = function(product){
				return !costlyProductCriteria(product);
			}*/
			var affordableProductCriteria = negate(costlyProductCriteria);

			describe("All costly products", function(){
				var costlyProducts = filter(products, costlyProductCriteria);
				console.table(costlyProducts);
			})
			describe("All affordable products", function(){
				var affordableProducts = filter(products, affordableProductCriteria);
				console.table(affordableProducts);
			});
		});
	});
});

describe('groupBy', function(){
	function groupBy(list, keySelectorFn){
		var result = {};
		for(var i=0; i < list.length; i++){
			var key = keySelectorFn(list[i]);
			result[key] = result[key] || [];
			result[key].push(list[i]);
		}
		return result;
	}

	function printGroup(groupedObj){
		for(var key in groupedObj)
			describe('Key - [' + key + ']', function(){
				console.table(groupedObj[key]);
			});
	}
	describe("products by category", function(){
		var categoryKeySelector = function(product){
			return product.category;
		};
		var productsByCategory = groupBy(products, categoryKeySelector);
		printGroup(productsByCategory);
	});

	describe("products by cost", function(){
		var costKeySelector = function(product){
			return product.cost < 50 ? 'affordable' : 'costly';
		};
		var productsByCost = groupBy(products, costKeySelector);
		printGroup(productsByCost);
	});
});



