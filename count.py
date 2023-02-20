from collections import Counter

# Open the text file and read its contents
with open('big.txt', 'r') as f:
    text = f.read()

# Split the text into words and count their frequency
word_counts = Counter(text.split())

# Sort the words by frequency in descending order
sorted_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)

# Write the sorted words to a new file
with open('dictionary.txt', 'w') as f:
    for word, count in sorted_words:
        f.write(f"{word}\t{count}\n")
