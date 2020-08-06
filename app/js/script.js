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
