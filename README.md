# web-index
A simple web page of index for SeedClass train.

The project for SeedClass-prep training in web developping.

这个工程下的文件适用于在本地搭建flask服务器,在环境搭好的情况下,运行index.py,访问对应的127.0.0.1:xx端口即可.  
也可以通过:  
/etc/init.d/nginx start  
uwsgi --ini /home/web-index/web/uwsgi.ini  
的方式搭建Nginx服务器,访问127.0.0.1:8012即可.  

需要的环境为:
python3, flask, nginx, uwsgi, mysql

mysql中结构为:
database:web-index
tables:index_test

具体的操作还可以在docker-for-web-index仓库下找到
