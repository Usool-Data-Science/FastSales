import time
from payment.utils import redis, Order

key = 'order_refund'
group = 'payment_group'

try:
    redis.xgroup_create(key, group)
except:
    print('Group already exist')

while True:
    try:
        results = redis.xreadgroup(group, key, {key: '>'}, None)
        if results != []:
            for result in results:
                obj = result[1][0][1]
                order = Order.get(obj['pk'])
                order.status = 'refunded'
                order.save()
    except Exception as e:
        print(str(e))
    time.sleep(1)   # Consume the message every 1 second