//
// Module design pattern using IIFE's
//


// Storage Controller (LocalStorage)

// Item Controller
const ItemCtrl = (function() {
    const item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: [
            {id: 0, name: 'Steak Dinner', calories: 1200},
            {id: 3, name: 'Eggs', calories: 650},
            {id: 1, name: 'Cookie', calories: 300},
        ],
        currentItem: null,
        totalCalories: 0
    }

    // Public API
    return {
        logData: function() {
            return data;
        },
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            // ID creation
            let ID;
            if(data.items.length > 0) {
                // the ID of the last item + 1
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            calories = parseInt(calories);
            newItem = new item(ID, name, calories);

            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function() {
            data.totalCalories = data.items.reduce((total, item) => {return total += item.calories}, 0);
            return data.totalCalories;
        }
    }
})();

// UI Controller
const UICtrl = (function() {

    const UISelectors = {
        itemList: '#item-list',
        addMeal: '#btn--add-meal',
        itemForm: '#calorie-card--form',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    
    // Public API
    return {
        populateItemList: function(items) {
            let html = '';

            items.forEach(item => {
                html += `
                    <li class="mdc-list-item" id="item-${item.id}">
                        <strong>${item.name}</strong> <em>${item.calories} Calories</em>
                        <span class="mdc-list-item__meta material-icons edit-item" aria-hidden="true">info</span>
                    </li>
                `
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function() {
            return UISelectors;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // Create the li element
            const li = document.createElement('li');
            li.className = 'mdc-list-item';
            li.id = `item-${item.id}`;

            // populate content
            li.innerHTML = `
                <strong>${item.name}</strong> <em>${item.calories} Calories</em>
                <span class="mdc-list-item__meta material-icons edit-item" aria-hidden="true">info</span>
            `;

            // Insert into the list
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInputs: function() {
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
            document.querySelector(UISelectors.itemNameInput).value = '';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        }
    }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
    const loadEventListeners = function() {
        // Grab from the UICtrl API
        const UISelectors = UICtrl.getSelectors();

        // Add Item event
        document.querySelector(UISelectors.addMeal).addEventListener('click', itemAddSubmit);
    }

    const itemAddSubmit = function(e) {
        // Grab form values from UICtrl
        const input = UICtrl.getItemInput();

        // Validation
        if((input.name !== '' && input.calories !== '')) {
            // Add the item via ItemCtrl
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Update UI
            UICtrl.addListItem(newItem);
            
            // Get Totale Calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Update Total Calories
            UICtrl.showTotalCalories(totalCalories);

            // Clear the inputs
            UICtrl.clearInputs();
        }
        e.preventDefault();
    }
    
    // Public API
    return {
        init: function() {
            console.log('Initializing App...');

            const items = ItemCtrl.getItems();

            UICtrl.populateItemList(items);

            // Get Totale Calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Update Total Calories
            UICtrl.showTotalCalories(totalCalories);

            // Event Listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl);

// Initialize App
App.init();