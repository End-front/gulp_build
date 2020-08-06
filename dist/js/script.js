if (typeof Promise === "undefined") {
(function () {
	function Promise(resolver) {
		var
		self = this,
		then = self.then = function () {
			return Promise.prototype.then.apply(self, arguments);
		};

		then.fulfilled = [];
		then.rejected = [];

		function timeout(state, object) {
			then.state = 'pending';

			if (then[state].length) setTimeout(function () {
				timeout(state, then.value = then[state].shift().call(self, object));
			}, 0);
			else then.state = state;
		}

		then.fulfill = function (object) {
			timeout('fulfilled', object);
		};

		then.reject = function (object) {
			timeout('rejected', object);
		};

		resolver.call(self, then.fulfill, then.reject);

		return self;
	}

	Promise.prototype = {
		'constructor': Promise,
		'then': function (onFulfilled, onRejected) {
			if (onFulfilled) this.then.fulfilled.push(onFulfilled);
			if (onRejected) this.then.rejected.push(onRejected);

			if (this.then.state === 'fulfilled') this.then.fulfill(this.then.value);

			return this;
		},
		'catch': function (onRejected) {
			if (onRejected) this.then.rejected.push(onRejected);

			return this;
		}
	};

	Promise.all = function () {
		var
		args = Array.prototype.slice.call(arguments),
		countdown = args.length;

		function process(promise, fulfill, reject) {
			promise.then(function onfulfilled(value) {
				if (promise.then.fulfilled.length > 1) promise.then(onfulfilled);
				else if (!--countdown) fulfill(value);

				return value;
			}, function (value) {
				reject(value);
			});
		}

		return new Promise(function (fulfill, reject) {
			while (args.length) process(args.shift(), fulfill, reject);
		});
	};

	window.Promise = Promise;
})();

}
if (!Array.prototype.forEach) {
// Array.prototype.forEach
Array.prototype.forEach = function forEach(callback, scope) {
	for (var array = this, index = 0, length = array.length; index < length; ++index) {
		callback.call(scope || window, array[index], index, array);
	}
};

}
if (!Array.prototype.map) {
// Array.prototype.map
Array.prototype.map = function map(callback, scope) {
	for (var array = this, arrayB = [], index = 0, length = array.length, element; index < length; ++index) {
		element = array[index];

		arrayB.push(callback.call(scope || window, array[index], index, array));
	}

	return arrayB;
};

}

var csv_file_API_1 = "./UsersSample.csv";
var csv_file_API_2 = "./team2.csv";
var APIs_array = [csv_file_API_1, csv_file_API_2];

// Выполняем некие действия при загрузке страницы
$(document).ready(function () {

    $("#headerTitle").hide(300).show(1500);

    makeAPICalls();

}); // end: document.ready()

function makeAPICalls() {

    // Массив, который будет содержать обращения к API
    var calls = [];

    // Передача API для CSV-файлов коллбэкам
    APIs_array.forEach(function (csv_file_API) {

        // Помещение промиса в массив вызовов
        calls.push(new Promise(function (resolve, reject) {

            // Выполнение вызова API с использованием AJAX
            $.ajax({

                type: "GET",

                url: csv_file_API,

                dataType: "text",

                cache: false,

                error: function (e) {
                    alert("An error occurred while processing API calls");
                    console.log("API call Failed: ", e);
                    reject(e);
                },

                success: function (data) {

                    var jsonData = $.csv.toObjects(data);

                    console.log(jsonData);

                    resolve(jsonData);
                } // end: обработка данных при успешном обращении к API

            }); // end: AJAX-вызов

        })); // end: добавление данных при вызове промисов

    }); // end: обход массива API


    // После завершения всех обращений к API
    Promise.all(calls).then(function (data) {

        // объединим все данные
        var flatData = data.map(function (item) {
            return item;
        }).flat();

        console.log(flatData);

        dislayData(flatData);
    });

}

function dislayData(data) {
    
    $.each(data, function (index, value) {

        $('#showCSV').append(

            '<li class="list-group-item d-flex justify-content-between align-items-center">' +

                '<span style="width: 15%; font-size: 1rem; font-weight: bold; color: #37474F">' +
                    value['FIRST NAME'] +
                '</span>' +

                '<span style="width: 15%; font-size: 1rem;  color: #37474F">' +
                    value['LAST NAME'] +
                '</span>' +

                '<span class="badge warning-color-dark badge-pill">' +
                    value['PHONE NUMBER'] +
                '</span>' +

                '<span class="badge success-color-dark badge-pill">' +
                    value['EMAIL ADDRESS'] +
                '</span>' +

                '<span class="badge badge-primary badge-pill">' +
                    value.CITY +
                '</span>' +

                '<span class="badge badge-primary badge-pill">' +
                    value.STATE +
                '</span>' +

            '</li>'
        );

    });
};
