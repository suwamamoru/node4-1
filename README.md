# 開発環境の立ち上げ
## 1. dockerイメージ 生成
```
$ docker-compose build
```
## 2. dockerコンテナ 起動
```
$ docker-compose up -d
```
# 開発環境のマイグレーション
```
$ docker-compose run --rm app npx sequelize-cli db:migrate --env development
```
