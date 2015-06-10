# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 3000, host: 3000

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
  end

  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    sudo apt-get update -qq

    echo "Installing dependencies"
    sudo apt-get -qq install mongodb nodejs nodejs-legacy npm git -y
    sudo npm install --quiet -g bower grunt-cli
    # this tmp folder is stupid and deserves to die
    sudo rm -rf /home/vagrant/tmp
    
    echo "Installing node_modules and bower_modules"
    cd /vagrant
    npm install --quiet
    bower install --quiet

    echo "Copying default config to config.js"
    cp config.example.js config.js

    echo "Babelifying babies"
    /usr/bin/env node node_modules/gulp/bin/gulp.js babelify

    echo "You can now run lounge:"
    echo "\$ vagrant ssh"
    echo "\$ cd /vagrant"
    echo "\$ /usr/bin/env node index.js"

  SHELL
end
