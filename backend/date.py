from datetime import datetime

date_str = '2022-04-13T01:25:16.088Z'
fromatted_date_str = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
# store in db
print(fromatted_date_str)

# print(date_obj.strftime("%m"))


print(datetime.now())


