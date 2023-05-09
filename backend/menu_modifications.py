import collections

import data as d
from helper import get_restaurant

#ADD A SPECIFIED CATEGORY TO A RESTAURANT'S MENU
def add_category(restaurant_id, category_title):
    restaurant_exists = False
    for i, restaurant in enumerate(d.restaurants):
        if restaurant['restaurant_id'] == restaurant_id:
            restaurant_exists = True
            if str(category_title) not in d.restaurants[i]['categories'].keys():
                d.restaurants[i]['categories'][str(category_title)] = []
                return {'success': True}
            else:
                return {'success': False}
    if restaurant_exists == False:
        return {'success': False}

#EDIT THE NAME OF A SPECIFIED CATEGORY ON A RESTAURANT'S MENU
def edit_category(restaurant_id, old_category, new_title):
    restaurant_exists = False
    for i, restaurant in enumerate(d.restaurants):
        if restaurant['restaurant_id'] == restaurant_id:
            if old_category not in restaurant['categories'].keys():
                return False
            temp = restaurant['categories'][old_category]
            restaurant_exists = True
            break
        
    if (restaurant_exists == False):
        return False
    d.restaurants[i]['categories'][new_title] = temp
    d.restaurants[i]['categories'].pop(old_category)


    # update all items that used to be under that category
    for item in d.menu_items:
        if (str(item["restaurant_id"]) == str(restaurant_id)):
            if (item["category"] == old_category):
                item["category"] = new_title

    return True

#DELETE A SPECIFIED CATEGORY FROM A RESTAURANT'S MENU
def delete_category(restaurant_id, category_title):
    for i, restaurant in enumerate(d.restaurants):
        if restaurant['restaurant_id'] == restaurant_id:
            if category_title not in d.restaurants[i]['categories'].keys():
                return False
            d.restaurants[i]['categories'].pop(category_title)
            return True
    return False

#GET CATEGORIES IN ORDER
def get_categories(restaurant_id):
    for restaurant in d.restaurants:
        if restaurant['restaurant_id'] == restaurant_id:
            return {'success': True, 'output': list(restaurant['categories'].keys())}
    return {'success': False, 'output': None}

#CHANGE THE ORDER OF A RESTAURANT'S CATEGORIES
def order_categories(restaurant_id, categories):
    restaurant_exists = False
    for i, restaurant in enumerate(d.restaurants):
        if restaurant['restaurant_id'] == restaurant_id:
            if sorted(d.restaurants[i]['categories'].keys()) != sorted(categories):
                return {'success': False}

            restaurant_exists = True
            ordered = collections.OrderedDict()

            for j in categories:
                ordered[j] = d.restaurants[i]['categories'][j]

            d.restaurants[i]['categories'] = ordered
            return {'success': True}
    if restaurant_exists == False:
        return {'success': False}

# GET ITEM IDS IN A RESTAURANT'S CATEGORIES
def get_item_ids_category(restaurant_id, category_title):
    restaurant_exists = False
    for i, restaurant in enumerate(d.restaurants):
        if restaurant['restaurant_id'] == restaurant_id:
            if category_title in d.restaurants[i]['categories'].keys():
                return {'success': True, 'output': d.restaurants[i]['categories'][category_title]}
            else:
                return {'success': False, 'output': None}
    if restaurant_exists == False:
        return {'success': False, 'output': None}


# ADD A RESTAURANT WITH A GIVEN ID, AFTER CHECKING THAT SAID RESTAURANT DOESN'T EXIST
def add_restaurant(restaurant_id):
    for restaurant in d.restaurants:
        if restaurant['restaurant_id'] == restaurant_id:
            return False

    d.restaurants.append({'restaurant_id': restaurant_id, 'categories': collections.OrderedDict()})
    return True

# ADD A MENU ITEM TO A RESTAURANT'S MENU
def add_menu_item(restaurant_id, title, price, description, dietType, prepTime,  customisations, img, category):
    d.item_count += 1
    item_id = d.item_count
   
    menu_item_to_add = {
        'item_id': item_id,
        'restaurant_id': restaurant_id,
        'title': title,
        'price': price,
        'description': description,
        "dietType": dietType,
        "prepTime": prepTime,
        "customisations": customisations,
        "img": img,
        'category': category,
        'reviews': [],
    }

    restaurant = get_restaurant(restaurant_id)
    if restaurant is not None:
        restaurant["categories"][category].append(item_id)
    else:
        return False

    d.menu_items.append(menu_item_to_add)
    return True

# GET A MENU_ITEM FROM THE DB
def get_menu_item(item_id):
    for item in d.menu_items:
        if (int(item["item_id"]) == int(item_id)):
            return {'success': True, 'output': item}
    return {'success': False, 'output': None}
    

# CHANGE/UPDATE A MENU ITEM'S FIELDS
def edit_menu_item(item_id, restaurant_id, title, price, description, dietType, prepTime,  customisations, img, category):
    for i, menu_item in enumerate(d.menu_items):
        if menu_item['item_id'] == item_id:
            if (menu_item["category"] != category): # category is being changed
                change_item_category(restaurant_id, menu_item['category'], category, item_id)
            d.menu_items.insert(i, 
            {'item_id': item_id, 'restaurant_id': restaurant_id, 'title': title, 'description': description, 'img': img, 'category': category,
            'dietType': dietType, 'prepTime': prepTime, 'customisations': customisations, 'category': category, 'price': price})
            d.menu_items.pop(i+1)
            return {'success': True}

    return {'success': False}
    

# REMOVE A MENU_ITEM FROM THE DB
def delete_menu_item(item_id, restaurant_id):
    item_exists = False
    for l, menu_item in enumerate(d.menu_items):
        if menu_item['item_id'] == item_id:
            category = menu_item['category']
            item_exists = True
            del d.menu_items[l]

    if item_exists == False:
        return False

    for i, restaurant in enumerate(d.restaurants):
        if restaurant['restaurant_id'] == restaurant_id:
            if category not in d.restaurants[i]['categories'].keys() or item_id not in d.restaurants[i]['categories'][category]:
                return False
            else:
                d.restaurants[i]['categories'][category].remove(item_id)
                return True
    return False

#GET A MENU
def get_menu_item(item_id):
    for menu_item in d.menu_items:
        if menu_item['item_id'] == item_id:
            return menu_item
    return False

# CHANGE ORDER OF MENU_ITEMS IN A RESTAURANT'S CATEGORY DIRECTORY
def reorder_items(restaurant_id, category, items):
    # find restaurant
    for org in d.restaurants:
        if (org["restaurant_id"]) == restaurant_id:
            org["categories"][category] = items
            return {'success': True}
    return {'success': False}

# UPDATE CATEGORY OF AN ITEM
def change_item_category(restaurant_id, old_category, new_category, item_id):
    restaurant = get_restaurant(restaurant_id)
    print(restaurant)
    restaurant["categories"][old_category].remove(item_id)
    restaurant["categories"][new_category].append(item_id)