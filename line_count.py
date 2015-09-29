#!/usr/bin/python

import os
import os.path as P

dirs = ['www/js', 'www/templates', 'scss/app']

# manually add
# 34 angular-material.scss
# 57 index.html

def line_count(filepath):
    with open(filepath) as f:
        num = sum(1 for line in f)

    print(filepath, num)
    return num

total = 0
for dir in dirs:
    for dirpath, dirnames, filenames in os.walk(dir):
        for filename in filenames:
            file_path = P.join(dirpath, filename)
            total += line_count(file_path)

print('total', total)


