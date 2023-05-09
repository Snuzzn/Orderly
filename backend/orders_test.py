from collections import OrderedDict
from multiprocessing.sharedctypes import Value
from orders import get_order_queue, place_order, get_orders_of_table_for_payment, order_status, add_review, get_order, search_query
from data import *
from menu_modifications import add_category, add_menu_item, edit_category, delete_category, add_restaurant, delete_menu_item, get_menu_item, edit_menu_item, order_categories
from pytest import raises
from helper import clear
import datetime as t
from pprint import pprint
import time

# DUE BY 23/03/2022
# BELOW 5 ARE RICKY'S
# def place_order(restaurant_id, table_num, total_price, orders):
#     pass
def set_up_for_order_tests():
    clear()

    add_restaurant(1)
    add_category(1, "mains")
    add_menu_item(1, "Burger", 11.2, "Burg for burgs", None, 10, None, None, "mains")

    
def sandbox():
    set_up_for_order_tests()
    place_order(1, 1, 11.2, [{
            'item_id': 1,
            'title': "Burger",
            'customisations': None,
            'qty': 1,
            'price': 11.2,
            'status': "Preparing",
            }])
    place_order(1, 1, 11.2, [{
            'item_id': 1,
            'title': "Burger",
            'customisations': None,
            'qty': 1,
            'price': 11.2,
            'status': "Preparing",
            }])
sandbox()

def test_place_order_successful():
    set_up_for_order_tests()
    assert(place_order(1, 1, 11.2, [{
        'item_id': 1,
        'title': "Burger",
        'customisations': None,
        'qty': 1,
        'price': 11.2,
        'status': "Preparing",
        }]) == {'success': True, 'order_id': 1}
    )
    assert(place_order(1, 1, 22.4, [{
        'item_id': 1,
        'title': "Burger",
        'customisations': None,
        'qty': 1,
        'price': 11.2,
        'status': "Preparing",
        },
        {
        'item_id': 1,
        'title': "Burger",
        'customisations': None,
        'qty': 2,
        'price': 11.2,
        'status': "Preparing",
        }]) == {'success': True, 'order_id': 2}
    )

    assert orders == [
        {
            'restaurant_id': 1,
            'order_id': 1,
            'table_num': 1, 
            'price': 11.2,
            'prep_time': 'MD',
            'date_ordered': time.strptime(t.datetime.today().strftime("%d/%m/%Y"),("%d/%m/%Y")),
            'order': [
                {
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': None,
                    'qty': 1,
                    'price': 11.2,
                    'status': "Preparing",
                },
            ]
        },
        {
            'restaurant_id': 1,
            'order_id': 2,
            'table_num': 1,
            'price': 22.4,
            'prep_time': 'XL',
            'date_ordered': time.strptime(t.datetime.today().strftime("%d/%m/%Y"),("%d/%m/%Y")),
            'order': [
                {
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': None,
                    'qty': 1,
                    'price': 11.2,
                    'status': "Preparing",
                },
                {
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': None,
                    'qty': 2,
                    'price': 11.2,
                    'status': "Preparing",
                },
            ]   
        }
    ]
test_place_order_successful()

def test_place_order_nonexistent_restaurant_shoulderror():
    set_up_for_order_tests()
    assert(place_order(2, 1, 11.2, [{
        'item_id': 1,
        'title': "Burger",
        'customisations': None,
        'qty': 1,
        'price': 11.2,
        'status': "Preparing",
        }]) == {'success': False}
    )

    assert orders == []

def test_place_order_without_any_orders_shoulderror():
    set_up_for_order_tests()
    assert(place_order(1, 1, 11.2, []) == {'success': False})
    assert(place_order(1, 1, 11.2, None) == {'success': False})

    assert orders == []

# def get_order_queue(restaurant_id):
#     pass
def test_get_order_queue_successful():
    set_up_for_order_tests()
    assert(place_order(1, 1, 11.2, [{
        'item_id': 1,
        'title': "Burger",
        'customisations': None,
        'qty': 1,
        'price': 11.2,
        'status': "Preparing",
        }]) == {'success': True, 'order_id': 1}
    )
    assert(place_order(1, 2, 11.2, [{
        'item_id': 1,
        'title': "Burger",
        'customisations': None,
        'qty': 1,
        'price': 11.2,
        'status': "Preparing",
        }]) == {'success': True, 'order_id': 2}
    ) 
    assert(get_order_queue(1) == {
        'success': True,
        'queue': [
            {
                'table_num': 1,
                'order_id': 1,
                'prep_time': 'MD',
                'items': [{
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': None,
                    'qty': 1,
                    'price': 11.2,
                    'status': "Preparing",
                }]
            },
            {
                'table_num': 2,
                'order_id': 2,
                'prep_time': 'MD',
                'items': [{
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': None,
                    'qty': 1,
                    'price': 11.2,
                    'status': "Preparing",
                }]
            },
        ]
    })
test_get_order_queue_successful()

