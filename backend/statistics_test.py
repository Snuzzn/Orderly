from collections import OrderedDict
from multiprocessing.sharedctypes import Value
from pprint import pprint
from xmlrpc.client import _datetime
from menu_modifications import add_category, add_menu_item, edit_category, delete_category, add_restaurant, delete_menu_item, get_menu_item, edit_menu_item, order_categories
from orders import get_order_queue, place_order, get_orders_of_table_for_payment, order_status, add_review, get_order, search_query
import data as d
from pytest import raises
from helper import clear, get_restaurant, get_sale_count, set_order_date_to
import datetime as t
from dateutil.relativedelta import relativedelta 
from statistics import get_statistics, get_seasonal_statistics

x = {
    'item_id': 1,
    'title': "Burger",
    'customisations': None,
    'qty': 1,
    'price': 11.2,
    'status': "Preparing",
    }
y = {
    'item_id': 2,
    'title': "Fries",
    'customisations': None,
    'qty': 1,
    'price': 9.8,
    'status': "Preparing",
    }

def test_get_statistics_successful():
    clear()

    start = t.datetime.now().isoformat()
    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, 10, None, None, 'mains')
    add_category(1,'sides')
    add_menu_item(1, 'Fries', 9.8, 'Loaded', None, 5, None, None, 'sides')

    place_order(1, 1, 20, [x, y])
    place_order(1, 1, 20, [x, y])
    place_order(1, 1, 11.2, [x])
    finish = t.datetime.now().isoformat()
    
    expected = {
        'item_sales': {"Burger": 3, "Fries": 2},
        'total_revenue': 51.2,
    }

    assert(get_statistics(1, start, finish) == {'success': True, 'output': expected})
   
def test_get_statistics_invalid_times_shoulderror():
    clear()

    start = (t.datetime.now() - relativedelta(days=1)).isoformat()
    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, 10, None, None, 'mains')
    add_category(1,'sides')
    add_menu_item(1, 'Fries', 9.8, 'Loaded', None, 5, None, None, 'sides')

    place_order(1, 1, 20, [x, y])
    place_order(1, 1, 20, [x, y])
    place_order(1, 1, 11.2, [x])
    finish = t.datetime.now().isoformat()

    assert(get_statistics(1, finish, start) == {'success': False})

def test_get_statistics_invalid_restaraunt_id_shoulderror():
    clear()

    start = t.datetime.now().isoformat()
    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, 10, None, None, 'mains')
    add_category(1,'sides')
    add_menu_item(1, 'Fries', 9.8, 'Loaded', None, 5, None, None, 'sides')

    place_order(1, 1, 20, [x, y])
    place_order(1, 1, 20, [x, y])
    place_order(1, 1, 11.2, [x])
    finish = t.datetime.now().isoformat()

    assert(get_statistics(2, start, finish) == {'success': False})

test_get_statistics_successful()
test_get_statistics_invalid_restaraunt_id_shoulderror()
test_get_statistics_invalid_times_shoulderror()

def test_get_seasonal_statistics_successful():
    clear()

    add_restaurant(1)
    add_category(1, 'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, 10, None, None, 'mains')
    add_category(1,'sides')
    add_menu_item(1, 'Fries', 9.8, 'Loaded', None, 5, None, None, 'sides')

    place_order(1, 1, 20, [x, y])
    set_order_date_to(1, 11)
    place_order(1, 1, 20, [x, y])
    set_order_date_to(2, 16)
    place_order(1, 1, 20,[x, y])
    set_order_date_to(3, 2)
    place_order(1, 1, 20,[x, y])
    set_order_date_to(4, 2)

    # print(get_seasonal_statistics(1))
    # print({
    #     'success': True,
    #     'output': {
    #         'Burger': [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
    #         'Fries': [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0]
    #     }
    # })

    assert(get_seasonal_statistics(1) == {
        'success': True,
        'output': {
            'Burger': [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
            'Fries': [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0]
        }
    })

test_get_seasonal_statistics_successful()

def test_get_seasonal_statistics_invalid_restaurant_shoulderror():
    clear()

    add_restaurant(1)
    add_category(1, 'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, 10, None, None, 'mains')
    add_category(1,'sides')
    add_menu_item(1, 'Fries', 9.8, 'Loaded', None, 5, None, None, 'sides')

    place_order(1, 1, 20, [x, y])
    set_order_date_to(1, 11)
    place_order(1, 1, 20, [x, y])
    set_order_date_to(2, 14)
    place_order(1, 1, 20,[x, y])
    set_order_date_to(3, 2)
    place_order(1, 1, 20,[x, y])
    set_order_date_to(4, 2)

    assert(get_seasonal_statistics(2) == {
        'success': False,
    })

test_get_seasonal_statistics_invalid_restaurant_shoulderror()