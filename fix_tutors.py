filepath = r'd:\My Projects\LearnLoop-AI\index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the garbled characters
text = text.replace('€˜‘ Arjun S. — 4.9⭐★', '🎓 Arjun S. — 4.9⭐')
text = text.replace('€˜‘ Priya M. — 4.8⭐★', '🎓 Priya M. — 4.8⭐')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print("Garbled text corrected.")