def test_get_order_queue_nonexistent_restaurant_shoulderror():
    set_up_for_order_tests()
    assert(place_order(1, 1, 11.2, [{
        'item_id': 1,
        'title': "Burger",
        'customisations': None,
        'qty': 1,
        'price': 11.2,
        'status': "Preparing",
        }]) == {'success': True, 'order_id': 1}
    )
    assert(place_order(1, 2, 11.2, [{
        'item_id': 1,
        'title': "Burger",
        'customisation_selections': None,
        'qty': 1,
        'price': 11.2,
        'status': "Preparing",
        }]) == {'success': True, 'order_id': 2}
    )
    assert(get_order_queue(2) == {
        'success': False,
        'queue': None,
    })

test_get_order_queue_successful()

# BELOW 6 ARE ZIYI'S
# def get_order(order_id):
#     pass
def test_get_order_successful():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')
    
    global orders 
    orders.append(
        {
            'restaurant_id': 1,
            'order_id': 1,
            'table_num': 5, 
            'price': 12,
            'order': [
                {
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': {
                        "Choice of sauce": [{"title": "Tomato", "price": 3.2}],
                        "Choice of add-on": [{"title": "Tomato", "price": 3.2}],
                    },
                    'qty': 2,
                    'price': 5.8,
                    'status': '',
                }
            ]
        }
    )
    assert(get_order(1)['output'] == orders[0])

test_get_order_successful()
    
    
def test_get_order_invalid_order_id_shoulderror():
    clear()
    
    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')
    
    global orders
    orders.append(
        {
            'restaurant_id': 1,
            'order_id': 1,
            'table_num': 5, 
            'price': 12,
            'order': []
        }
    )

    assert(get_order(2) == {'success': False, 'output': None})

test_get_order_invalid_order_id_shoulderror()


# def order_status(order_id, staff_role, status):
#     pass
def test_order_status_successful():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    global orders
    orders.append(
        {
            'restaurant_id': 1,
            'order_id': 1,
            'table_num': 5, 
            'price': 12,
            'order': [
                {
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': {
                        "Choice of sauce": [{"title": "Tomato", "price": 3.2}],
                        "Choice of add-on": [{"title": "Tomato", "price": 3.2}],
                    },
                    'qty': 2,
                    'price': 5.8,
                    'status': '',
                }
            ]
        }
    )

    new_orders = {
            'restaurant_id': 1,
            'order_id': 1,
            'table_num': 5, 
            'price': 12,
            'order': [
                {
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': {
                        "Choice of sauce": [{"title": "Tomato", "price": 3.2}],
                        "Choice of add-on": [{"title": "Tomato", "price": 3.2}],
                    },
                    'qty': 2,
                    'price': 5.8,
                    'status': 'Preparing',
                }
            ]
        }



    assert(order_status(1, 1, 'Chef', 'Preparing') == {'success': True, 'output': new_orders})
      
test_order_status_successful()

def test_order_status_invalid_order_id_shoulderror():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')


    global orders 
    orders.append(
        {
            'restaurant_id': 1,
            'order_id': 1,
            'table_num': 5, 
            'price': 12,
            'order': [
                {
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': {
                        "Choice of sauce": [{"title": "Tomato", "price": 3.2}],
                        "Choice of add-on": [{"title": "Tomato", "price": 3.2}],
                    },
                    'qty': 2,
                    'price': 5.8,
                    'status': "Preparing",
                }
            ]
        }
    )

    assert(order_status(2, 1, 'Chef', "Preparing") == {'success': False, 'output': None})

test_order_status_invalid_order_id_shoulderror()

def test_order_status_invalid_staff_role_shoulderror():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')
    add_menu_item(2, 'Pizza', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    global orders
    orders.append(
        {
            'restaurant_id': 1,
            'order_id': 1,
            'table_num': 5, 
            'price': 12,
            'order': [
                {
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': {
                        "Choice of sauce": [{"title": "Tomato", "price": 3.2}],
                        "Choice of add-on": [{"title": "Tomato", "price": 3.2}],
                    },
                    'qty': 2,
                    'price': 5.8,
                    'status': "Preparing",
                },
                {
                    'item_id': 2,
                    'title': "Pizza",
                    'customisations': {
                        "Choice of sauce": [{"title": "Tomato", "price": 3.2}],
                        "Choice of add-on": [{"title": "Tomato", "price": 3.2}],
                    },
                    'qty': 1,   
                    'price': 6.2,
                    'status': "Served"
                }
            ]
        }
    )

    assert(order_status(1, 1, 'Manager', 'Preparing') == {'success': False, 'output': 1})
    assert(order_status(1, 1, 'Waiter', 'Preparing') == {'success': False, 'output': 4})
    assert(order_status(1, 2, "Chef", "Served") == {'success': False, 'output': 3})

test_order_status_invalid_staff_role_shoulderror()

