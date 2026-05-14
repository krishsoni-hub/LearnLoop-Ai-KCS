filepath = r'd:\My Projects\LearnLoop-AI\index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace these exact substrings with an empty string
text = text.replace('<li><a href="#features">Features</a></li>', '')
text = text.replace('<div class="info-stat"><span class="info-stat-num">12</span><span class="info-stat-label">Core Features</span></div>', '')
text = text.replace('<a href="#features">Features</a>', '')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print("Links and stats removed.")
