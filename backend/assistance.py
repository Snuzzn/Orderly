import collections
import data as d
from helper import get_item_prepTime, get_restaurant, clear


def get_assistance(restaurant_id):
    # find restaurant in d.assistance dictionary 
    # if it doesnt exist or the list is empty, return an empty list 
    # if it does exist, return that list 
    # print(d.assistance)
    
    restaurant = get_restaurant(restaurant_id)
    if restaurant is None:
        return {'success': False}
    
    if str(restaurant_id) not in d.assistance:
        return {'success': True, 'output': []}

    return {'success': True, 'output': d.assistance[str(restaurant_id)]}



def update_assistance(restaurant_id, table_num, requires_assistance):


    # find restaurant in d.assistance dictionary (if it doesn't exist, then create one)

    # if requires_assistance is True (customer asking for help), 
    # check that the list of tables for that restaruant does not contain table_num, then add table. 
    # if requires_assistance is True but the table already exists in the list, return {success: False}

    # if requires_assistance is False, remove table_num from list of table (if it already exists)

    restaurant = get_restaurant(restaurant_id)
    if restaurant is None:
        return {'success': False}

    # if restaurant_id doesn't exist, then create one
    if d.assistance.get(str(restaurant_id)) != None:
        pass
    else:
        d.assistance[str(restaurant_id)] = []


    if requires_assistance == True:
        if table_num in d.assistance[str(restaurant_id)]:
            pass
        else:
            d.assistance[str(restaurant_id)].append(table_num)
    else:
        if table_num in d.assistance[str(restaurant_id)]:
            d.assistance[str(restaurant_id)].remove(table_num)    
        else:
            pass

    return {'success': True, 'output': d.assistance[str(restaurant_id)]} 

