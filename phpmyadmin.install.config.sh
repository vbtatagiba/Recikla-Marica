#!/bin/bash

##########
# UBUNTU #
##########

##################################################
#                   PHPMYADMIN                   #
# 1. INSTALL PHPMYADMIN                          #
# 2. CONFIGURE USER "phpmyadmin" WITH PASS "123" #
# 3. ECHO URL TO ACCESS PHPMYADMIN               #
##################################################

#########################
# 1. INSTALL PHPMYADMIN #
#########################
DB_PASS=""          # Defina aqui a senha do usuário root do MySQL
PHPMYADMIN_PASS="123"              # Senha desejada para o usuário phpMyAdmin no MySQL

echo "Atualizando pacotes..."
sudo apt update -y

echo "Instalando phpMyAdmin e dependências..."
sudo apt install -y phpmyadmin php-mbstring php-zip php-gd php-json php-curl

echo "Habilitando mbstring para o PHP..."
sudo phpenmod mbstring

echo "Reiniciando Apache para aplicar configurações..."
sudo systemctl restart apache2

# Configurando o MySQL para permitir conexões de localhost
echo "Configurando MySQL para conexões locais..."
sudo sed -i "s/^bind-address.*/bind-address = 127.0.0.1/" /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql

# Configurando o usuário phpMyAdmin no MySQL
echo "Configurando o usuário phpMyAdmin no MySQL..."
sudo mysql -u root -p"$DB_PASS" <<MYSQL_SCRIPT
CREATE USER IF NOT EXISTS 'phpmyadmin'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON *.* TO 'phpmyadmin'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
MYSQL_SCRIPT

# Alterando a senha do usuário phpMyAdmin para '123'
echo "Alterando a senha do usuário phpMyAdmin para '123'..."
sudo mysql -u root -p"$DB_PASS" <<MYSQL_SCRIPT
ALTER USER 'phpmyadmin'@'localhost' IDENTIFIED BY '$PHPMYADMIN_PASS';
FLUSH PRIVILEGES;
MYSQL_SCRIPT

# Criando o link simbólico para o phpMyAdmin no Apache
echo "Linkando o phpMyAdmin para o Apache..."
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
sudo systemctl restart apache2

##################################################
# 2. CONFIGURE USER "phpmyadmin" WITH PASS "123" #
##################################################
sudo mysql -u root -p -e "ALTER USER 'phpmyadmin'@'localhost' IDENTIFIED BY '123'; FLUSH PRIVILEGES;"


####################################
# 3. ECHO URL TO ACCESS PHPMYADMIN #
####################################
echo "Instalação e configuração do phpMyAdmin concluídas."
echo "Acesse o phpMyAdmin em http://localhost/phpmyadmin"
echo "Use o usuário 'phpmyadmin' e a senha '123' para acessar."
