var timetableController = (function () {

    var Timetable = function (id, day, color, description, hour) {
        this.id = id;
        this.day = day;
        this.color = color;
        this.description = description;
        this.hour = hour;
    };

    var data = {
        allItems: {
            mon: [],
            tue: [],
            wed: [],
            thur: [],
            fri: [],
            sat: [],
            sun: []
        },
    };

    var duplicate = false;


    return {
        addItem: function (day, color, description, hour) {
            var newItem;

            if (data.allItems[day].length > 0) {
                ID = data.allItems[day][data.allItems[day].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Check if time available
            data.allItems[day].forEach(function (item) {
                if (item.hour.value === hour.value) {
                    alert("Please select a valid time slot!");
                    duplicate = true;
                }
            });

            // Check if the time slot is already used
            if (!duplicate) {
                newItem = new Timetable(ID, day, color, description, hour);
                data.allItems[day].push(newItem);
            }

            duplicate = false;

            return newItem;

        },
        testing: function () {
            console.log(data);
        }
    };

})();


var UIController = (function () {

    var DOMStrings = {
        inputDay: '.add__day',
        inputColor: '.add__color',
        inputDescription: '.add__description',
        inputHour: '.add__hour',
        inputBtn: '.add__btn',
        // Add one for each day
        mondayContainer: '.monday__list',
        tuesdayContainer: '.tuesday__list',
        wednesdayContainer: '.wednesday__list',
        thursdayContainer: '.thursday__list',
        fridayContainer: '.friday__list',
        saturdayContainer: '.saturday__list',
        sundayContainer: '.sunday__list'
    };


    function getElementFromDay(day) {
        switch (day) {
            case "mon":
                return DOMStrings.mondayContainer;
            case "tue":
                return DOMStrings.tuesdayContainer;
            case "wed":
                return DOMStrings.wednesdayContainer;
            case "thur":
                return DOMStrings.thursdayContainer;
            case "fri":
                return DOMStrings.fridayContainer;
            case "sat":
                return DOMStrings.saturdayContainer;
            case "sun":
                return DOMStrings.sundayContainer;
            default:
                alert("Error please refresh!");
        }
    }

    return {
        getInput: function () {
            return {
                day: document.querySelector(DOMStrings.inputDay).value, // Will be mon-sun
                color: document.querySelector(DOMStrings.inputColor).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                hour: document.querySelector(DOMStrings.inputHour).options[document.querySelector(DOMStrings.inputHour).selectedIndex].text,
                hourValue: document.querySelector(DOMStrings.inputHour).value
            };
        },

        addListItem: function (obj) {

            var html, newHtml, element;

            element = getElementFromDay(obj.day);
            // Create HTML String with placeholder text
            html = '<div value="%value%" class="item clearfix" id="%id%"><div class="item__hour">%hour%</div><div class="right clearfix"><div class="item__description">%description%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            // Replace the placehodler text with some actual data
            newHtml = html.replace('%id%', obj.day + "-" + obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%hour%', obj.hour.text);
            newHtml = newHtml.replace('%value%', obj.hour.value);
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            document.querySelector('#' + obj.day + '-' + obj.id).style.backgroundColor = obj.color;

            var p = document.querySelector('#' + obj.day + '__list');
            if (p) {
                Array.prototype.slice.call(p.children)
                    .map(function (x) {
                        return p.removeChild(x);
                    })
                    .sort(function (x, y) {
                        return parseInt(x.attributes[0].value) === parseInt(y.attributes[0].value)
                            ? 0 : (parseInt(x.attributes[0].value) > parseInt(y.attributes[0].value) ? 1 : -1)
                    })
                    .forEach(function (x) {
                        p.appendChild(x);
                    });
            }

        },
        clearFields: function () {
            var field;
            field = document.querySelector(DOMStrings.inputDescription);

            field.value = "";


            field.focus();
        },
        getDOMStrings: function () {
            return DOMStrings;
        }

    };
})();


var controller = (function (timetableCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector('.add__color').addEventListener('change', function (e) {
            document.querySelector('.add__color').style.backgroundColor = e.target.value;
        });

    };


    var ctrlAddItem = function () {
        // !. Get the filled input data
        var input = UICtrl.getInput();
        // 2. Add the item to the timetable controller
        var hourData = {
            text: input.hour,
            value: input.hourValue
        };
        input.hour = hourData;
        var newItem = timetableCtrl.addItem(input.day, input.color, input.description, input.hour);
        // 3. Add the item to the ui
        UICtrl.addListItem(newItem);
        // 4. Clear the fields
        UICtrl.clearFields();

    };

    return {
        init: function () {
            console.log('Application has started.');
            setupEventListeners();
        }
    }

})(timetableController, UIController);

controller.init();


/********************************************
 This is for soring the array to display when adding new times
 **********************************************************/

// var p = document.getElementById('mylist');
// Array.prototype.slice.call(p.children)
//   .map(function (x) { return p.removeChild(x); })
//   .sort(function (x, y) { return /* your sort logic, compare x and y here */; })
//   .forEach(function (x) { p.appendChild(x); });
//
// var list = document.getElementById('mylist');
//
// var items = list.childNodes;
// var itemsArr = [];
// for (var i in items) {
//     if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
//         itemsArr.push(items[i]);
//     }
// }
//
// itemsArr.sort(function(a, b) {
//   return a.innerHTML == b.innerHTML
//           ? 0
//           : (a.innerHTML > b.innerHTML ? 1 : -1);
// });
//
// for (i = 0; i < itemsArr.length; ++i) {
//   list.appendChild(itemsArr[i]);
// }