import data as d
from menu_modifications import *
from orders import *
import pickle
import pprint
from datetime import datetime, timedelta


with open('store.p', 'rb') as FILE:
    store = pickle.load(FILE)
    if store != {}:
        d.restaurants = store["restaurants"]
        d.menu_items = store["menu_items"]
        d.item_count = store["item_count"]
        d.orders = store["orders"]
    FILE.close()

# restaurant_id = '232'
restaurant_id = "2643c402-195a-44e8-a945-d80a8d3895e8"
tableNum = 4;
given_items = [{'qty': 1, 'customisations': {}, 'price': 13, 'item_id': '3', 'title': 'Tonkotsu ramen', 'status': 'Preparing'}]

# place_order(restaurant_id, table_num, 13, given_items)
# print(datetime.today() - timedelta(days=2))


pp = pprint.PrettyPrinter(indent=4)

# add_restaurant(restaurant_id)
# add_category(restaurant_id, "Mains")
# # add_category(restaurant_id, "Entrees")
# # print(get_categories(restaurant_id))
# # order_categories(restaurant_id, ["Entrees", "Mains"])
# # print(get_categories(restaurant_id))

# print(add_menu_item(restaurant_id, "title", "price", "description", "dietType", "prepTime", "customisations", "img", "Mains"))
# print(add_menu_item(restaurant_id, "title2", "price2", "description2", "dietType", "prepTime", "customisations", "img", "Mains"))
# # print(restaurants[0]["categories"]["Mains"])
# print(d.menu_items)

# print(edit_menu_item(1, restaurant_id, "okay", "price2", "description2", "dietType", "prepTime", "customisations", "img", "Mains"))
# # reorder_items(restaurant_id, "Mains", [2, 1])pa
# # print(restaurants[0]["categories"]["Mains"])
# # print(delete_menu_item(1, restaurant_id))

# # edit_category(restaurant_id, "Mains", "Foooood")

# # print(restaurants[0])
# # print(get_item_ids_category(restaurant_id, "Mains"))
# print(get_menu_item(1))
items = {'restaurantId': '2643c402-195a-44e8-a945-d80a8d3895e8', 'tableNum': 4, 'totalPrice': 30.5, 'orders': [{'qty': 1, 'customisations': {'Add-ons': [{'title': 'Narutoma', 'price': '0.8'}, {'title': 'Scallions', 'price': '0.7'}]}, 'price': 14.5, 'item_id': '3', 'title': 'Tonkotsu ramen', 'status': 'Preparing'}, {'qty': 1, 'customisations': {'Extra Toppings': [{'title': 'Anchovies', 'price': '4'}]}, 'price': 16, 'item_id': '2', 'title': ' Pizzetta Capreseee', 'status': 'Preparing'}]}
# print(place_order(items["restaurantId"], items["tableNum"], items["totalPrice"], items["orders"]))

# print(order_status(4, '2', "Waiter", "Served"))
# print(pp.pprint(d.orders))
