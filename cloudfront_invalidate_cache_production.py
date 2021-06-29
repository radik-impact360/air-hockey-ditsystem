import boto,os
conn = boto.connect_cloudfront(os.environ['AWS_ACCESS_KEY_ID'], os.environ['AWS_SECRET_ACCESS_KEY'])
print "Invalidating files: "
paths = [
	'/index.html'
	,'/game.css'
    ,'/game.js'
	,'/media/graphics/*'
	,'/*'
]
for path in paths:
	print path
inval_req = conn.create_invalidation_request(u'E34SUJV146QUML', paths) # Unique ID
print 'Cloudfront invalidation done ... please check again after 5 minutes'