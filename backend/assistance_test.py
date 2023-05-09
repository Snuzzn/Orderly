from collections import OrderedDict
from multiprocessing.sharedctypes import Value
from menu_modifications import add_category, add_menu_item, edit_category, delete_category, add_restaurant, delete_menu_item, get_menu_item, edit_menu_item, order_categories
from orders import get_order_queue, place_order, get_orders_of_table_for_payment, order_status, add_review, get_order, search_query
import data
from assistance import get_assistance, update_assistance
from pytest import raises
from helper import clear


# def get_assistance(restaurant_id):
#     pass
def test_get_assistance_successful():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    add_restaurant(2)
    add_category(2,'mains')
    add_menu_item(2, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    data.assistance = {'1': [4, 3, 8]}
    

    assert(get_assistance(1) == {'success': True, 'output': [4, 3, 8]})

def test_get_assistance_invalid_restaurant_id_shoulderror():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')


    assert(get_assistance(2) == {'success': False})



# def update_assistance(restaurant_id, table_num, requires_assistance):
#     pass
def test_update_assistance_successful_add():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    data.assistance = {'1': [4, 3, 8]}

    assert(update_assistance(1, 5, True) == {'success': True, 'output': [4, 3, 8, 5]})

    assert(data.assistance == {'1': [4, 3, 8, 5]})

def test_update_assistance_successful_remove():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    data.assistance = {'1': [4, 3, 8]}

    assert(update_assistance(1, 3, False) == {'success': True, 'output': [4, 8]})

    assert(data.assistance == {'1': [4, 8]})


def test_update_assistance_successful_new_restaurant():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')
    add_restaurant(2)

    data.assistance = {'1': [4, 3, 8]}

    assert(update_assistance(2, 3, True) == {'success': True, 'output': [3]})

    assert(data.assistance == {
        '1': [4, 3, 8],
        '2': [3]
    })


def test_update_assistance_invalid_restaurant_id_shoulderror():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    assert(update_assistance(2, 1, False) == {'success': False})
'''
def test_update_assistance_invalid_table_num_shoulderror():
    clear()

    add_restaurant(1)
    add_category(1,'mains')
    add_menu_item(1, 'Burger', 11.2, 'Burg for burgs', None, None, None, None, 'mains')

    

    assert(update_assistance(1, 2, False) == {'success': False})
'''