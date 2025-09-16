#!/bin/bash

filename="$1"
sed_script='s/(\$/( \$/g; s/\$)/\$ )/g; s/\$;/\$ ;/g'
if sed "$sed_script" "$filename" > "${filename}.tmp"; then
  mv "$filename" "${filename}.old"
  mv "${filename}.tmp" "$filename"
  echo "Replacements applied successfully to '$filename'."
else
  echo "Error: Sed command failed."
  rm -f "${filename}.tmp" # Clean up temp file on error
  exit 1
fi

exit 0

