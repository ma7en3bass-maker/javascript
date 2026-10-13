// =====================================================
// Interactive Product Inventory & Analytics Dashboard
// Capstone Mini Project - JavaScript
// =====================================================

// Output helper: prints to the console and, in the browser page, to the output box
function out(message) {
  console.log(message);
  const box = typeof document !== "undefined" ? document.getElementById("output") : null;
  if (box) {
    box.textContent += message + "\n";
  }
}

// Formats an array like ["A", "B"] to match the expected output
function formatList(list) {
  return '["' + list.join('", "') + '"]';
}

// ---------- 2. Control flow: category badge (switch) ----------
function getCategory(price) {
  let category;
  switch (true) {
    case price < 100:
      category = "Budget";
      break;
    case price < 500:
      category = "Standard";
      break;
    default:
      category = "Premium";
  }
  return category;
}

// ---------- 1 + 2 + 3. Input, validation (if...else) and retry loop ----------
function askForProduct() {
  const MAX_ATTEMPTS = 3;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const nameInput = prompt("Enter product name:", "Monitor");
    if (nameInput === null) {
      out("Input cancelled by user.");
      break; // stop asking
    }

    const priceInput = prompt("Enter product price:", "150");
    if (priceInput === null) {
      out("Input cancelled by user.");
      break; // stop asking
    }

    // Explicit type conversion
    const name = nameInput.trim();
    const price = Number(priceInput);

    // Validation with if...else
    if (name === "") {
      out("Attempt " + attempt + ": product name is missing. Try again.");
      continue; // handle bad input, go to next attempt
    } else if (isNaN(price) || price <= 0) {
      out("Attempt " + attempt + ": price must be a positive number. Try again.");
      continue;
    } else {
      return { name: name, price: price };
    }
  }
  return null; // no valid product entered
}

// ---------- 3. Loops: search the inventory ----------
function findProductIndex(items, name) {
  let foundIndex = -1;
  for (let i = 0; i < items.length; i++) {
    if (!items[i].name) {
      continue; // skip items with a missing name
    }
    if (items[i].name.toLowerCase() === name.toLowerCase()) {
      foundIndex = i;
      break; // stop as soon as it is found
    }
  }
  return foundIndex;
}

// ---------- 4. Functions & scope ----------
// Regular function: total value of all items (variables stay local)
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

// Arrow functions with default parameters (custom tax / discount)
const applyTax = (amount, taxPercent = 10) => amount + (amount * taxPercent) / 100;
const applyDiscount = (amount, discountPercent = 5) => amount - (amount * discountPercent) / 100;

// ---------- Main program ----------
function runInventorySystem() {
  // Inventory is local to this function, so nothing outside can change it
  const inventory = [
    { name: "Laptop", price: 800 },
    { name: "Mouse", price: 25 }
  ];

  out("--- Initializing Inventory System ---");

  // 1. Data & input initialization
  const newProduct = askForProduct();

  if (newProduct === null) {
    out("No new product was added.");
  } else if (findProductIndex(inventory, newProduct.name) !== -1) {
    out('"' + newProduct.name + '" already exists in the inventory. Not added.');
  } else {
    inventory.push(newProduct);
    out('[Prompt executed: User adds "' + newProduct.name + '" at "$' + newProduct.price + '"]');
  }

  // 5. forEach: log the final inventory sheet
  out("--- Processing Inventory Roster (forEach) ---");
  inventory.forEach(function (item) {
    out("* Item: " + item.name + " ($" + item.price + ") -> Category: " + getCategory(item.price));
  });

  // 4 + 5. Financial analytics
  out("--- Financial Analytics ---");
  const totalValue = calculateTotal(inventory);
  out("Total Inventory Value: $" + totalValue);

  // filter: affordable items under $200
  const affordable = inventory.filter(item => item.price < 200);
  out("Filtered Affordable Items (Under $200): " + formatList(affordable.map(item => item.name)));

  // map: transformed report summary
  const report = inventory.map(item => item.name.toUpperCase() + ": $" + item.price);
  out("Formatted Report List: " + formatList(report));

  // Extra: custom tax and discount parameters
  out("--- Tax & Discount ---");
  out("Total with 10% tax: $" + applyTax(totalValue, 10).toFixed(2));
  out("Total after 5% discount: $" + applyDiscount(totalValue, 5).toFixed(2));
  out("Total with 18% tax and 12% discount: $" + applyDiscount(applyTax(totalValue, 18), 12).toFixed(2));
}

// In the browser the HTML button calls runInventorySystem().
// In Node (for testing) it runs straight away.
if (typeof window === "undefined") {
  runInventorySystem();
}
