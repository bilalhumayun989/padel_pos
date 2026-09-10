# Local database setup

This app uses SQLite by default at `database/database.sqlite`. Keep `DB_CONNECTION=sqlite` in `.env`; no database server is needed. PHP needs the PDO SQLite extension.

From the project directory, run:

```sh
php artisan config:clear
php artisan migrate --seed
php artisan serve
```

Sign in at `/login` with `admin@skylinepadel.com` and `password` on a newly seeded local database. Existing account passwords are preserved.

The demo seeder runs only in local/testing environments. It adds courts, clients, teams, players, bookings for the previous seven days through the next seven days, cafe orders, expenses, and stock with different availability levels. Booking prices use the court's hourly rate.

You can rerun `php artisan db:seed`: existing records are preserved, occupied booking slots are skipped, and the same demo records are not added twice. Running it on a later date extends the demo date window. Legacy data is preserved, including any old overlapping bookings. Do not use `migrate:fresh` on a database whose data you want to keep.

Verification:

```sh
php artisan migrate:status
php artisan test
```
