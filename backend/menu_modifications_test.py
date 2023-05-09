from collections import OrderedDict
from multiprocessing.sharedctypes import Value
from data import *
from menu_modifications import add_category, add_menu_item, edit_category, delete_category, add_restaurant, delete_menu_item, get_menu_item, edit_menu_item, order_categories
from pytest import raises
from helper import clear
#import pytest

'''
ADD_CATEGORY: TESTS
'''
def test_add_category():
    clear()

    restaurants.append(
        {
            'restaurant_id': 1,
            'categories': {},
        } 
    )

    assert(add_category(1, "mains") == {'success': True})

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                "mains": [],
            }
        }
    ]

    assert(restaurants == new_restaurants)

def test_add_category_to_nonexisting_restaurant_shoulderror():
    clear()

    restaurants.append(
        {
            'restaurant_id': 1,
            'categories': {},
        } 
    )

    assert(add_category(2, "mains") == {'success': False})

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {}
        }
    ]

    assert(restaurants == new_restaurants)

def test_add_preexisting_category_shoulderror():
    clear()

    restaurants.append(
        {
            'restaurant_id': 1,
            'categories': {},
        } 
    )

    add_category(1, "mains")
    assert(add_category(1, "mains") == {'success': False})

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                'mains' : [],
            }
        }
    ]

    assert(restaurants == new_restaurants)
    
'''
EDIT_CATEGORY: TESTS
'''
def test_edit_category():
    clear()

    test_add_category()

    edit_category(1, "mains", "main")

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                "main": [],
            }
        }
    ]

    assert(restaurants == new_restaurants)

def test_edit_category_of_nonexisting_restaurant_shoulderror():
    clear()

    test_add_category()

    assert(edit_category(2, "mains", "main") == False)

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                "mains": [],
            }
        }
    ]

    assert(restaurants == new_restaurants)

def test_edit_nonexisting_category_shoulderror():
    clear()

    test_add_category()

    assert(edit_category(1, "main", "lol") == False)    

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                "mains": [],
            }
        }
    ]

    assert(restaurants == new_restaurants)
 
'''
DELETE_CATEGORY: TESTS
'''
def test_delete_category():
    clear()

    test_add_category()

    assert(delete_category(1, "mains") == True)

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
            }
        }
    ]

    assert(restaurants == new_restaurants)

def test_delete_category_of_nonexisting_restaurant_shoulderror():
    clear()

    test_add_category()

    assert(delete_category(2, "mains") == False)

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                'mains': []
            }
        }
    ]

    assert(restaurants == new_restaurants)

def test_delete_nonexisting_category_shoulderror():
    clear()

    test_add_category()

    assert(delete_category(1, "main") == False)

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                'mains': []
            }
        }
    ]

    assert(restaurants == new_restaurants)

def test_order_category():
    clear()

    test_add_category()
    assert(add_category(1, "snacks") == {'success': True})

    assert(order_categories(1, ["snacks", "mains"]) == {'success': True})

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                'snacks': [],
                'mains': [],
            }
        }
    ]

    assert(new_restaurants == restaurants)

def test_order_category_nonexisting_restaurant_shoulderror():
    clear()

    test_add_category()
    assert(add_category(1, "snacks") == {'success': True})

    assert(order_categories(2, ["snacks", "mains"]) == {'success': False})

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                'mains': [],
                'snacks': [],
            }
        }
    ]

    assert(new_restaurants == restaurants)

def test_order_category_incorrect_input_list_shoulderror():
    clear()

    test_add_category()
    assert(add_category(1, "snacks") == {'success': True})

    assert(order_categories(1, ["mains"]) == {'success': False})

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                'mains': [],
                'snacks': [],
            }
        }
    ]

    assert(new_restaurants == restaurants)

test_add_category()
test_add_category_to_nonexisting_restaurant_shoulderror()
test_add_preexisting_category_shoulderror()
test_edit_category()
test_edit_category_of_nonexisting_restaurant_shoulderror()
test_edit_nonexisting_category_shoulderror()
test_delete_category()
test_delete_category_of_nonexisting_restaurant_shoulderror()
test_delete_nonexisting_category_shoulderror()

'''
ADD_MENU_ITEMS: TESTS
'''
def test_add_menu_items():
    clear()

    global menu_items
    test_add_category()

    assert(add_menu_item(1, "Burger", 11.2, "A juicy classic American-style cheeseburger", None, None, None, None, "mains") == True)

    new_menu_items = [
        {
            'item_id': 1,
            'restaurant_id': 1,
            'title': "Burger",
            'price': 11.2,
            'dietType': None,
            'prepTime': None,
            'customisations': None,
            'img': None,
            'category': 'mains',
            'description': "A juicy classic American-style cheeseburger",
            'reviews': [],
        } 
    ]
    assert(menu_items == new_menu_items)

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                'mains': [1]
            }
        }
    ]

    assert(new_restaurants == restaurants)

def test_add_menu_items_to_nonexistent_restaurant_shoulderror():
    clear()

    global menu_items
    test_add_category()

    assert(add_menu_item(2, "Burger", 11.2, "A juicy classic American-style cheeseburger", None, None, None, None, "mains") == False)

    new_menu_items = []
    assert(new_menu_items == menu_items)

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                'mains': []
            }
        }
    ]

    assert(new_restaurants == restaurants)

def test_add_menu_items_to_nonexistent_category_shoulderror():
    clear()

    global menu_items
    test_add_category()

    assert(add_menu_item(2, "Burger", 11.2, "A juicy classic American-style cheeseburger", None, None, None, None, "main") == False)

    new_menu_items = []
    assert(new_menu_items == menu_items)

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {
                'mains': []
            }
        }
    ]

    assert(new_restaurants == restaurants)
    
