#!/bin/bash

##########
# UBUNTU #
##########

######################################
#              MYSQL                 #
# 1. INSTALL                         #
# 2. START POSTGRESQL SERVICE        #
# 3. CREATE DATABASE IF NOT EXISTS   #
# 4. GRANT LOGIN ACCESS WITHOUT SUDO #
######################################

# 1. INSTALL
sudo apt update
sudo apt install --yes mysql-server
# 2. START MYSQL SERVICE
sudo systemctl start mysql
# 3. CREATE DATABASE IF NOT EXISTS
DB_NAME="recikla_marica_api"
sudo mysql --user root -p -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;"
# 4. GRANT LOGIN ACCESS WITHOUT SUDO
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;"

####################################
#            POSTGRESQL            #
# 1. INSTALL                       #
# 2. START POSTGRESQL SERVICE      #
# 3. CREATE DATABASE IF NOT EXISTS #
####################################
# 1. INSTALL
sudo apt update
sudo apt install --yes postgresql postgresql-contrib
# 2. START POSTGRESQL SERVICE
sudo systemctl start postgresql
# 3. CREATE DATABASE IF NOT EXISTS
DB_NAME="recikla_marica_api"
sudo -i -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
sudo -i -u postgres psql -c "CREATE DATABASE $DB_NAME;"
