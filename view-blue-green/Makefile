package:
	rm -f router.zip
	zip router.zip router.js
	aws s3 cp router.zip s3://$(CODE_BUCKET)
	aws s3 cp blue.yml s3://$(CODE_BUCKET)
	aws s3 cp green.yml s3://$(CODE_BUCKET)
	aws s3 cp viewbg.yml s3://$(CODE_BUCKET)
