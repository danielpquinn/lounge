
// Item controller

// Dependencies

var Item = require('../models/item');

// Constructor

function ItemController() {}

// Create an item

ItemController.createItem = function (user, name, description) {
  var item;

  // Must be admin to create an item
  
  if (!user || user.role !== 'admin') { throw new Error('Access denied'); }

  // Make sure all arguments are present
  
  if (!name || !description) { throw new Error('Must supply name and description arguments'); }

  item = new Item({
    name: name,
    description: description
  });

  return item.saveAsync()
    .then(function () {

      // Send item created message back
      
      return {
        command: 'createItem',
        text: 'Successfully created item ' + item.name
      };
    });
};

// Remove an item

ItemController.removeItem = function (user, name) {

  // Must be admin to remove an item
  
  if (!user || user.role !== 'admin') { throw new Error('Access denied'); }

  // Make sure all arguments are present
  
  if (!name) { throw new Error('Must supply name argument'); }

  // Look up item by name
  
  return Item.findOneAsync({ name: name })
    .then(function (item) {

      // Throw error if no item found

      if (!item) { throw new Error('Could not find item with name ' + name); }

      // Remove item

      return item.removeAsync();
    })
    .then(function () {

      // Send success message

      return {
        command: 'removeItem',
        text: 'Removed item ' + name
      };
    });
};

// Exports

module.exports = ItemController;