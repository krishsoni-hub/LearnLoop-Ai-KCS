filepath = r'd:\My Projects\LearnLoop-AI\index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# delete lines 269 to 372 (0-indexed 268 to 372)
# The comment <!-- ===== FEATURES ===== --> is at line 269
# and </section> is at line 371, followed by a blank line at 372.
del lines[268:372]

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Section removed.")
