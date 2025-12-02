import sys

file_path = "../WomaDashboard/dashboard/products.html"
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace('js/api.js?v=2', 'js/api.js?v=3')
content = content.replace('js/products.js?v=2', 'js/products.js?v=3')

with open(file_path, 'w') as f:
    f.write(content)
print("Updated products.html version")
