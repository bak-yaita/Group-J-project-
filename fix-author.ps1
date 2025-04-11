
# === CONFIGURATION ===
$oldName = "Your Name"
$oldEmail = "your.email@example.com"
$newName = "Namubiru Kirabo Bakyaita"
$newEmail = "kirabon225@gmail.com"

# === SCRIPT ===
git filter-branch --env-filter `
"
if ([`"`$GIT_COMMITTER_NAME`"] -eq '$oldName' -or [`"`$GIT_COMMITTER_EMAIL`"] -eq '$oldEmail') {
    `$env:GIT_COMMITTER_NAME = '$newName'
    `$env:GIT_COMMITTER_EMAIL = '$newEmail'
}
if ([`"`$GIT_AUTHOR_NAME`"] -eq '$oldName' -or [`"`$GIT_AUTHOR_EMAIL`"] -eq '$oldEmail') {
    `$env:GIT_AUTHOR_NAME = '$newName'
    `$env:GIT_AUTHOR_EMAIL = '$newEmail'
}
" --tag-name-filter cat -- --branches --tags
