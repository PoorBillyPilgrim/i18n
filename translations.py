import csv

attributes = open('attributes.csv', 'r', newline='', encoding='utf-8')

reader = csv.reader(attributes)
readerDict = csv.DictReader(attributes)

translation = {}
list = []

for row in readerDict:
    # print(row['_key'].split("_"))
    splitKey = row['_key'].split("_")
    # for key in splitKey[::-1]:
    #     translation = {key: translation}
    # print(splitKey + ": " + row["en"])

# print(translation)

print(list)
