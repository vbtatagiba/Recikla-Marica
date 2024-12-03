#########
# RESET #
#########
npx sequelize-cli db:migrate:undo:all

##########
# UPDATE #
##########
npx sequelize-cli db:migrate

############
# POPULATE #
############
# npx sequelize-cli db:seed:all
npx sequelize-cli db:seed --seed seeders/20241105170859-users-seed.js
npx sequelize-cli db:seed --seed seeders/20241103000000-coletas-seed.js
