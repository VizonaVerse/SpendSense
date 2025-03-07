#!/bin/sh

# Apply database migrations
python manage.py makemigrations
python manage.py migrate

if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "from django.contrib.auth.models import User; User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists() or User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', 'testemail', '$DJANGO_SUPERUSER_PASSWORD')" | python manage.py shell
fi
exec "$@"