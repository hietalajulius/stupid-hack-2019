import firebase_admin
from firebase_admin import credentials
import firebase_admin.messaging as messaging
from firebase_admin import db
from content import random_negative
import random
import time

cred = credentials.Certificate("<token>")
initialize = firebase_admin.initialize_app(cred,{
    'databaseURL': '<database url>'
})



ref = db.reference('/')
facts_ref = db.reference('/facts')
user_ref = db.reference('/only_user')
token = ref.get()['only_user']['token']


titles = ["Really?", "No Whey!", "Did you know?", "Was?", "Oikeesti?"]


def callback(event):
	interval = ref.get()['only_user']['interval']
	print("Interval", interval)
	time.sleep(interval)
	body = random_negative()
	link = body[1]
	body = body[0]
	notification = messaging.Notification(title=random.choice(titles), body=body)
	message = messaging.Message(notification=notification,token=token)
	sent = messaging.send(message,dry_run=False)
	initial = {"message":body,"url":link}
	change = facts_ref.push(value=initial)

ref.listen(callback)



