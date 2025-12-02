import sys

file_path = "../WomaDashboard/dashboard/js/products.js"
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add Edit Button
old_btn = """<button class="btn btn-sm btn-danger" onclick="deleteVariation('${v.id}')">Delete</button>"""
new_btn = """<button class="btn btn-sm btn-secondary" onclick="editVariation('${v.id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteVariation('${v.id}')">Delete</button>"""
content = content.replace(old_btn, new_btn)

# 2. Add editVariation function
delete_func = "async function deleteVariation(id) {"
new_funcs = """
function editVariation(id) {
    const variation = currentVariations.find(v => v.id === id);
    if (!variation) return;

    // Populate form
    document.getElementById('var-sku').value = variation.sku;
    document.getElementById('var-price-adj').value = variation.price_adjustment;
    document.getElementById('var-stock').value = variation.stock_quantity;
    document.getElementById('var-image').value = variation.image || '';

    // Clear and populate attributes
    const container = document.getElementById('attributes-container');
    container.innerHTML = '';
    if (variation.attributes) {
        Object.entries(variation.attributes).forEach(([key, value]) => {
            addAttributeField(key, value);
        });
    }

    // Show form
    document.getElementById('add-variation-form').style.display = 'block';
    document.getElementById('variation-form').dataset.mode = 'edit';
    document.getElementById('variation-form').dataset.id = id;
}

""" + delete_func

content = content.replace(delete_func, new_funcs)

# 3. Update Submit Handler
search_str = """            const data = {
                sku: document.getElementById('var-sku').value,
                price_adjustment: parseFloat(document.getElementById('var-price-adj').value) || 0,
                stock_quantity: parseInt(document.getElementById('var-stock').value) || 0,
                image: document.getElementById('var-image').value,
                attributes: attributes
            };

            await API.createVariation(currentProductForVariations.id, data);
            showSuccess('Variation created');"""

replace_str = """            const data = {
                sku: document.getElementById('var-sku').value,
                price_adjustment: parseFloat(document.getElementById('var-price-adj').value) || 0,
                stock_quantity: parseInt(document.getElementById('var-stock').value) || 0,
                image: document.getElementById('var-image').value,
                attributes: attributes,
                product: currentProductForVariations.id
            };

            const mode = document.getElementById('variation-form').dataset.mode;
            const varId = document.getElementById('variation-form').dataset.id;

            if (mode === 'edit') {
                await API.updateVariation(varId, data);
                showSuccess('Variation updated');
            } else {
                await API.createVariation(data);
                showSuccess('Variation created');
            }"""

content = content.replace(search_str, replace_str)

# 4. Reset form mode on close
close_func = "function closeAddVariationForm() {"
new_close = """function closeAddVariationForm() {
    document.getElementById('variation-form').dataset.mode = 'create';
    document.getElementById('variation-form').dataset.id = '';
"""
content = content.replace(close_func, new_close)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated products.js")
