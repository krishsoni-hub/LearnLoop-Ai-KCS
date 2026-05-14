filepath = r'd:\My Projects\LearnLoop-AI\index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the exact substring with an empty string
text = text.replace(' <a href="#">Blog</a>', '')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print("Blog link removed.")
