cd /var/mobile/Documents/Kosmos
git add .
echo "why do you wanna commit? "
read reason
git commit -m "$reason"
git push --force