def test_order_status_invalid_status_shoulderror():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    global orders
    orders.append(
        {
            'restaurant_id': 1,
            'order_id': 1,
            'table_num': 5, 
            'price': 12,
            'order': [
                {
                    'item_id': 1,
                    'customisationSelections': {
                        "Choice of sauce": [{"title": "Tomato", "price": 3.2}],
                        "Choice of add-on": [{"title": "Tomato", "price": 3.2}],
                    },
                    'qty': 2,
                    'price': 5.8,
                    'status': "Preparing",
                }
            ]
        }
    )

    assert(order_status(1, 1, 'Chef', 'Lost') == {'success': False, 'output': 2})

test_order_status_invalid_status_shoulderror()

def test_order_status_Awaiting_payed_successful():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')
    
    global orders
    orders.append(
        {
            'restaurant_id': 1,
            'order_id': 1,
            'table_num': 5, 
            'price': 12,
            'order': [
                {
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': {
                        "Choice of sauce": [{"title": "Tomato", "price": 3.2}],
                        "Choice of add-on": [{"title": "Tomato", "price": 3.2}],
                    },
                    'qty': 2,
                    'price': 5.8,
                    'status': 'Served',
                }
            ]
        }
    )

    new_orders = {
            'restaurant_id': 1,
            'order_id': 1,
            'table_num': 5, 
            'price': 12,
            'order': [
                {
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': {
                        "Choice of sauce": [{"title": "Tomato", "price": 3.2}],
                        "Choice of add-on": [{"title": "Tomato", "price": 3.2}],
                    },
                    'qty': 2,
                    'price': 5.8,
                    'status': 'Awaiting payment',
                }
            ]
        }



    assert(order_status(1, 1, 'Waiter', 'Awaiting payment') == {'success': True, 'output': new_orders})
      
test_order_status_Awaiting_payed_successful()


def test_order_status_Awaiting_payed_invalid_status_shoulderror():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')
    
    global orders
    orders.append(
        {
            'restaurant_id': 1,
            'order_id': 1,
            'table_num': 5, 
            'price': 12,
            'order': [
                {
                    'item_id': 1,
                    'title': "Burger",
                    'customisations': {
                        "Choice of sauce": [{"title": "Tomato", "price": 3.2}],
                        "Choice of add-on": [{"title": "Tomato", "price": 3.2}],
                    },
                    'qty': 2,
                    'price': 5.8,
                    'status': "On it's way",
                }
            ]
        }
    )

    assert(order_status(1, 1, 'Waiter', 'Awaiting payment') == {'success': False, 'output': 5, 'itemTitle': "Burger"})

test_order_status_Awaiting_payed_invalid_status_shoulderror()

'''
# BELOW 5 ARE JASON'S
# def get_orders_of_table_for_payment(table_num):
#     pass
def test_order_payment_successful():
    set_up_for_order_tests()
    place_order(1, 1, 11.2, {
        'item_id': 1,
        'customisations': None,
        'qty': 1,
        'price': 11.2,
        'status': "Completed",
        })
    place_order(1, 2, 11.2, {
        'item_id': 1,
        'customisations': None,
        'qty': 1,
        'price': 11.2,
        'status': "Completed",
        })
    place_order(1, 1, 12.2, {
        'item_id': 2,
        'customisations': None,
        'qty': 1,
        'price': 15.2,
        'status': "Completed",
        })
    assert(len(get_orders_of_table_for_payment(1)) == 2)
    assert(get_orders_of_table_for_payment(1) == {'success': True, 'output': [1,3]})
'''

# def add_review(restaurant_id, item_id, review_name, review_description, review_rating):
#     pass
def test_add_review_successful():
    set_up_for_order_tests()
    add_review(1,1, "John", "This item sucked.", 1)
    assert menu_items == [
        { 
            'item_id': 1,
            'restaurant_id': 1,
            'title': "Burger",
            'price': 11.2,
            'description': 'Burg for burgs',  
            'dietType': None,
            'prepTime': 10,
            'customisations': None,
            'img': None,
            'category': 'mains',
            'reviews': [
                {
                    'name': "John",
                    'description': "This item sucked.",
                    'rating': 1,
                }
            ]
        },
    ]

def test_add_review_invalid_restaurant_id_shoulderror():
    set_up_for_order_tests()
    assert(add_review(2,1, "John", "This item sucked.", 1) == {'success': False})

def test_add_review_invalid_item_id_shoulderror():
    set_up_for_order_tests()
    assert(add_review(1,2, "John", "This item sucked.", 1) == {'success': False})

def test_add_review_invalid_review_rating_number_shoulderror():
    set_up_for_order_tests()
    assert(add_review(1,1, "John", "This item sucked.", 0) == {'success': False})


# ZIYI
# def search_query(restaurant_id, query):
#   pass
def test_search_query_successful():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')
    add_menu_item(1, 'Pizza', 11.2, 'Burg for burgs', None, None, None, None, 'mains')
    add_menu_item(1, 'Bacon Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    add_restaurant(2)
    add_category(2,'mains')
    add_menu_item(2, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    assert(search_query(1,'burg') == {'success': True, 'output': [1,3]})



def test_search_query_invalid_org_id_shoulderror():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    assert(search_query(2,'Burger') == {'success': False})