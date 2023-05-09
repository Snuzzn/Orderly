import collections
import data as d
from helper import get_item_prepTime, get_restaurant, clear
import datetime as t
import time

def place_order(restaurant_id, table_num, total_price, given_items):
    # test the input given_items valid or not
    if given_items == None:
        return {'success': False}
    restaurant = get_restaurant(restaurant_id)
    
    # The initial prepare time is small
    # The initial total prepare time is 0
    prep_time = "SM"
    total_prepTime = 0
    # calculate the total prepare time
    for item in given_items:
        quantity = item['qty']
        item_prepTime = get_item_prepTime(item['item_id'])
        item_prepTime = int(quantity) * int(item_prepTime)
        total_prepTime = item_prepTime + total_prepTime

    # SMALL: <10mins
    # MIDDLE: >=10mins and <15mins
    # LARGE: >=15mins and <20mins
    # EXTRA LARGE: >=20mins
    if total_prepTime >= 10:
        prep_time = "MD"
    if total_prepTime >= 15:
        prep_time = "LG"
    if total_prepTime >= 20:
        prep_time = "XL"

    # test the inputs valid or not
    if restaurant is None or given_items is None or given_items == []:
        return {'success': False}
    
    # duplicate_found = False
    # for given_item in given_items:
    #     for order in d.orders:
    #         if order['restaurant_id'] == restaurant_id and order['table_num'] == table_num:
    #             duplicate_found = True
    #             order['order'].append(given_item)
    # if duplicate_found == True:
    #     return {'success': True}
            
    # create new order then append into existing orders
    d.order_count += 1
    object_to_add = {
        'order_id': d.order_count,
        'restaurant_id': restaurant_id,
        'table_num': table_num,
        'price': total_price,
        'order': given_items,
        'prep_time': prep_time,
        # set specific date
        # 'date_ordered': time.strptime((t.datetime.today()-t.timedelta(days=190)).strftime("%d/%m/%Y"),("%d/%m/%Y")),
        # current
        'date_ordered': time.strptime(t.datetime.today().strftime("%d/%m/%Y"),("%d/%m/%Y")),
    }

    d.orders.append(object_to_add)
    return {'success': True, 'order_id': d.order_count }

def get_order_queue(restaurant_id):
    # test the inputs valid or not
    restaurant = get_restaurant(restaurant_id)
    if restaurant is None:
        return {'success': False, 'queue': None}

    output = []

    # find the given restaurant's orders
    for order in d.orders:
        if order['restaurant_id'] == restaurant_id:
            output.append({
                'order_id': order['order_id'],
                'table_num': order['table_num'],
                'items': order['order'],
                'prep_time': order['prep_time']
            })
    sorted_output = sorted(output, key=lambda d: d['order_id'])

    return {'success': True, 'queue': sorted_output}
    
def get_order(order_id):
    # find the given order
    for order in d.orders:
        if order["order_id"]== order_id:
            return {'success': True, 'output': order}
    
    return {'success': False, 'output': None}

def order_status(order_id, item_id, staff_role, status):
    # only Chef or waiter can change status
    if staff_role == 'Chef' or staff_role == 'Waiter' or staff_role == 'Customer':
        pass
    else:
        return {'success': False, 'output': 1}

    # five status: Preparing, On it's way, Served, Awaiting payment and Paid
    if status == "Preparing" or status == "On it's way" or status == "Served" or status == "Awaiting payment" or status == "Paid":
        pass
    else:
        return {'success': False, 'output': 2}

    # Chef cannnot change status to 'Served'
    if (staff_role == 'Chef' or staff_role == 'Customer') and (status == 'Served'):
        return {'success': False, 'output': 3}

    # waiter cannot change status to 'Preparing'
    if (staff_role == 'Waiter' or staff_role == 'Customer') and (status == 'Preparing'):
        return {'success': False, 'output': 4}


    # if status === "Paid", then archive it
    # only the status is 'Served' can be change to 'Awaiting payment'
    if status == 'Awaiting payment':
        for odr in d.orders:
            if odr['order_id'] == order_id:
                for od in odr['order']:
                    if od['item_id'] == item_id:
                        if od['status'] == 'Served':
                            od['status'] = status
                            return {'success': True, 'output': odr}
                        else:
                            return {'success': False, 'output': 5, 'itemTitle': od['title']} # gives name of failed item


    # change to the privious status to the given status
    for odr in d.orders:
        if str(odr['order_id']) == str(order_id):
            for od in odr['order']:
                if str(od['item_id']) == str(item_id) and od['status'] != status:
                    od['status'] = status
                    return {'success': True, 'output': odr}
    
    return {'success': False, 'output': None}

def get_orders_of_table_for_payment(table_num):
    # find the given table and get the table's order_id
    orderIds = []
    for order in d.orders:
        if order["table_num"] == table_num:
            orderIds.append(order["order_id"])

    if len(orderIds) == 0:
        return ({"success": False})
    else:
        return {'success': True, 'output': orderIds}

def add_review(restaurant_id, item_id, review_name, review_description, review_rating):
    # find the given item and add review_description and rating to this item
    for item in d.menu_items:
        if item["item_id"] == item_id and item["restaurant_id"] == restaurant_id and review_rating > 0 and review_rating <= 5:
            if ("reviews" not in item):
                item["reviews"] = []
            item["reviews"].append({"name":review_name, "description": review_description, "rating": review_rating})
            return {'success': True}

    return {'success': False}


def search_query(restaurant_id, query):
    # search the given restaunrant
    for restaurant in d.restaurants:
        # find all the items related the given imput query
        if restaurant['restaurant_id'] == restaurant_id:
            itemIds = []
            for item in d.menu_items:
                if item['restaurant_id'] == restaurant_id:
                    temp = item['title'].lower()
                    if temp.find(query) == -1:
                        pass
                    else:
                        itemIds.append(item['item_id'])

            return {'success': True, 'output': itemIds}
        else:
            pass
        
    return ({"success": False})
    
