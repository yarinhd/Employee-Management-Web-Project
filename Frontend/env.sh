#!/bin/bash
# DO NOT CHANGE TO CRLF!!!!!!!!
# Recreate config file
rm -rf ./env-config-temp.js
touch ./env-config-temp.js

# Add assignment
echo "window._env_ = {" >>./env-config-temp.js

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]]; do
    # Split env variables by character `=`
    if printf '%s\n' "$line" | grep -q -e '='; then
        varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
        varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
    fi

    # Read value of current variable if exists as Environment variable
    value=$(printf '%s\n' "${!varname}")
    # Otherwise use value from .env file
    [[ -z $value ]] && value=${varvalue}

    # Append configuration property to JS file
    echo "  $varname: \"$value\"," >>./env-config-temp.js
done <.env

echo "}" >>./env-config-temp.js
tr -d '\015' <env-config-temp.js >env-config.js
