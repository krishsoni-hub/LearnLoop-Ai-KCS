import re

filepath = r'd:\My Projects\LearnLoop-AI\index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix remaining mojibake patterns
replacements = [
    (' \xa0\u2019 ', ' \u2192 '),  #  <nbsp>’  to  → 
    ('€Â¥', ''),
    ('⭐⭐ First Session', '⭐ First Session'),
    ('\xa0\u2018↑', '↑'),
    (' ‘↑', '↑'),
    ('  ’ ', ' → ')
]

for bad, good in replacements:
    text = text.replace(bad, good)

# Also fix any other possible variations of the arrow pattern:
# We know the text should be "email → OTP"
text = re.sub(r'email\s+[^a-zA-Z0-9<>]+\s+OTP', 'email → OTP', text)
text = re.sub(r'form\s+[^a-zA-Z0-9<>]+\s+AI auto-tags', 'form → AI auto-tags', text)
text = re.sub(r'subject/topic\s+[^a-zA-Z0-9<>]+\s+set urgency', 'subject/topic → set urgency', text)
text = re.sub(r'duration\s+[^a-zA-Z0-9<>]+\s+request goes', 'duration → request goes', text)
text = re.sub(r'history\s+[^a-zA-Z0-9<>]+\s+top 3', 'history → top 3', text)
text = re.sub(r'recommended\s+[^a-zA-Z0-9<>]+\s+accept', 'recommended → accept', text)
text = re.sub(r'room\s+[^a-zA-Z0-9<>]+\s+real-time', 'room → real-time', text)
text = re.sub(r'\(WebRTC\)\s+[^a-zA-Z0-9<>]+\s+tutor shares', '(WebRTC) → tutor shares', text)
text = re.sub(r'notes\s+[^a-zA-Z0-9<>]+\s+timer runs', 'notes → timer runs', text)
text = re.sub(r'ends\s+[^a-zA-Z0-9<>]+\s+learner rates', 'ends → learner rates', text)
text = re.sub(r'text\)\s+[^a-zA-Z0-9<>]+\s+AI scores', 'text) → AI scores', text)
text = re.sub(r'quality\s+[^a-zA-Z0-9<>]+\s+credits transfer', 'quality → credits transfer', text)
text = re.sub(r'transfer\s+[^a-zA-Z0-9<>]+\s+badges', 'transfer → badges', text)
text = re.sub(r'update\s+[^a-zA-Z0-9<>]+\s+leaderboard refreshes', 'update → leaderboard refreshes', text)
text = re.sub(r'refreshes\s+[^a-zA-Z0-9<>]+\s+AI-generated', 'refreshes → AI-generated', text)
text = re.sub(r'verification\s+[^a-zA-Z0-9<>]+\s+create profile', 'verification → create profile', text)
text = re.sub(r'interests\)\s+[^a-zA-Z0-9<>]+\s+receive', 'interests) → receive', text)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed remaining patterns!")
