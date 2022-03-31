#
# Check if raw  `MarkdownIt` is not imported.
#
#    All Markdown compilation must be executed via functions exported by '~/lib/md.ts',
#   to prevend XSS. This is not a perfect solution, but at least raises a bar to exploit.
#

EXCLUDE_PATH=(
  "./.nuxt/*"
  "./node_modules/*"
  "./functions/node_modules/*"
  "./dist/*"
)

TARGET_PATTERN=(
  ".vue"
  ".ts"
)

ALLOW_FILES=(
  "lib/md.ts"
)





#################################################

function gen_targets_string() {
  echo -ne "\\( "
  for ix in "${!TARGET_PATTERN[@]}"; do
    if [ "$ix" -eq 0 ]; then
      echo -n "-name \"*${TARGET_PATTERN[$ix]}\" "
    else
      echo -n "-or -name \"*${TARGET_PATTERN[$ix]}\" "
    fi
  done
  echo -ne "\\) "
}

function gen_ignore_path() {
  for path in "${EXCLUDE_PATH[@]}"; do
    echo -n "-not -path \"$path\" "
  done
}

#################################################

queries_anded=(
  "-type f"
  "$(gen_targets_string)"
  "$(gen_ignore_path)"
)

queries=$(printf "%s " "${queries_anded[@]}")
IFS=$'\n'
target_files=$(eval find . $queries)
target_files=($target_files)

retv=0

for target in "${target_files[@]}"; do
  if grep MarkdownIt "$target" 1>/dev/null; then
    is_allow=0
    for allowed in "${ALLOW_FILES[@]}"; do
      if [[ $target -ef $allowed ]]; then
        is_allow=1
      fi
    done
    if [ $is_allow -eq 0 ]; then
      echo "$target"
      retv=1
    fi
  fi
done

exit $retv
