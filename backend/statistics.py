import calendar
import collections
import datetime as t
from dateutil.relativedelta import relativedelta 
import data as d
from helper import get_item_prepTime, get_restaurant, clear, get_sale_count
import time
from dateutil import parser

def get_statistics(restaurant_id, start_time, end_time):
    # find all sales as keys available during date range
    # and display sale count as values for specified restaurant id
    # if there were no sales made, return empty list
    # if restaurant doesn't exist return false

    start = parser.parse(start_time)
    end = parser.parse(end_time)
    start_time = time.strptime(start.strftime("%d/%m/%Y"),("%d/%m/%Y"))
    end_time = time.strptime(end.strftime("%d/%m/%Y"),"%d/%m/%Y")
    
    restaurant = get_restaurant(restaurant_id)
    if restaurant is None:
        return {'success': False}

    
    if start_time > end_time:
        return {'success': False}

    output = {
        'item_sales': {},
        'total_revenue': 0
    }
    
    for order in d.orders:
        if (order['restaurant_id'] == restaurant_id) and (order['date_ordered'] >= start_time) and (order['date_ordered'] <= end_time):
            for item in order['order']:
                if item['title'] not in output['item_sales']:
                    output['item_sales'][item['title']] = item['qty']

                elif item['title'] in output['item_sales']:
                    
                    qty_to_add = get_sale_count(order['order_id'], item['title'])
                    existing_qty = output['item_sales'][item['title']]
                    
                    output['item_sales'].update({item['title']: (qty_to_add + existing_qty)})

            output['total_revenue'] = output['total_revenue'] + order['price']
            
  
    return {'success': True, 'output': output}


def get_seasonal_statistics(restaurant_id):
    # find all sales for given restaurant in the past year
    # all sales will have a list of 12 values representing each month
    # ie 2021 feb to 2022 jan
    # returns false for invalid restaurant id

    restaurant = get_restaurant(restaurant_id)
    if restaurant is None:
        return {'success': False}

   
    output = {}
    
    for i in range(1,13):
       #i_month = (last_year2 + relativedelta(months=i)).strftime("%d/%m/%Y")
        start_counter = t.datetime.today() - relativedelta(months=12-i)
        end_counter = t.datetime.today() - relativedelta(months=12-i)
        start_counter = start_counter.replace(day=1)
        end_counter = end_counter.replace(day=calendar.monthrange(end_counter.year, end_counter.month)[1])
        # start = start_counter.strftime('%Y-%m-%dT%H:%M:%S.%f%z')
        # end = start_counter.strftime('%Y-%m-%dT%H:%M:%S.%f%z')
        start = start_counter.isoformat()
        end = end_counter.isoformat()

        data = get_statistics(restaurant_id, start, end)
        # print("lol")
        # print(start)
        # print(end)
        
        for key_d in data['output']['item_sales']:
            if key_d not in output:
                output[key_d] = [0,0,0,0,0,0,0,0,0,0,0,0]
                output[key_d][i-1] = data['output']['item_sales'][key_d]
            else:
                for key_o in output.keys():
                    if key_o == key_d:
                        output[key_o][i-1] = (output[key_o][i-1] + data['output']['item_sales'][key_d])

    return {'success': True, 'output': output}
