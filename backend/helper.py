import data as d
import datetime as t
from dateutil.relativedelta import relativedelta 
import time
# clear - clears all global variables
def clear():
    d.restaurants.clear()
    d.menu_items.clear()
    d.item_count = 0
    d.orders.clear()
    d.order_count = 0


# get the specific restaurant
def get_restaurant(restaurant_id):
    for restaurant in d.restaurants:
        if restaurant['restaurant_id'] == restaurant_id:
            return restaurant
    return None

# get the prepare time for a specific item
def get_item_prepTime(item_id):
    for item in d.menu_items:
        if str(item_id) == str(item['item_id']):
            return item["prepTime"]

# get the custermer's order list
def get_orderlist():
    return d.orders

# get the quantity of the given item in a given order
def get_sale_count(order_id, title):
    for sale in d.orders:
        if sale['order_id'] == order_id:
            for item in sale['order']:
                if item['title'] == title:
                    return item['qty']

# set the ordered date for a given order
def set_order_date_to(order_id, months_ago):
    for order in d.orders:
        if order['order_id'] == order_id:
            order['date_ordered'] = time.strptime((t.datetime.now() - relativedelta(months=months_ago)).strftime("%d/%m/%Y"),"%d/%m/%Y")
