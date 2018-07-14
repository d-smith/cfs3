#!/bin/bash
rm -f deploy.zip
cd sample-app
npm install
ng build
cd dist
cp ../../buildspec.yml .
zip deploy.zip -r *
mv deploy.zip ../../
cd ../../