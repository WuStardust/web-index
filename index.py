from flask import Flask, request, render_template
import pymysql
import json

Loginfo = {'HOST': 'localhost', 'USER': 'root', 'PSWD': '071420', 'DB': 'web-index'}


def connDB():
    # connect the database
    conn = pymysql.connect(host=Loginfo['HOST'], user=Loginfo['USER'],
                           passwd=Loginfo['PSWD'], db=Loginfo['DB'], charset='utf8')
    cur = conn.cursor()

    return (conn, cur)


def update(conn, cur, sql):
    # update / insert
    sta = cur.execute(sql)
    conn.commit()

    return 0 if (sta == 1) else 1


def delete(conn, cur, ID):
    # delete one data
    sta = cur.execute('delete from index_test where Id=%d' % int(ID))

    conn.commit()

    return 0 if (sta == 1) else 1


def query(cur, sql):
    # query datas
    cur.execute(sql)
    result = cur.fetchone()

    return result


def getInf(cur, sql):
    cur.execute(sql)
    result = cur.fetchall()

    return result


def connClose(conn, cur):
    # close all connects
    cur.close()
    conn.close()


app = Flask(__name__)


@app.route('/')
def home():
    conn, cur = connDB()
    cur.execute("SELECT COUNT(*) FROM index_test;")
    result = cur.fetchone()

    connClose(conn, cur)

    totalPage = int((int(result[0]) + 4 - 1) / 4)
    curPage = 1

    return render_template('index.html', total=totalPage, page=curPage)


@app.route('/info/list/<int:curPage>', methods=['GET', 'PRE', 'NEXT', 'GOTO'])
def returnAllInf(curPage):
    conn, cur = connDB()
    cur.execute("SELECT COUNT(*) FROM index_test")
    result = cur.fetchone()

    connClose(conn, cur)

    totalPage = int((int(result[0]) + 4 - 1) / 4)

    if (request.method == 'GET'):
        conn, cur = connDB()
        data = getInf(cur, "SELECT * FROM index_test LIMIT 0, 4;")
        fields = cur.description
        connClose(conn, cur)

        column_list = []
        for i in fields:
            column_list.append(i[0])

        JSONdata = []
        i = 0
        for inf in data:
            result = {}
            result['id'] = inf[0]
            result['name'] = inf[1]
            result['number'] = inf[2]
            result['phone'] = inf[3]
            JSONdata.append(result)
        return json.dumps(JSONdata)

    if (request.method == 'PRE'):
        conn, cur = connDB()
        if (curPage == 1):
            data = getInf(cur, "SELECT * FROM index_test LIMIT 0, 4;")
        else:
            data = getInf(cur, "SELECT * FROM index_test LIMIT " + str((curPage - 2) * 4) + ", 4;")
            curPage = curPage - 1

        fields = cur.description

        connClose(conn, cur)

        column_list = []
        for i in fields:
            column_list.append(i[0])

        JSONdata = []
        i = 0
        for inf in data:
            result = {}
            result['id'] = inf[0]
            result['name'] = inf[1]
            result['number'] = inf[2]
            result['phone'] = inf[3]
            JSONdata.append(result)
        return json.dumps(JSONdata)

    if (request.method == 'NEXT'):
        conn, cur = connDB()
        if (curPage == totalPage):
            data = getInf(cur, "SELECT * FROM index_test LIMIT " + str((curPage - 1) * 4) + ", 4;")
        else:
            data = getInf(cur, "SELECT * FROM index_test LIMIT " + str(curPage * 4) + ", 4;")
            curPage = curPage + 1

        fields = cur.description

        connClose(conn, cur)

        column_list = []
        for i in fields:
            column_list.append(i[0])

        JSONdata = []
        i = 0
        for inf in data:
            result = {}
            result['id'] = inf[0]
            result['name'] = inf[1]
            result['number'] = inf[2]
            result['phone'] = inf[3]
            JSONdata.append(result)
        return json.dumps(JSONdata)

    if (request.method == 'GOTO'):
        conn, cur = connDB()
        print(curPage, totalPage, curPage <= totalPage, curPage > 0, curPage > totalPage)
        if ((curPage <= totalPage) and (curPage > 0)):
            data = getInf(cur, "SELECT * FROM index_test LIMIT " + str((curPage - 1) * 4) + ", 4;")
            print('a')
        elif (curPage > totalPage):
            data = getInf(cur, "SELECT * FROM index_test LIMIT " + str((totalPage - 1) * 4) + ", 4;")
            print('b')
        else:
            data = getInf(cur, "SELECT * FROM index_test LIMIT " + str(0 * 4) + ", 4;")
            print('c')

        fields = cur.description

        connClose(conn, cur)

        column_list = []
        for i in fields:
            column_list.append(i[0])

        JSONdata = []
        i = 0
        for inf in data:
            result = {}
            result['id'] = inf[0]
            result['name'] = inf[1]
            result['number'] = inf[2]
            result['phone'] = inf[3]
            JSONdata.append(result)
        return json.dumps(JSONdata)


@app.route('/info/modify', methods=['PUT'])
def modifyInf():
    conn, cur = connDB()
    sql = "UPDATE index_test SET name='%s', number='%s', phone='%s' WHERE id='%s'" % (
        request.form["name"], request.form["number"], request.form["phone"], request.form["id"])

    sta = update(conn, cur, sql)

    connClose(conn, cur)

    return json.dumps(sta)


@app.route('/info/add', methods=['POST'])
def addInf():
    conn, cur = connDB()

    sql = "INSERT INTO index_test (name, number, phone) VALUES('%s', '%s', '%s');" % (
        request.form["name"], request.form["number"], request.form["phone"])

    sta = update(conn, cur, sql)

    connClose(conn, cur)

    return json.dumps(sta)


@app.route('/info/delete/<int:del_id>', methods=['DELETE'])
def deleteInf(del_id):
    conn, cur = connDB()

    ID = del_id

    sta = delete(conn, cur, ID)

    connClose(conn, cur)

    return json.dumps(sta)


@app.route('/info/search', methods=['SEARCH'])
def searchInf():
    conn, cur = connDB()

    if (request.form["inf"] != ""):
        sql = "SELECT * FROM index_test WHERE name LIKE '%" + request.form["inf"] + "%' "
        sql += "OR number LIKE '%" + request.form["inf"] + "%'"
        sql += "OR phone LIKE '%" + request.form["inf"] + "%';"
    else:
        sql = "SELECT * FROM index_test"

    data = getInf(cur, sql)
    fields = cur.description
    connClose(conn, cur)

    column_list = []
    for i in fields:
        column_list.append(i[0])

    JSONdata = []
    i = 0
    for inf in data:
        result = {}
        result['id'] = inf[0]
        result['name'] = inf[1]
        result['number'] = inf[2]
        result['phone'] = inf[3]
        JSONdata.append(result)

    return json.dumps(JSONdata)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8756)
