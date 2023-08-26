#!/usr/bin/env python3
import textwrap
import sys
import os

# Set default width
default_width = 90

def print_usage():
    print("Usage:", sys.argv[0], "<input file> [width (default:", default_width, ")]")
    sys.exit(1)

if len(sys.argv) < 2 or len(sys.argv) > 3:
    print_usage()

filename = sys.argv[1]

# Check if the file exists
if not os.path.isfile(filename):
    print("Error: The file", filename, "does not exist.")
    print_usage()

# Use the provided width if available, otherwise use the default
width = int(sys.argv[2]) if len(sys.argv) == 3 else default_width

with open(filename, 'r') as file:
    content = file.read()

paragraphs = content.split('\n\n')
formatted_paragraphs = []

for paragraph in paragraphs:
    # Remove newline characters within paragraphs
    paragraph = paragraph.replace('\n', ' ')
    formatted_paragraphs.append(textwrap.fill(paragraph, width=width))

with open(filename, 'w') as file:
    file.write('\n\n'.join(formatted_paragraphs))
