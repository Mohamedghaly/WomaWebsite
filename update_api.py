import sys

file_path = "../WomaDashboard/dashboard/js/api.js"
with open(file_path, 'r') as f:
    content = f.read()

insert_point = "static async createVariation(productId, data) {"
start_idx = content.find(insert_point)

if start_idx != -1:
    brace_count = 0
    insert_idx = -1
    for i in range(start_idx, len(content)):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                insert_idx = i + 1
                break
    
    if insert_idx != -1:
        new_method = """

    static async updateVariation(productId, variationId, data) {
        return this.request(`/products/${productId}/variations/${variationId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }"""
        new_content = content[:insert_idx] + new_method + content[insert_idx:]
        with open(file_path, 'w') as f:
            f.write(new_content)
        print("Updated api.js")
    else:
        print("Could not find end of createVariation")
else:
    print("Could not find createVariation")
