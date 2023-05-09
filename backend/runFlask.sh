#!/bin/sh
if [ "$1" == "backend" ]
then
  echo "commenting out decorator"
  sed -i'.bak' -e 's/@auth.require_user/#@auth.require_user/g' app.py
elif [ "$1" == "frontend" ]
then
  echo "applying auth decorator"
  sed -i'.bak' -e 's/\#*@auth.require_user/@auth.require_user/g' app.py
else
  echo "Expected: sh runFlask.sh frontend OR sh runFlask.sh backend "
  exit
fi

python3 app.py $1