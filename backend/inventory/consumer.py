import time
from inventory.utils import redis, Product

key = 'order_completed'
group = 'inventory_group'

try:
    redis.xgroup_create(key, group)
except:
    print('Group already exist')

while True:
    try:
        results = redis.xreadgroup(group, key, {key: '>'}, None)
        # print(results) # Here is the sample result
        # [['order_completed', 
        #   [
        #       ('<event_id>', {'pk': '01KGTEPDJ2596ERHAQTTJXZT3B', 'product_id': '01KGS84HJT67ZVTCE2JNDXGKMA', 'price': '30.0', 'fee': '6.0', 'total': '36.0', 'quantity': '1', 'status': 'completed'})
        #       ]
        #   ]
        # ]
        if results != []:
            for result in results:
                obj = result[1][0][1]
                try:
                    product = Product.get(obj['product_id'])
                    product.quantity = product.quantity - int(obj['quantity'])
                    product.save()
                except:
                    redis.xadd('order_refund', obj, '*')
    except Exception as e:
        print(str(e))
    time.sleep(1)   # Consume the message every 1 second