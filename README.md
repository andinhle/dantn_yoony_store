# CÁCH CHẠY DỰ ÁN

Phía [FE] các bước như sau: 
- B1: git clone https://github.com/andinhle/dantn_yoony_store.git
- B2: cd client
- B3: npm i
- B4: npm run dev


Phía [BE] các bước như sau: 
- B1: git clone https://github.com/andinhle/dantn_yoony_store.git
- B2: cd server
- B3: composer install
- B4: cp .env.example .env
- B5: php artisan key:generate --ansi
- B6: php artisan storage:link
- B7: php artisan migrate
- B8: php artisan serve

- Để hiển thị tất router api: php artisan route:list