test_add_menu_items()
test_add_menu_items_to_nonexistent_restaurant_shoulderror()
test_add_menu_items_to_nonexistent_category_shoulderror()

'''
ADD_RESTAURANT: TESTS
'''
def test_add_restaurant():
    clear()

    global restaurants

    add_restaurant(1)
    add_restaurant(2)

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {}
        },
        {
            'restaurant_id': 2,
            'categories': {}
        }
    ]
    assert(restaurants == new_restaurants)
    
        
test_add_restaurant()

def test_add_restaurant2():
    clear()

    global restaurants
    restaurants.append(
        {
            'restaurant_id': 1,
            'categories': {}
        } 
    )

    add_restaurant(1)
    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': {}
        }
    ]
    assert(restaurants == new_restaurants)
        
'''
ADD_CATEGORY: TESTS
'''
test_add_category()

def test_edit_menu_item():
    clear()

    global menu_items
    menu_items.append(
        {
            'item_id': 1,
            'restaurant_id': 1,
            'title': "burger",
            'price': 11.2,
            'description': 'Hearty and flavorful harvest bowls with roasted vegetables, quinoa, and a creamy, 3-ingredient tahini dressing! A healthy, plant-based, gluten-free meal!',
            'dietType': None,
            'prepTime': None,
            'customisations': None,
            'img': None,
            'category': 'mains',
        }
    )
    edit_menu_item(1, 1, "burger", 15, 'Hearty and flavorful harvest bowls with roasted vegetables, quinoa, and a creamy, 3-ingredient tahini dressing! A healthy, plant-based, gluten-free meal!',
    None, None, None, None, "mains")

    new_menu_items = [
       {
            'item_id': 1,
            'restaurant_id': 1,
            'title': "burger",
            'price': 15,
            'description': 'Hearty and flavorful harvest bowls with roasted vegetables, quinoa, and a creamy, 3-ingredient tahini dressing! A healthy, plant-based, gluten-free meal!',
            'dietType': None,
            'prepTime': None,
            'customisations': None,
            'img': None,
            'category': 'mains',
        }
    ]
    assert(new_menu_items == menu_items)

'''
EDIT_MENU_ITEMS: TESTS
'''
test_edit_menu_item()

def test_edit_menu_item_doesnotexist():
    clear()
    global menu_items
    menu_items.append(
        {
            'item_id': 1,
            'restaurant_id': 1,
            'title': "burger",
            'price': 11.2,
            'description': 'Hearty and flavorful harvest bowls with roasted vegetables, quinoa, and a creamy, 3-ingredient tahini dressing! A healthy, plant-based, gluten-free meal!',
            'dietType': None,
            'prepTime': None,
            'customisations': None,
            'img': None,
            'category': 'mains',
        }
    )

    #edit_menu_item(2, 'price', 15)
    #with pytest.raises(InputError):
    assert (edit_menu_item(2, 1, "burger", 15, 'Hearty and flavorful harvest bowls with roasted vegetables, quinoa, and a creamy, 3-ingredient tahini dressing! A healthy, plant-based, gluten-free meal!',
    None, None, None, None, "mains") == {'success': False})


test_edit_menu_item_doesnotexist()

'''
DELETE_MENU_ITEMS: TESTS
'''
def test_delete_menu_item():
    clear()

    global menu_items
    global restaurants

    add_restaurant(1)
    add_category(1, "mains")

    add_menu_item(1, "Burger", 11.2, "Burg for burgs", None, None, None, None, "mains")

    assert(delete_menu_item(1, 1) == True)

    new_menu_item = []

    assert(menu_items == new_menu_item)

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': OrderedDict([('mains', [])]),
        }
    ]

    assert new_restaurants == restaurants

test_delete_menu_item()

def test_delete_menu_item_doesnotexist():
    clear()

    global menu_items
    global restaurants

    add_restaurant(1)
    add_category(1, "mains")

    add_menu_item(1, "Burger", 11.2, "Burg for burgs", None, None, None, None, "mains")

    assert(delete_menu_item(2, 1) == False)

    new_menu_item = [
        {
            'item_id': 1,
            'restaurant_id': 1,
            'title': "Burger",
            'price': 11.2,
            'description': "Burg for burgs",
            'dietType': None,
            'prepTime': None,
            'customisations': None,
            'img': None,
            'category': "mains",
            'reviews': [],
        }
    ]

    assert(menu_items == new_menu_item)

    new_restaurants = [
        {
            'restaurant_id': 1,
            'categories': OrderedDict(
                [
                    ('mains', [1]),
                ]
            ),
        }
    ]

    assert(new_restaurants == restaurants)

test_delete_menu_item_doesnotexist()

'''
GET_MENU_ITEM: TESTS
'''
def test_get_menu_item():
    clear()

    global menu_items
    global restaurants

    add_restaurant(1)
    add_category(1, "mains")

    add_menu_item(1, "Burger", 11.2, "Burg for burgs", None, None, None, None, "mains")
    output = get_menu_item(1)
    expected = {
        'item_id': 1,
        'restaurant_id': 1,
        'title': "Burger",
        'price': 11.2,
        'description': "Burg for burgs",
        'dietType': None,
        'prepTime': None,
        'customisations': None,
        'img': None,
        'category': "mains",
        'reviews': [],
    }
    assert(output == expected)

test_get_menu_item()


def test_get_menu_item_doesnotexist():
    clear()

    global menu_items
    global restaurants

    add_restaurant(1)
    add_category(1, "mains")

    add_menu_item(1, "Burger", 11.2, "Burg for burgs", None, None, None, None, "mains")
    output = get_menu_item(2)
    assert(output == False)


test_get_menu_item_doesnotexist()
test_add_restaurant2()
