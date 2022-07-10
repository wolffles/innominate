# crontab -e
# /var/mail
# resources =>
# https://ole.michelsen.dk/blog/schedule-jobs-with-crontab-on-mac-osx/
# https://betterprogramming.pub/how-to-execute-a-cron-job-on-mac-with-crontab-b2decf2968eb

import requests

json_body = requests.get('https://www.reddit.com/r/aquaswap/search.json?sort=new&q=san%20francisco&restrict_sr=on', headers = {'User-agent': 'your bot 0.1'}).json()


file = open('reddit_save.txt',mode='r')
lastPost = file.read()
if lastPost != str(json_body['data']['children'][0]):
    # ping
    requests.get('https://maker.ifttt.com/trigger/aquaswap/json/with/key/klTT3AsU2qDDlGPz4Z0vDkZAs6pGBR2JzQrpReJupRh')
# creates file errors out if exist
f = open("reddit_save.txt", "w")
f.write(str(json_body['data']['children'][0]))
f.close





