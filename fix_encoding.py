filepath = r'd:\My Projects\LearnLoop-AI\index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace ALL mojibake patterns with clean ASCII equivalents
# Em dash patterns
text = text.replace('\u00e2\u20ac\u201c', ' -- ')  # â€"
text = text.replace('\u00e2\u20ac\u201d', ' -- ')
text = text.replace('\u00e2\u20ac\u0094', ' -- ')

# Arrow patterns  
text = text.replace('\u00e2\u20ac\u2122', ' -> ')   # â€™ (used as arrow)
text = text.replace('\u00e2\u20ac ', ' -> ')

# Quotes
text = text.replace('\u00e2\u20ac\u0153', '"')
text = text.replace('\u00e2\u20ac\u009d', '"')

# Apostrophe
text = text.replace('\u00e2\u20ac\u02dc', "'")

# Star/badge emoji patterns - replace with simple emoji or text
text = text.replace('\u00c3\u00b0', '')
text = text.replace('\u00c3\u00a2', '')

# Clean up any orphaned Ã or â characters that are clearly mojibake
import re
# Remove sequences of 2+ characters where first is in latin supplement range
# and they don't form valid words
text = re.sub(r'[\u00c0-\u00ff][\u0152\u0153\u0160\u0161\u0178\u017d\u017e\u0192\u02c6\u02dc\u2013\u2014\u2018\u2019\u201a\u201c\u201d\u201e\u2020\u2021\u2022\u2026\u2030\u2039\u203a\u20ac\u2122]{1,4}', '', text)

# Fix double spaces
text = re.sub(r'  +', ' ', text)

# Fix -- with proper em dash
text = text.replace(' -- ', ' — ')
text = text.replace(' -> ', ' → ')

# Fix badge text that lost emojis
text = text.replace(' 7-Day Streak', '🔥 7-Day Streak')
text = text.replace(' First Session', '⭐ First Session')
text = text.replace(' Math Whiz', '🧠 Math Whiz')
text = text.replace(' Physics Master', '🎓 Physics Master')
text = text.replace(' Top 10', '💎 Top 10')
text = text.replace(' 50 Sessions', '🌟 50 Sessions')
text = text.replace(' 12 Days', '🔥 12 Days')
text = text.replace('4.8 ', '4.8 ⭐')
text = text.replace('4.9', '4.9⭐')
text = text.replace('4.8', '4.8⭐')
text = text.replace(' 3 spots', '↑ 3 spots')
text = text.replace(' 12% vs avg', '↑ 12% vs avg')

# Fix footer
text = text.replace('Confidential — Hackathon Use Only', 'Confidential — Hackathon Use Only')

# Remove any remaining double blank lines
text = re.sub(r'\n\n\n+', '\n\n', text)

with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

# Count remaining
remaining = 0
for ch in text:
    o = ord(ch)
    if 0xc0 <= o <= 0xff:
        remaining += 1

print(f"Done! Size: {len(text)} chars")
print(f"Remaining high-latin chars: {remaining}")
