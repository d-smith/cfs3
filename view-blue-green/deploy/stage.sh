#!/bin/bash
rm -f deploy.zip
cd sample-app
npm install
ng build --base-href /sample-app/
cd dist
cp ../../buildspec.yml .
zip deploy.zip -r *
mv deploy.zip ../../
cd ../../